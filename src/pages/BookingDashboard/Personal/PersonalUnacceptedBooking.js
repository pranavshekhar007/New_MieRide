import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/Sidebar";
import TopNav from "../../../components/TopNav";
import TableNav from "../../../components/TableNav";

import {
  getUnacceptedPersonalListServ,
  assignPersonalDriverServ,
  manualPersonalDriverServ,
  cancelPersonalServ
} from "../../../services/personalBookingServices";
import { updateNotificationStatusServ } from "../../../services/notification.services";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import moment from "moment";
import { useGlobalState } from "../../../GlobalProvider";
import { toast } from "react-toastify";
import NoRecordFound from "../../../components/NoRecordFound";
import Ably from "ably";
import { getNavItems } from "../../../utils/TopNavItemData/bookingDashboard";
import Pagination from "../../../components/Pagination";
function PersonalUnacceptedBooking() {
  const { setGlobalState, globalState } = useGlobalState();
  const [payload, setPayload] = useState({
    per_page: 10,
    page_no: 1,
    first_pickup_date: "",
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
  const [list, setList] = useState([]);
  const [showSkelton, setShowSkelton] = useState(false);
  const handleGetListFunc = async () => {
    if (list?.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await getUnacceptedPersonalListServ(payload);
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
          if (event == "new-group-created" || event == "group-updated") {
            playNotificationSound();
          }
          handleGetListFunc();
        });
      });
      return channel;
    };

    // Channel-event mapping
    const channelEventMap = [
      {
        name: "booking-updates",
        events: ["group-updated", "new-group-created"],
      },
      { name: "manual-booking-arrived", events: ["new-manual-booking"] },
      { name: "missed-booking-arrived", events: ["new-missed-booking"] },
      {
        name: "admin-booking-canceled-auto",
        events: ["booking-canceled-auto"],
      },
      { name: "route-updates", events: ["route-created"] },
      { name: "booking-assigned", events: ["booking-assigned"] },
      { name: "admin-booking-updates", events: ["admin-booking-update"] },
      {
        name: "admin-ride-status-updated",
        events: [
          "ride-started",
          "ride-canceled",
          "ride-status-updated",
          "booking-enroute",
          "booking-arrived",
          "booking-dropped",
          "booking-missed",
          "booking-cancelled",
        ],
      },
      {
        name: "admin-route-recreated",
        events: ["admin-group-recreate", "group-modified"],
      },
    ];

    // Subscribe to all channels and events
    const channels = channelEventMap.map(({ name, events }) =>
      subscribeToChannel(name, events)
    );
  }, [payload]);

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
        return v.category == "new_booking" && v?.is_read == 0;
      })
      ?.map((v, i) => {
        updateNotificationStatusFunc(v?.id);
      });
  });
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
  const [assignLoader, setAssignLoader] = useState(false);
  const assignDriverFunc = async (id) => {
    setAssignLoader(id);
    try {
      let response = await assignPersonalDriverServ({ booking_id: id });
      if (response?.data?.statusCode == "200") {
        handleGetListFunc();
        toast.success(response?.data?.message)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
    setAssignLoader(false);
  };
 const [manualLoader, setManualLoader] = useState(false);
  const manualDriverFunc = async (id) => {
    setManualLoader(id);
    try {
      let response = await manualPersonalDriverServ({ booking_id: id });
      if (response?.data?.statusCode == "200") {
        handleGetListFunc();
        toast.success(response?.data?.message)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
    setManualLoader(false);
  }; 
  const [cancelLoader, setCancelLoader] = useState(false);
  const cancelBookingFunc = async (id) => {
     const confirmed = window.confirm("Are you sure you want to cancel the booking?");
    if(confirmed){
 setCancelLoader(id);
    try {
      let response = await cancelPersonalServ({ booking_id: id });
      if (response?.data?.statusCode == "200") {
        handleGetListFunc();
        toast.success(response?.data?.message)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
    setCancelLoader(false);
    }
   
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
          marginLeft: globalState?.isFillSidebarWidth100 ? "260px" : "80px",
          padding: "0px 30px 45px 30px",
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
            selectedItem="Unaccepted"
            sectedNavBg="#353535"
            selectedNavColor="#fff"
            isItemMoreThen8={true}
          />
        </div>
        {/* table List started */}
        <div className="tableMain">
          <div
            className="tableBody py-2 px-2 borderRadius30All"
            style={{ background: "#363435", marginTop: "25px" }}
          >
            <div style={{ margin: "15px 10px 0px 10px" }}>
              <table className="table bookingGroupTable mb-0">
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
                    <th scope="col">Pick Address</th>
                    <th scope="col">Drop Address</th>
                    <th scope="col">Booking Date & Time</th>
                    <th scope="col" style={{ width: "100px" }}>
                      Time Choice
                    </th>
                    <th scope="col">Booking Placed</th>
                    <th scope="col">Payment</th>

                    <th
                      scope="col"
                      style={{ borderRadius: "0px 24px 24px 0px" }}
                    >
                      <span className="mx-2">Action</span>
                    </th>
                  </tr>
                </thead>
                <div className="pt-3 pb-2 "></div>
                {showSkelton
                  ? [1, 2, 3, 4, 5, 6, 7, 8, 9]?.map((v, i) => {
                      return (
                        <tr key={i}>
                          <td>
                            <Skeleton width={50} />
                          </td>
                          <td>
                            <Skeleton width={70} />
                          </td>

                          <td>
                            <Skeleton width={70} />
                          </td>
                          <td>
                            <Skeleton width={70} />
                          </td>
                          <td>
                            <Skeleton width={70} />
                          </td>
                          <td>
                            <Skeleton width={70} />
                          </td>

                          <td>
                            <Skeleton width={70} />
                          </td>
                          <td>
                            <Skeleton width={70} />
                          </td>
                          <td>
                            <Skeleton width={70} />
                          </td>
                          <td>
                            <Skeleton width={70} />
                          </td>
                        </tr>
                      );
                    })
                  : list?.map((v, i) => {
                      return (
                        <>
                          <tbody className="bg-light groupTab verticalCenter">
                            <tr className=" ">
                              <td
                                scope="row"
                                style={{
                                  borderTopLeftRadius: "24px",
                                  borderBottomLeftRadius: "24px",
                                }}
                              >
                                {i + 1 + (pageData?.current_page - 1) * 10}
                              </td>

                              <td>{v?.id}</td>

                              <td>{v?.user_details?.first_name + " "+ v?.user_details?.last_name}</td>
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
                                {moment(v?.booking_date).format("DD MMM, YYYY")} (
                                {moment(v?.booking_time, "HH:mm").format(
                                  "hh:mm A"
                                )}
                                )
                              </td>

                              <td>
                                {v?.time_choice == "pickupat"
                                  ? "Pickup"
                                  : " Dropoff"}
                              </td>
                              <td>
                                <div>
                                  {moment(v?.created_at).format("DD/MM/YYYY")}
                                </div>
                                <div>
                                  {moment(v?.created_at).format("hh:mm A")}
                                </div>
                              </td>
                              <td>
                                <div onClick={() => setPaymentDetailsPopup(v)}>
                                  <img
                                    src="/icons/eyeIcon.png"
                                    style={{ height: "20px" }}
                                  />
                                </div>
                              </td>
                              <td
                                style={{
                                  borderTopRightRadius: "24px",
                                  borderBottomRightRadius: "24px",
                                }}
                              >
                                <div className="d-flex justify-content-center ">
                                  <div style={{ marginTop: "0px" }}>
                                    {/* <div
                                      onClick={() =>
                                        assignLoader == v?.id
                                          ? {}
                                          : assignDriverFunc(v?.id)
                                      }
                                      style={{
                                        background: "#00A431",
                                        border: "none",
                                        width: "90px",
                                        opacity:
                                          assignLoader == v?.id ? "0.5" : "1",
                                      }}
                                      className="btn btn-primary shadow btnHeight25 d-flex justify-content-center align-items-center"
                                    >
                                      <span
                                        style={{
                                          marginLeft: "6px",
                                          color: "#fff",
                                          fontSize: "9px",
                                        }}
                                      >
                                        {assignLoader == v?.id
                                          ? "Assigning ..."
                                          : "Assign"}{" "}
                                      </span>
                                    </div> */}

                                    <div
                                      onClick={() =>
                                        manualLoader == v?.id
                                          ? {}
                                          : manualDriverFunc(v?.id)
                                      }
                                      style={{
                                        background: "#353535",
                                        border: "none",
                                        width: "90px",
                                        opacity:
                                          manualLoader == v?.id ? "0.5" : "1",
                                      }}
                                      className="btn btn-primary shadow btnHeight25 d-flex justify-content-center align-items-center"
                                    >
                                      <span
                                        style={{
                                          marginLeft: "6px",
                                          color: "#D0FF13",
                                          fontSize: "9px",
                                        }}
                                      >
                                       {manualLoader == v?.id
                                          ? "Loading ..."
                                          : "Manual"}{" "}
                                      </span>
                                    </div>

                                    <div
                                      onClick={() =>
                                        cancelLoader == v?.id
                                          ? {}
                                          : cancelBookingFunc(v?.id)
                                      }
                                      style={{
                                        background: "#353535",
                                        border: "none",
                                        width: "90px",
                                        opacity:
                                          cancelLoader == v?.id ? "0.5" : "1",
                                      }}
                                      className="btn btn-primary shadow btnHeight25 d-flex justify-content-center align-items-center"
                                    >
                                      <span
                                        style={{
                                          marginLeft: "6px",
                                          color: "#D0FF13",
                                          fontSize: "9px",
                                        }}
                                      >
                                        {cancelLoader == v?.id
                                          ? "Cancelling ..."
                                          : "Cancel"}{" "}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                          <div className="mb-4"></div>
                        </>
                      );
                    })}
              </table>
              {list?.length == 0 && !showSkelton && (
                <NoRecordFound theme="light" />
              )}
              <div></div>
            </div>
          </div>
        </div>
        <Pagination
          current_page={pageData?.current_page}
          onPerPageChange={onPerPageChange}
          last_page={pageData?.total_pages}
          per_page={payload?.per_page}
          onPageChange={onPageChange}
        />
        {/* table List ended */}
      </section>
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
                        ${paymentDetailsPopup?.booking_amount}
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
      {paymentDetailsPopup && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}

export default PersonalUnacceptedBooking;
