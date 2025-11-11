import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/Sidebar";
import TopNav from "../../../components/TopNav";
import TableNav from "../../../components/TableNav";
import { getPersonalCompletedBookingRecordServ } from "../../../services/personalBookingServices";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Image_Base_Url } from "../../../utils/api_base_url_configration";
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
function PersonalCompletedSharing() {
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
    per_page: 10,
    page_no: 1,
    first_pickup_date: "",
  });
  const [pageData, setPageData] = useState({
    total_pages: "",
    current_page: "",
  });
  const [totalRecord, setTotalRecord] = useState(0);
  const handleGetListFunc = async () => {
    if (list?.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await getPersonalCompletedBookingRecordServ(payload);
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
  const playNotificationSound = () => {
    const audio = new Audio(
      "https://res.cloudinary.com/dglkjvsk4/video/upload/v1734440582/siren-alert-96052_cae69f.mp3"
    ); // Path to your notification sound
    audio.play();
  };
  useEffect(() => {
    handleGetListFunc();
  }, [payload]);
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

    // Cleanup on component unmount
  }, []);
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
  const renderUserId = (booking_id, bookingArr) => {
    const filteredArr = bookingArr?.filter((v, i) => {
      return v?.booking_id == booking_id;
    });
    return filteredArr[0]?.user_details?.id;
  };
  const renderUserName = (booking_id, bookingArr) => {
    const filteredArr = bookingArr?.filter((v, i) => {
      return v?.booking_id == booking_id;
    });
    return (
      filteredArr[0]?.user_details?.first_name +
      " " +
      filteredArr[0]?.user_details?.last_name
    );
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
        return v.category == "booking_completed" && v?.is_read == 0;
      })
      ?.map((v, i) => {
        updateNotificationStatusFunc(v?.id);
      });
  });
  const renderStarFunc = (rating) => {
    const totalStars = 5;
    const filledStar =
      "https://cdn-icons-png.flaticon.com/128/1828/1828884.png";
    const emptyStar = "/icons/emptyStar.png";

    return (
      <div className="d-flex">
        {[...Array(totalStars)].map((_, index) => (
          <img
            key={index}
            className="me-2"
            style={{ height: "20px" }}
            src={index < rating ? filledStar : emptyStar}
            alt="star"
          />
        ))}
      </div>
    );
  };
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
            selectedItem="Completed"
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
                    <th scope="col">Driver Name</th>
                    <th scope="col">Pickup city</th>
                    <th scope="col">Drop-off city</th>

                    <th scope="col">Booking Date & Time</th>
                    <th scope="col">Time Choice</th>

                    <th
                      scope="col"
                      style={{ borderRadius: "0px 24px 24px 0px" }}
                    >
                      <span className="me-3">Action</span>
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
                          <td>{v?.driver_details?.first_name}</td>
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
                            {moment(v?.booking_date).format("DD MMM, YYYY")}(
                            {moment(v?.booking_time, "HH:mm").format("hh:mm A")}
                            )
                          </td>

                          <td>
                            {v?.time_choice == "pickupat"
                              ? "Pickup"
                              : " Dropoff"}
                          </td>
                          <td
                            style={{
                              borderTopRightRadius: i == 0 ? "20px" : "0px",
                              borderBottomRightRadius:
                                i + 1 == list?.length ? "20px" : "0px",
                              wordWrap: "break-word",
                              whiteSpace: "normal",
                              color: "#3B82F6",
                            }}
                          >
                            <span
                              style={{
                                textDecoration: "underline",
                                cursor: "pointer",
                              }}
                              onClick={() => setPopupdetails(v)}
                            >
                              View Full Details
                            </span>
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
            <div className="modal-content completedPopup" style={{padding:"10px"}}>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <div
                      className="leftCardRoute d-flex align-items-center w-100"
                      style={{
                        background: "#353535",
                        height: "240px",
                        borderRadius: "20px",
                        padding: "20px",
                        filter: "none",
                      }}
                    >
                      <div className="w-100 ">
                        <div
                          className="personalAcceptedDriverBox p-2 d-flex align-items-center"
                          style={{ background: "#fff" }}
                        >
                          <div>
                            <img
                              src={
                                Image_Base_Url +
                                popupDetails?.driver_details?.image
                              }
                            />
                          </div>
                          <div className="ms-3">
                            <div
                              className="driverIdBox d-flex justify-content-center mb-2"
                              style={{ background: "#353535" }}
                            >
                              <span style={{ color: "#fff" }}>
                                Driver ID :- {popupDetails?.driver_details?.id}
                              </span>
                            </div>
                            <h5 style={{ color: "#1C1C1E" }}>
                              {popupDetails?.driver_details?.first_name +
                                " " +
                                popupDetails?.driver_details?.last_name}
                            </h5>
                          </div>
                        </div>
                        <div className="row mt-3">
                          <div className="col-6">
                            <div className="">
                              <p style={{ color: "#fff" }}>
                                {popupDetails?.driver_details?.vehicle_name +
                                  " (" +
                                  popupDetails?.driver_details?.vehicle_colour +
                                  ")"}
                              </p>
                              <h3 style={{ color: "#fff", textAlign: "left" }}>
                                {popupDetails?.driver_details?.vehicle_no}
                              </h3>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="">
                              <p style={{ color: "#fff" }}>Driver Review</p>
                              <h3 style={{ color: "#fff" }}>
                                {renderStarFunc(
                                  popupDetails?.driver_average_rating
                                )}
                              </h3>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div
                      className="leftCardRoute d-flex align-items-center w-100"
                      style={{
                        background: "#353535",
                        height: "240px",
                        borderRadius: "20px",
                        padding: "20px",
                        filter: "none",
                      }}
                    >
                      <div className="w-100 ">
                        <div className="row ">
                          <div className="col-6">
                            <div className="">
                              <p style={{ color: "#fff" }}>Booking Amount</p>
                              <h3 style={{ color: "#fff", textAlign: "left" }}>
                                ${popupDetails?.total_trip_cost}
                              </h3>
                            </div>
                            <div className="my-3">
                              <p style={{ color: "#fff" }}>Admin Fee</p>
                              <h3 style={{ color: "#fff", textAlign: "left" }}>
                                ${popupDetails?.admin_commission}
                              </h3>
                            </div>
                            <div className="">
                              <p style={{ color: "#fff" }}>Total Amount</p>
                              <h3 style={{ color: "#fff", textAlign: "left" }}>
                                ${popupDetails?.total_trip_cost}
                              </h3>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="">
                              <p style={{ color: "#fff" }}>Surge Amount</p>
                              <h3 style={{ color: "#fff", textAlign: "left" }}>
                                ${popupDetails?.extra_charge}
                              </h3>
                            </div>
                            <div className="my-3">
                              <p style={{ color: "#fff" }}>Driver Earn</p>
                              <h3 style={{ color: "#fff", textAlign: "left" }}>
                                ${popupDetails?.driver_earning}
                              </h3>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className=" row m-0 p-0" style={{ borderRadius: "24px" }}>
                    <div className="col-md-12 mt-4">
                      <div
                        className="leftCardRoute d-flex align-items-center w-100"
                        style={{
                          background: "#D0FF13",
                          height: "160px",
                          borderRadius: "20px",
                          filter:"none"
                        }}
                      >
                        <div className="w-100 ">
                          <div className="row">
                            <div className="col-3">
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
                                    <div className="ms-1">
                                      {popupDetails?.id}
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-2">
                                <p style={{ color: "#000" }}>Username</p>
                                <h3 style={{ color: "#000", textAlign:"left" }}>
                                  {popupDetails?.user_details?.first_name +
                                    " " +
                                    popupDetails?.user_details?.last_name}
                                </h3>
                              </div>
                                
                              </div>
                            </div>
                           
                            <div className="col-9 row">
                              <div className="col-6">
                              <div className="mb-3">
                                <p style={{ color: "#000" }}>Source</p>
                                <h3 style={{ color: "#000", textAlign:"left" }}>
                                  {popupDetails?.source?.length >25 ? popupDetails?.source?.substring(0, 20)+"..." :popupDetails?.source }
                                </h3>
                              </div>
                               <div className="">
                                <p style={{ color: "#000" }}>Destination</p>
                                <h3 style={{ color: "#000", textAlign:"left" }}>
                                  {popupDetails?.destination?.length >25 ? popupDetails?.destination?.substring(0, 20)+"..." :popupDetails?.destination }
                                </h3>
                              </div>
                              
                            </div>
                            <div className="col-6">
                             <div className="mb-3">
                                <p style={{ color: "#000" }}>
                                  Booking Amount
                                </p>
                                <h3 style={{ color: "#000", textAlign:"left" }}>
                                   ${popupDetails?.total_trip_cost}
                                  
                                </h3>
                              </div>
                               <div className="mb-0">
                                <p style={{ color: "#000" , }}>
                                  Booking Date & Time
                                </p>
                                <h3 style={{ color: "#000", textAlign:"left" }}>
                                  {moment(popupDetails?.booking_date).format(
                                    "DD MMM, YYYY"
                                  )}{" "}
                                  (
                                  {moment(
                                    popupDetails?.booking_time,
                                    "HH:mm"
                                  ).format("hh:mm A")}
                                  )
                                </h3>
                              </div>
                            </div>
                              
                            </div>
                          </div>
                        </div>
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
      {/* sectionLayout ended */}
    </div>
  );
}

export default PersonalCompletedSharing;
