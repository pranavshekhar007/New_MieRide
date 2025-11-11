// import React, { useState, useEffect } from "react";
// import Sidebar from "../../../components/Sidebar";
// import TopNav from "../../../components/TopNav";
// import TableNav from "../../../components/TableNav";
// import { useGlobalState } from "../../../GlobalProvider";
// import Ably from "ably";
// import NoRecordFound from "../../../components/NoRecordFound";
// import Skeleton from "react-loading-skeleton";
// import { getPersonalCanceledBookingRecordServ } from "../../../services/personalBookingServices";
// import "react-loading-skeleton/dist/skeleton.css";
// import moment from "moment";
// import { updateNotificationStatusServ } from "../../../services/notification.services";
// import { getNavItems } from "../../../utils/TopNavItemData/bookingDashboard";
// function PersonalCancelledBooking() {
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
//       let response = await getPersonalCanceledBookingRecordServ();
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

//     // Channel-event mapping
// const channelEventMap = [
//   { name: "manual-booking-arrived", events: ["personal-new-manual-booking"] },
//   { name: "missed-booking-arrived", events: ["personal-new-missed-booking"] },
//   { name: "admin-booking-canceled-auto", events: ["personal-booking-canceled-auto"] },

//   { name: "booking-assigned", events: ["personal-booking-assigned"] },
//   { name: "admin-booking-updates", events: ["personal-admin-booking-update"] },
//   {
//     name: "admin-ride-status-updated",
//     events: [
//       "personal-ride-started",
//       "personal-ride-canceled",
//       "personal-ride-status-updated",
//       "personal-booking-enroute",
//       "personal-booking-  arrived",
//       "personal-booking-dropped",
//       "personal-booking-missed",
//       "personal-booking-cancelled",
//     ],
//   },
// ];

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
//         return v.category == "personal_booking_canceled" && v?.is_read == 0;
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
//           <TableNav tableNav={tableNav} selectedItem="Cancelled" sectedItemBg="#363435" selectedNavColor="#fff"  notificationBg="#B8336A"/>
//           <div className="tableBody py-2 px-4 borderRadius50All" style={{ background: "#363435" }}>
//             <div style={{ margin: "20px 10px" }}>
//               <table className="table bookingTable">
//                 <thead>
//                   <tr style={{ background: "#CD3937", color: "#fff" }}>
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
//                     <th scope="col">Booking Placed</th>
//                     <th scope="col">Booking Date</th>
//                     <th scope="col">Booking Time</th>
//                     <th scope="col">Cancel Time</th>

//                     <th scope="col">Cancel By</th>
//                     <th scope="col" style={{ borderRadius: "0px 24px 24px 0px" }}>
//                       Cancel Reason
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
//                                         style={{ height: "18px", position: "relative" }}
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
//                                         style={{ height: "18px", position: "relative" }}
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
//                               <td>{moment(v?.created_at).format("hh:mm A")}</td>
//                               <td>{moment(v?.booking_date).format("DD-MM-YY")}</td>
//                               <td>{v?.booking_time}</td>
//                               <td>{moment(v?.cancel_time).format("hh:mm A")}</td>
//                               <td>{v?.cancel_by}</td>
//                               <td
//                                 style={{
//                                   borderTopRightRadius: "24px",
//                                   borderBottomRightRadius: "24px",
//                                 }}
//                               >
//                                 {v?.reason}
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

// export default PersonalCancelledBooking;

import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/Sidebar";
import TopNav from "../../../components/TopNav";
import TableNav from "../../../components/TableNav";
import { getPersonalCanceledBookingRecordServ } from "../../../services/personalBookingServices";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import NoRecordFound from "../../../components/NoRecordFound";
import moment from "moment";
import { useGlobalState } from "../../../GlobalProvider";
import Ably from "ably";
import { updateNotificationStatusServ } from "../../../services/notification.services";
import { getNavItems } from "../../../utils/TopNavItemData/bookingDashboard";
import Pagination from "../../../components/Pagination";
import { Image_Base_Url } from "../../../utils/api_base_url_configration";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

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
  const [payload, setPayload] = useState({
    per_page: "10",
    page_no: 1,
    first_pickup_date: "",
  });
  const [totalRecord, setTotalRecord] = useState(0);
  const [pageData, setPageData] = useState({
    total_pages: "",
    current_page: "",
  });
  const renderPage = () => {
    const pages = [];
    // Generate page numbers
    for (let i = 1; i <= pageData?.total_pages; i++) {
      pages.push(
        <li
          key={i}
          className={`page-item`}
          onClick={() => setPayload({ ...payload, page_no: i })}
        >
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
            <li
              className="page-item"
              onClick={() =>
                setPayload({ ...payload, page_no: pageData.current_page - 1 })
              }
            >
              <a className="page-link" href="#" aria-label="Previous">
                <span aria-hidden="true">«</span>
              </a>
            </li>
          )}

          {/* Page numbers */}
          {pages}

          {/* Next button */}
          {pageData?.total_pages > 1 &&
            pageData?.total_pages != pageData?.current_page && (
              <li
                className="page-item"
                onClick={() =>
                  setPayload({
                    ...payload,
                    page_no: pageData?.current_page + 1,
                  })
                }
              >
                <a className="page-link" href="#" aria-label="Next">
                  <span aria-hidden="true">»</span>
                </a>
              </li>
            )}
        </ul>
      </nav>
    );
  };
  const handleGetListFunc = async () => {
    if (list?.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await getPersonalCanceledBookingRecordServ(payload);
      if (response?.data?.statusCode == "200") {
        setList(response?.data?.data);
        setTotalRecord(response?.data?.total);
        setPageData({
          total_pages: response?.data?.last_page,
          current_page: response?.data?.current_page,
        });
      }
    } catch (error) {}
    setShowSkelton(false);
  };
  useEffect(() => {
    handleGetListFunc();
  }, [payload]);
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

    // Channel-event mapping
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
  }, []);
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
        return (
          (v.category == "booking_canceled" ||
            v.category == "booking_ride_canceled") &&
          v?.is_read == 0
        );
      })
      ?.map((v, i) => {
        updateNotificationStatusFunc(v?.id);
      });
  });
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
  const [popupDetails, setPopupdetails] = useState();
  const [refundDetailsPopup, setRefundDetailsPopup] = useState();
  const handleDownload = () => {
    const input = document.getElementById("refundDetailsContent");
    // alert("Comming Soon")
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`RefundDetails_${refundDetailsPopup?.id}.pdf`);
    });
  };
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
            selectedItem="Cancelled"
            sectedNavBg="#353535"
            selectedNavColor="#fff"
            isItemMoreThen8={true}
          />
        </div>
        {/* top nav ended  */}
        {/* <div className="p-3 my-3 row d-flex justify-content-end"> 
          <div className="col-3">
            <select className="form-control shadow-sm py-2" style={{ borderRadius: "20px" }} onChange={(e)=>setPayload({...payload, per_page:e?.target.value})}>
              <option>Show Entities</option>
              <option>10</option>
              <option>20</option>
              <option>50</option>
              <option>100</option>
            </select>
          </div>
          <div className="col-3 d-flex align-items-center shadow-sm border"  style={{ borderRadius: "20px" }}>
            <span className="text-secondary me-2" style={{fontSize:"18px"}}>Select Date</span>
            <input type="date" placeholder="Select First Pickup Date" onChange={(e)=>setPayload({...payload, first_pickup_date:e?.target.value})} className="form-control  py-2" style={{ borderRadius: "20px", border:"none" }} />
          </div>
          <div className="col-2">
            <h4
              className="mb-0 text-secondary  text-light bg-secondary text-center"
              style={{ borderRadius: "16px", padding: "6px" }}
            >
              Total Record {totalRecord}
            </h4>
          </div>
        </div> */}
        {/* table List started */}
        <div className="tableMain">
          <div
            className={"tableBody py-2 px-2 borderRadius30All"}
            style={{ background: "#363435", marginTop: "25px" }}
          >
            <div style={{ margin: "15px 10px 0px 10px" }}>
              <table className="table bookingGroupTable">
                <thead>
                  <tr style={{ background: "#D0FF13", color: "#000" }}>
                    <th
                      scope="col"
                      style={{ borderRadius: "24px 0px 0px 24px" }}
                    >
                      <div className="d-flex justify-content-center ms-2">
                        <span className="mx-2">Sr. No</span>
                      </div>
                    </th>
                    <th scope="col">Booking ID</th>
                    <th scope="col">Username</th>
                    <th scope="col">Pickup city</th>
                    <th scope="col">Drop-off city</th>

                    <th scope="col">Booking Date & Time</th>

                    <th scope="col">Total Amount</th>

                    <th scope="col">Cancel By</th>
                    <th scope="col">Action</th>

                    <th
                      scope="col"
                      style={{ borderRadius: "0px 24px 24px 0px" }}
                    >
                      <span className="me-3">Refund</span>
                    </th>
                  </tr>
                </thead>
                <div className="pt-3 pb-2 "></div>
                <div></div>
                {showSkelton ? (
                  [1, 2, 3, 4, 5, 6, 7, 8, 9]?.map((v, i) => {
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
                        <td>
                          <Skeleton width={100} />
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tbody className="bg-light ">
                    {list?.map((v, i) => {
                      return (
                        <tr className="">
                          <td
                            scope="row"
                            style={{
                              borderTopLeftRadius: i == 0 ? "20px" : "0px",
                              borderBottomLeftRadius:
                                i + 1 == list?.length ? "20px" : "0px",
                            }}
                          >
                            {i + 1 + (pageData?.current_page - 1) * 10}
                          </td>
                          <td>{v?.id}</td>
                          <td>{v?.user_details?.first_name}</td>
                          <td>
                            {v?.source
                              ? `${v.source.substring(0, 15)}${
                                  v.source.length > 15 ? "..." : ""
                                }`
                              : ""}
                          </td>
                          <td>
                            {v?.destination
                              ? `${v.destination.substring(0, 15)}${
                                  v.destination.length > 15 ? "..." : ""
                                }`
                              : ""}
                          </td>

                          <td>
                            {moment(v?.booking_date).format("MMM DD YYYY")} (
                            {moment(v?.booking_time, "HH:mm").format("hh:mm A")}
                            )
                          </td>
                          <td>${v?.total_trip_cost}</td>
                          <td>{v?.cancel_by}</td>

                          <td style={{ color: "#3B82F6" }}>
                            <span
                              style={{
                                textDecoration: "underline",
                                cursor: "pointer",
                              }}
                              onClick={() => setRefundDetailsPopup(v)}
                            >
                              View Full Details
                            </span>
                          </td>

                          <td
                            style={{
                              borderTopRightRadius: i == 0 ? "20px" : "0px",
                              borderBottomRightRadius:
                                i + 1 == list?.length ? "20px" : "0px",
                              wordWrap: "break-word",
                              whiteSpace: "normal",
                            }}
                          >
                            <img
                              onClick={() => alert("Coming Soon")}
                              style={{ height: "20px" }}
                              src="/icons/refundIcon.png"
                            />
                          </td>
                        </tr>

                        // <div className="mb-2"></div>
                      );
                    })}
                  </tbody>
                )}
              </table>
              {list?.length == 0 && !showSkelton && (
                <NoRecordFound theme="light" />
              )}
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
      {popupDetails?.id && (
        <div
          className="modal fade show d-flex align-items-center manualSetPopup  justify-content-center "
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content completedPopup">
              <div className="modal-body">
                <div className="completedPopupDriverDetails">
                  <div className="row">
                    <div className="col-5">
                      <div className="mb-3">
                        <img
                          src={
                            Image_Base_Url + popupDetails?.driverDetails?.image
                          }
                        />
                      </div>
                      <div className="mb-3">
                        <p>Driver Name</p>
                        <h5>
                          {popupDetails?.driverDetails?.first_name +
                            " " +
                            popupDetails?.driverDetails?.last_name}
                        </h5>
                      </div>
                      <div className="">
                        <p>Car Color</p>
                        <h5>{popupDetails?.driverDetails?.vehicle_colour}</h5>
                      </div>
                    </div>
                    <div className="col-7 mt-auto">
                      <div className="mb-3">
                        <p>Car Model</p>
                        <h5>{popupDetails?.driverDetails?.vehicle_name}</h5>
                      </div>
                      <div className="mb-3">
                        <p>Car Number</p>
                        <h5>{popupDetails?.driverDetails?.vehicle_no}</h5>
                      </div>
                      <div className="">
                        <p>Driver Review</p>
                        {/* {renderStarFunc(popupDetails?.driver_rating)} */}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-center mt-5">
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/660/660252.png"
                    onClick={() => setPopupdetails(null)}
                    style={{ height: "50px" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {popupDetails?.id && <div className="modal-backdrop fade show"></div>}
      {refundDetailsPopup?.id && (
        <div
          className="modal fade show d-flex align-items-center manualSetPopup  justify-content-center "
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content refundDetailsPopup">
              <div className="modal-body p-0">
                <div id="refundDetailsContent">
                  <div className="refundHeading">Cancel Recipt</div>
                  <div className="cancelRefundBody">
                    <div className="d-flex justify-content-between">
                      <div>
                        <div>
                          <span>Date :- </span>
                          <b>
                            {" "}
                            {moment(refundDetailsPopup?.booking_date).format(
                              "DD MMM YYYY"
                            )}
                          </b>
                        </div>
                        <div>
                          <span>Booking ID :- </span>
                          <b>{refundDetailsPopup?.id}</b>
                        </div>
                        <div>
                          <span>Cancel By :- </span>
                          <b>{refundDetailsPopup?.cancel_by}</b>
                        </div>
                        <div>
                          <span>Username :- </span>
                          <b>
                            {refundDetailsPopup?.user_details?.first_name +
                              " " +
                              refundDetailsPopup?.user_details?.last_name}
                          </b>
                        </div>
                        <div>
                          <span>Booking Placed :- </span>
                          <b>
                            {" "}
                            {moment(refundDetailsPopup?.confirm_time).format(
                              "DD MMM YYYY"
                            )}
                          </b>
                        </div>
                        <div>
                          <span>Pickup Address :- </span>
                          <b>{refundDetailsPopup?.source}</b>
                        </div>
                        <div>
                          <span>Drop Address :- </span>
                          <b>{refundDetailsPopup?.destination}</b>
                        </div>
                        <div>
                          <span>Cancelled At:-</span>
                          <b>
                            {" "}
                            {moment(refundDetailsPopup?.cancel_time).format(
                              "DD MMM YYYY"
                            )}
                          </b>
                        </div>
                        <div>
                          <span>Cancel Reason:-</span>
                          <b>{refundDetailsPopup?.reason}</b>
                        </div>
                      </div>
                      <div>
                        <img src="/icons/brandIconForCancel.png" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <h5>Fare Summary</h5>
                      <div className="refundDetailsBox mt-2">
                        <div className="row d-flex align-items-center py-1">
                          <i className="fa fa-circle col-2" />
                          <p className="col-8">Cancel Fee :-</p>
                          <h6 className="col-2">
                            ${" "}
                            {refundDetailsPopup?.total_trip_cost -
                              refundDetailsPopup?.refund_amount}
                          </h6>
                        </div>
                        <div className="row d-flex align-items-center py-1">
                          <i className="fa fa-circle col-2" />
                          <p className="col-8">User Refund :-</p>
                          <h6 className="col-2">
                            $ {refundDetailsPopup?.refund_amount}
                          </h6>
                        </div>
                        <div className="row d-flex align-items-center py-1">
                          <i className="fa fa-circle col-2" />
                          <p className="col-8">Admin Earned :-</p>
                          <h6 className="col-2">
                            $ {refundDetailsPopup?.admin_commission}
                          </h6>
                        </div>
                        <div className="row d-flex align-items-center py-1">
                          <i className="fa fa-circle col-2" />
                          <p className="col-8">Driver Earned :-</p>
                          <h6 className="col-2">
                            $ {refundDetailsPopup?.driver_earning}
                          </h6>
                        </div>
                        <div className="row d-flex align-items-center py-1">
                          <i className="fa fa-circle col-2" />
                          <p className="col-8">Surge Amount :-</p>
                          <h6 className="col-2">
                            $ {refundDetailsPopup?.extra_charge}
                          </h6>
                        </div>
                        <div
                          className="row d-flex align-items-center bg-dark text-light py-1 mx-0"
                          style={{ borderRadius: "0px 0px 15px 15px" }}
                        >
                          <i className=" col-2" />
                          <p className="col-8" style={{ color: " #D0FF13" }}>
                            Total Amount
                          </p>
                          <h6 className="col-2" style={{ color: " #D0FF13" }}>
                            $ {refundDetailsPopup?.total_trip_cost}
                          </h6>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 note">
                      Note: <br />
                      Cancellation charges are applied as per our
                      cancellation policy.
                    </div>
                  </div>
                </div>
                <div className="mb-4 mt-2 d-flex justify-content-end cancelRefundButton px-4">
                  <button
                    className="mx-3"
                    onClick={() => setRefundDetailsPopup(null)}
                  >
                    Close
                  </button>
                  <button
                    style={{ background: "#1C1C1E", color: "white" }}
                    onClick={handleDownload}
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {refundDetailsPopup?.id && (
        <div className="modal-backdrop fade show"></div>
      )}
      {/* sectionLayout ended */}
    </div>
  );
}

export default PersonalCancelledBooking;
