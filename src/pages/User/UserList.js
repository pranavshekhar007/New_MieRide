import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import {
  getUserListServ,
  updateUserWalletAmountServ,
  deleteUserServ,
} from "../../services/user.services";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useNavigate } from "react-router-dom";
import { useGlobalState } from "../../GlobalProvider";
import { toast } from "react-toastify";
import { Image_Base_Url } from "../../utils/api_base_url_configration";
import moment from "moment";
import Ably from "ably";
import { updateNotificationStatusServ } from "../../services/notification.services";
import Pagination from "../../components/Pagination";
import NewSidebar from "../../components/NewSidebar";
function UserList() {
  const { setGlobalState, globalState } = useGlobalState();
  const onPageChange = (page) => {
    setPayload({
      ...payload,
      page_no: page,
    });
  };
  const onPerPageChange = (per_page) => {
    setPayload({
      ...payload,
      per_page: per_page,
      page_no: 1, // optionally reset to first page on per page change
    });
  };
  const navigate = useNavigate();
  const [totalRecord, setToatalRecord] = useState(0);
  const [deviceCountDetails, setDeviceCountDetails] = useState({
    total_android_users: "",
    total_ios_users: "",
  });
  const [userList, setUserList] = useState([]);
  const [showSkelton, setShowSkelton] = useState(false);
  const [actionValue, setActionValue] = useState("");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showDeviceDropdown, setShowDeviceDropdown] = useState(false);
  const [payload, setPayload] = useState({
    page: 1,
    search_key: "",
    per_page: 10,
    status: "",
    deviceStatus: "",
  });
  const [pageData, setPageData] = useState({
    total_pages: "",
    current_page: "",
  });

  const handleGetUserListFunc = async () => {
    if (userList.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await getUserListServ(payload);
      if (response?.data?.statusCode == "200") {
        const updatedUserList = response?.data?.data.map((item) => ({
          ...item,
          showPassword: false,
        }));
        setUserList(updatedUserList);
        setToatalRecord(response?.data?.total_records);
        setPageData({
          total_pages: response?.data?.last_page,
          current_page: response?.data?.current_page,
        });
        setDeviceCountDetails({
          total_android_users: response?.data?.total_android_users,
          total_ios_users: response?.data?.total_ios_users,
        });
      }
    } catch (error) {}
    setShowSkelton(false);
  };
  useEffect(() => {
    // Initialize Ably client with the API key
    const ably = new Ably.Realtime(
      "cgbtZA.AQetNw:hE5TCgJHH9F4gWbFqv6pD5ScBM-A_RnW0RQG7xwQg-Y"
    );
    const channel = ably.channels.get("user-updates");

    // Fetch user list initially
    handleGetUserListFunc();

    // Subscribe to the 'user-updates' channel for real-time updates
    channel.subscribe("profile-updated", (message) => {
      console.log("Received real-time update:", message.data);
      // Re-fetch user list when an update is received
      handleGetUserListFunc();
    });
  }, [payload]); // Re-run when the `payload` changes

  const [userHistory, setUserHistory] = useState({
    show: false,
    transection_history: [],
  });
  const [userFunds, setUserFunds] = useState({
    show: false,
    current_wallet: "",
    user_wallet: "",
    user_id: "",
    reason: "",
    input_value: 0,
    reasonStatus: "",
  });
  const [fundBtnLoader, setFundBtnLoader] = useState(false);
  const updateWalletFunc = async () => {
    setFundBtnLoader(true);
    try {
      const { reasonStatus, input_value, user_wallet } = userFunds;

      const inputValue = parseFloat(input_value) || 0;

      // Prepare the formdata based on reasonStatus
      let updatedWallet = parseFloat(user_wallet);
      if (reasonStatus === "increasing") {
        updatedWallet += inputValue;
      } else if (reasonStatus === "decreasing") {
        updatedWallet -= inputValue;
      }

      const formdata = {
        ...userFunds,
        user_wallet: updatedWallet,
      };
      const response = await updateUserWalletAmountServ(formdata);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        handleGetUserListFunc(); // Refresh user list
      }
    } catch (error) {
      toast.error("Internal Server Error");
    } finally {
      setUserFunds({
        show: false,
        current_wallet: "",
        user_wallet: "",
        user_id: "",
        reason: "",
        input_value: 0,
        reasonStatus: "",
      });
    }
    setFundBtnLoader(false);
  };

  const handleDeleteUser = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete the record?"
    );
    if (confirmed) {
      try {
        let response = await deleteUserServ(id);
        if (response?.data?.statusCode == "200") {
          toast.success(response?.data?.message);
          setActionValue("");
          handleGetUserListFunc();
        } else if (response?.data?.statusCode == "400") {
          toast.error(response?.data?.message);
        }
      } catch (error) {
        toast.error("Internal Server Error");
      }
    }
  };

  const updateNotificationStatusFunc = async (id) => {
    try {
      let response = await updateNotificationStatusServ({
        notification_id: id,
      });
      if (response?.data?.statusCode == "200") {
      }
    } catch (error) {}
  };
  useEffect(() => {
    globalState?.notificationList
      ?.filter((v) => {
        return v?.notifiable_type == "User" && v?.is_read == 0;
      })
      ?.map((v, i) => {
        updateNotificationStatusFunc(v?.id);
      });
  });

  const [exportPopup, setExportPopup] = useState({
    show: false,
    type: "",
    status: "",
  });

  const handleOpenExport = () => {
    setExportPopup({ show: true, type: "", status: "" });
  };
  return (
    <div className="mainBody">
      <NewSidebar selectedItem="Users" />
      <div className="contentLayout">
        <div className="bgWhite borderRadius30 p-4 minHeight100vh">
          <div className="tableMain" style={{ marginTop: "0px" }}>
            {/* upper section start */}
            {/* <div className="row ms-2 mb-5 p-0">
              <div className="col-2 m-0 p-0">
                <div className="searchBox d-flex">
                  <img src="https://cdn-icons-png.flaticon.com/128/751/751463.png" />
                  <input
                    placeholder="Search"
                    onChange={(e) => setPayload({ ...payload, search_key: e.target.value })}
                  />
                </div>
              </div>
              <div className="col-10 m-0 p-0 row">
              <div className="col-2">
                  <div className="filterBox d-flex ">
                    <img src="https://cdn-icons-png.flaticon.com/128/1159/1159641.png" />
                    <select onChange={(e)=>setPayload({...payload, status:e?.target?.value})}>
                      <option value="">Status</option>
                      <option value="complete">Complete</option>
                      <option value="incomplete">Incomplete</option>
                    </select>
                  </div>
                </div>
                <div className="col-2">
                  <div className="filterBox d-flex ">
                    <img src="https://cdn-icons-png.flaticon.com/128/1159/1159641.png" />
                    <select onChange={(e)=>setPayload({...payload, deviceStatus:e?.target?.value})}>
                      <option value="">Device</option>
                      <option value="ios">IOS</option>
                      <option value="android">Android</option>
                      <option value="no">Not Provided</option>
                    </select>
                  </div>
                </div>
                
                <div className="col-2 my-auto">
                  <button className="btn btn-light w-100" style={{ background: "#F9F9F9" }}>
                    <div className="d-flex justify-content-between w-100">
                      <div className="d-flex align-items-center">
                        
                          <img
                            style={{ height: "20px" }}
                            src="/icons/priceAndCityIcons/androidIcon.png"
                            // src="https://cdn-icons-png.flaticon.com/128/16066/16066059.png"
                          />
                          <span className="ms-1">Device : {deviceCountDetails?.total_android_users}</span>
                        
                          </div>
                          <div className="d-flex align-items-center">

                        
                          <img
                            style={{ height: "20px" }}
                            // src="https://cdn-icons-png.flaticon.com/128/14776/14776639.png"
                            src="/icons/priceAndCityIcons/appleIcon.png"
                            />
                        <span className="ms-1">Device : {deviceCountDetails?.total_ios_users}</span>
                            </div>
                    </div>
                  </button>
                </div>
                <div className="col-2 my-auto">
                  <button className="btn btn-light w-100" style={{ background: "#F9F9F9" }}>
                    <div className="d-flex justify-content-between ">
                      <p className="mb-0">Total Users </p>
                      <p className="mb-0">{totalRecord}</p>
                    </div>
                  </button>
                </div>

                <div className="col-2">
                  <div
                    onClick={() => navigate("/add-user")}
                    className="addUserBtn d-flex justify-content-between align-items-center"
                  >
                    <p className="mb-0">Add User</p>
                    <img src="https://cdn-icons-png.flaticon.com/128/1077/1077114.png" />
                  </div>
                </div>
              </div>
            </div> */}
            <div className="row mx-0 p-0   ">
              <div className="row col-lg-6 m-0 p-0">
                <div className="col-lg-6 m-0   ">
                  <div className="d-flex align-items-center fundInputBox">
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/2801/2801881.png"
                      className="ms-2"
                      style={{ height: "18px" }}
                    />
                    <input
                      className="form-control"
                      placeholder="Search"
                      onChange={(e) =>
                        setPayload({ ...payload, search_key: e?.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="col-lg-3">
                  <div
                    className="fundInputBox position-relative"
                    style={{ overflow: "visible" }}
                  >
                    <div
                      className={`custom-status-header d-flex justify-content-between align-items-center`}
                      onClick={() => setShowDeviceDropdown(!showDeviceDropdown)}
                    >
                      <span className={payload.deviceStatus ? "selected" : ""}>
                        {payload.deviceStatus === "ios"
                          ? "IOS"
                          : payload.deviceStatus === "android"
                          ? "Android"
                          : payload.deviceStatus === "no"
                          ? "Not Provided"
                          : "Device Type"}
                      </span>
                      <i
                        className={`fa ${
                          showDeviceDropdown
                            ? "fa-chevron-up"
                            : "fa-chevron-down"
                        }`}
                      ></i>
                    </div>

                    {showDeviceDropdown && (
                      <div className="custom-status-dropdown">
                        {[
                          { label: "All", value: "" },
                          { label: "IOS", value: "ios" },
                          { label: "Android", value: "android" },
                          { label: "Not Provided", value: "no" },
                        ].map((item) => (
                          <div
                            key={item.value}
                            className={`dropdown-option ${
                              payload.deviceStatus === item.value
                                ? "active"
                                : ""
                            }`}
                            onClick={() => {
                              setPayload({
                                ...payload,
                                deviceStatus: item.value,
                              });
                              setShowDeviceDropdown(false);
                            }}
                          >
                            <span>{item.label}</span>
                            <div
                              className={`checkbox ${
                                payload.deviceStatus === item.value
                                  ? "checked"
                                  : ""
                              }`}
                            >
                              {payload.deviceStatus === item.value && (
                                <i className="fa fa-check"></i>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-lg-3">
                  <div
                    className="fundInputBox position-relative"
                    style={{ overflow: "visible" }}
                  >
                    <div
                      className={`custom-status-header d-flex justify-content-between align-items-center`}
                      onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                    >
                      <span className={payload.status ? "selected" : ""}>
                        {payload.status === "complete"
                          ? "Active"
                          : payload.status === "incomplete"
                          ? "In-Active"
                          : "Select Status"}
                      </span>
                      <i
                        className={`fa ${
                          showStatusDropdown
                            ? "fa-chevron-up"
                            : "fa-chevron-down"
                        }`}
                      ></i>
                    </div>

                    {showStatusDropdown && (
                      <div className="custom-status-dropdown">
                        {[
                          { label: "All", value: "" },
                          { label: "Active", value: "complete" },
                          { label: "In-Active", value: "incomplete" },
                        ].map((item) => (
                          <div
                            key={item.value}
                            className={`dropdown-option ${
                              payload.status === item.value ? "active" : ""
                            }`}
                            onClick={() => {
                              setPayload({ ...payload, status: item.value });
                              setShowStatusDropdown(false);
                            }}
                          >
                            <span>{item.label}</span>
                            <div
                              className={`checkbox ${
                                payload.status === item.value ? "checked" : ""
                              }`}
                            >
                              {payload.status === item.value && (
                                <i className="fa fa-check"></i>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="row col-lg-6 m-0 p-0">
                <div className="col-2">
                  <div className="fundInputBox d-flex align-items-center justify-content-evenly">
                    <img
                      src="/icons/priceAndCityIcons/androidIcon.png"
                      className=""
                      style={{ height: "24px" }}
                    />
                    <span>{deviceCountDetails?.total_android_users}</span>
                  </div>
                </div>
                <div className="col-2">
                  <div className="fundInputBox d-flex align-items-center justify-content-evenly">
                    <img
                      src="/icons/priceAndCityIcons/appleIcon.png"
                      className=""
                      style={{ height: "24px" }}
                    />
                    <span>{deviceCountDetails?.total_ios_users}</span>
                  </div>
                </div>
                <div className="col-4">
                  <div className="fundInputBox d-flex align-items-center justify-content-center">
                    <span>Total Users :-</span>
                    <span className="ms-2">
                      <b>{totalRecord}</b>
                    </span>
                  </div>
                </div>
                {/* <div className="col-4">
                  <div
                    onClick={() => navigate("/add-user")}
                    className="fundInputBox d-flex align-items-center justify-content-center"
                    style={{
                      background: "#1C1C1E",
                      color: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    <span style={{ fontSize: "30px" }}>+</span>
                    <span className="ms-3"> New User</span>
                  </div>
                </div> */}
                <div className="col-4">
                  <div
                    className="fundInputBox d-flex align-items-center justify-content-center"
                    style={{
                      background: "#1C1C1E",
                      color: "#fff",
                      cursor: "pointer",
                    }}
                    onClick={handleOpenExport} // Add this line
                  >
                    <i
                      className="fa fa-upload"
                      style={{ fontSize: "22px" }}
                    ></i>
                    <span className="ms-3">Export</span>
                  </div>
                </div>
              </div>
            </div>
            {/* upper section end */}
            <div
              className={"tableBody py-2 px-2 borderRadius30All"}
              style={{ background: "#363435", marginTop: "25px" }}
            >
              <div style={{ margin: "20px 10px" }}>
                <table className="table bookingTable outOfArea">
                  <thead>
                    <tr style={{ background: "#D0FF13", color: "#000" }}>
                      <th
                        scope="col"
                        style={{ borderRadius: "24px 0px 0px 24px" }}
                      >
                        <div className="d-flex justify-content-center ms-2">
                          <span>Sr. No</span>
                        </div>
                      </th>
                      <th scope="col">Profile</th>
                      <th scope="col">User id</th>
                      <th scope="col">First Name</th>
                      <th scope="col">Last Name</th>
                      <th scope="col">Phone Number</th>
                      <th scope="col">Email Address</th>
                      <th scope="col">Wallet</th>
                      <th scope="col">Device Type</th>

                      {/* <th scope="col">History</th> */}
                      <th scope="col">Funds</th>
                      <th scope="col">Status</th>
                      <th scope="col">Referral</th>
                      {/* <th scope="col">Password</th> */}
                      <th
                        scope="col"
                        style={{ borderRadius: "0px 24px 24px 0px" }}
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <div className="py-2"></div>
                  <tbody className=" ">
                    {showSkelton
                      ? Array(10)
                          .fill()
                          .map((_, i) => (
                            <tr key={i}>
                              <td>
                                <Skeleton width={20} />
                              </td>
                              <td>
                                <Skeleton circle height={50} width={50} />
                              </td>
                              <td>
                                <Skeleton width={80} />
                              </td>

                              <td>
                                <Skeleton width={100} />
                              </td>
                              <td>
                                <Skeleton width={60} />
                              </td>
                              <td>
                                <Skeleton width={80} />
                              </td>
                              <td>
                                <Skeleton width={60} />
                              </td>
                              <td>
                                <Skeleton width={60} />
                              </td>
                              <td>
                                <Skeleton width={60} />
                              </td>
                              <td>
                                <Skeleton width={60} />
                              </td>
                              <td>
                                <Skeleton width={60} />
                              </td>
                              <td>
                                <Skeleton width={60} />
                              </td>
                              <td>
                                <Skeleton width={80} />
                              </td>
                            </tr>
                          ))
                      : userList?.map((v, i) => {
                          return (
                            <>
                              <tr key={i} className="bg-light mb-2">
                                <td
                                  style={{ borderRadius: "50px 0px 0px 50px" }}
                                  scope="row"
                                >
                                  {parseInt(pageData?.current_page - 1) * 10 +
                                    i +
                                    1}
                                </td>
                                <td>
                                  <img
                                    src={
                                      v?.image
                                        ? Image_Base_Url + v?.image
                                        : "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
                                    }
                                    style={{
                                      height: "50px",
                                      width: "50px",
                                      borderRadius: "59%",
                                      cursor: "pointer",
                                      // marginTop: "-16px",
                                    }}
                                  />
                                </td>
                                <td>{v?.id}</td>
                                <td>{v?.first_name}</td>
                                <td>{v?.last_name}</td>

                                <td>
                                  {v?.country_code === "91" ? (
                                    <div className="d-flex justify-content-center align-items-center">
                                      {" "}
                                      <img
                                        src="https://cdn-icons-png.flaticon.com/128/206/206606.png"
                                        style={{
                                          height: "15px",
                                          marginRight: "5px",
                                        }}
                                      />{" "}
                                      +{v?.country_code}{" "}
                                      {v?.contact?.substring(0, 5) +
                                        " " +
                                        v?.contact?.substring(5, 10)}
                                    </div>
                                  ) : (
                                    <div className="d-flex justify-content-center align-items-center">
                                      {" "}
                                      <img
                                        src="https://cdn-icons-png.flaticon.com/128/5975/5975506.png"
                                        style={{
                                          height: "15px",
                                          marginRight: "5px",
                                        }}
                                      />{" "}
                                      +{v?.country_code}{" "}
                                      {v?.contact?.substring(0, 3) +
                                        " " +
                                        v?.contact?.substring(3, 6) +
                                        " " +
                                        v?.contact?.substring(6, 10)}
                                    </div>
                                  )}
                                </td>
                                <td>{v?.email}</td>

                                <td>
                                  ${parseFloat(v?.user_wallet).toFixed(2)}
                                </td>
                                <td>
                                  <div>
                                    {v?.device_id && (
                                      <img
                                        style={{ height: "40px" }}
                                        src="/icons/priceAndCityIcons/androidIcon.png"
                                      />
                                    )}
                                    {v?.iosdevice_id && (
                                      <img
                                        style={{ height: "40px" }}
                                        src="/icons/priceAndCityIcons/appleIcon.png"
                                      />
                                    )}
                                    {!v?.iosdevice_id && !v?.device_id && (
                                      <img
                                        style={{ height: "30px" }}
                                        src="/icons/notIntrestedIcon.png"
                                      />
                                    )}
                                  </div>
                                </td>
                                {/* <td>
                                  <div
                                    onClick={() => {
                                      setUserHistory({
                                        show: true,
                                        transaction_history:
                                          v?.transaction_history,
                                      });
                                    }}
                                  >
                                    <img
                                      src="/icons/eyeIcon.png"
                                      style={{ height: "20px" }}
                                    />
                                  </div>
                                </td> */}

                                <td>
                                  <button
                                    className="btn btn-primary"
                                    style={{
                                      background: "#353535",
                                      borderRadius: "7px",
                                      border: "none",
                                    }}
                                    onClick={() => {
                                      setUserFunds({
                                        show: true,
                                        current_wallet: v?.user_wallet,
                                        user_wallet: v?.user_wallet,
                                        user_id: v?.id,
                                        input_value: 0,
                                        reasonStatus: "",
                                      });
                                    }}
                                  >
                                    Open
                                  </button>
                                </td>
                                <td>
                                  <span
                                    className={`status-badge ${
                                      v?.status === "Approve"
                                        ? "active-status"
                                        : "inactive-status"
                                    }`}
                                  >
                                    {v?.status === "Approve"
                                      ? "Active"
                                      : "In-Active"}
                                  </span>
                                </td>
                                <td>
                                  <span className="code-badge">
                                    {v?.referral_code || "N/A"}
                                  </span>
                                </td>

                                <td
                                  style={{ borderRadius: "0px 50px 50px 0px" }}
                                >
                                  {/* <select
                              style={{ padding: "9.5px", marginTop: "0px" }}
                              value={actionValue}
                              onChange={(e) => {
                                if (e.target.value == "delete") {
                                  handleDeleteUser(v?.id);
                                  setActionValue("");
                                }
                                if (e.target.value == "edit") {
                                  toast.info("Work in progress");
                                  setActionValue("");
                                }
                              }}
                            >
                              <option value="">Action</option>
                              <option value="edit">Edit</option>
                              <option value="delete">Delete</option>
                            </select> */}
                                  {/* <div>
                                    <img
                                      src="https://cdn-icons-png.flaticon.com/128/61/61456.png"
                                      style={{ height: "16px" }}
                                      className="mx-2"
                                      onClick={() =>
                                        toast.info("Work in progress")
                                      }
                                    />
                                    <img
                                      src="https://cdn-icons-png.flaticon.com/128/6861/6861362.png"
                                      style={{ height: "16px" }}
                                      className="mx-2"
                                      onClick={() => handleDeleteUser(v?.id)}
                                    />
                                  </div> */}
                                  <button className="view-btn">View</button>
                                </td>
                              </tr>
                              <div
                                className="py-2"
                                style={{ background: "#363435" }}
                              ></div>
                            </>
                          );
                        })}
                  </tbody>
                </table>
              </div>
            </div>
            <Pagination
              current_page={pageData?.current_page}
              onPerPageChange={onPerPageChange}
              last_page={pageData?.total_pages}
              per_page={payload?.per_page}
              onPageChange={onPageChange}
            />
          </div>
          {userHistory?.show && (
            <div
              className="modal fade show d-flex align-items-center justify-content-center userHistoryPopUp"
              tabIndex="-1"
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)", // Adds a semi-transparent background
                zIndex: 1050,
              }}
            >
              <div
                className="modal-dialog"
                style={{
                  width: "70%", // Takes 90% of the screen width
                  maxWidth: "100%", // Ensures it doesn't exceed the screen width
                  margin: "0 auto",
                  margin: "50px auto", // 50px gap from top and bottom
                  maxHeight: "calc(100% - 100px)", // Leaves 50px gap at top and bottom
                  overflowY: "auto", // Scrollable content when it overflows
                }}
              >
                <div
                  className="modal-content"
                  style={{
                    border: "1px solid #7650E0",
                    borderRadius: "9px",
                    background: "#f9fafc",
                    width: "100%", // Ensures it stretches across the modal dialog
                    padding: "20px",
                    height: "500px",
                    overflowY: "auto",
                  }}
                >
                  <div className="d-flex justify-content-end p-2">
                    <i
                      className="fa fa-close text-secondary"
                      onClick={() => {
                        setUserHistory({
                          show: false,
                          transaction_history: [],
                        });
                      }}
                    ></i>
                  </div>
                  <h4 className="mb-4 text-center">History</h4>
                  <table className="table">
                    <thead
                      className=" rounded"
                      style={{ background: "#FDEEE7" }}
                    >
                      <tr>
                        <th
                          scope="col"
                          style={{ borderRadius: "6px 0px 0px 6px" }}
                        >
                          Sr. No
                        </th>
                        <th scope="col">Old Balance</th>
                        <th scope="col">Amount</th>
                        <th scope="col" style={{ width: "200px" }}>
                          Transaction Details
                        </th>
                        <th scope="col">Date</th>
                        <th scope="col">Time</th>
                        <th
                          scope="col"
                          style={{ borderRadius: "0px 6px 6px 0px" }}
                        >
                          New Balance
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {userHistory?.transaction_history?.map((v, i) => {
                        return (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>$ {v?.wallet_amount}</td>
                            <td
                              style={{
                                color:
                                  v?.transfer_type == "debit"
                                    ? "#FD0100"
                                    : "#139F02",
                              }}
                            >
                              $ {v?.transaction_amount}
                            </td>
                            <td>
                              <div
                                style={{
                                  width: "200px",
                                  whiteSpace: "normal", // Allow normal text wrapping
                                  wordBreak: "break-word", // Break words when necessary
                                  overflowWrap: "break-word", // Compatibility for older browsers
                                }}
                              >
                                {v?.type}
                              </div>
                            </td>

                            <td>
                              {moment(v?.created_at).format("DD/MM/YYYY")}
                            </td>
                            <td>{moment(v?.created_at).format("hh:mm A")}</td>
                            <td>$ {v?.current_balance}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {userHistory?.show && (
            <div className="modal-backdrop fade show"></div>
          )}
          {/* User History end*/}

          {/* User Funds Start */}
          {userFunds?.show && (
            <div className="modal-overlay">
              <div className="funds-modal">
                <div className="funds-header">
                  <h5>Funds</h5>
                </div>

                <div className="funds-body">
                  <div className="funds-icon">
                    <img
                      src="https://t4.ftcdn.net/jpg/05/55/92/27/240_F_555922705_6ay4h4MnDkyRgTsmVpCEkpzGbKffHTgu.jpg"
                      alt="fund-icon"
                    />
                  </div>

                  <p className="funds-label">Total Balance</p>
                  <div className="funds-balance">
                    ${userFunds?.current_wallet}
                  </div>

                  <div className="funds-counter">
                    <button
                      className={`funds-btn minus-btn ${
                        userFunds?.reasonStatus === "decreasing" ? "active" : ""
                      }`}
                      onClick={() =>
                        userFunds?.input_value != 0
                          ? setUserFunds({
                              ...userFunds,
                              reasonStatus: "decreasing",
                            })
                          : alert("Please add fund in the input")
                      }
                    >
                      −
                    </button>
                    <input
                      type="number"
                      className="funds-input"
                      value={userFunds?.input_value}
                      onChange={(e) =>
                        setUserFunds({
                          ...userFunds,
                          input_value: e.target.value,
                        })
                      }
                    />
                    <button
                      className={`funds-btn plus-btn ${
                        userFunds?.reasonStatus === "increasing" ? "active" : ""
                      }`}
                      onClick={() =>
                        userFunds?.input_value != 0
                          ? setUserFunds({
                              ...userFunds,
                              reasonStatus: "increasing",
                            })
                          : alert("Please add fund in the input")
                      }
                    >
                      +
                    </button>
                  </div>

                  <select
                    className="funds-select"
                    onChange={(e) =>
                      setUserFunds({ ...userFunds, reason: e?.target.value })
                    }
                  >
                    <option value="">Select</option>
                    {userFunds?.reasonStatus === "increasing" ? (
                      <>
                        <option value="Refund">
                          Refund for Incorrect Deduction
                        </option>
                        <option value="Promotional">Promotional Credit</option>
                        <option value="Bonus">Bonus or Reward</option>
                      </>
                    ) : userFunds?.reasonStatus === "decreasing" ? (
                      <>
                        <option value="Penalty">
                          Penalty for Policy Violation
                        </option>
                        <option value="Chargeback">Chargeback Fee</option>
                        <option value="Correction">
                          Correction for Mistaken Addition
                        </option>
                      </>
                    ) : null}
                  </select>

                  <button
                    className="funds-submit-btn"
                    onClick={userFunds?.reason ? updateWalletFunc : undefined}
                    disabled={!userFunds?.reason}
                  >
                    {fundBtnLoader ? "Updating..." : "Submit"}
                  </button>
                  {/* --- Close Icon --- */}
                  <div
                    className="funds-close-inside"
                    onClick={() =>
                      setUserFunds({
                        show: false,
                        current_wallet: "",
                        user_wallet: "",
                        user_id: "",
                        reason: "",
                        input_value: 0,
                        reasonStatus: "",
                      })
                    }
                  >
                    <div className="funds-close-circle">
                      <i className="fa fa-close"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {userFunds?.show && <div className="modal-backdrop fade show"></div>}

          {exportPopup.show && (
            <div className="modal-overlay">
              <div className="export-modal">
                {/* Header */}
                <div className="export-header">
                  <h5>Export Detail</h5>
                </div>

                {/* Body */}
                <div className="export-body">
                  {/* Radio options */}
                  <div className="export-radio-group">
                    <label
                      className={`export-radio-option ${
                        exportPopup.type === "user" ? "active" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="exportType"
                        value="user"
                        checked={exportPopup.type === "user"}
                        onChange={(e) =>
                          setExportPopup({
                            ...exportPopup,
                            type: e.target.value,
                          })
                        }
                      />
                      <span>User Details</span>
                    </label>

                    <label
                      className={`export-radio-option ${
                        exportPopup.type === "driver" ? "active" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="exportType"
                        value="driver"
                        checked={exportPopup.type === "driver"}
                        onChange={(e) =>
                          setExportPopup({
                            ...exportPopup,
                            type: e.target.value,
                          })
                        }
                      />
                      <span>Driver Details</span>
                    </label>
                  </div>

                  {/* Status dropdown */}
                  <div className="export-status">
                    <label>Status</label>
                    <select
                      className="export-select"
                      value={exportPopup.status}
                      onChange={(e) =>
                        setExportPopup({
                          ...exportPopup,
                          status: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>

                  {/* Buttons */}
                  <div className="export-actions">
                    <button className="export-submit-btn">Send on Email</button>
                    <button
                      className="export-close-btn"
                      onClick={() =>
                        setExportPopup({ show: false, type: "", status: "" })
                      }
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {exportPopup.show && <div className="modal-backdrop fade show"></div>}
        </div>
      </div>
    </div>
  );
  return (
    <div className="main_layout  bgBlack d-flex">
      {/* sidebar started */}
      <Sidebar selectedItem="User" />
      {/* sidebar ended */}

      {/* sectionLayout started */}
      <section
        className="section_layout"
        style={{
          marginLeft: globalState?.isFillSidebarWidth100 ? "260px" : "80px",
        }}
      >
        {/* table List started */}
        <div className="tableMain" style={{ marginTop: "0px" }}>
          {/* upper section start */}
          {/* <div className="row ms-2 mb-5 p-0">
              <div className="col-2 m-0 p-0">
                <div className="searchBox d-flex">
                  <img src="https://cdn-icons-png.flaticon.com/128/751/751463.png" />
                  <input
                    placeholder="Search"
                    onChange={(e) => setPayload({ ...payload, search_key: e.target.value })}
                  />
                </div>
              </div>
              <div className="col-10 m-0 p-0 row">
              <div className="col-2">
                  <div className="filterBox d-flex ">
                    <img src="https://cdn-icons-png.flaticon.com/128/1159/1159641.png" />
                    <select onChange={(e)=>setPayload({...payload, status:e?.target?.value})}>
                      <option value="">Status</option>
                      <option value="complete">Complete</option>
                      <option value="incomplete">Incomplete</option>
                    </select>
                  </div>
                </div>
                <div className="col-2">
                  <div className="filterBox d-flex ">
                    <img src="https://cdn-icons-png.flaticon.com/128/1159/1159641.png" />
                    <select onChange={(e)=>setPayload({...payload, deviceStatus:e?.target?.value})}>
                      <option value="">Device</option>
                      <option value="ios">IOS</option>
                      <option value="android">Android</option>
                      <option value="no">Not Provided</option>
                    </select>
                  </div>
                </div>
                
                <div className="col-2 my-auto">
                  <button className="btn btn-light w-100" style={{ background: "#F9F9F9" }}>
                    <div className="d-flex justify-content-between w-100">
                      <div className="d-flex align-items-center">
                        
                          <img
                            style={{ height: "20px" }}
                            src="/icons/priceAndCityIcons/androidIcon.png"
                            // src="https://cdn-icons-png.flaticon.com/128/16066/16066059.png"
                          />
                          <span className="ms-1">Device : {deviceCountDetails?.total_android_users}</span>
                        
                          </div>
                          <div className="d-flex align-items-center">

                        
                          <img
                            style={{ height: "20px" }}
                            // src="https://cdn-icons-png.flaticon.com/128/14776/14776639.png"
                            src="/icons/priceAndCityIcons/appleIcon.png"
                            />
                        <span className="ms-1">Device : {deviceCountDetails?.total_ios_users}</span>
                            </div>
                    </div>
                  </button>
                </div>
                <div className="col-2 my-auto">
                  <button className="btn btn-light w-100" style={{ background: "#F9F9F9" }}>
                    <div className="d-flex justify-content-between ">
                      <p className="mb-0">Total Users </p>
                      <p className="mb-0">{totalRecord}</p>
                    </div>
                  </button>
                </div>

                <div className="col-2">
                  <div
                    onClick={() => navigate("/add-user")}
                    className="addUserBtn d-flex justify-content-between align-items-center"
                  >
                    <p className="mb-0">Add User</p>
                    <img src="https://cdn-icons-png.flaticon.com/128/1077/1077114.png" />
                  </div>
                </div>
              </div>
            </div> */}
          <div className="row mx-0 p-0   ">
            <div className="row col-lg-6 m-0 p-0">
              <div className="col-lg-6 m-0   ">
                <div className="d-flex align-items-center fundInputBox">
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/2801/2801881.png"
                    className="ms-2"
                    style={{ height: "18px" }}
                  />
                  <input
                    className="form-control"
                    placeholder="Search"
                    onChange={(e) =>
                      setPayload({ ...payload, search_key: e?.target.value })
                    }
                  />
                </div>
              </div>
              <div className="col-lg-3   ">
                <div className="fundInputBox">
                  <select
                    className="form-control"
                    onChange={(e) =>
                      setPayload({ ...payload, deviceStatus: e?.target.value })
                    }
                  >
                    <option value="">Device Type</option>
                    <option value="ios">IOS</option>
                    <option value="android">Android</option>
                    <option value="no">Not Provided</option>
                  </select>
                </div>
              </div>
              <div className="col-lg-3   ">
                <div className="fundInputBox">
                  <select
                    className="form-control"
                    onChange={(e) =>
                      setPayload({ ...payload, status: e?.target.value })
                    }
                  >
                    <option value="">Status</option>
                    <option value="complete">Complete</option>
                    <option value="incomplete">Incomplete</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="row col-lg-6 m-0 p-0">
              <div className="col-2">
                <div className="fundInputBox d-flex align-items-center justify-content-evenly">
                  <img
                    src="/icons/priceAndCityIcons/androidIcon.png"
                    className=""
                    style={{ height: "24px" }}
                  />
                  <span>{deviceCountDetails?.total_android_users}</span>
                </div>
              </div>
              <div className="col-2">
                <div className="fundInputBox d-flex align-items-center justify-content-evenly">
                  <img
                    src="/icons/priceAndCityIcons/appleIcon.png"
                    className=""
                    style={{ height: "24px" }}
                  />
                  <span>{deviceCountDetails?.total_ios_users}</span>
                </div>
              </div>
              <div className="col-4">
                <div className="fundInputBox d-flex align-items-center justify-content-center">
                  <span>Total Users :-</span>
                  <span className="ms-2">
                    <b>{totalRecord}</b>
                  </span>
                </div>
              </div>
              <div className="col-4">
                <div
                  onClick={() => navigate("/add-user")}
                  className="fundInputBox d-flex align-items-center justify-content-center"
                  style={{
                    background: "#1C1C1E",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  <span style={{ fontSize: "30px" }}>+</span>
                  <span className="ms-3"> New User</span>
                </div>
              </div>
            </div>
          </div>
          {/* upper section end */}
          <div
            className={"tableBody py-2 px-2 borderRadius30All"}
            style={{ background: "#363435", marginTop: "25px" }}
          >
            <div style={{ margin: "20px 10px" }}>
              <table className="table bookingTable outOfArea">
                <thead>
                  <tr style={{ background: "#D0FF13", color: "#000" }}>
                    <th
                      scope="col"
                      style={{ borderRadius: "24px 0px 0px 24px" }}
                    >
                      <div className="d-flex justify-content-center ms-2">
                        <span>Sr. No</span>
                      </div>
                    </th>
                    <th scope="col">Profile Picture</th>
                    <th scope="col">Name</th>

                    <th scope="col">Phone Number</th>
                    <th scope="col">Email Address</th>
                    <th scope="col">Wallet</th>
                    <th scope="col">Device Type</th>

                    <th scope="col">History</th>
                    <th scope="col">Funds</th>
                    <th scope="col">Status</th>
                    {/* <th scope="col">Password</th> */}
                    <th
                      scope="col"
                      style={{ borderRadius: "0px 24px 24px 0px" }}
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <div className="py-2"></div>
                <tbody className=" ">
                  {showSkelton
                    ? Array(10)
                        .fill()
                        .map((_, i) => (
                          <tr key={i}>
                            <td>
                              <Skeleton width={20} />
                            </td>
                            <td>
                              <Skeleton circle height={50} width={50} />
                            </td>
                            <td>
                              <Skeleton width={80} />
                            </td>

                            <td>
                              <Skeleton width={100} />
                            </td>
                            <td>
                              <Skeleton width={60} />
                            </td>
                            <td>
                              <Skeleton width={80} />
                            </td>
                            <td>
                              <Skeleton width={60} />
                            </td>
                            <td>
                              <Skeleton width={60} />
                            </td>
                            <td>
                              <Skeleton width={60} />
                            </td>
                            <td>
                              <Skeleton width={60} />
                            </td>
                            <td>
                              <Skeleton width={80} />
                            </td>
                          </tr>
                        ))
                    : userList?.map((v, i) => {
                        return (
                          <>
                            <tr key={i} className="bg-light mb-2">
                              <td
                                style={{ borderRadius: "24px 0px 0px 24px" }}
                                scope="row"
                              >
                                {parseInt(pageData?.current_page - 1) * 10 +
                                  i +
                                  1}
                              </td>
                              <td>
                                <img
                                  src={
                                    v?.image
                                      ? Image_Base_Url + v?.image
                                      : "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
                                  }
                                  style={{
                                    height: "50px",
                                    width: "50px",
                                    borderRadius: "59%",
                                    cursor: "pointer",
                                    // marginTop: "-16px",
                                  }}
                                />
                              </td>
                              <td>{v?.first_name + " " + v?.last_name}</td>

                              <td>
                                {v?.country_code === "91" ? (
                                  <div className="d-flex justify-content-center align-items-center">
                                    {" "}
                                    <img
                                      src="https://cdn-icons-png.flaticon.com/128/206/206606.png"
                                      style={{
                                        height: "15px",
                                        marginRight: "5px",
                                      }}
                                    />{" "}
                                    +{v?.country_code}{" "}
                                    {v?.contact?.substring(0, 5) +
                                      " " +
                                      v?.contact?.substring(5, 10)}
                                  </div>
                                ) : (
                                  <div className="d-flex justify-content-center align-items-center">
                                    {" "}
                                    <img
                                      src="https://cdn-icons-png.flaticon.com/128/5975/5975506.png"
                                      style={{
                                        height: "15px",
                                        marginRight: "5px",
                                      }}
                                    />{" "}
                                    +{v?.country_code}{" "}
                                    {v?.contact?.substring(0, 3) +
                                      " " +
                                      v?.contact?.substring(3, 6) +
                                      " " +
                                      v?.contact?.substring(6, 10)}
                                  </div>
                                )}
                              </td>
                              <td>{v?.email}</td>

                              <td>${parseFloat(v?.user_wallet).toFixed(2)}</td>
                              <td>
                                <div>
                                  {v?.device_id && (
                                    <img
                                      style={{ height: "40px" }}
                                      src="/icons/priceAndCityIcons/androidIcon.png"
                                    />
                                  )}
                                  {v?.iosdevice_id && (
                                    <img
                                      style={{ height: "40px" }}
                                      src="/icons/priceAndCityIcons/appleIcon.png"
                                    />
                                  )}
                                  {!v?.iosdevice_id && !v?.device_id && (
                                    <img
                                      style={{ height: "30px" }}
                                      src="/icons/notIntrestedIcon.png"
                                    />
                                  )}
                                </div>
                              </td>
                              <td>
                                <div
                                  onClick={() => {
                                    setUserHistory({
                                      show: true,
                                      transaction_history:
                                        v?.transaction_history,
                                    });
                                  }}
                                >
                                  <img
                                    src="/icons/eyeIcon.png"
                                    style={{ height: "20px" }}
                                  />
                                </div>
                              </td>

                              <td>
                                <button
                                  className="btn btn-primary"
                                  style={{
                                    background: "#353535",
                                    borderRadius: "7px",
                                    border: "none",
                                  }}
                                  onClick={() => {
                                    setUserFunds({
                                      show: true,
                                      current_wallet: v?.user_wallet,
                                      user_wallet: v?.user_wallet,
                                      user_id: v?.id,
                                      input_value: 0,
                                      reasonStatus: "",
                                    });
                                  }}
                                >
                                  Open
                                </button>
                              </td>
                              <td
                                style={{
                                  color:
                                    v?.status == "Approve"
                                      ? "#00A431"
                                      : "#DD4132",
                                }}
                              >
                                {v?.status == "Approve"
                                  ? "Active"
                                  : "In-active"}
                              </td>

                              <td style={{ borderRadius: "0px 24px 24px 0px" }}>
                                {/* <select
                              style={{ padding: "9.5px", marginTop: "0px" }}
                              value={actionValue}
                              onChange={(e) => {
                                if (e.target.value == "delete") {
                                  handleDeleteUser(v?.id);
                                  setActionValue("");
                                }
                                if (e.target.value == "edit") {
                                  toast.info("Work in progress");
                                  setActionValue("");
                                }
                              }}
                            >
                              <option value="">Action</option>
                              <option value="edit">Edit</option>
                              <option value="delete">Delete</option>
                            </select> */}
                                <div>
                                  <img
                                    src="https://cdn-icons-png.flaticon.com/128/61/61456.png"
                                    style={{ height: "16px" }}
                                    className="mx-2"
                                    onClick={() =>
                                      toast.info("Work in progress")
                                    }
                                  />
                                  <img
                                    src="https://cdn-icons-png.flaticon.com/128/6861/6861362.png"
                                    style={{ height: "16px" }}
                                    className="mx-2"
                                    onClick={() => handleDeleteUser(v?.id)}
                                  />
                                </div>
                              </td>
                            </tr>
                            <div
                              className="py-2"
                              style={{ background: "#363435" }}
                            ></div>
                          </>
                        );
                      })}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination
            current_page={pageData?.current_page}
            onPerPageChange={onPerPageChange}
            last_page={pageData?.total_pages}
            per_page={payload?.per_page}
            onPageChange={onPageChange}
          />
        </div>
        {/* table List ended */}
      </section>
      {/* sectionLayout ended */}

      {/* User History Start */}
      {/* Modal */}
      {userHistory?.show && (
        <div
          className="modal fade show d-flex align-items-center justify-content-center userHistoryPopUp"
          tabIndex="-1"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Adds a semi-transparent background
            zIndex: 1050,
          }}
        >
          <div
            className="modal-dialog"
            style={{
              width: "70%", // Takes 90% of the screen width
              maxWidth: "100%", // Ensures it doesn't exceed the screen width
              margin: "0 auto",
              margin: "50px auto", // 50px gap from top and bottom
              maxHeight: "calc(100% - 100px)", // Leaves 50px gap at top and bottom
              overflowY: "auto", // Scrollable content when it overflows
            }}
          >
            <div
              className="modal-content"
              style={{
                border: "1px solid #7650E0",
                borderRadius: "9px",
                background: "#f9fafc",
                width: "100%", // Ensures it stretches across the modal dialog
                padding: "20px",
                height: "500px",
                overflowY: "auto",
              }}
            >
              <div className="d-flex justify-content-end p-2">
                <i
                  className="fa fa-close text-secondary"
                  onClick={() => {
                    setUserHistory({
                      show: false,
                      transaction_history: [],
                    });
                  }}
                ></i>
              </div>
              <h4 className="mb-4 text-center">History</h4>
              <table className="table">
                <thead className=" rounded" style={{ background: "#FDEEE7" }}>
                  <tr>
                    <th scope="col" style={{ borderRadius: "6px 0px 0px 6px" }}>
                      Sr. No
                    </th>
                    <th scope="col">Old Balance</th>
                    <th scope="col">Amount</th>
                    <th scope="col" style={{ width: "200px" }}>
                      Transaction Details
                    </th>
                    <th scope="col">Date</th>
                    <th scope="col">Time</th>
                    <th scope="col" style={{ borderRadius: "0px 6px 6px 0px" }}>
                      New Balance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {userHistory?.transaction_history?.map((v, i) => {
                    return (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>$ {v?.wallet_amount}</td>
                        <td
                          style={{
                            color:
                              v?.transfer_type == "debit"
                                ? "#FD0100"
                                : "#139F02",
                          }}
                        >
                          $ {v?.transaction_amount}
                        </td>
                        <td>
                          <div
                            style={{
                              width: "200px",
                              whiteSpace: "normal", // Allow normal text wrapping
                              wordBreak: "break-word", // Break words when necessary
                              overflowWrap: "break-word", // Compatibility for older browsers
                            }}
                          >
                            {v?.type}
                          </div>
                        </td>

                        <td>{moment(v?.created_at).format("DD/MM/YYYY")}</td>
                        <td>{moment(v?.created_at).format("hh:mm A")}</td>
                        <td>$ {v?.current_balance}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {userHistory?.show && <div className="modal-backdrop fade show"></div>}
      {/* User History end*/}

      {/* User Funds Start */}
      {/* Modal */}
      {userFunds?.show && (
        <div
          className="modal fade show d-flex align-items-center justify-content-center userHistoryPopUp"
          tabIndex="-1"
        >
          <div className="modal-dialog" style={{ width: "370px" }}>
            <div
              className="modal-content fundsPopUpDiv p-4"
              style={{ background: "#fff" }}
            >
              <div className="d-flex justify-content-end p-2">
                <i
                  className="fa fa-close text-secondary"
                  onClick={() => {
                    setUserFunds({
                      show: false,
                      current_wallet: "",
                      user_wallet: "",
                      user_id: "",
                      reason: "",
                      input_value: 0,
                      reasonStatus: "",
                    });
                  }}
                ></i>
              </div>
              <h6 className="mb-4">Funds</h6>
              <div className="modal-body p-0">
                <div className="d-flex justify-content-center">
                  <img src="https://t4.ftcdn.net/jpg/05/55/92/27/240_F_555922705_6ay4h4MnDkyRgTsmVpCEkpzGbKffHTgu.jpg" />
                </div>
                <p className="text-center">Total Balance</p>
                <div className="d-flex justify-content-center">
                  <div className="balanceDiv">${userFunds?.current_wallet}</div>
                </div>
                <div className="d-flex justify-content-center my-3">
                  <span
                    style={{
                      cursor: "pointer",
                      background:
                        userFunds?.reasonStatus == "decreasing" && "#BAA7EF",
                    }}
                    onClick={() =>
                      userFunds?.input_value != 0
                        ? setUserFunds({
                            ...userFunds,
                            reasonStatus: "decreasing",
                          })
                        : alert("Please add fund in the input")
                    }
                  >
                    -
                  </span>
                  <input
                    value={userFunds?.input_value}
                    onChange={(e) =>
                      setUserFunds({
                        ...userFunds,
                        input_value: e.target.value,
                      })
                    }
                  />
                  <span
                    style={{
                      cursor: "pointer",
                      background:
                        userFunds?.reasonStatus == "increasing" && "#BAA7EF",
                    }}
                    onClick={() =>
                      userFunds?.input_value != 0
                        ? setUserFunds({
                            ...userFunds,
                            reasonStatus: "increasing",
                          })
                        : alert("Please add fund in the input")
                    }
                  >
                    +
                  </span>
                </div>
                <div>
                  {!userFunds?.reasonStatus ? (
                    <select className="form-control">
                      <option value="">Select</option>
                      {/* <option value="Refund for Incorrect Deduction – Funds were mistakenly deducted earlier and are now being refunded.">Refund for Incorrect Deduction – Funds were mistakenly deducted earlier and are now being refunded.</option>
                      <option value="Promotional Credit – Funds added as part of a company promotional offer.">Promotional Credit – Funds added as part of a company promotional offer.</option>
                      <option value="Referral Bonus – Funds added as a referral reward.">Referral Bonus – Funds added as a referral reward.</option>
                      <option value="System Adjustment – Correcting an issue with a previous transaction.">System Adjustment – Correcting an issue with a previous transaction.</option>
                      <option value="Goodwill Gesture – Funds added as compensation for an inconvenience.">Goodwill Gesture – Funds added as compensation for an inconvenience.</option>
                      <option value="Bonus or Reward – Funds credited as a loyalty reward or seasonal bonus.">Bonus or Reward – Funds credited as a loyalty reward or seasonal bonus.</option>
                      <option value="Event Participation Credit – Funds added for participating in a company event or survey.">Event Participation Credit – Funds added for participating in a company event or survey.</option>
                      <option value="Marketing Campaign Credit – Promotional funds added as part of a marketing campaign.">Marketing Campaign Credit – Promotional funds added as part of a marketing campaign.</option> */}
                    </select>
                  ) : userFunds?.reasonStatus == "increasing" ? (
                    <select
                      className="form-control"
                      onChange={(e) =>
                        setUserFunds({ ...userFunds, reason: e?.target.value })
                      }
                    >
                      <option value="">Select</option>
                      <option value="Refund for Incorrect Deduction – Funds were mistakenly deducted earlier and are now being refunded.">
                        Refund for Incorrect Deduction – Funds were mistakenly
                        deducted earlier and are now being refunded.
                      </option>
                      <option value="Promotional Credit – Funds added as part of a company promotional offer.">
                        Promotional Credit – Funds added as part of a company
                        promotional offer.
                      </option>
                      <option value="Referral Bonus – Funds added as a referral reward.">
                        Referral Bonus – Funds added as a referral reward.
                      </option>
                      <option value="System Adjustment – Correcting an issue with a previous transaction.">
                        System Adjustment – Correcting an issue with a previous
                        transaction.
                      </option>
                      <option value="Goodwill Gesture – Funds added as compensation for an inconvenience.">
                        Goodwill Gesture – Funds added as compensation for an
                        inconvenience.
                      </option>
                      <option value="Bonus or Reward – Funds credited as a loyalty reward or seasonal bonus.">
                        Bonus or Reward – Funds credited as a loyalty reward or
                        seasonal bonus.
                      </option>
                      <option value="Event Participation Credit – Funds added for participating in a company event or survey.">
                        Event Participation Credit – Funds added for
                        participating in a company event or survey.
                      </option>
                      <option value="Marketing Campaign Credit – Promotional funds added as part of a marketing campaign.">
                        Marketing Campaign Credit – Promotional funds added as
                        part of a marketing campaign.
                      </option>
                    </select>
                  ) : (
                    <select
                      className="form-control"
                      onChange={(e) =>
                        setUserFunds({ ...userFunds, reason: e?.target.value })
                      }
                    >
                      <option value="">Select</option>
                      <option value="Correction for Mistaken Addition – Funds were mistakenly added earlier and are now being deducted.">
                        Correction for Mistaken Addition – Funds were mistakenly
                        added earlier and are now being deducted.
                      </option>
                      <option value="Penalty for Policy Violation – Deduction as a result of violating platform rules.">
                        Penalty for Policy Violation – Deduction as a result of
                        violating platform rules.
                      </option>
                      <option value="System Adjustment – Correcting an error in a previous transaction.">
                        System Adjustment – Correcting an error in a previous
                        transaction.
                      </option>
                      <option value="Chargeback Fee – Deduction due to a chargeback initiated by the payment gateway.">
                        Chargeback Fee – Deduction due to a chargeback initiated
                        by the payment gateway.
                      </option>
                    </select>
                  )}
                </div>
                <div className="d-flex justify-content-center mt-3">
                  {userFunds?.reason ? (
                    fundBtnLoader ? (
                      <button
                        className="purpleButton"
                        style={{ opacity: "0.5" }}
                      >
                        Updating ...
                      </button>
                    ) : (
                      <button
                        className="purpleButton"
                        onClick={updateWalletFunc}
                      >
                        Submit
                      </button>
                    )
                  ) : (
                    <button className="purpleButton" style={{ opacity: "0.5" }}>
                      Submit
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {userFunds?.show && <div className="modal-backdrop fade show"></div>}
      {/* User Funds end*/}
    </div>
  );
}

export default UserList;
