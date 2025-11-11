import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import TopNav from "../../../components/TopNav";
import TableNav from "../../../components/TableNav";
import { useGlobalState } from "../../../GlobalProvider";
import { getBookingRecordServ } from "../../../services/bookingDashboard.services";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import moment from "moment";
import NoRecordFound from "../../../components/NoRecordFound";
import { updateNotificationStatusServ } from "../../../services/notification.services";
function SharingConfirmedBooking() {
  const { setGlobalState, globalState } = useGlobalState();
  const navItems = [
    {
      name: "Sharing",
      path: "/sharing-group-booking",  
    },
    {
      name: "Personal",
      path: "/personal-assigned-booking",
    },
    {
      name: "Airport",
      path: "/airport-comming-soon",
    },
    {
      name: "Drive Test",
      path: "/drive-test-new-booking",
    },
    {
      name: "Intercity",
      path: "/intercity-comming-soon",
    },
    {
      name: "Driver's Availability",
      path: "/availability-confirmed",
      notificationLength:globalState?.notificationList
      ?.filter((v) => {
        return v.category == "driver_availability" && v?.is_read ==0;
      })
      ?.length
    },
    {
      name: "Driver's Route",
      path: "/route-new-booking",
    },
    {
      name: "Out Of Area",
      path: "/out-of-area",
      notificationLength:globalState?.notificationList
      ?.filter((v) => {
        return v.category == "out_of_area" && v?.is_read ==0;
      })
      ?.length
    },
  ];
  const tableNav = [
    {
      name: "Group",
      path: "/sharing-group-booking",
      notificationLength:globalState?.notificationList
      ?.filter((v) => {
        return v.category == "new_booking" && v?.is_read ==0;
      })
      ?.length
    },
    {
      name: "Route",
      path: "/sharing-route-booking", 
    },
    {
      name: "Assigned",
      path: "/sharing-assigned-booking",
    },

    {
      name: "Accepted",
      path: "/sharing-accepted-booking",
      notificationLength:globalState?.notificationList
      ?.filter((v) => {
        return (v.category == "booking_accepted" || v.category == "booking_rejected") && v?.is_read ==0;
      })
      ?.length
    },
    {
      name: "Manual",
      path: "/sharing-manual-booking",
      
    },
    {
      name: "Missed",
      path: "/sharing-missed-booking",
      notificationLength:globalState?.notificationList
      ?.filter((v) => {
        return v.category == "booking_missed"  && v?.is_read ==0;
      })
      ?.length
    },
    {
      name: "Enroute",
      path: "/sharing-enroute-booking",
      notificationLength:globalState?.notificationList
      ?.filter((v) => {
        return (v.category == "booking_ride_started"  || v.category == "booking_arrived"  || v.category == "booking_pickup_started" || v.category == "booking_drop_route_started" || v.category == "booking_drop_started") && v?.is_read ==0;
      })
      ?.length
    },
    {
      name: "Completed",
      path: "/sharing-completed-booking",
      notificationLength:globalState?.notificationList
      ?.filter((v) => {
        return (v.category == "booking_completed") && v?.is_read ==0;
      })
      ?.length
    },
    {
      name: "Cancelled",
      path: "/sharing-cancelled-booking",
      notificationLength:globalState?.notificationList
      ?.filter((v) => {
        return (v.category == "booking_canceled" || v.category == "booking_ride_canceled") && v?.is_read ==0;
      })
      ?.length
    },
  ];

  const [list, setList] = useState([]);
  const [showSkelton, setShowSkelton] = useState(false);
  const handleGetListFunc = async () => {
    if (list?.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await getBookingRecordServ({ booking_status: "confirmed" });
      if (response?.data?.statusCode == "200") {
        setList(response?.data?.data);
      }
    } catch (error) {}
    setShowSkelton(false);
  };
  useEffect(() => {
    handleGetListFunc();
  }, []);
  return (
    <div className="main_layout  bgBlack d-flex">
      {/* sidebar started */}
      <Sidebar selectedItem="Booking Dashboard" />
      {/* sidebar ended */}

      {/* sectionLayout started */}
      <section
        className="section_layout"
        style={{ minWidth: "1800px", marginLeft: globalState?.isFillSidebarWidth100 ? "260px" : "80px" }}
      >
        {/* top nav started  */}
        <TopNav
          navItems={navItems}
          navColor="#fff"
          navBg="#000"
          divideRowClass="col-xl-6 col-lg-6 col-md-12 col-12"
          selectedItem="Sharing"
          sectedNavBg="#139F01"
          selectedNavColor="#fff"
        />
        {/* top nav ended  */}
        {/* table List started */}
        <div className="tableMain">
          <TableNav tableNav={tableNav} selectedItem="Confirmed" sectedItemBg="#363435" selectedNavColor="#fff" />
          <div className="tableBody py-2 px-4 borderRadius50exceptTopLeft" style={{ background: "#363435" }}>
            <div style={{ margin: "20px 10px" }}>
              <table className="table bookingTable">
                <thead>
                  <tr style={{ background: "#139F01", color: "#fff" }}>
                    <th scope="col" style={{ borderRadius: "24px 0px 0px 24px" }}>
                      <div className="d-flex justify-content-center ">
                        <span className="mx-2">Sr. No</span>
                      </div>
                    </th>
                    <th scope="col">Booking ID</th>
                    <th scope="col">Source Address</th>
                    <th scope="col">Destination Address</th>
                    <th scope="col">Username</th>
                    <th scope="col">Booking Date</th>
                    <th scope="col">Booking Time</th>
                    <th scope="col">Time Choice</th>
                    <th scope="col">Booking Amount</th>
                    <th scope="col">Surge Amount</th>
                    <th scope="col">Total Amount</th>
                    <th scope="col">Admin Fee</th>
                    <th scope="col">Driver Earn</th>

                    <th scope="col" style={{ borderRadius: "0px 24px 24px 0px" }}>
                      Booking Placed
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
                    : list?.map((v, i) => {
                        return (
                          <>
                            <tr className="bg-light mb-2 ">
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
                              <td className="" style={{ padding: "0px" }}>
                                <div className="d-flex justify-content-center">
                                  <div className="d-flex justify-content-between locationBoxButton">
                                    <div>
                                      <img
                                        src="https://cdn-icons-png.flaticon.com/128/3179/3179068.png"
                                        className=""
                                        style={{
                                          height: "18px",
                                          top: "5px",
                                          position: "relative",
                                        }}
                                      />
                                      <div className="countDiv">{i + 1}</div>
                                    </div>

                                    <span className="ms-2">{v?.source}</span>
                                  </div>{" "}
                                </div>
                              </td>
                              <td className="" style={{ padding: "0px" }}>
                                <div className="d-flex justify-content-center">
                                  <div className="d-flex justify-content-between locationBoxButton">
                                    <div>
                                      <img
                                        src="https://cdn-icons-png.flaticon.com/128/1483/1483285.png"
                                        className=""
                                        style={{ height: "18px", top: "5px", position: "relative" }}
                                      />
                                      <div className="countDivSmall">{i + 1}</div>
                                    </div>

                                    <span className="ms-2">{v?.destination}</span>
                                  </div>{" "}
                                </div>
                              </td>
                              <td>{v?.user_details?.first_name}</td>
                              <td style={{ color: "#ed2236" }}>{moment(v?.booking_date).format("DD/MM/YYYY")}</td>
                              <td style={{ color: " #139f01" }}>{v?.booking_time}</td>
                              <td>{v?.time_choice == "pickupat" ? "Pickup" : " Dropoff"}</td>
                              <td>
                                <div style={{ width: "80px" }}>${v?.booking_amount}</div>{" "}
                              </td>
                              <td>
                                <div style={{ width: "80px" }}>${v?.extra_charge}</div>{" "}
                              </td>
                              <td>
                                <div style={{ width: "80px" }}>${v?.total_trip_cost}</div>{" "}
                              </td>
                              <td>
                                <div style={{ width: "80px" }}>${v?.admin_commission}</div>{" "}
                              </td>
                              <td>
                                <div style={{ width: "80px" }}>${v?.driver_earning}</div>{" "}
                              </td>

                              <td
                                style={{
                                  borderTopRightRadius: "24px",
                                  borderBottomRightRadius: "24px",
                                }}
                              >
                                <div>{moment(v?.created_at).format("DD/MM/YYYY")}</div>
                                <div>{moment(v?.created_at).format("hh:mm A")}</div>
                              </td>
                            </tr>
                            <div className="py-2"></div>
                          </>
                        );
                      })}
                </tbody>
              </table>
              {list?.length  == 0 && !showSkelton &&
               <NoRecordFound theme="light"/>}
            </div>
          </div>
        </div>
        {/* table List ended */}
      </section>
      {/* sectionLayout ended */}
    </div>
  );
}

export default SharingConfirmedBooking;
