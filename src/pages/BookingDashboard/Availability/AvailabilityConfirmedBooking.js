import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import TopNav from "../../../components/TopNav";
import TableNav from "../../../components/TableNav";
import {
  getDriverAvailabilityListServ,
  deleteDriverAvailability,
} from "../../../services/bookingDashboard.services";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import NoRecordFound from "../../../components/NoRecordFound";
import { useGlobalState } from "../../../GlobalProvider";
import { toast } from "react-toastify";
import moment from "moment";
import "react-toastify/dist/ReactToastify.css";
import { updateNotificationStatusServ } from "../../../services/notification.services";
import { getNavItems } from "../../../utils/TopNavItemData/bookingDashboard";
function AvailabilityConfirmedBooking() {
  const { setGlobalState, globalState } = useGlobalState();

  const tableNav = [
    {
      name: "Confirmed",
      path: "/availability-confirmed",
    },
    {
      name: "Cancelled",
      path: "/availability-cancelled",
    },
  ];
  const [showSkelton, setShowSkelton] = useState(false);
  const [availabilityList, setAvailabilityList] = useState([]);
  const handleGetDriverAvailibilityList = async () => {
    if (availabilityList.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await getDriverAvailabilityListServ({ status: "1" });
      if (response?.data?.statusCode == "200") {
        setAvailabilityList(response?.data?.data);
      }
    } catch (error) {}
    setShowSkelton(false);
  };
  useEffect(() => {
    handleGetDriverAvailibilityList();
  }, []);
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete the driver's availability?"
    );

    if (!confirmDelete) return; // Exit if the user clicks 'Cancel'
    try {
      let response = await deleteDriverAvailability({ availability_id: id });
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        handleGetDriverAvailibilityList();
      }
    } catch (error) {
      toast.error("Internal Server Error");
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
        return v.category == "driver_availability" && v?.is_read == 0;
      })
      ?.map((v, i) => {
        updateNotificationStatusFunc(v?.id);
      });
  });
  const [popupDetails, setPopupDetails] = useState(null);
  return (
    <div className="main_layout  bgBlack d-flex">
      {/* sidebar started */}
      <Sidebar selectedItem="Booking Dashboard" />
      {/* sidebar ended */}

      {/* sectionLayout started */}
      <section
        className="section_layout"
        style={{
          marginLeft: globalState?.isFillSidebarWidth100 ? "260px" : "80px",
        }}
      >
        {/* top nav started  */}
        <TopNav
          navItems={getNavItems(globalState)}
          navColor="#fff"
          navBg="#363435"
          divideRowClass="col-xl-6 col-lg-6 col-md-12 col-12"
          selectedItem="Driver's Availability"
          sectedNavBg="#D0FF13"
          selectedNavColor="#000"
          bookingTop={true}
        />
        {/* top nav ended  */}
        {/* table List started */}
        <div className="tableMain">
          {/* <TableNav tableNav={tableNav} selectedItem="Confirmed" sectedItemBg="#363435" selectedNavColor="#fff" /> */}
          <div
            className="tableBody py-1 px-3 borderRadius30All"
            style={{ background: "#363435" }}
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
                    <th scope="col">Request ID</th>
                    <th scope="col">Driver Name</th>
                    <th scope="col">Vehicle Number</th>
                    <th scope="col">Source City</th>
                    <th scope="col">Date</th>
                    <th scope="col">View Shift</th>

                    <th
                      scope="col"
                      style={{ borderRadius: "0px 24px 24px 0px" }}
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <div className="py-2"></div>
                <tbody>
                  {showSkelton
                    ? [1, 2, 3, 4, 5, 6, 7, 8, 9]?.map((v, i) => {
                        return (
                          <tr key={i}>
                            <td>
                              <Skeleton width={50} />
                            </td>
                            <td>
                              <Skeleton width={100} />
                            </td>
                            <td>
                              <Skeleton width={100} />
                            </td>
                            <td>
                              <Skeleton width={100} />
                            </td>
                            <td>
                              <Skeleton width={100} />
                            </td>
                            <td>
                              <Skeleton width={100} />
                            </td>

                            <td>
                              <Skeleton width={100} />
                            </td>
                            <td>
                              <Skeleton width={100} />
                            </td>
                          </tr>
                        );
                      })
                    : availabilityList?.map((v, i) => {
                        return (
                          <>
                            <tr className="bg-light mb-2">
                              <td
                                scope="row"
                                style={{
                                  borderTopLeftRadius: "30px",
                                  borderBottomLeftRadius: "30px",
                                }}
                              >
                                {i + 1}
                              </td>
                              <td>{v?.id}</td>
                              <td>
                                {v?.driver_details?.first_name}{" "}
                                {v?.driver_details?.last_name}
                              </td>
                              <td>
                                <button className="viewShiftBtn">
                                  <img
                                    className="me-2"
                                    src="https://cdn-icons-png.flaticon.com/128/89/89102.png"
                                  />{" "}
                                  <span>{v?.driver_details?.vehicle_no}</span>
                                </button>
                              </td>
                              <td>{v?.start_city}</td>
                              <td>
                                <div>
                                  <div>
                                    
                                      {moment(v?.start_date).format(
                                        "DD MMM, YYYY"
                                      )}{" "}
                                    
                                  </div>
                                </div>
                              </td>
                              <td style={{ color: "#006198" }}>
                                <button
                                  className="viewShiftBtn"
                                  onClick={() => setPopupDetails(v)}
                                >
                                  <img src="/icons/eyeIcon.png" />{" "}
                                  <span>View Shift</span>
                                </button>
                              </td>

                              <td
                                style={{
                                  color: "#B56B46",
                                  borderTopRightRadius: "30px",
                                  borderBottomRightRadius: "30px",
                                }}
                              >
                                <button
                                  className="viewShiftBtn"
                                  style={{ background: "#DD4132" }}
                                  onClick={() => handleDelete(v?.id)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                            <div className="py-2"></div>
                          </>
                        );
                      })}
                </tbody>
              </table>
              {availabilityList?.length == 0 && !showSkelton && (
                <NoRecordFound theme="light" />
              )}
            </div>
          </div>
        </div>
        {/* table List ended */}
      </section>
      {/* sectionLayout ended */}
      {/* {popupDetails && (
        <div
          className="modal fade show d-flex align-items-center manualSetPopup  justify-content-center "
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div
              className="modal-content"
              style={{
                borderRadius: "20px",
                background: "#f7f7f5",
                width: "364px",
              }}
            >
              <div className="d-flex justify-content-between pt-4 pb-0 px-4">
                <p>
                  <u>My Shift Schedule</u>
                </p>
                <i
                  className="fa fa-close text-secondary"
                  onClick={() => {
                    popupDetails(null);
                  }}
                ></i>
              </div>
              <hr className="m-0" />
              <div className="modal-body" style={{ fontFamily: "poppins" }}>
                <div
                  style={{
                    wordWrap: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                  className="d-flex justify-content-center w-100"
                >
                  <div className="w-100 " >
                    {popupDetails?.shift_details?.map((v, i) => {
                      return (
                        <div className=" px-2 mb-2">
                          <p className="mb-0" style={{ fontWeight: "400", fontSize:"14px" }}>{v?.name?.split("-")[0]}</p>
                          <span style={{ fontWeight: "500", fontSize:"20px" }}>
                            {v?.start_time + " to "+v?.end_time}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="d-flex justify-content-center"></div>
              </div>
            </div>
          </div>
        </div>
      )}
      {popupDetails && <div className="modal-backdrop fade show"></div>} */}
      {popupDetails && (
        <div
          className="modal fade show d-flex align-items-center manualSetPopup  justify-content-center "
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div
              className="modal-content"
              style={{
                borderRadius: "20px",
                background: "#353535",
                width: "364px",
                padding: "20px",
              }}
            >
              <div className="modal-body p-0" style={{ fontFamily: "poppins" }}>
                <div
                  style={{
                    wordWrap: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                  className="d-flex justify-content-center w-100"
                >
                  <div
                    className="w-100"
                    style={{
                      borderRadius: "15px",
                      padding: "24px",
                      background: "#D0FF13",
                    }}
                  >
                    <button
                      className="viewShiftBtn mb-3"
                      style={{
                        background: "#000",
                      }}
                    >
                      Range : {popupDetails?.distance_range} KM
                    </button>
                    {popupDetails?.shift_details?.map((v, i) => {
                      return (
                        <div
                          className={
                            i == popupDetails?.shift_details?.length
                              ? " "
                              : " mb-2"
                          }
                        >
                          <p
                            className="mb-0"
                            style={{ fontWeight: "400", fontSize: "14px" }}
                          >
                            {v?.name?.split("-")[0]}
                          </p>
                          <span style={{ fontWeight: "500", fontSize: "20px" }}>
                            {v?.start_time + " to " + v?.end_time}
                          </span>
                        </div>
                      );
                    })}
                    
                  </div>
                </div>
                <div className="d-flex justify-content-center mt-4">
                  <img
                    onClick={() => setPopupDetails(null)}
                    style={{ height: "70px" }}
                    src="/icons/popupCloseImg.png"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {popupDetails && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}

export default AvailabilityConfirmedBooking;
