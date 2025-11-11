import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { getUserListServ, updateUserWalletAmountServ, deleteUserServ } from "../../services/user.services";
import { getAgentListServ, deleteAgentServ } from "../../services/agent.service";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useNavigate } from "react-router-dom";
import { useGlobalState } from "../../GlobalProvider";
import { toast } from "react-toastify";
import { Image_Base_Url } from "../../utils/api_base_url_configration";
import moment from "moment";
import Ably from "ably";
import { updateNotificationStatusServ } from "../../services/notification.services";

function AgentList() {
  const { setGlobalState, globalState } = useGlobalState();
  const navigate = useNavigate();
  const [totalRecord, setToatalRecord] = useState(0);
  const [deviceCountDetails, setDeviceCountDetails] = useState({
    total_ios_agents: "",
    total_android_agents: "",
  });
  const [userList, setUserList] = useState([]);
  const [showSkelton, setShowSkelton] = useState(false);
  const [actionValue, setActionValue] = useState("");
  const [payload, setPayload] = useState({
    page: 1,
    search_key: "",
    per_page: 10,
  });
  const [pageData, setPageData] = useState({
    total_pages: "",
    current_page: "",
  });
  const renderPage = () => {
    const pages = [];
    // Generate page numbers
    for (let i = 1; i <= pageData?.total_pages; i++) {
      pages.push(
        <li key={i} className={`page-item`} onClick={() => setPayload({ ...payload, page: i })}>
          <a
            className="page-link"
            href="#"
            style={{
              background: pageData?.current_page === i ? "#024596" : "",
              color: pageData?.current_page === i ? "#fff" : "",
            }}
          >
            {i}
          </a>
        </li>
      );
    }

    return (
      <nav aria-label="Page navigation example">
        <ul className="pagination justify-content-center">
          {/* Previous button */}
          {pageData?.total_pages > 1 && pageData?.current_page != 1 && (
            <li className="page-item" onClick={() => setPayload({ ...payload, page: pageData.current_page - 1 })}>
              <a className="page-link" href="#" aria-label="Previous">
                <span aria-hidden="true">«</span>
              </a>
            </li>
          )}

          {/* Page numbers */}
          {pages}

          {/* Next button */}
          {pageData?.total_pages > 1 && pageData?.total_pages != pageData?.current_page && (
            <li className="page-item" onClick={() => setPayload({ ...payload, page: pageData?.current_page + 1 })}>
              <a className="page-link" href="#" aria-label="Next">
                <span aria-hidden="true">»</span>
              </a>
            </li>
          )}
        </ul>
      </nav>
    );
  };
  const handleGetUserListFunc = async () => {
    if (userList.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await getAgentListServ(payload);
      if (response?.data?.statusCode == "200") {
        const updatedUserList = response?.data?.data.map((item) => ({
          ...item,
          showPassword: false,
        }));
        setUserList(updatedUserList);
        setToatalRecord(response?.data?.total_records);
        setPageData({
          total_pages: response?.data?.total_pages,
          current_page: response?.data?.current_page,
        });
        setDeviceCountDetails({
          total_ios_agents: response?.data?.total_ios_agents,
          total_android_agents: response?.data?.total_android_agents,
        });
      }
    } catch (error) {}
    setShowSkelton(false);
  };
  useEffect(() => {
    // Initialize Ably client with the API key
    const ably = new Ably.Realtime("cgbtZA.AQetNw:hE5TCgJHH9F4gWbFqv6pD5ScBM-A_RnW0RQG7xwQg-Y");
    const channel = ably.channels.get("user-updates");

    // Fetch user list initially
    handleGetUserListFunc();

    // Subscribe to the 'user-updates' channel for real-time updates
    channel.subscribe("profile-updated", (message) => {
      console.log("Received real-time update:", message.data);
      // Re-fetch user list when an update is received
      handleGetUserListFunc();
    });

    // Cleanup on component unmount
    return () => {
      channel.unsubscribe();
      ably.close();
    };
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
const [deleteBtnId, setDeleteBtnId]=useState("")
  const handleDeleteUser = async (id) => {
    setDeleteBtnId(id)
    const confirmed = window.confirm("Are you sure you want to delete the record?");
    if (confirmed) {
      try {
        let response = await deleteAgentServ(id);
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
    setDeleteBtnId(null)
  };
  const findDeviceCount = (type) => {
    if (type == "device_id") {
      let filteredUser = userList?.filter((v, i) => {
        return v?.device_id;
      });
      return filteredUser?.length;
    } else {
      let filteredUser = userList?.filter((v, i) => {
        return v?.iosdevice_id;
      });
      return filteredUser?.length;
    }
  };
  const updateNotificationStatusFunc = async (id) => {
    try {
      let response = await updateNotificationStatusServ({ notification_id: id });
      if (response?.data?.statusCode == "200") {
      }
    } catch (error) {}
  };
  useEffect(() => {
    globalState?.notificationList
      ?.filter((v) => {
        return v?.notifiable_type == "Agent" && v?.is_read == 0;
      })
      ?.map((v, i) => {
        updateNotificationStatusFunc(v?.id);
      });
  });
  return (
    <div className="main_layout  bgBlack d-flex">
      {/* sidebar started */}
      <Sidebar selectedItem="Agent Hub" />
      {/* sidebar ended */}

      {/* sectionLayout started */}
      <section
        className="section_layout"
        style={{ minWidth: "1850px", marginLeft: globalState?.isFillSidebarWidth100 ? "260px" : "80px" }}
      >
        {/* table List started */}
        <div className="tableMain" style={{ marginTop: "0px" }}>
          <div className="tableBody   ">
            {/* upper section start */}
            <div className="row ms-2 mb-5 p-0">
              <div className="col-3 m-0 p-0">
                <div className="searchBox d-flex">
                  <img src="https://cdn-icons-png.flaticon.com/128/751/751463.png" />
                  <input
                    placeholder="Search"
                    onChange={(e) => setPayload({ ...payload, search_key: e.target.value })}
                  />
                </div>
              </div>
              <div className="col-9 m-0 p-0 row">
                <div className="col-2">
                  <div className="filterBox d-flex ">
                    <img src="https://cdn-icons-png.flaticon.com/128/1159/1159641.png" />
                    <select>
                      <option>Filter</option>
                      <option>Filter 1</option>
                      <option>Filter 2</option>
                      <option>Filter 3</option>
                    </select>
                  </div>
                </div>
                <div className="col-2 my-auto" style={{ background: "#F9F9F9", height: "37px", borderRadius: "6px" }}>
                  <div className="d-flex justify-content-between showSelectDiv align-items-center">
                    <p className="mb-0">Show Entities</p>
                    <select
                      value={payload.per_page}
                      onChange={(e) => setPayload({ ...payload, per_page: e.target.value })}
                    >
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>
                  </div>
                </div>
                <div className="col-3 my-auto">
                  <button className="btn btn-light w-100" style={{ background: "#F9F9F9" }}>
                    <div className="d-flex justify-content-between w-100">
                      <div className="d-flex align-items-center">
                        <img
                          style={{ height: "20px" }}
                          src="/icons/priceAndCityIcons/androidIcon.png"
                          // src="https://cdn-icons-png.flaticon.com/128/16066/16066059.png"
                        />
                        <span className="ms-1">Device : {deviceCountDetails?.total_android_agents}</span>
                      </div>
                      <div className="d-flex align-items-center">
                        <img
                          style={{ height: "20px" }}
                          // src="https://cdn-icons-png.flaticon.com/128/14776/14776639.png"
                          src="/icons/priceAndCityIcons/appleIcon.png"
                        />
                        <span className="ms-1">Device : {deviceCountDetails?.total_ios_agents}</span>
                      </div>
                    </div>
                  </button>
                </div>
                <div className="col-3 my-auto">
                  <button className="btn btn-light w-100" style={{ background: "#F9F9F9" }}>
                    <div className="d-flex justify-content-between ">
                      <p className="mb-0">Total Users </p>
                      <p className="mb-0">{totalRecord}</p>
                    </div>
                  </button>
                </div>

                <div className="col-2">
                  <div
                    onClick={() => navigate("/add-agent")}
                    className="addUserBtn d-flex justify-content-between align-items-center"
                    style={{ background: "#F7D444", color: "#000" }}
                  >
                    <p className="mb-0" style={{ color: "#000" }}>
                      Create Agent
                    </p>
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/126/126327.png"
                      style={{ filter: "brightness(1) invert(0)" }}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* upper section end */}
            <div style={{ margin: "0px 10px" }}>
              <table className="table">
                <thead>
                  <tr style={{ background: "#8174A0", color: "white" }}>
                    <th scope="col" style={{ borderRadius: "8px 0px 0px 8px" }}>
                      <div className="d-flex justify-content-center ms-2">
                        <span>Sr. No</span>
                      </div>
                    </th>
                    <th scope="col">Profile Picture</th>
                    <th scope="col">Full Name</th>
                    <th scope="col">Email Address</th>
                    <th scope="col">Phone Number</th>
                    <th scope="col">Gender</th>
                    <th scope="col">Address</th>
                    <th scope="col">User app</th>
                    <th scope="col">Driver app</th>
                    <th scope="col">Device type</th>
                    <th scope="col">Wallet amount</th>
                    <th scope="col">Referral code</th>
                    <th scope="col">Total install app</th>

                    <th scope="col" style={{ borderRadius: "0px 8px 8px 0px" }}>
                      Action
                    </th>
                  </tr>
                </thead>
                <div className="py-2"></div>
                <tbody>
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
                              <Skeleton width={80} />
                            </td>
                            <td>
                              <Skeleton width={120} />
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
                    : userList?.map((v, i) => (
                        <tr key={i}>
                          <td scope="row">{parseInt(pageData?.current_page - 1) * 10 + i + 1}</td>
<td>
                            <img
                              src={
                                v?.image
                                  ? Image_Base_Url + v?.image
                                  : "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
                              }
                              alt="Profile"
                              style={{ height: "50px", borderRadius: "50%", width: "50px", marginTop: "-13px" }}
                            />
                          </td>
                          <td>
                            {v?.first_name} {v?.last_name}
                          </td>

                          <td>{v?.email}</td>
                          <td>
                            {v?.country_code === "91" ? (
                              <div className="d-flex justify-content-center align-items-center">
                                {" "}
                                <img
                                  src="https://cdn-icons-png.flaticon.com/128/206/206606.png"
                                  style={{ height: "15px", marginRight: "5px" }}
                                />{" "}
                                +{v?.country_code} {v?.contact?.substring(0, 5) + " " + v?.contact?.substring(5, 10)}
                              </div>
                            ) : (
                              <div className="d-flex justify-content-center align-items-center">
                                {" "}
                                <img
                                  src="https://cdn-icons-png.flaticon.com/128/5975/5975506.png"
                                  style={{ height: "15px", marginRight: "5px" }}
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
                          <td>{v?.gender}</td>
                          <td>{v?.address}</td>
                          <td>{v?.referred_user_count}</td>
                          <td>{v?.referred_driver_count}</td>
                          <td>
                            <div style={{ position: "relative", top: "-10px", marginBottom: "-10px" }}>
                              {v?.agent_device_id && (
                                <img style={{ height: "40px" }} src="/icons/priceAndCityIcons/androidIcon.png" />
                              )}
                              {v?.iosagent_device_id && (
                                <img style={{ height: "40px" }} src="/icons/priceAndCityIcons/appleIcon.png" />
                              )}
                            </div>
                          </td>
                          <td>${parseFloat(v?.wallet_balance).toFixed(2)}</td>
                          <td>
                            <button
                              className="btn btn-warning"
                              style={{ position: "relative", top: "-8px", background: "#F4D640" }}
                            >
                              {v?.referral_code}
                            </button>
                          </td>

                          <td>{parseInt(v?.referred_user_count) + parseInt(v?.referred_driver_count)}</td>
                          <td>
                            <div style={{ position: "relative", top: "-4px" }}>
                              
                              <button
                                className="p-2 ms-4"
                                style={{
                                  background: "#363535",
                                  fontSize: "14px",
                                  color: "#fff",
                                  border: "none",
                                  width: "90px",
                                  borderRadius: "6px",
                                }}
                                onClick={() => navigate("/agent-profile/" + v?.id)}
                              >
                                View
                              </button>
                              {deleteBtnId == v?.id ? <button
                                className="p-2 ms-4"
                                style={{
                                  background: "#EC5C13",
                                  fontSize: "14px",
                                  color: "#fff",
                                  border: "none",
                                  width: "90px",
                                  borderRadius: "6px",
                                  opacity:"0.5"
                                }}
                                
                              >
                                Deleting ...
                              </button>:<button
                                className="p-2 ms-4"
                                style={{
                                  background: "#EC5C13",
                                  fontSize: "14px",
                                  color: "#fff",
                                  border: "none",
                                  width: "90px",
                                  borderRadius: "6px",
                                }}
                                onClick={()=>handleDeleteUser(v?.id)}
                              >
                                Delete
                              </button>}
                              
                            </div>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
              {renderPage()}
            </div>
          </div>
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
                        <td style={{ color: v?.transfer_type == "debit" ? "#FD0100" : "#139F02" }}>
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
            <div className="modal-content fundsPopUpDiv p-4" style={{ background: "#fff" }}>
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
                    style={{ cursor: "pointer", background: userFunds?.reasonStatus == "decreasing" && "#BAA7EF" }}
                    onClick={() =>
                      userFunds?.input_value != 0
                        ? setUserFunds({ ...userFunds, reasonStatus: "decreasing" })
                        : alert("Please add fund in the input")
                    }
                  >
                    -
                  </span>
                  <input
                    value={userFunds?.input_value}
                    onChange={(e) => setUserFunds({ ...userFunds, input_value: e.target.value })}
                  />
                  <span
                    style={{ cursor: "pointer", background: userFunds?.reasonStatus == "increasing" && "#BAA7EF" }}
                    onClick={() =>
                      userFunds?.input_value != 0
                        ? setUserFunds({ ...userFunds, reasonStatus: "increasing" })
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
                      onChange={(e) => setUserFunds({ ...userFunds, reason: e?.target.value })}
                    >
                      <option value="">Select</option>
                      <option value="Refund for Incorrect Deduction – Funds were mistakenly deducted earlier and are now being refunded.">
                        Refund for Incorrect Deduction – Funds were mistakenly deducted earlier and are now being
                        refunded.
                      </option>
                      <option value="Promotional Credit – Funds added as part of a company promotional offer.">
                        Promotional Credit – Funds added as part of a company promotional offer.
                      </option>
                      <option value="Referral Bonus – Funds added as a referral reward.">
                        Referral Bonus – Funds added as a referral reward.
                      </option>
                      <option value="System Adjustment – Correcting an issue with a previous transaction.">
                        System Adjustment – Correcting an issue with a previous transaction.
                      </option>
                      <option value="Goodwill Gesture – Funds added as compensation for an inconvenience.">
                        Goodwill Gesture – Funds added as compensation for an inconvenience.
                      </option>
                      <option value="Bonus or Reward – Funds credited as a loyalty reward or seasonal bonus.">
                        Bonus or Reward – Funds credited as a loyalty reward or seasonal bonus.
                      </option>
                      <option value="Event Participation Credit – Funds added for participating in a company event or survey.">
                        Event Participation Credit – Funds added for participating in a company event or survey.
                      </option>
                      <option value="Marketing Campaign Credit – Promotional funds added as part of a marketing campaign.">
                        Marketing Campaign Credit – Promotional funds added as part of a marketing campaign.
                      </option>
                    </select>
                  ) : (
                    <select
                      className="form-control"
                      onChange={(e) => setUserFunds({ ...userFunds, reason: e?.target.value })}
                    >
                      <option value="">Select</option>
                      <option value="Correction for Mistaken Addition – Funds were mistakenly added earlier and are now being deducted.">
                        Correction for Mistaken Addition – Funds were mistakenly added earlier and are now being
                        deducted.
                      </option>
                      <option value="Penalty for Policy Violation – Deduction as a result of violating platform rules.">
                        Penalty for Policy Violation – Deduction as a result of violating platform rules.
                      </option>
                      <option value="System Adjustment – Correcting an error in a previous transaction.">
                        System Adjustment – Correcting an error in a previous transaction.
                      </option>
                      <option value="Chargeback Fee – Deduction due to a chargeback initiated by the payment gateway.">
                        Chargeback Fee – Deduction due to a chargeback initiated by the payment gateway.
                      </option>
                    </select>
                  )}
                </div>
                <div className="d-flex justify-content-center mt-3">
                  {userFunds?.reason ? (
                    fundBtnLoader ? (
                      <button className="purpleButton" style={{ opacity: "0.5" }}>
                        Updating ...
                      </button>
                    ) : (
                      <button className="purpleButton" onClick={updateWalletFunc}>
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

export default AgentList;
