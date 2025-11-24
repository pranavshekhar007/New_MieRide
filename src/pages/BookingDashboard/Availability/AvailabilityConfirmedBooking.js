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
import NewSidebar from "../../../components/NewSidebar";
import CustomTopNav from "../../../components/CustomTopNav";
import SecondaryTopNav from "../../../components/SecondaryTopNav";
import { Image_Base_Url } from "../../../utils/api_base_url_configration";
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
  const navItems = [
    [
      {
        name: "Sharing Ride",
        path: "/sharing-group-booking",
        notificationLength: globalState?.notificationList?.filter((v) => {
          return (
            (v?.category == "new_booking" ||
              v?.category == "new_route_created" ||
              v?.category == "booking_accepted" ||
              v?.category == "booking_rejected" ||
              v?.category == "booking_missed" ||
              v?.category == "booking_ride_started" ||
              v?.category == "booking_arrived" ||
              v?.category == "booking_pickup_started" ||
              v?.category == "booking_drop_started" ||
              v?.category == "booking_completed" ||
              v?.category == "booking_canceled" ||
              v?.category == "booking_ride_canceled") &&
            v?.is_read == 0
          );
        })?.length,
      },
      {
        name: "Personal Ride",
        path: "/personal-later-booking",
        notificationLength: globalState?.notificationList?.filter((v) => {
          return (
            (v?.category == "personal_new_booking" ||
              v?.category == "personal_booking_accepted" ||
              v?.category == "personal_booking_ride_canceled" ||
              v?.category == "personal_booking_missed" ||
              v?.category == "personal_booking_ride_started" ||
              v?.category == "personal_booking_completed" ||
              v?.category == "personal_booking_canceled") &&
            v?.is_read == 0
          );
        })?.length,
      },
      {
        name: "Family Ride",
        path: "/family-ride",
      },
    ],
    [
      {
        name: "Driver's Availability",
        path: "/availability-confirmed",
        notificationLength: globalState?.notificationList?.filter((v) => {
          return v.category == "driver_availability" && v?.is_read == 0;
        })?.length,
      },
      {
        name: "Driver's Route",
        path: "/route-confirmed",
        notificationLength: globalState?.notificationList?.filter((v) => {
          return v.category == "driver_share_route" && v?.is_read == 0;
        })?.length,
      },
    ],
    [
      {
        name: "Out Of Area",
        path: "/out-of-area",
        notificationLength: globalState?.notificationList?.filter((v) => {
          return v.category == "out_of_area" && v?.is_read == 0;
        })?.length,
      },
    ],
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
  const [shiftPopup, setShiftPopup] = useState(null);
  const [driverPopup, setDriverPopup] = useState(null);
  const [deletePopup, setDeletePopup] = useState(null);

  return (
    <div className="mainBody">
      <NewSidebar selectedItem="Booking Dashboard" />
      <div className="contentLayout">
        <div className="bgWhite borderRadius30 p-4 minHeight100vh">
          <div className="sticky-top bgWhite">
            <CustomTopNav
              navItems={navItems}
              selectedNav="Driver's Availability"
            />
            {/* <SecondaryTopNav
              navItems={tableNav}
              selectedNav="Completed"
              navBg="#E5E5E5"
              navColor="#1C1C1C"
              selectedNavBg="#353535"
              selectedNavColor="#fff"
            /> */}
          </div>
          <div className="tableOuterContainer bgDark mt-4">
            <div>
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      style={{ borderRadius: "24px 0px 0px 24px" }}
                    >
                      <div className="d-flex justify-content-center ms-2">
                        <span className="mx-2">Sr. No</span>
                      </div>
                    </th>

                    <th scope="col">Request ID</th>
                    <th scope="col">Driver Name</th>
                    <th scope="col">Vehicle Number</th>
                    <th scope="col">Source City</th>
                    <th scope="col">Ride Date</th>
                    <th scope="col">Shift Availability</th>

                    <th
                      scope="col"
                      style={{ borderRadius: "0px 24px 24px 0px" }}
                    >
                      <span className="me-3">Action</span>
                    </th>
                  </tr>
                </thead>
                <div className="pt-4"></div>
                <tbody>
                  {showSkelton
                    ? [1, 2, 3, 4, 5, 6, 7, 8, 9].map((v, i) => (
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
                      ))
                    : availabilityList?.map((v, i) => (
                        <React.Fragment key={i}>
                          <tr className="bgWhite">
                            {/* Left rounded corners */}
                            <td
                              scope="row"
                              style={{
                                borderTopLeftRadius: "24px",
                                borderBottomLeftRadius: "24px",
                              }}
                            >
                              {i + 1}
                            </td>

                            <td>{v?.id}</td>

                            <td className="text-dark">
                              {v?.driver_details?.first_name}{" "}
                              {v?.driver_details?.last_name}
                            </td>

                            {/* Vehicle Number button matching style */}
                            <td className="text-center">
                              <div
                                className="d-flex align-items-center justify-content-center"
                                style={{
                                  background: "#3A3A3A",
                                  borderRadius: "5px",
                                  padding: "8px 18px",
                                  color: "white",
                                  width: "120px",
                                  fontFamily: "Nexa",
                                  margin: "0 auto",
                                }}
                              >
                                <img
                                  src="https://cdn-icons-png.flaticon.com/128/89/89102.png"
                                  style={{
                                    height: "22px",
                                    marginRight: "10px",
                                    filter: "invert(1)",
                                  }}
                                />
                                <span
                                  style={{
                                    fontSize: "14px",
                                    fontWeight: "700",
                                    letterSpacing: "1px",
                                  }}
                                >
                                  {v?.driver_details?.vehicle_no}
                                </span>
                              </div>
                            </td>

                            <td className="text-center fontDesign">
                              {v?.start_city}
                            </td>

                            <td>
                              <div>
                                {moment(v?.start_date).format("DD MMM, YYYY")}
                              </div>
                            </td>

                            {/* View Shift column using reference eye-icon style */}
                            <td className="text-center">
                              <div
                                onClick={() => setShiftPopup(v)}
                                className="d-flex align-items-center justify-content-center"
                                style={{
                                  background: "#3A3A3A",
                                  borderRadius: "5px",
                                  padding: "8px 22px",
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  color: "white",
                                  margin: "0 auto",
                                  fontSize: "16px",
                                  letterSpacing: "0.2px",
                                  width: "100px",
                                }}
                              >
                                <img
                                  src="/imagefolder/eyeIcon.png"
                                  style={{
                                    height: "22px",
                                    marginRight: "10px",
                                    filter: "invert(1)",
                                  }}
                                />
                                <span
                                  style={{
                                    fontFamily: "Nexa",
                                    fontWeight: "600",
                                  }}
                                >
                                  View
                                </span>
                              </div>
                            </td>

                            {/* Action column using refundBtn style */}
                            <td
                              style={{
                                borderTopRightRadius: "24px",
                                borderBottomRightRadius: "24px",
                              }}
                            >
                              <div
                                className="d-flex align-items-center justify-content-center"
                                style={{
                                  gap: "25px", // spacing between icons
                                  padding: "5px 0",
                                }}
                              >
                                {/* Profile Icon */}
                                <div
                                  onClick={() => setDriverPopup(v)}
                                  style={{
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <img
                                    src="/imagefolder/Profile.png" /* You can replace with your green profile icon */
                                    style={{
                                      height: "35px",
                                      width: "40px",
                                    }}
                                  />
                                </div>

                                {/* Delete Icon */}
                                <div
                                  onClick={() => setDeletePopup(v)}
                                  style={{
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <img
                                    src="/imagefolder/delete.png" /* replace with your delete icon */
                                    style={{
                                      height: "35px",
                                      width: "40px",
                                    }}
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>

                          {/* Gap between rows like reference */}
                          <div
                            className={
                              i === availabilityList.length - 1 ? "" : "pb-3"
                            }
                          ></div>
                        </React.Fragment>
                      ))}
                </tbody>
              </table>

              {/* No Records */}
              {availabilityList?.length === 0 && !showSkelton && (
                <NoRecordFound theme="light" />
              )}
            </div>
          </div>
        </div>
        {driverPopup && (
          <>
            <div className="modal fade show d-flex align-items-center justify-content-center avDriverModal">
              <div className="modal-dialog">
                <div className="modal-content avDriverPopup">
                  <div className="avDriverHeader">
                    <h5>Driver Details</h5>
                  </div>

                  <div className="avDriverBody">
                    <div className="avDriverImgBox">
                      <img
                        className="avDriverImg"
                        src={Image_Base_Url + driverPopup.driver_details?.image}
                        alt="driver"
                      />
                      <span className="avDriverId">
                        Driver ID :- {driverPopup.driver_details?.unique_id}
                      </span>
                    </div>

                    <h4 className="avDriverName">
                      {driverPopup.driver_details?.first_name}{" "}
                      {driverPopup.driver_details?.last_name}
                    </h4>

                    <p className="avDriverInfoLabel">Email ID</p>
                    <p className="avDriverInfoValue">
                      {driverPopup.driver_details?.email}
                    </p>

                    <p className="avDriverInfoLabel mt-3">Phone no.</p>
                    <p className="avDriverInfoValue">
                      🇮🇳 {driverPopup.driver_details?.contact}
                    </p>

                    <button
                      className="avDriverCloseBtn"
                      onClick={() => setDriverPopup(null)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-backdrop fade show"></div>
          </>
        )}

        {shiftPopup && (
          <>
            <div className="modal fade show d-flex align-items-center justify-content-center avShiftModal">
              <div className="modal-dialog">
                <div className="modal-content avShiftPopup">
                  <div className="avShiftHeader">
                    <h5>Shift Availability</h5>
                  </div>

                  <div className="avShiftBody">
                    <div className="avShiftTopInfo">
                      <p>
                        Driver Name :-{" "}
                        <b>{shiftPopup.driver_details?.first_name}</b>
                      </p>
                      <p>
                        Source City :- <b>{shiftPopup.start_city}</b>
                      </p>
                    </div>

                    <div className="avShiftTags">
                      <div className="avShiftVehicleTag">
                        <img
                          src="https://cdn-icons-png.flaticon.com/128/89/89102.png"
                          className="avShiftVehicleIcon"
                          alt="car"
                        />
                        <span>{shiftPopup.driver_details?.vehicle_no}</span>
                      </div>

                      <div className="avShiftRangeTag">
                        Range : {shiftPopup.distance_range} KM
                      </div>
                    </div>

                    <div className="avShiftTableBox">
                      <table className="avShiftTable">
                        <thead>
                          <tr>
                            <th>Shift</th>
                            {/* <th>Time</th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {shiftPopup.shift_details?.map((s, index) => (
                            <tr key={index}>
                              <td>{s.name}</td>
                              <td>
                                {s.start_time} to {s.end_time}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="avShiftCloseBtn">
                    <img
                      src="/imagefolder/popUpCloseIcon.png"
                      onClick={() => setShiftPopup(null)}
                      style={{ cursor: "pointer", height: "45px" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-backdrop fade show"></div>
          </>
        )}

        {deletePopup && (
          <>
            <div className="modal fade show d-flex align-items-center justify-content-center avDeleteModal">
              <div className="modal-dialog">
                <div className="modal-content avDeletePopup">
                  <div className="avDeleteHeader">
                    <h5>Delete Driver’s Availability</h5>
                  </div>

                  <div className="avDeleteBody">
                    <img
                      src="/imagefolder/delete.png"
                      className="avDeleteIcon"
                    />

                    <p className="avDeleteText">
                      Are you sure you want to delete this driver’s
                      availability?
                      <br />
                      This action cannot be undone.
                    </p>

                    <div className="avDeleteActions">
                      <button
                        className="avDeleteNoBtn"
                        onClick={() => setDeletePopup(null)}
                      >
                        No
                      </button>
                      <button
                        className="avDeleteYesBtn"
                        onClick={() => {
                          handleDelete(deletePopup.id);
                          setDeletePopup(null);
                        }}
                      >
                        Yes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-backdrop fade show"></div>
          </>
        )}
      </div>
    </div>
  );
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
