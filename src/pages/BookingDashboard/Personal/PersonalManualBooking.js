// import React, { useState, useEffect } from "react";
// import Sidebar from "../../../components/Sidebar";
// import TopNav from "../../../components/TopNav";
// import TableNav from "../../../components/TableNav";
// import { useGlobalState } from "../../../GlobalProvider";
// import Ably from "ably";
// import NoRecordFound from "../../../components/NoRecordFound";
// import Skeleton from "react-loading-skeleton";
// import { getPersonalManualBookingRecordServ } from "../../../services/personalBookingServices";
// import "react-loading-skeleton/dist/skeleton.css";
// import moment from "moment";
// import { useNavigate } from "react-router-dom";
// import { updateNotificationStatusServ } from "../../../services/notification.services";
// import { getNavItems } from "../../../utils/TopNavItemData/bookingDashboard";
// function PersonalManualBooking() {
//   const navigate = useNavigate();
//   const { setGlobalState, globalState } = useGlobalState();

//   const tableNav = [
//     {
//       name: "Assigned",
//       path: "/personal-assigned-booking",
//       notificationLength: globalState?.notificationList?.filter((v) => {
//         return v.category == "personal_new_booking" && v?.is_read == 0;
//       })?.length,
//     },
//     {
//       name: "Accepted",
//       path: "/personal-accepted-booking",
//       notificationLength: globalState?.notificationList?.filter((v) => {
//         return v.category == "personal_booking_accepted" && v?.is_read == 0;
//       })?.length,
//     },
//     {
//       name: "Manual",
//       path: "/personal-manual-booking",
//       notificationLength: globalState?.notificationList?.filter((v) => {
//         return (
//           (v.category == "personal_new_booking" || v.category == "personal_booking_ride_canceled") && v?.is_read == 0
//         );
//       })?.length,
//     },
//     {
//       name: "Missed",
//       path: "/personal-missed-booking",
//       notificationLength: globalState?.notificationList?.filter((v) => {
//         return v.category == "personal_booking_missed" && v?.is_read == 0;
//       })?.length,
//     },
//     {
//       name: "Enroute",
//       path: "/personal-enroute-booking",
//       notificationLength: globalState?.notificationList?.filter((v) => {
//         return v.category == "personal_booking_ride_started" && v?.is_read == 0;
//       })?.length,
//     },
//     {
//       name: "Completed",
//       path: "/personal-completed-booking",
//       notificationLength: globalState?.notificationList?.filter((v) => {
//         return v.category == "personal_booking_completed" && v?.is_read == 0;
//       })?.length,
//     },
//     {
//       name: "Cancelled",
//       path: "/personal-cancelled-booking",
//       notificationLength: globalState?.notificationList?.filter((v) => {
//         return v.category == "personal_booking_canceled" && v?.is_read == 0;
//       })?.length,
//     },
//   ];
//   const [list, setList] = useState([]);
//   const [showSkelton, setShowSkelton] = useState(false);
//   const handleGetListFunc = async () => {
//     if (list?.length == 0) {
//       setShowSkelton(true);
//     }
//     try {
//       let response = await getPersonalManualBookingRecordServ();
//       if (response?.data?.statusCode == "200") {
//         setList(response?.data?.data);
//       }
//     } catch (error) {}
//     setShowSkelton(false);
//   };
//   const playNotificationSound = () => {
//     const audio = new Audio(
//       "https://res.cloudinary.com/dglkjvsk4/video/upload/v1734440582/siren-alert-96052_cae69f.mp3"
//     ); // Path to your notification sound
//     audio.play();
//   };
//   useEffect(() => {
//     handleGetListFunc();
//     // Initialize Ably client with the API key
//     const ably = new Ably.Realtime("cgbtZA.AQetNw:hE5TCgJHH9F4gWbFqv6pD5ScBM-A_RnW0RQG7xwQg-Y");

//     // Helper to subscribe to a channel and its events
//     const subscribeToChannel = (channelName, events) => {
//       const channel = ably.channels.get(channelName);
//       events.forEach((event) => {
//         channel.subscribe(event, (message) => {
//           console.log(`Received '${event}' real-time update on '${channelName}' channel:`, message.data);
//           // Handle the event as needed
//           playNotificationSound();
//           handleGetListFunc();
//         });
//       });
//       return channel;
//     };

//     const channelEventMap = [
//       { name: "manual-booking-arrived", events: ["personal-new-manual-booking"] },
//       { name: "missed-booking-arrived", events: ["personal-new-missed-booking"] },
//       { name: "admin-booking-canceled-auto", events: ["personal-booking-canceled-auto"] },

//       { name: "booking-assigned", events: ["personal-booking-assigned"] },
//       { name: "admin-booking-updates", events: ["personal-admin-booking-update"] },
//       {
//         name: "admin-ride-status-updated",
//         events: [
//           "personal-ride-started",
//           "personal-ride-canceled",
//           "personal-ride-status-updated",
//           "personal-booking-enroute",
//           "personal-booking-  arrived",
//           "personal-booking-dropped",
//           "personal-booking-missed",
//           "personal-booking-cancelled",
//         ],
//       },
//     ];

//     // Subscribe to all channels and events
//     const channels = channelEventMap.map(({ name, events }) => subscribeToChannel(name, events));

//     // Cleanup on component unmount

//   }, []);
//   const updateNotificationStatusFunc = async (id) => {
//     try {
//       let response = await updateNotificationStatusServ({ notification_id: id });
//       if (response?.data?.statusCode == "200") {
//       }
//     } catch (error) {}
//   };
//   useEffect(() => {
//     globalState?.notificationList
//       ?.filter((v) => {
//         return (
//           (v.category == "personal_new_booking" || v.category == "personal_booking_ride_canceled") && v?.is_read == 0
//         );
//       })
//       ?.map((v, i) => {
//         updateNotificationStatusFunc(v?.id);
//       });
//   });
//   return (
//     <div className="main_layout  bgBlack d-flex">
//       {/* sidebar started */}
//       <Sidebar selectedItem="Booking Dashboard" />
//       {/* sidebar ended */}

//       {/* sectionLayout started */}
//       <section
//         className="section_layout"
//         style={{ minWidth: "2100px", marginLeft: globalState?.isFillSidebarWidth100 ? "260px" : "80px" }}
//       >
//         {/* top nav started  */}
//         <TopNav
//           navItems={getNavItems(globalState)}
//           navColor="#fff"
//           navBg="#000"
//           divideRowClass="col-xl-6 col-lg-6 col-md-12 col-12"
//           selectedItem="Personal"
//           sectedNavBg="#CD3937"
//           selectedNavColor="#fff"
//         />
//         {/* top nav ended  */}
//         {/* table List started */}
//         <div className="tableMain">
//           <TableNav tableNav={tableNav} selectedItem="Manual" sectedItemBg="#363435" selectedNavColor="#fff"  notificationBg="#B8336A"/>
//           <div className="tableBody py-2 px-4 borderRadius50All" style={{ background: "#363435" }}>
//             <div style={{ margin: "20px 10px" }}>
//               <table className="table bookingTable">
//                 <thead>
//                   <tr style={{ background: "#FED7A2", color: "#000" }}>
//                     <th scope="col" style={{ borderRadius: "24px 0px 0px 24px" }}>
//                       <div className="d-flex justify-content-center ms-2">
//                         <span>Sr. No</span>
//                       </div>
//                     </th>
//                     <th scope="col">Booking ID</th>
//                     <th scope="col">Source Address</th>
//                     <th scope="col">Destination Address</th>
//                     <th scope="col">Username</th>
//                     <th scope="col">Booking Time Choice</th>
//                     <th scope="col">Car Type</th>
//                     <th scope="col">Total Amount</th>
//                     <th scope="col">Admin Fee</th>
//                     <th scope="col">Driver Earn</th>
//                     <th scope="col">Booking Date</th>
//                     <th scope="col">Booking Time</th>
//                     <th scope="col">Booking Placed</th>
//                     <th scope="col" style={{ borderRadius: "0px 24px 24px 0px" }}>
//                       Action
//                     </th>
//                   </tr>
//                 </thead>
//                 <div className="py-2"></div>
//                 <tbody>
//                   {showSkelton
//                     ? [1, 2, 3, 4, 5, 6, 7, 8, 9]?.map((v, i) => {
//                         return (
//                           <tr key={i}>
//                             <td>
//                               <Skeleton width={50} />
//                             </td>
//                             <td>
//                               <Skeleton width={100} />
//                             </td>
//                             <td>
//                               <Skeleton width={100} />
//                             </td>
//                             <td>
//                               <Skeleton width={100} />
//                             </td>
//                             <td>
//                               <Skeleton width={100} />
//                             </td>
//                             <td>
//                               <Skeleton width={100} />
//                             </td>
//                             <td>
//                               <Skeleton width={100} />
//                             </td>

//                             <td>
//                               <Skeleton width={100} />
//                             </td>
//                             <td>
//                               <Skeleton width={100} />
//                             </td>
//                             <td>
//                               <Skeleton width={100} />
//                             </td>
//                             <td>
//                               <Skeleton width={100} />
//                             </td>
//                             <td>
//                               <Skeleton width={100} />
//                             </td>
//                             <td>
//                               <Skeleton width={100} />
//                             </td>
//                             <td>
//                               <Skeleton width={100} />
//                             </td>
//                           </tr>
//                         );
//                       })
//                     : list?.map((v, i) => {
//                         return (
//                           <>
//                             <tr className="bg-light mb-2">
//                               <td scope="row" style={{ borderTopLeftRadius: "24px", borderBottomLeftRadius: "24px" }}>
//                                 {i + 1}
//                               </td>
//                               <td>{v?.id}</td>
//                               <td className="" style={{ padding: "0px" }}>
//                                 <div className="d-flex justify-content-center">
//                                   <div
//                                     className="d-flex justify-content-between locationBoxButton"
//                                     style={{ background: "#353535" }}
//                                   >
//                                     <div>
//                                       <img
//                                         src="https://cdn-icons-png.flaticon.com/128/3179/3179068.png"
//                                         className=""
//                                         style={{ height: "18px", top: "5px", position: "relative" }}
//                                       />
//                                       {/* <div className="countDiv">{i + 1}</div> */}
//                                     </div>

//                                     <span className="ms-2">{v?.source}</span>
//                                   </div>{" "}
//                                 </div>
//                               </td>
//                               <td className="" style={{ padding: "0px" }}>
//                                 <div className="d-flex justify-content-center">
//                                   <div
//                                     className="d-flex justify-content-between locationBoxButton"
//                                     style={{ background: "#353535" }}
//                                   >
//                                     <div>
//                                       <img
//                                         src="https://cdn-icons-png.flaticon.com/128/1483/1483285.png"
//                                         className=""
//                                         style={{ height: "18px", top: "5px", position: "relative" }}
//                                       />
//                                       {/* <div className="countDivSmall">{i + 1}</div> */}
//                                     </div>

//                                     <span className="ms-2">{v?.destination}</span>
//                                   </div>{" "}
//                                 </div>
//                               </td>
//                               <td>{v?.user_details?.first_name}</td>

//                               <td style={{ color: "#139F01" }}>
//                                 {v?.time_prefrence == "five_to_ten" ? "5-10 Mins" : "45-50 Mins"}
//                               </td>
//                               <td>{v?.car_type == "four_seater" ? "4 seater" : "6 seater"}</td>
//                               <td>${v?.total_trip_cost}</td>
//                               <td>${v?.admin_commission}</td>
//                               <td>${v?.driver_earning}</td>
//                               <td style={{ color: "red" }}>{moment(v?.booking_date).format("DD/MM/YYYY")}</td>
//                               <td>{v?.booking_time}</td>
//                               <td>{moment(v?.created_at).format("hh:mm A")}</td>
//                               <td
//                                 style={{
//                                   borderTopRightRadius: "24px",
//                                   borderBottomRightRadius: "24px",
//                                   overflow: "hidden",
//                                 }}
//                               >
//                                 <div
//                                   className="d-flex justify-content-center align-items-center"
//                                   style={{ borderRadius: "12px", width: "100%", height: "100%" }}
//                                 >
//                                   <button
//                                     onClick={() => navigate("/personal-select-driver-availability/" + v?.id)}
//                                     className="btn btn-success shadow"
//                                     style={{ background: "#139F01", border: "none" }}
//                                   >
//                                     Assign Driver
//                                   </button>
//                                 </div>
//                               </td>
//                             </tr>
//                             <div className="py-2"></div>
//                           </>
//                         );
//                       })}
//                 </tbody>
//               </table>
//               {list?.length == 0 && !showSkelton && <NoRecordFound theme="light" />}
//             </div>
//           </div>
//         </div>
//         {/* table List ended */}
//       </section>
//       {/* sectionLayout ended */}
//     </div>
//   );
// }

// export default PersonalManualBooking;

// import React, { useState, useEffect } from "react";
// import Sidebar from "../../../components/Sidebar";
// import TopNav from "../../../components/TopNav";
// import TableNav from "../../../components/TableNav";
// import { useGlobalState } from "../../../GlobalProvider";
// import Ably from "ably";
// import NoRecordFound from "../../../components/NoRecordFound";
// import Skeleton from "react-loading-skeleton";
// import { getPersonalAcceptedBookingRecordServ } from "../../../services/personalBookingServices";
// import "react-loading-skeleton/dist/skeleton.css";
// import moment from "moment";
// import { updateNotificationStatusServ } from "../../../services/notification.services";
// import { getNavItems } from "../../../utils/TopNavItemData/bookingDashboard";
// function PersonalAcceptedBooking() {
//   const { setGlobalState, globalState } = useGlobalState();

//   const tableNav = [
//     {
//       name: "Assigned",
//       path: "/personal-assigned-booking",
//       notificationLength:globalState?.notificationList
//       ?.filter((v) => {
//         return v.category == "personal_new_booking" && v?.is_read ==0;
//       })
//       ?.length
//     },
//     {
//       name: "Accepted",
//       path: "/personal-accepted-booking",
//       notificationLength:globalState?.notificationList
//       ?.filter((v) => {
//         return v.category == "personal_booking_accepted" && v?.is_read ==0;
//       })
//       ?.length
//     },
//     {
//       name: "Manual",
//       path: "/personal-manual-booking",
//       notificationLength:globalState?.notificationList
//       ?.filter((v) => {
//         return (v.category == "personal_new_booking" ||  v.category == "personal_booking_ride_canceled")  && v?.is_read ==0;
//       })
//       ?.length
//     },
//     {
//       name: "Missed",
//       path: "/personal-missed-booking",
//       notificationLength:globalState?.notificationList
//       ?.filter((v) => {
//         return v.category == "personal_booking_missed" && v?.is_read ==0;
//       })
//       ?.length
//     },
//     {
//       name: "Enroute",
//       path: "/personal-enroute-booking",
//       notificationLength:globalState?.notificationList
//       ?.filter((v) => {
//         return v.category == "personal_booking_ride_started" && v?.is_read ==0;
//       })
//       ?.length
//     },
//     {
//       name: "Completed",
//       path: "/personal-completed-booking",
//       notificationLength:globalState?.notificationList
//       ?.filter((v) => {
//         return v.category == "personal_booking_completed" && v?.is_read ==0;
//       })
//       ?.length
//     },
//     {
//       name: "Cancelled",
//       path: "/personal-cancelled-booking",
//       notificationLength:globalState?.notificationList
//       ?.filter((v) => {
//         return v.category == "personal_booking_canceled" && v?.is_read ==0;
//       })
//       ?.length
//     },
//   ];
//   const [list, setList] = useState([]);
//   const [showSkelton, setShowSkelton] = useState(false);
//   const handleGetListFunc = async () => {
//     if (list?.length == 0) {
//       setShowSkelton(true);
//     }
//     try {
//       let response = await getPersonalAcceptedBookingRecordServ();
//       if (response?.data?.statusCode == "200") {
//         setList(response?.data?.data);
//       }
//     } catch (error) {}
//     setShowSkelton(false);
//   };
//   const playNotificationSound = () => {
//     const audio = new Audio(
//       "https://res.cloudinary.com/dglkjvsk4/video/upload/v1734440582/siren-alert-96052_cae69f.mp3"
//     ); // Path to your notification sound
//     audio.play();
//   };
//   useEffect(() => {
//     handleGetListFunc();
//     // Initialize Ably client with the API key
//     const ably = new Ably.Realtime("cgbtZA.AQetNw:hE5TCgJHH9F4gWbFqv6pD5ScBM-A_RnW0RQG7xwQg-Y");

//     // Helper to subscribe to a channel and its events
//     const subscribeToChannel = (channelName, events) => {
//       const channel = ably.channels.get(channelName);
//       events.forEach((event) => {
//         channel.subscribe(event, (message) => {
//           console.log(`Received '${event}' real-time update on '${channelName}' channel:`, message.data);
//           // Handle the event as needed
//           //  playNotificationSound();
//           handleGetListFunc();
//         });
//       });
//       return channel;
//     };

//     // Channel-event mapping
//     const channelEventMap = [
//       { name: "manual-booking-arrived", events: ["personal-new-manual-booking"] },
//       { name: "missed-booking-arrived", events: ["personal-new-missed-booking"] },
//       { name: "admin-booking-canceled-auto", events: ["personal-booking-canceled-auto"] },

//       { name: "booking-assigned", events: ["personal-booking-assigned"] },
//       { name: "admin-booking-updates", events: ["personal-admin-booking-update"] },
//       {
//         name: "admin-ride-status-updated",
//         events: [
//           "personal-ride-started",
//           "personal-ride-canceled",
//           "personal-ride-status-updated",
//           "personal-booking-enroute",
//           "personal-booking-  arrived",
//           "personal-booking-dropped",
//           "personal-booking-missed",
//           "personal-booking-cancelled",
//         ],
//       },
//     ];
//     // Subscribe to all channels and events
//     const channels = channelEventMap.map(({ name, events }) => subscribeToChannel(name, events));

//     // Cleanup on component unmount

//   }, []);
// const updateNotificationStatusFunc = async (id) => {
//     try {
//       let response = await updateNotificationStatusServ({ notification_id: id });
//       if (response?.data?.statusCode == "200") {
//       }
//     } catch (error) {}
//   };
//   useEffect(() => {
//     globalState?.notificationList
//       ?.filter((v) => {
//         return (v.category == "personal_booking_accepted") && v?.is_read == 0;
//       })
//       ?.map((v, i) => {
//         updateNotificationStatusFunc(v?.id);
//       });
//   });
//   return (
//     <div className="main_layout  bgBlack d-flex">
//       {/* sidebar started */}
//       <Sidebar selectedItem="Booking Dashboard" />
//       {/* sidebar ended */}

//       {/* sectionLayout started */}
//       <section
//         className="section_layout"
//         style={{ minWidth: "2000px", marginLeft: globalState?.isFillSidebarWidth100 ? "260px" : "80px" }}
//       >
//         {/* top nav started  */}
//         <TopNav
//           navItems={getNavItems(globalState)}
//           navColor="#fff"
//           navBg="#000"
//           divideRowClass="col-xl-6 col-lg-6 col-md-12 col-12"
//           selectedItem="Personal"
//           sectedNavBg="#CD3937"
//           selectedNavColor="#fff"
//         />
//         {/* top nav ended  */}
//         {/* table List started */}
//         <div className="tableMain">
//           <TableNav tableNav={tableNav} selectedItem="Accepted" sectedItemBg="#363435" selectedNavColor="#fff" notificationBg="#B8336A"/>
//           <div className="tableBody py-2 px-4 borderRadius50All" style={{ background: "#363435" }}>
//             <div style={{ margin: "20px 10px" }}>
//               <table className="table bookingTable">
//                 <thead>
//                   <tr style={{ background: "#1C4865", color: "#fff" }}>
//                     <th scope="col" style={{ borderRadius: "24px 0px 0px 24px" }}>
//                       <div className="d-flex justify-content-center ms-2">
//                         <span>Sr. No</span>
//                       </div>
//                     </th>
//                     <th scope="col">Booking ID</th>
//                     <th scope="col">Source Address</th>
//                     <th scope="col">Destination Address</th>
//                     <th scope="col">Username</th>
//                     <th scope="col">Driver Name</th>
//                     <th scope="col">Vehicle Number</th>
//                     <th scope="col">Booking Time Choice</th>
//                     <th scope="col">Car Type</th>
//                     <th scope="col">Total Amount</th>
//                     <th scope="col">Admin Fee</th>
//                     <th scope="col">Driver Earn</th>
//                     <th scope="col">Booking Date</th>
//                     <th scope="col">Booking Time</th>
//                     <th scope="col">Accept Time</th>
//                     <th scope="col" style={{ borderRadius: "0px 24px 24px 0px" }}>
//                       Booking Placed
//                     </th>
//                   </tr>
//                 </thead>
//                 <div className="py-2"></div>
//                 <tbody>
//                   {showSkelton
//                     ? [1, 2, 3, 4, 5, 6, 7, 8, 9]?.map((v, i) => {
//                         return (
//                           <tr key={i}>
//                             <td>
//                               <Skeleton width={50} />
//                             </td>
//                             <td>
//                               <Skeleton width={100} />
//                             </td>
//                             <td>
//                               <Skeleton width={100} />
//                             </td>
//                             <td>
//                               <Skeleton width={100} />
//                             </td>
//                             <td>
//                               <Skeleton width={100} />
//                             </td>
//                             <td>
//                               <Skeleton width={100} />
//                             </td>
//                             <td>
//                               <Skeleton width={100} />
//                             </td>
//                             <td>
//                               <Skeleton width={100} />
//                             </td>
//                             <td>
//                               <Skeleton width={100} />
//                             </td>
//                             <td>
//                               <Skeleton width={100} />
//                             </td>

//                             <td>
//                               <Skeleton width={100} />
//                             </td>

//                             <td>
//                               <Skeleton width={100} />
//                             </td>
//                             <td>
//                               <Skeleton width={100} />
//                             </td>
//                             <td>
//                               <Skeleton width={100} />
//                             </td>
//                             <td>
//                               <Skeleton width={100} />
//                             </td>
//                             <td>
//                               <Skeleton width={100} />
//                             </td>
//                           </tr>
//                         );
//                       })
//                     : list?.map((v, i) => {
//                         return (
//                           <>
//                             <tr className="bg-light mb-2">
//                               <td scope="row" style={{ borderTopLeftRadius: "24px", borderBottomLeftRadius: "24px" }}>
//                                 {i + 1}
//                               </td>
//                               <td>{v?.id}</td>
//                               <td className="" style={{ padding: "0px" }}>
//                                 <div className="d-flex justify-content-center">
//                                   <div
//                                     className="d-flex justify-content-between locationBoxButton"
//                                     style={{ background: "#353535" }}
//                                   >
//                                     <div>
//                                       <img
//                                         src="https://cdn-icons-png.flaticon.com/128/3179/3179068.png"
//                                         className=""
//                                         style={{ height: "18px", top: "5px", position: "relative" }}
//                                       />
//                                       {/* <div className="countDiv">{i + 1}</div> */}
//                                     </div>

//                                     <span className="ms-2">{v?.source}</span>
//                                   </div>{" "}
//                                 </div>
//                               </td>
//                               <td className="" style={{ padding: "0px" }}>
//                                 <div className="d-flex justify-content-center">
//                                   <div
//                                     className="d-flex justify-content-between locationBoxButton"
//                                     style={{ background: "#353535" }}
//                                   >
//                                     <div>
//                                       <img
//                                         src="https://cdn-icons-png.flaticon.com/128/1483/1483285.png"
//                                         className=""
//                                         style={{ height: "18px", top: "5px", position: "relative" }}
//                                       />
//                                       {/* <div className="countDivSmall">{i + 1}</div> */}
//                                     </div>

//                                     <span className="ms-2">{v?.destination}</span>
//                                   </div>{" "}
//                                 </div>
//                               </td>
//                               <td>{v?.user_details?.first_name}</td>
//                               <td>{v?.driver_details?.first_name}</td>
//                               <td style={{ color: "red" }}>
//                                 <div className="d-flex justify-content-center">
//                                   <div
//                                     className="d-flex justify-content-center locationBoxButton"
//                                     style={{ background: "#1C4969", width: "100%" }}
//                                   >
//                                     <span className="ms-2">123456</span>
//                                   </div>{" "}
//                                 </div>
//                               </td>
//                               <td style={{ color: "#139F01" }}>
//                                 {v?.time_prefrence == "five_to_ten" ? "5-10 Mins" : "45-50 Mins"}
//                               </td>
//                               <td>{v?.car_type == "four_seater" ? "4 seater" : "6 seater"}</td>
//                               <td>${v?.total_trip_cost}</td>
//                               <td>${v?.admin_commission}</td>
//                               <td>${v?.driver_earning}</td>
//                               <td style={{ color: "red" }}>{moment(v?.booking_date).format("DD/MM/YYYY")}</td>
//                               <td>{v?.booking_time}</td>
//                               <td>{moment(v?.accept_time).format("hh:mm A")}</td>
//                               <td
//                                 style={{
//                                   borderTopRightRadius: "24px",
//                                   borderBottomRightRadius: "24px",
//                                 }}
//                               >
//                                 {moment(v?.created_at).format("hh:mm A")}
//                               </td>
//                             </tr>
//                             <div className="py-2"></div>
//                           </>
//                         );
//                       })}
//                 </tbody>
//               </table>
//               {list?.length == 0 && !showSkelton && <NoRecordFound theme="light" />}
//             </div>
//           </div>
//         </div>
//         {/* table List ended */}
//       </section>
//       {/* sectionLayout ended */}
//     </div>
//   );
// }

// export default PersonalAcceptedBooking;

import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/Sidebar";
import TopNav from "../../../components/TopNav";
import TableNav from "../../../components/TableNav";
import { getPersonalManualBookingRecordServ } from "../../../services/personalBookingServices";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import moment from "moment";
import { useGlobalState } from "../../../GlobalProvider";
import NoRecordFound from "../../../components/NoRecordFound";
import Ably from "ably";
import { Tooltip } from "react-tooltip";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { updateNotificationStatusServ } from "../../../services/notification.services";
import { getNavItems } from "../../../utils/TopNavItemData/bookingDashboard";
import Pagination from "../../../components/Pagination";
import { Image_Base_Url } from "../../../utils/api_base_url_configration";
import { useNavigate } from "react-router-dom";
import NewSidebar from "../../../components/NewSidebar";
import CustomTopNav from "../../../components/CustomTopNav";
import SecondaryTopNav from "../../../components/SecondaryTopNav";
import CustomPagination from "../../../components/CustomPazination";
function PersonalManualBooking() {
  const { setGlobalState, globalState } = useGlobalState();
  const navigate = useNavigate();
  const [payload, setPayload] = useState({
    per_page: 10,
    page_no: 1,
    // first_pickup_date:""
  });
  const [pageData, setPageData] = useState({
    total_pages: "",
    current_page: "",
  });
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
  const [list, setList] = useState([]);
  const [showSkelton, setShowSkelton] = useState(false);
  const handleGetListFunc = async () => {
    if (list?.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await getPersonalManualBookingRecordServ(payload);
      if (response?.data?.statusCode == "200") {
        setList(response?.data?.data);
        setPageData({
          total_pages: response?.data?.last_page,
          current_page: response?.data?.current_page,
        });
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
    const ably = new Ably.Realtime(
      "cgbtZA.AQetNw:hE5TCgJHH9F4gWbFqv6pD5ScBM-A_RnW0RQG7xwQg-Y"
    );

    // Helper to subscribe to a channel and its events
    const subscribeToChannel = (channelName, events) => {
      const channel = ably.channels.get(channelName);
      events.forEach((event) => {
        channel.subscribe(event, (message) => {
          console.log(
            `Received '${event}' real-time update on '${channelName}' channel:`,
            message.data
          );
          // Handle the event as needed
          // playNotificationSound();
          handleGetListFunc();
        });
      });
      return channel;
    };

    const channelEventMap = [
      {
        name: "manual-booking-arrived",
        events: ["personal-new-manual-booking"],
      },
      {
        name: "missed-booking-arrived",
        events: ["personal-new-missed-booking"],
      },
      {
        name: "admin-booking-canceled-auto",
        events: ["personal-booking-canceled-auto"],
      },

      { name: "booking-assigned", events: ["personal-booking-assigned"] },
      {
        name: "admin-booking-updates",
        events: ["personal-admin-booking-update"],
      },
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
    const channels = channelEventMap.map(({ name, events }) =>
      subscribeToChannel(name, events)
    );
  }, [payload]);
  const bgArrColorCode = [
    "#789dbc",
    "#17616e",
    "#b5c0d0",
    "#987d9a",
    "#789dbc",
    "#17616e",
    "#b5c0d0",
    "#987d9a",
  ];
  const formatRouteTime = (time) => {
    if (!time) return "00 Hr 00 Mins";

    const [hours, minutes] = time.split(":");

    return `${hours} Hr ${minutes} Mins`;
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
  const [paymentDetailsPopup, setPaymentDetailsPopup] = useState(null);
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

  return (
    <div className="mainBody">
      <NewSidebar selectedItem="Booking Dashboard" />
      <div className="contentLayout">
        <div className="bgWhite borderRadius30 p-4 minHeight100vh">
          <div className="sticky-top bgWhite">
            <CustomTopNav navItems={navItems} selectedNav="Personal Ride" />
            <SecondaryTopNav
              navItems={tableNav}
              selectedNav="Manual"
              navBg="#E5E5E5"
              navColor="#1C1C1C"
              selectedNavBg="#353535"
              selectedNavColor="#fff"
            />
          </div>
          <div className="tableOuterContainer bgDark mt-4">
            {showSkelton
              ? [1, 2, 3, 4, 5, 6, 7, 8, 9]?.map((v, i) => {
                  return (
                    <div
                      className={"tableBody py-4 my-4 px-4 borderRadius50All"}
                      style={{ background: "#363435" }}
                    >
                      <div className="row" style={{ borderRadius: "24px" }}>
                        <div className="col-md-12">
                          <div>
                            <Skeleton height={440} width="100%" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              : list?.map((value, i) => {
                  return (
                    <div
                      className="tableBody my-2 borderRadius30All"
                      style={{ background: "#363435" }}
                    >
                      <div className="row">
                        <div className="col-md-12">
                          <div
                            className="leftCardRoute d-flex align-items-center w-100"
                            style={{
                              background: i % 2 == 0 ? "#D0FF13" : "#fff",
                              borderRadius: "20px",
                              padding: "20px 25px",
                              minHeight: "190px",
                            }}
                          >
                            <div className="row w-100">
                              {/* ------------------ 1: Booking ID + Date + Vehicle ------------------ */}
                              <div className="col-3">
                                {/* Booking ID */}
                                <div
                                  className="groupIdBtn d-flex justify-content-center align-items-center mb-3"
                                  style={{
                                    background: "#353535",
                                    color: "#fff",
                                    borderRadius: "6px",
                                    padding: "8px 12px",
                                    width: "fit-content",
                                  }}
                                >
                                  <span>Booking ID: {value?.id}</span>
                                </div>

                                {/* Booking Date & Time */}
                                <p
                                  style={{
                                    color: "#000",
                                    marginBottom: "8px",
                                    fontWeight: 600,
                                    fontSize: ".8rem",
                                  }}
                                >
                                  Booking Date & Time
                                </p>
                                <h3
                                  style={{
                                    color: "#000",
                                    fontWeight: 700,
                                    fontSize: "1.1rem",
                                  }}
                                >
                                  {moment(value?.booking_date).format(
                                    "DD MMM, YYYY"
                                  )}{" "}
                                  (
                                  {moment(value?.booking_time, "HH:mm").format(
                                    "hh:mm A"
                                  )}
                                  )
                                </h3>

                                {/* Vehicle Size */}
                                <p
                                  className="mt-3 mb-2"
                                  style={{
                                    color: "#000",
                                    fontWeight: 600,
                                    fontSize: ".8rem",
                                  }}
                                >
                                  Vehicle Size
                                </p>
                                <h3
                                  style={{
                                    color: "#000",
                                    fontWeight: 700,
                                    fontSize: "1.1rem",
                                  }}
                                >
                                  {value?.car_type === "six_seater"
                                    ? "6-Seater"
                                    : "4-Seater"}
                                </h3>
                              </div>

                              {/* ------------------ 2: User Box ------------------ */}
                              <div className="col-3">
                                {/* User Box */}
                                <div className="mb-3 text-center">
                                  <div
                                    className="userNameDiv"
                                    style={{
                                      width: "130px",
                                      textAlign: "center",
                                      background: "#353535",
                                      color: "#fff",
                                      borderRadius: "6px",
                                      padding: "6px 8px",
                                      margin: "0 auto",
                                    }}
                                  >
                                    <p
                                      className="mb-0 bgWhite text-dark radius3 p-1"
                                      style={{
                                        fontSize: "12px",
                                        fontWeight: 600,
                                      }}
                                    >
                                      ID: {value?.user_details?.unique_id}
                                    </p>
                                    <p
                                      className="mb-0 text-white mt-1"
                                      style={{
                                        fontSize: "14px",
                                        fontWeight: 600,
                                      }}
                                    >
                                      {value?.user_details?.first_name}{" "}
                                      {value?.user_details?.last_name}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* ------------------ 3: Source + Total Route + Payment ------------------ */}
                              <div className="col-3">
                                {/* Source */}
                                <p
                                  className="mb-2"
                                  style={{
                                    color: "#000",
                                    fontWeight: 600,
                                    fontSize: ".8rem",
                                  }}
                                >
                                  Source
                                </p>
                                <h3
                                  style={{
                                    color: "#000",
                                    fontWeight: 700,
                                    fontSize: "1.1rem",
                                  }}
                                >
                                  {value?.source?.length > 40
                                    ? value?.source.substring(0, 37) + "..."
                                    : value?.source}
                                </h3>

                                {/* Total Route Time */}
                                <p
                                  className="mt-3 mb-2"
                                  style={{
                                    color: "#000",
                                    fontWeight: 600,
                                    fontSize: ".8rem",
                                  }}
                                >
                                  Total Route Time
                                </p>
                                <h3
                                  style={{
                                    color: "#000",
                                    fontWeight: 700,
                                    fontSize: "1.1rem",
                                  }}
                                >
                                  {formatRouteTime(value?.total_trip_time)}
                                </h3>

                                {/* Payment Eye */}
                                <p
                                  className="mt-3 m-0"
                                  style={{
                                    color: "#000",
                                    fontWeight: 600,
                                    fontSize: ".8rem",
                                  }}
                                >
                                  Payment
                                </p>
                                <img
                                  onClick={() => setPaymentDetailsPopup(value)}
                                  src="/icons/eyeIcon.png"
                                  style={{ height: "34px", cursor: "pointer" }}
                                />
                              </div>

                              {/* ------------------ 4: Destination + Time Choice + Button ------------------ */}
                              <div className="col-3">
                                {/* Destination */}
                                <p
                                  className="mb-2"
                                  style={{
                                    color: "#000",
                                    fontWeight: 600,
                                    fontSize: ".8rem",
                                  }}
                                >
                                  Destination
                                </p>
                                <h3
                                  style={{
                                    color: "#000",
                                    fontWeight: 700,
                                    fontSize: "1.1rem",
                                  }}
                                >
                                  {value?.destination?.length > 40
                                    ? value?.destination.substring(0, 37) +
                                      "..."
                                    : value?.destination}
                                </h3>

                                {/* Time Choice → MOVE HERE */}
                                <p
                                  className="mt-3 mb-2"
                                  style={{
                                    color: "#000",
                                    fontWeight: 600,
                                    fontSize: ".8rem",
                                  }}
                                >
                                  Time Choice
                                </p>
                                <h3
                                  style={{
                                    color: "#000",
                                    fontWeight: 700,
                                    fontSize: "1.1rem",
                                  }}
                                >
                                  {value?.time_choice.includes("pickup")
                                    ? "Pick-Up"
                                    : "Drop-Off"}
                                </h3>

                                {/* Assign Button */}
                                <button
                                  className="sharingRouteButton w-100 mt-3"
                                  onClick={() =>
                                    navigate(
                                      "/personal-select-driver-availability/" +
                                        value?.id
                                    )
                                  }
                                  style={{
                                    height: "40px",
                                    background: "#353535",
                                    color: "#fff",
                                    borderRadius: "10px",
                                    fontWeight: 500,
                                  }}
                                >
                                  Assign Driver
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            {list?.length == 0 && !showSkelton && (
              <NoRecordFound theme="dark" />
            )}
          </div>
          <CustomPagination
            current_page={pageData?.current_page}
            onPerPageChange={onPerPageChange}
            last_page={pageData?.total_pages}
            per_page={payload?.per_page}
            onPageChange={onPageChange}
          />
          {paymentDetailsPopup && (
            <div
              className="modal fade show d-flex align-items-center manualSetPopup  justify-content-center "
              tabIndex="-1"
            >
              <div className="modal-dialog">
                <div className="modal-content paymentReceiptPopup">
                  <div className="modal-body p-0">
                    <div className="text-center mb-4">
                      <h3 className="popupTitle">
                        Payment Receipt – Persona Ride
                      </h3>
                    </div>

                    <div className="px-3">
                      <div className="d-flex justify-content-between align-items-center mb-3 popupLine">
                        <p>Booking</p>
                        <h5>${paymentDetailsPopup?.total_trip_cost}</h5>
                      </div>

                      <div className="d-flex justify-content-between align-items-center mb-3 popupLine">
                        <p>HST (13%)</p>
                        <h5>{"N/A"}</h5>
                      </div>

                      <div className="d-flex justify-content-between align-items-center mb-3 popupLine totalLine">
                        <p className="fw-bold">Total Amount</p>
                        <h5 className="fw-bold">
                          ${paymentDetailsPopup?.total_trip_cost}
                        </h5>
                      </div>

                      <hr />

                      <div className="d-flex justify-content-between align-items-center mb-3 popupLine">
                        <p>Driver Commission</p>
                        <h5>${paymentDetailsPopup?.driver_earning || 0}</h5>
                      </div>

                      <div className="d-flex justify-content-between align-items-center mb-3 popupLine">
                        <p>Driver HST (13%)</p>
                        <h5>{"N/A"}</h5>
                      </div>

                      <div className="d-flex justify-content-between align-items-center mb-3 popupLine">
                        <p>Admin Commission</p>
                        <h5>${paymentDetailsPopup?.admin_commission || 0}</h5>
                      </div>

                      <div className="d-flex justify-content-between align-items-center mb-3 popupLine">
                        <p>Admin HST (13%)</p>
                        <h5>{"N/A"}</h5>
                      </div>

                      <div className="d-flex justify-content-between align-items-center mb-3 popupLine discountLine">
                        <p>Bonus Amount</p>
                        <h5>${paymentDetailsPopup?.tip_amount || 0}</h5>
                      </div>
                      <hr />

                      <div className="d-flex justify-content-between align-items-center mb-3 popupLine finalLine">
                        <h4>Final Paid to Driver</h4>
                        <h4>
                          $
                          {(
                            Number(paymentDetailsPopup?.total_trip_cost || 0) +
                            Number(paymentDetailsPopup?.tip_amount || 0)
                          )}
                          {/* <span className="hstText">
                        +(HST $
                        {(
                          paymentDetailsPopup?.total_driver_earning * 0.13
                        ).toFixed(2)}
                        )
                      </span> */}
                        </h4>
                      </div>

                      <button className="payButton">Paid via Wallet Pay</button>

                      <div className="d-flex justify-content-center">
                        <img
                          className=""
                          src="/imagefolder/popUpCloseIcon.png"
                          onClick={() => setPaymentDetailsPopup(null)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {paymentDetailsPopup && (
            <div className="modal-backdrop fade show"></div>
          )}
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
          padding: "0px 30px 45px 30px",
          marginLeft: globalState?.isFillSidebarWidth100 ? "260px" : "80px",
        }}
      >
        <div className="sticky-top bg-light" style={{ paddingTop: "45px" }}>
          <TopNav
            navItems={getNavItems(globalState)}
            navColor="#fff"
            navBg="#363435"
            divideRowClass="col-xl-6 col-lg-6 col-md-12 col-12"
            selectedItem="Personal Ride"
            sectedNavBg="#D0FF13"
            selectedNavColor="#000"
            bookingTop={true}
          />
          <div className="py-2 mt-1"></div>
          <TopNav
            navItems={tableNav}
            navColor="#000"
            navBg="#e5e5e5"
            divideRowClass="col-xl-4 col-lg-4 col-md-12 col-12"
            selectedItem="Manual"
            sectedNavBg="#353535"
            selectedNavColor="#fff"
            isItemMoreThen8={true}
          />
        </div>

        {/* top nav ended  */}
        {/* table List started */}
        <div
          className="tableMain"
          style={{
            background: "#353535",
            borderRadius: "30px",
            padding: "2px 20px",
          }}
        >
          {showSkelton
            ? [1, 2, 3, 4, 5, 6, 7, 8, 9]?.map((v, i) => {
                return (
                  <div
                    className={"tableBody py-4 my-4 px-4 borderRadius50All"}
                    style={{ background: "#363435" }}
                  >
                    <div className="row" style={{ borderRadius: "24px" }}>
                      <div className="col-md-12">
                        <div>
                          <Skeleton height={440} width="100%" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            : list?.map((value, i) => {
                return (
                  <div
                    className={"tableBody my-4  borderRadius30All"}
                    style={{ background: "#363435" }}
                  >
                    <div className=" row " style={{ borderRadius: "24px" }}>
                      <div className="col-md-12">
                        <div
                          className="leftCardRoute d-flex align-items-center w-100"
                          style={{
                            background: i % 2 == 0 ? "#D0FF13" : "#fff",
                            height: "160px",
                            borderRadius: "20px",
                          }}
                        >
                          <div className="w-100 ">
                            <div className="row">
                              <div className="col-2">
                                <div className="row d-flex align-items-center ">
                                  <div
                                    className="d-flex groupIdBtn  justify-content-center w-100  mb-3 align-items-center"
                                    style={{
                                      filter: "none",
                                      background: "#353535",
                                      color: "#fff",
                                    }}
                                  >
                                    <div className="d-flex justify-content-center w-100 px-4">
                                      <div>Booking ID :- </div>
                                      <div className="ms-1">{value?.id}</div>
                                    </div>
                                  </div>
                                  <div className="">
                                    <p style={{ color: "#000" }}>Time Choice</p>
                                    <h3 style={{ color: "#000" }}>
                                      {value?.time_choice == "pickupat"
                                        ? "Pick Up"
                                        : "Drop Off"}
                                    </h3>
                                  </div>
                                </div>
                              </div>
                              <div className="col-2">
                                <div className="mb-3">
                                  <p style={{ color: "#000" }}>Username</p>
                                  <h3 style={{ color: "#000" }}>
                                    {value?.user_details?.first_name +
                                      " " +
                                      value?.user_details?.last_name}
                                  </h3>
                                </div>
                                <div className="">
                                  <p style={{ color: "#000" }}>Payment</p>
                                  <img
                                    onClick={() =>
                                      setPaymentDetailsPopup(value)
                                    }
                                    src="/icons/eyeIcon.png"
                                    style={{ height: "20px" }}
                                  />
                                </div>
                              </div>
                              <div className="col-4">
                                <div className="mb-3">
                                  <p style={{ color: "#000" }}>Source</p>
                                  <h3 style={{ color: "#000" }}>
                                    {value?.source?.length > 30
                                      ? value?.source?.substring(0, 25) + " ..."
                                      : value?.source}
                                  </h3>
                                </div>
                                <div className="mb-0">
                                  <p style={{ color: "#000" }}>
                                    Booking Date & Time
                                  </p>
                                  <h3 style={{ color: "#000" }}>
                                    {moment(value?.booking_date).format(
                                      "DD MMM, YYYY"
                                    )}{" "}
                                    (
                                    {moment(
                                      value?.booking_time,
                                      "HH:mm"
                                    ).format("hh:mm A")}
                                    )
                                  </h3>
                                </div>
                              </div>
                              <div className="col-4">
                                <div className="mb-3">
                                  <p style={{ color: "#000" }}>Destination</p>
                                  <h3 style={{ color: "#000" }}>
                                    {value?.destination?.length > 30
                                      ? value?.destination?.substring(0, 25) +
                                        " ..."
                                      : value?.destination}
                                  </h3>
                                </div>
                                <div className="mb-0">
                                  <div className="col-12">
                                    <button
                                      className="sharingRouteButton w-100"
                                      onClick={() =>
                                        navigate(
                                          "/personal-select-driver-availability/" +
                                            value?.id
                                        )
                                      }
                                      style={{ height: "45px" }}
                                    >
                                      <div className="d-flex justify-content-around align-items-center">
                                        <div>Assign Driver</div>
                                      </div>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          {list?.length == 0 && !showSkelton && <NoRecordFound theme="dark" />}
        </div>
        {paymentDetailsPopup && (
          <div
            className="modal fade show d-flex align-items-center manualSetPopup  justify-content-center "
            tabIndex="-1"
          >
            <div className="modal-dialog">
              <div
                className="modal-content"
                style={{
                  borderRadius: "16px",
                  background: "#f7f7f5",
                  width: "364px",
                }}
              >
                <div className="d-flex justify-content-between pt-4 pb-0 px-4">
                  <p>
                    <u>Payment Details</u>
                  </p>
                  <i
                    className="fa fa-close text-secondary"
                    onClick={() => {
                      setPaymentDetailsPopup(null);
                    }}
                  ></i>
                </div>
                <hr className="mt-0" />
                <div className="modal-body" style={{ fontFamily: "poppins" }}>
                  <div
                    style={{
                      wordWrap: "break-word",
                      whiteSpace: "pre-wrap",
                    }}
                    className="d-flex justify-content-center w-100"
                  >
                    <div className="w-100 px-2">
                      <div className="d-flex justify-content-between px-2 mb-1">
                        <p style={{ fontWeight: "400" }}>Booking Amount</p>
                        <span style={{ fontWeight: "500" }}>
                          ${paymentDetailsPopup?.total_trip_cost}
                        </span>
                      </div>

                      <div className="d-flex justify-content-between px-2 mb-1">
                        <p>Driver Earn</p>
                        <span style={{ fontWeight: "500" }}>
                          ${paymentDetailsPopup?.driver_earning}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between px-2 mb-1">
                        <p>Admin Fee</p>
                        <span style={{ fontWeight: "500" }}>
                          ${paymentDetailsPopup?.admin_commission}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between px-2 mb-1">
                        <p>Surge Amount</p>
                        <span style={{ fontWeight: "500" }}>
                          ${paymentDetailsPopup?.extra_charge}
                        </span>
                      </div>
                      <div
                        className="my-3"
                        style={{ borderTop: "1px solid #B2B2B2" }}
                      ></div>
                      <div
                        className="d-flex justify-content-between px-2 mb-1 pt-3"
                        style={{ fontWeight: "500" }}
                      >
                        <p>Total Payment</p>
                        <span>${paymentDetailsPopup?.total_trip_cost}</span>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-center"></div>
                </div>
              </div>
            </div>
          </div>
        )}
        {paymentDetailsPopup && (
          <div className="modal-backdrop fade show"></div>
        )}
        {/* table List ended */}
        <Pagination
          current_page={pageData?.current_page}
          onPerPageChange={onPerPageChange}
          last_page={pageData?.total_pages}
          per_page={payload?.per_page}
          onPageChange={onPageChange}
        />
      </section>
    </div>
  );
}

export default PersonalManualBooking;
