import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import {
  getDriverListServ,
  deleteDriverServ,
  getDriverByIdServ,
  updateDriverWalletAmountServ,
} from "../../services/driver.services";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useNavigate } from "react-router-dom";
import { useGlobalState } from "../../GlobalProvider";
import { Image_Base_Url } from "../../utils/api_base_url_configration";
import NoRecordFound from "../../components/NoRecordFound";
import Ably from "ably";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { updateNotificationStatusServ } from "../../services/notification.services";
import NewSidebar from "../../components/NewSidebar";

function DriverList() {
  const { setGlobalState, globalState } = useGlobalState();
  const [totalRecord, setToatalRecord] = useState(0);
  const navigate = useNavigate();
  const [driverList, setDriverList] = useState([]);
  const [showSkelton, setShowSkelton] = useState(false);
  const [payload, setPayload] = useState({
    page: 1,
    search_key: "",
    per_page: 10,
    status:"",
    deviceStatus:"",
    
  });
  const [pageData, setPageData] = useState({
    total_pages: "",
    current_page: "",
  });
  const [deviceCountDetails, setDeviceCountDetails] = useState({
    total_android_drivers: "",
    total_ios_drivers: "",
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
    if (driverList?.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await getDriverListServ(payload);
      if (response?.data?.statusCode == "200") {
        setDriverList(response?.data?.data);
        setToatalRecord(response?.data?.total_records);
        setPageData({
          total_pages: response?.data?.total_pages,
          current_page: response?.data?.current_page,
        });
        setDeviceCountDetails({
          total_android_drivers: response?.data?.total_android_drivers,
          total_ios_drivers: response?.data?.total_ios_drivers,
        });
      }
    } catch (error) {}
    setShowSkelton(false);
  };
  useEffect(() => {
    // Initialize Ably client with the API key
    const ably = new Ably.Realtime("cgbtZA.AQetNw:hE5TCgJHH9F4gWbFqv6pD5ScBM-A_RnW0RQG7xwQg-Y");
    const channel = ably.channels.get("driver-updates");

    // Fetch user list initially
    handleGetUserListFunc();

    // Subscribe to the 'user-updates' channel for real-time updates
    channel.subscribe("profile-updated", (message) => {
      console.log("Received real-time update:", message.data);
      // Re-fetch user list when an update is received
      handleGetUserListFunc();
    });
    // Cleanup on component unmount
    
  }, [payload]);
  const handleDeleteDriver = async (id, event) => {
    event.stopPropagation();
    const confirmDelete = window.confirm("Are you sure you want to delete this driver?");

    if (!confirmDelete) return; // Exit if the user clicks 'Cancel'

    try {
      const response = await deleteDriverServ(id);
      if (response.data.statusCode === "200") {
        toast.success(response?.data?.message);
        handleGetUserListFunc();
      }
    } catch (error) {
      console.error("Error deleting driver:", error);
      toast.error("Failed to delete the driver. Please try again.");
    }
  };
  const navigateDriverApprovalPage = async (id) => {
    try {
      let response = await getDriverByIdServ(id);
      let statusDetails;
      if (response?.data?.statusCode == "200") {
        statusDetails = response.data?.data;
        if (statusDetails?.profileStatus?.status != "1") {
          navigate(`/driver-personal-details-verification/${id}`);
          return;
        } else if (statusDetails?.vehicleStatus?.status != "1") {
          navigate(`/driver-car-details-verification/${id}`);
          return;
        } else if (statusDetails?.imageStatus?.status != "1") {
          navigate(`/driver-profile-details-verification/${id}`);
          return;
        } else if (statusDetails?.licenceStatus?.status != "1") {
          navigate(`/driver-license-details-verification/${id}`);
          return;
        } else if (statusDetails?.ownershipStatus?.status != "1") {
          navigate(`/driver-ownership-details-verification/${id}`);
          return;
        } else if (statusDetails?.insuranceStatus?.status != "1") {
          navigate(`/driver-insurance-details-verification/${id}`);
          return;
        } else {
          navigate(`/driver-review-details-verification/${id}`);
        }
      }
    } catch (error) {}
  };
  const preventRouting = async (event) => {
    event.stopPropagation();
  };
  const findDeviceCount = (type) => {
    if (type == "driver_device_id") {
      let filteredDriver = driverList?.filter((v, i) => {
        return v?.driver_device_id;
      });
      return filteredDriver?.length;
    } else {
      let filteredDriver = driverList?.filter((v, i) => {
        return v?.iosdriver_device_id;
      });
      return filteredDriver?.length;
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
        return v?.notifiable_type == "Driver" && v?.is_read == 0;
      })
      ?.map((v, i) => {
        updateNotificationStatusFunc(v?.id);
      });
  });
  const [userFunds, setUserFunds] = useState({
    show: false,
    current_wallet: "",
    wallet_balance: "",
    driver_id: "",
    reason: "",
    input_value: 0,
    reasonStatus: "",
  });
  const updateWalletFunc = async () => {
    try {
      const { reasonStatus, input_value, wallet_balance } = userFunds;

      // Parse input_value to a number to avoid type issues
      const inputValue = parseFloat(input_value);

      // Prepare the formdata based on reasonStatus
      let updatedWallet = parseFloat(wallet_balance);
      if (reasonStatus === "increasing") {
        updatedWallet += inputValue;
      } else if (reasonStatus === "decreasing") {
        updatedWallet -= inputValue;
      }

      const formdata = {
        ...userFunds,
        user_wallet: updatedWallet,
        driver_wallet: updatedWallet,
      };
      const response = await updateDriverWalletAmountServ(formdata);
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
        wallet_balance: "",
        driver_id: "",
        reason: "",
        input_value: 0,
        reasonStatus: "",
      });
    }
  };
   return(
    <div className="mainBody">
      <NewSidebar selectedItem="Drivers" />
      <div className="contentLayout">
        <div className="bgWhite borderRadius30 p-4 minHeight100vh">
          <div className="sticky-top bgWhite">
            
          </div>
          <div className="vh-100 bgDark d-flex justify-content-center align-items-center borderRadius30 ">
            <p
              style={{
                color: "#FFF",
                textAlign: "center",
                fontFamily: "Poppins",
                fontSize: "50px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "normal",
              }}
            >
              Work In Progress
            </p>
          </div>
        </div>
      </div>
    </div>
  )
  return (
    <div className="main_layout  bgBlack d-flex">
      {/* sidebar started */}
      <Sidebar selectedItem="Driver" />
      {/* sidebar ended */}

      {/* sectionLayout started */}
      <section
        className="section_layout"
        style={{ minWidth: "2100px", marginLeft: globalState?.isFillSidebarWidth100 ? "260px" : "80px" }}
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
                    <select onChange={(e)=>setPayload({...payload, status:e?.target?.value})}>
                      <option value="">Status</option>
                      <option value="approved">Approved</option>
                      <option value="reissue">Reissue</option>
                      <option value="pending">New request</option>
                      <option value="incomplete">Incomplete</option>
                    </select>
                  </div>
                </div>
                <div className="col-1">
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
                        <img style={{ height: "20px" }} src="/icons/priceAndCityIcons/androidIcon.png" />
                        <span className="ms-1">Device : {deviceCountDetails?.total_android_drivers}</span>
                      </div>
                      <div className="d-flex align-items-center">
                        <img style={{ height: "20px" }} src="/icons/priceAndCityIcons/appleIcon.png" />
                        <span className="ms-1">Device : {deviceCountDetails?.total_ios_drivers}</span>
                      </div>
                    </div>
                  </button>
                </div>
                <div className="col-2 my-auto">
                  <button className="btn btn-light w-100" style={{ background: "#F9F9F9" }}>
                    <div className="d-flex justify-content-between ">
                      <p className="mb-0">Total Driver </p>
                      <p className="mb-0"> {totalRecord} </p>
                    </div>
                  </button>
                </div>

                <div className="col-2">
                  <div
                    onClick={() => navigate("/add-driver")}
                    className="addUserBtn d-flex justify-content-between align-items-center"
                    style={{ background: "#EC5C13", cursor: "pointer" }}
                  >
                    <p className="mb-0">Add Driver</p>
                    <img src="/icons/sidebarIcons/driver.png" />
                  </div>
                </div>
              </div>
            </div>
            {/* upper section end */}
            <div style={{ margin: "0px 10px" }}>
              <table className="table">
                <thead>
                  <tr style={{ background: "#EC5C13", color: "white" }}>
                    <th scope="col" style={{ borderRadius: "8px 0px 0px 8px" }}>
                      <div className="d-flex justify-content-center ms-2">
                        <span>Sr. No</span>
                      </div>
                    </th>
                    <th scope="col">Profile Picture</th>
                    <th scope="col">First Name</th>
                    <th scope="col">Last Name</th>
                    <th scope="col">Email Address</th>
                    <th scope="col">Phone Number</th>
                    <th scope="col">Device Type</th>
                    <th scope="col">Wallet</th>
                    <th scope="col">Funds</th>
                    <th scope="col">Vehicle Brand</th>
                    <th scope="col">Vehicle Colour</th>
                    <th scope="col">Year Of Manufacture</th>
                    <th scope="col">Vehicle Size</th>
                    <th scope="col">Status</th>

                    <th scope="col" style={{ borderRadius: "0px 8px 8px 0px" }}>
                      <div className="d-flex justify-content-center me-3">
                        <span>Profile</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <div className="py-2"></div>
                <tbody className="driverTable">
                  {showSkelton
                    ? Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i}>
                          <td>
                            <Skeleton width={40} />
                          </td>
                          <td>
                            <Skeleton circle={true} height={50} width={50} />
                          </td>
                          <td>
                            <Skeleton width={100} />
                          </td>
                          <td>
                            <Skeleton width={100} />
                          </td>
                          <td>
                            <Skeleton width={150} />
                          </td>
                          <td>
                            <Skeleton width={120} />
                          </td>
                          <td>
                            <Skeleton width={80} />
                          </td>
                          <td>
                            <Skeleton width={100} />
                          </td>
                          <td>
                            <Skeleton width={100} />
                          </td>
                          <td>
                            <Skeleton width={120} />
                          </td>
                          <td>
                            <Skeleton width={90} />
                          </td>
                          <td>
                            <Skeleton width={90} />
                          </td>
                          <td>
                            <Skeleton width={100} />
                          </td>
                          <td>
                            <Skeleton width={100} />
                          </td>
                        </tr>
                      ))
                    : driverList?.map((v, i) => (
                        <tr
                          key={i}
                          style={{ background: i % 2 === 0 ? "#FDEEE7" : "#fff", cursor: "pointer" }}
                          onClick={() =>
                            navigate(
                              v?.status == "Disapprove" ? navigateDriverApprovalPage(v?.id) : `/driver-profile/${v?.id}`
                            )
                          }
                        >
                          {/* <td style={{ borderRadius: "12px 0px 0px 12px" }}>{i + 1}</td> */}
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
                          <td>{v?.first_name}</td>
                          <td>{v?.last_name}</td>
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
                          <td>
                            <div style={{ position: "relative", top: "-10px", marginBottom: "-10px" }}>
                              {v?.driver_device_id && (
                                <img style={{ height: "40px" }} src="/icons/priceAndCityIcons/androidIcon.png" />
                              )}
                              {v?.iosdriver_device_id && (
                                <img style={{ height: "40px" }} src="/icons/priceAndCityIcons/appleIcon.png" />
                              )}
                            </div>
                          </td>
                          <td>${v?.wallet_balance}</td>
                          <td>
                            <button
                              className="btn btn-primary"
                              style={{ marginTop: "-6px", background: "#EC5C13", borderRadius: "6px", border: "none" }}
                              onClick={(event) => {
                                event.stopPropagation();
                                setUserFunds({
                                  show: true,
                                  current_wallet: v?.wallet_balance,
                                  wallet_balance: v?.wallet_balance,
                                  driver_id: v?.id,
                                  input_value: 0,
                                  reasonStatus: "",
                                });
                              }}
                            >
                              Open
                            </button>
                          </td>
                          <td>{v?.vehicle_name}</td>
                          <td>{v?.vehicle_colour}</td>
                          <td>{v?.vehicle_date}</td>
                          <td>{v?.vehicle_size} seater</td>
                          {/* <td>
                            {v?.status === "Disapprove" ? (
                              v?.complete_step == 3 ? (
                                <button
                                  className="p-2"
                                  style={{
                                    background: "#024596",
                                    fontSize: "12px",
                                    color: "#fff",
                                    border: "none",
                                    width: "100px",
                                    borderRadius: "7px",
                                    marginTop: "-6px",
                                  }}
                                >
                                  New Request
                                </button>
                              ) : (
                                <button
                                  className="p-2"
                                  // onClick={(event) => handleDeleteDriver(v?.id, event)}
                                  onClick={(event) => preventRouting(event)}
                                  style={{
                                    background: "red",
                                    fontSize: "8px",
                                    color: "#fff",
                                    border: "none",
                                    width: "100px",
                                    borderRadius: "7px",
                                    marginTop: "-6px",
                                  }}
                                >
                                  Profile Incomplete
                                </button>
                              )
                            ) : (
                              <button
                                className="p-2"
                                style={{
                                  background: "#139F01",
                                  fontSize: "12px",
                                  color: "#fff",
                                  border: "none",
                                  width: "100px",
                                  borderRadius: "7px",
                                  marginTop: "-6px",
                                }}
                              >
                                Approved
                              </button>
                            )}
                          </td> */}
                          <td>
                            {v?.accountApprovalStatus === "pending" && (
                              <button
                                className="p-2"
                                style={{
                                  background: "#024596",
                                  fontSize: "12px",
                                  color: "#fff",
                                  border: "none",
                                  width: "100px",
                                  borderRadius: "7px",
                                  marginTop: "-6px",
                                }}
                              >
                                New Request
                              </button>
                            )}
                             {v?.accountApprovalStatus === "reissue" && (
                              <button
                                className="p-2"
                                style={{
                                  background: "red",
                                  fontSize: "12px",
                                  color: "#fff",
                                  border: "none",
                                  width: "100px",
                                  borderRadius: "7px",
                                  marginTop: "-6px",
                                }}
                              >
                                Re Issued
                              </button>
                            )}
                            {v?.accountApprovalStatus === "approved" && (
                              <button
                                className="p-2"
                                style={{
                                  background: "#139F01",
                                  fontSize: "12px",
                                  color: "#fff",
                                  border: "none",
                                  width: "100px",
                                  borderRadius: "7px",
                                  marginTop: "-6px",
                                }}
                              >
                                Approved
                              </button>
                            )}
                            {v?.accountApprovalStatus === "incomplete" && (
                              <button
                              onClick={(event) => preventRouting(event)}
                                className="p-2"
                                style={{
                                  background: "gray",
                                  fontSize: "12px",
                                  color: "#fff",
                                  border: "none",
                                  width: "100px",
                                  borderRadius: "7px",
                                  marginTop: "-6px",
                                }}
                              >
                                 Incomplete
                              </button>
                            )}
                            {v?.accountApprovalStatus === "profile_updated" && (
                              <button
                              
                                className="p-2"
                                style={{
                                  background: "skyblue",
                                  fontSize: "12px",
                                  color: "#000",
                                  border: "none",
                                  width: "120px",
                                  borderRadius: "7px",
                                  marginTop: "-6px",
                                }}
                              >
                                 Profile Updated
                              </button>
                            )}
                          </td>
                          <td style={{ borderRadius: "0px 12px 12px 0px" }}>
                            <img src="/icons/sidebarIcons/driver.png" style={{ height: "18px" }} />
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
              {driverList.length == 0 && !showSkelton && <NoRecordFound />}
              {renderPage()}
            </div>
          </div>
        </div>
        {/* table List ended */}
      </section>
      {/* sectionLayout ended */}
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
                      wallet_balance: "",
                      driver_id: "",
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
                    <button className="purpleButton" onClick={updateWalletFunc}>
                      Submit
                    </button>
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

export default DriverList;
