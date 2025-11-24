import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import TopNav from "../../../components/TopNav";
import TableNav from "../../../components/TableNav";
import { getDriverRouteListServ } from "../../../services/bookingDashboard.services";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useGlobalState } from "../../../GlobalProvider";
import NoRecordFound from "../../../components/NoRecordFound";
import moment from "moment";
import { getNavItems } from "../../../utils/TopNavItemData/bookingDashboard";
import { updateNotificationStatusServ } from "../../../services/notification.services";
import NewSidebar from "../../../components/NewSidebar";
import CustomTopNav from "../../../components/CustomTopNav";
import SecondaryTopNav from "../../../components/SecondaryTopNav";
function RouteConfirmed() {
  const { setGlobalState, globalState } = useGlobalState();

  const tableNav = [
    {
      name: "New Booking",
      path: "/route-new-booking",
      notificationLength: globalState?.notificationList?.filter((v) => {
        return v.category == "driver_share_route" && v?.is_read == 0;
      })?.length,
    },
    {
      name: "Confirmed",
      path: "/route-confirmed",
    },
    {
      name: "Cancelled",
      path: "/route-cancelled",
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
  const [routeList, setRouteList] = useState([]);
  const handleGetDriverRouteList = async () => {
    if (routeList.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await getDriverRouteListServ({ status: "1" });
      if (response?.data?.statusCode == "200") {
        setRouteList(response?.data?.data);
      }
    } catch (error) {}
    setShowSkelton(false);
  };
  useEffect(() => {
    handleGetDriverRouteList();
  }, []);

  const [selectedTime, setSelectedTime] = useState({});

  return (
    <div className="mainBody">
      <NewSidebar selectedItem="Booking Dashboard" />
      <div className="contentLayout">
        <div className="bgWhite borderRadius30 p-4 minHeight100vh">
          <div className="sticky-top bgWhite">
            <CustomTopNav navItems={navItems} selectedNav="Driver's Route" />
            <SecondaryTopNav
              navItems={tableNav}
              selectedNav="Personal Later"
              navBg="#E5E5E5"
              navColor="#1C1C1C"
              selectedNavBg="#353535"
              selectedNavColor="#fff"
            />
          </div>
          <div className="tableOuterContainer bgDark mt-4">
            <div>
              <table className="table">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      style={{ borderRadius: "24px 0px 0px 24px" }}
                    >
                      <div className="d-flex justify-content-center ms-2">
                        <span>Sr. No</span>
                      </div>
                    </th>
                    <th scope="col">Req. ID</th>
                    <th scope="col">Driver Name</th>
                    <th scope="col">Vehicle No.</th>
                    <th scope="col">Source Address</th>
                    <th scope="col">Destination Address</th>
                    <th scope="col">Time Choice</th>
                    <th scope="col">Date & Time</th>
                    <th scope="col">Status</th>
                    <th scope="col">No. of seat</th>

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
                    : routeList?.map((v, i) => {
                        return (
                          <>
                            <tr className="bg-light mb-2">
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
                              <td>
                                {v?.driver_details?.first_name}{" "}
                                {v?.driver_details?.last_name}
                              </td>
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
                              <td>
                                <div className="d-flex justify-content-center">
                                  <div
                                    style={{
                                      padding: "3px 6px",
                                      width: "150px",
                                      // background: "#363435",
                                      border: "none",
                                      // color: "white",
                                      borderRadius: "8px",
                                      wordWrap: "break-word",
                                      whiteSpace: "normal",
                                    }}
                                  >
                                    {v?.start_point}, {v?.start_city}
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="d-flex justify-content-center">
                                  <div
                                    style={{
                                      padding: "3px 6px",
                                      width: "150px",
                                      // background: "#EAFF00",
                                      border: "none",
                                      // color: "#000",
                                      borderRadius: "8px",
                                      wordWrap: "break-word",
                                      whiteSpace: "normal",
                                    }}
                                  >
                                    {v?.end_point}, {v?.end_city}
                                  </div>
                                </div>
                              </td>
                              <td className="timeCell">
                                {/* START BUTTON (if start exists) */}
                                {v?.start_time && (
                                  <button className="timeBtn startBtns">
                                    Start
                                  </button>
                                )}
                              </td>

                              <td>
                                <div>
                                  {moment(v?.reach_date).format("DD/MM/YYYY")}{" "}
                                </div>
                                <div>
                                  {moment(v?.reach_time, "HH:mm").format(
                                    "hh:mm A"
                                  )}{" "}
                                </div>
                              </td>
                              <td className="statusCell">
                                <span className="statusBtn statusConfirmed">
                                  Confirmed
                                </span>
                              </td>

                              <td>{v?.seat_available}</td>
                              <td
                                style={{
                                  borderTopRightRadius: "24px",
                                  borderBottomRightRadius: "24px",
                                  overflow: "hidden",
                                }}
                              >
                                <div
                                  className="d-flex justify-content-center align-items-center"
                                  style={{
                                    borderRadius: "12px",
                                    width: "100%",
                                    height: "100%",
                                    color: "#870184",
                                  }}
                                >
                                  {/* {v?.seat_available} */}
                                </div>
                              </td>
                            </tr>
                            <div className="py-2"></div>
                          </>
                        );
                      })}
                </tbody>
              </table>
              {routeList?.length == 0 && !showSkelton && (
                <NoRecordFound theme="light" />
              )}
            </div>
          </div>
        </div>
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
          selectedItem="Driver's Route"
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
                    <th scope="col">Req. ID</th>
                    <th scope="col">Driver Name</th>
                    <th scope="col">Vehicle No.</th>
                    <th scope="col">Source Address</th>
                    <th scope="col">Destination Address</th>
                    <th scope="col">Time Choice</th>
                    <th scope="col">Date & Time</th>
                    <th scope="col">Status</th>
                    <th scope="col">No. of seat</th>

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
                    : routeList?.map((v, i) => {
                        return (
                          <>
                            <tr className="bg-light mb-2">
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
                              <td>
                                {v?.driver_details?.first_name}{" "}
                                {v?.driver_details?.last_name}
                              </td>
                              <td>{v?.driver_details?.vehicle_no}</td>
                              <td>
                                <div className="d-flex justify-content-center">
                                  <div
                                    style={{
                                      padding: "3px 6px",
                                      width: "150px",
                                      // background: "#363435",
                                      border: "none",
                                      // color: "white",
                                      borderRadius: "8px",
                                      wordWrap: "break-word",
                                      whiteSpace: "normal",
                                    }}
                                  >
                                    {v?.start_point}, {v?.start_city}
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="d-flex justify-content-center">
                                  <div
                                    style={{
                                      padding: "3px 6px",
                                      width: "150px",
                                      // background: "#EAFF00",
                                      border: "none",
                                      // color: "#000",
                                      borderRadius: "8px",
                                      wordWrap: "break-word",
                                      whiteSpace: "normal",
                                    }}
                                  >
                                    {v?.end_point}, {v?.end_city}
                                  </div>
                                </div>
                              </td>
                              <td style={{ color: "#006198" }}>
                                <div>
                                  {moment(v?.start_date).format("DD/MM/YYYY")}{" "}
                                </div>
                                <div>
                                  {moment(v?.start_time, "HH:mm").format(
                                    "hh:mm A"
                                  )}{" "}
                                </div>
                              </td>
                              <td style={{ color: "#B56B46" }}>
                                <div>
                                  {moment(v?.reach_date).format("DD/MM/YYYY")}{" "}
                                </div>
                                <div>
                                  {moment(v?.reach_time, "HH:mm").format(
                                    "hh:mm A"
                                  )}{" "}
                                </div>
                              </td>
                              <td>{v?.driver_details?.vehicle_no}</td>
                              <td>{v?.driver_details?.vehicle_no}</td>
                              <td
                                style={{
                                  borderTopRightRadius: "24px",
                                  borderBottomRightRadius: "24px",
                                  overflow: "hidden",
                                }}
                              >
                                <div
                                  className="d-flex justify-content-center align-items-center"
                                  style={{
                                    borderRadius: "12px",
                                    width: "100%",
                                    height: "100%",
                                    color: "#870184",
                                  }}
                                >
                                  {v?.seat_available}
                                </div>
                              </td>
                            </tr>
                            <div className="py-2"></div>
                          </>
                        );
                      })}
                </tbody>
              </table>
              {routeList?.length == 0 && !showSkelton && (
                <NoRecordFound theme="light" />
              )}
            </div>
          </div>
        </div>
        {/* table List ended */}
      </section>
      {/* sectionLayout ended */}
    </div>
  );
}

export default RouteConfirmed;
