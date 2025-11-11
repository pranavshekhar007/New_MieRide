import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/Sidebar";
import TopNav from "../../../components/TopNav";
import TableNav from "../../../components/TableNav";
import { useGlobalState } from "../../../GlobalProvider";
import Ably from "ably";
import NoRecordFound from "../../../components/NoRecordFound";
import Skeleton from "react-loading-skeleton";
import {
  getPersonalConfirmedListFunc
} from "../../../services/personalBookingServices";
import "react-loading-skeleton/dist/skeleton.css";
import moment from "moment";
import { getNavItems } from "../../../utils/TopNavItemData/bookingDashboard";
function PersonalCancelledBooking() {
  const { setGlobalState, globalState } = useGlobalState();
  
  const tableNav = [
    {
      name: "Personal Later",
      path: "/personal-later-booking",
      notificationLength: globalState?.notificationList?.filter((v) => {
        return v.category == "personal_new_booking" && v?.is_read == 0;
      })?.length,
    },
    {
      name: "Assigned",
      path: "/personal-assigned-booking",
      notificationLength: globalState?.notificationList?.filter((v) => {
        return v.category == "personal_new_booking" && v?.is_read == 0;
      })?.length,
    },
    {
      name: "Accepted",
      path: "/personal-accepted-booking",
      notificationLength: globalState?.notificationList?.filter((v) => {
        return v.category == "personal_booking_accepted" && v?.is_read == 0;
      })?.length,
    },
    {
      name: "Manual",
      path: "/personal-manual-booking",
      notificationLength: globalState?.notificationList?.filter((v) => {
        return (
          (v.category == "personal_new_booking" ||
            v.category == "personal_booking_ride_canceled") &&
          v?.is_read == 0
        );
      })?.length,
    },
    {
      name: "Unaccepted",
      path: "/personal-unaccepted-booking",
      
    },
    {
      name: "Missed",
      path: "/personal-missed-booking",
      notificationLength: globalState?.notificationList?.filter((v) => {
        return v.category == "personal_booking_missed" && v?.is_read == 0;
      })?.length,
    },
    {
      name: "Enroute",
      path: "/personal-enroute-booking",
      notificationLength: globalState?.notificationList?.filter((v) => {
        return v.category == "personal_booking_ride_started" && v?.is_read == 0;
      })?.length,
    },
    {
      name: "Completed",
      path: "/personal-completed-booking",
      notificationLength: globalState?.notificationList?.filter((v) => {
        return v.category == "personal_booking_completed" && v?.is_read == 0;
      })?.length,
    },
    {
      name: "Cancelled",
      path: "/personal-cancelled-booking",
      notificationLength: globalState?.notificationList?.filter((v) => {
        return v.category == "personal_booking_canceled" && v?.is_read == 0;
      })?.length,
    },
  ];
  const [list, setList] = useState([]);
  const [showSkelton, setShowSkelton] = useState(false);
  const handleGetListFunc = async () => {
    if (list?.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await getPersonalConfirmedListFunc();
      if (response?.data?.statusCode == "200") {
        setList(response?.data?.data);
      }
    } catch (error) {}
    setShowSkelton(false);
  };
  const playNotificationSound = () => {
    const audio = new Audio(
      "https://res.cloudinary.com/dglkjvsk4/video/upload/v1734440582/siren-alert-96052_cae69f.mp3"
    ); // Path to your notification sound
    audio.play();
  };
  useEffect(() => {
    handleGetListFunc();
    // Initialize Ably client with the API key
    const ably = new Ably.Realtime("cgbtZA.AQetNw:hE5TCgJHH9F4gWbFqv6pD5ScBM-A_RnW0RQG7xwQg-Y");

    // Helper to subscribe to a channel and its events
    const subscribeToChannel = (channelName, events) => {
      const channel = ably.channels.get(channelName);
      events.forEach((event) => {
        channel.subscribe(event, (message) => {
          console.log(`Received '${event}' real-time update on '${channelName}' channel:`, message.data);
          // Handle the event as needed
          //  playNotificationSound();
          handleGetListFunc();
        });
      });
      return channel;
    };

    // Channel-event mapping
    const channelEventMap = [
      { name: "manual-booking-arrived", events: ["personal-new-manual-booking"] },
      { name: "missed-booking-arrived", events: ["personal-new-missed-booking"] },
      { name: "admin-booking-canceled-auto", events: ["personal-booking-canceled-auto"] },

      { name: "booking-assigned", events: ["personal-booking-assigned"] },
      { name: "admin-booking-updates", events: ["personal-admin-booking-update"] },
      {
        name: "admin-ride-status-updated",
        events: [
          "personal-ride-started",
          "personal-ride-canceled",
          "personal-ride-status-updated",
          "personal-booking-enroute",
          "personal-booking-  arrived",
          "personal-booking-dropped",
          "personal-booking-missed",
          "personal-booking-cancelled",
        ],
      },
    ];

    // Subscribe to all channels and events
    const channels = channelEventMap.map(({ name, events }) => subscribeToChannel(name, events));

    // Cleanup on component unmount
    
  }, []);

  return (
    <div className="main_layout  bgBlack d-flex">
      {/* sidebar started */}
      <Sidebar selectedItem="Booking Dashboard" />
      {/* sidebar ended */}

      {/* sectionLayout started */}
      <section
        className="section_layout"
        style={{ minWidth: "2000px", marginLeft: globalState?.isFillSidebarWidth100 ? "260px" : "80px" }}
      >
        {/* top nav started  */}
        <TopNav
          // navItems={getNavItems(globalState)}
          navColor="#fff"
          navBg="#000"
          divideRowClass="col-xl-6 col-lg-6 col-md-12 col-12"
          selectedItem="Personal"
          sectedNavBg="#CD3937"
          selectedNavColor="#fff"
        />
        {/* top nav ended  */}
        {/* table List started */}
        <div className="tableMain">
          <TableNav tableNav={tableNav} selectedItem="Confirmed" sectedItemBg="#363435" selectedNavColor="#fff"  notificationBg="#B8336A"/>
          <div className="tableBody py-2 px-4 borderRadius50exceptTopLeft" style={{ background: "#363435" }}>
            <div style={{ margin: "20px 10px" }}>
              <table className="table bookingTable">
                <thead>
                  <tr style={{ background: "#139F01", color: "#fff" }}>
                    <th scope="col" style={{ borderRadius: "24px 0px 0px 24px" }}>
                      <div className="d-flex justify-content-center ms-2">
                        <span>Sr. No</span>
                      </div>
                    </th>
                    <th scope="col">Booking ID</th>
                    <th scope="col">Source Address</th>
                    <th scope="col">Destination Address</th>
                    <th scope="col">Username</th>
                    
                    <th scope="col">Booking Time Choice</th>
                    <th scope="col">Car Type</th>
                    <th scope="col">Total Amount</th>
                    <th scope="col">Admin Fee</th>
                    <th scope="col">Driver Earn</th>
                    <th scope="col">Booking Date</th>
                    <th scope="col">Booking Time</th>
                    <th scope="col">Confirm Time</th>
                    <th scope="col" style={{ borderRadius: "0px 24px 24px 0px" }}>Booking Placed</th>
                    
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
                            <tr className="bg-light mb-2">
                              <td scope="row" style={{ borderTopLeftRadius: "24px", borderBottomLeftRadius: "24px" }}>
                                {i + 1}
                              </td>
                              <td>{v?.id}</td>
                              <td className="" style={{ padding: "0px" }}>
                                    <div className="d-flex justify-content-center">
                                      <div
                                        className="d-flex justify-content-between locationBoxButton"
                                        style={{ background: "#353535" }}
                                      >
                                        <div>
                                          <img
                                            src="https://cdn-icons-png.flaticon.com/128/3179/3179068.png"
                                            className=""
                                            style={{ height: "18px", position: "relative" }}
                                          />
                                          {/* <div className="countDiv">{i + 1}</div> */}
                                        </div>

                                        <span className="ms-2">{v?.source}</span>
                                      </div>{" "}
                                    </div>
                                  </td>
                                  <td className="" style={{ padding: "0px" }}>
                                    <div className="d-flex justify-content-center">
                                      <div
                                        className="d-flex justify-content-between locationBoxButton"
                                        style={{ background: "#353535" }}
                                      >
                                        <div>
                                          <img
                                            src="https://cdn-icons-png.flaticon.com/128/1483/1483285.png"
                                            className=""
                                            style={{ height: "18px", position: "relative" }}
                                          />
                                          {/* <div className="countDivSmall">{i + 1}</div> */}
                                        </div>

                                        <span className="ms-2">{v?.destination}</span>
                                      </div>{" "}
                                    </div>
                                  </td>
                              <td>{v?.user_details?.first_name}</td>
                             
                              <td style={{color:"#139F01"}}>{v?.time_prefrence == "five_to_ten" ? "5-10 Mins" :"45-50 Mins"}</td>
                              <td>{v?.car_type=="four_seater"? "4 seater": "6 seater"}</td>
                              <td>${v?.total_trip_cost}</td>
                              <td>${v?.admin_commission}</td>
                              <td>${v?.driver_earning}</td>
                              <td style={{color:"red"}}>{moment(v?.booking_date).format("DD/MM/YYYY")}</td>
                              <td >{v?.booking_time}</td>
                              <td >{moment(v?.confirm_time).format("hh:mm A")}</td>
                              <td style={{
                                  borderTopRightRadius: "24px",
                                  borderBottomRightRadius: "24px",
                                  
                                }}>{moment(v?.created_at).format("hh:mm A")}</td>
                              
                            </tr>
                            <div className="py-2"></div>
                          </>
                        );
                      })}
                </tbody>
              </table>
              {list?.length == 0 && !showSkelton && <NoRecordFound theme="light" />}
            </div>
          </div>
        </div>
        {/* table List ended */}
      </section>
      {/* sectionLayout ended */}
    </div>
  );
}

export default PersonalCancelledBooking;
