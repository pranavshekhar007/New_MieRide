import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/Sidebar";
import TopNav from "../../../components/TopNav";
import TableNav from "../../../components/TableNav";
import { getAssignedBookingRecordServ } from "../../../services/bookingDashboard.services";
import { getPersonalAssignedListFunc } from "../../../services/personalBookingServices";
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
import NewSidebar from "../../../components/NewSidebar";
import CustomTopNav from "../../../components/CustomTopNav";
import SecondaryTopNav from "../../../components/SecondaryTopNav";
import CustomPagination from "../../../components/CustomPazination";
function PersonalAssignedBooking() {
  const { setGlobalState, globalState } = useGlobalState();
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
      let response = await getPersonalAssignedListFunc(payload);
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
              selectedNav="Assigned"
              navBg="#E5E5E5"
              navColor="#1C1C1C"
              selectedNavBg="#353535"
              selectedNavColor="#fff"
              isItemMoreThen8={true}
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
                        <div className="col-md-5">
                          <div>
                            <Skeleton height={440} width="100%" />
                          </div>
                        </div>
                        <div className="col-md-7">
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
                      className={"tableBody py-4 my-4 px-4 borderRadius30All"}
                      style={{
                        background:
                          value?.time_prefrence == "instant"
                            ? "#363435"
                            : "#fff",
                        border: "0.5px solid #E5E5E5",
                      }}
                    >
                      <div className=" row " style={{ borderRadius: "24px" }}>
                        <div className="col-md-5">
                          <div
                            className="leftCardRoute d-flex align-items-center w-100"
                            style={{
                              background:
                                value?.time_prefrence == "instant"
                                  ? "#D0FF13"
                                  : "#353535",
                              height: "420px",
                              borderRadius: "20px",
                              filter: "none",
                            }}
                          >
                            <div className="w-100 ">
                              <div className="row d-flex align-items-center mb-4">
                                <div className="col-6">
                                  <div className="d-flex justify-content-center">
                                    <div
                                      className="d-flex groupIdBtn  justify-content-center w-100  align-items-center"
                                      style={{
                                        filter: "none",
                                        background:
                                          value?.time_prefrence == "instant"
                                            ? "#000"
                                            : "#fff",
                                      }}
                                    >
                                      <div
                                        className="d-flex justify-content-center w-100 px-4"
                                        style={{
                                          color:
                                            value?.time_prefrence == "instant"
                                              ? "#fff"
                                              : "#000",
                                        }}
                                      >
                                        <div>Booking ID :- </div>
                                        <div className="ms-1">{value?.id}</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-6">
                                  <p
                                    style={{
                                      color:
                                        value?.time_prefrence == "instant"
                                          ? "#000"
                                          : "#fff",
                                    }}
                                  >
                                    Username
                                  </p>
                                  <h3
                                    style={{
                                      color:
                                        value?.time_prefrence == "instant"
                                          ? "#000"
                                          : "#fff",
                                    }}
                                  >
                                    {value?.user_details?.first_name +
                                      " " +
                                      value?.user_details?.last_name}
                                  </h3>
                                </div>
                              </div>

                              <div className="row">
                                <div className="col-12 ">
                                  <div className="mb-3">
                                    <p
                                      style={{
                                        color:
                                          value?.time_prefrence == "instant"
                                            ? "#000"
                                            : "#fff",
                                      }}
                                    >
                                      Source
                                    </p>
                                    <h3
                                      style={{
                                        color:
                                          value?.time_prefrence == "instant"
                                            ? "#000"
                                            : "#fff",
                                      }}
                                    >
                                      {value?.source?.length > 20
                                        ? value?.source?.substring(0, 25) +
                                          "..."
                                        : value?.source}
                                    </h3>
                                  </div>
                                  <div className="mb-3">
                                    <p
                                      style={{
                                        color:
                                          value?.time_prefrence == "instant"
                                            ? "#000"
                                            : "#fff",
                                      }}
                                    >
                                      Destination
                                    </p>
                                    <h3
                                      style={{
                                        color:
                                          value?.time_prefrence == "instant"
                                            ? "#000"
                                            : "#fff",
                                      }}
                                    >
                                      {value?.destination?.length > 20
                                        ? value?.destination?.substring(0, 25)
                                        : value?.destination}
                                    </h3>
                                  </div>
                                  <div className="mb-3">
                                    <p
                                      style={{
                                        color:
                                          value?.time_prefrence == "instant"
                                            ? "#000"
                                            : "#fff",
                                      }}
                                    >
                                      Booking Date & Time
                                    </p>
                                    <h3
                                      style={{
                                        color:
                                          value?.time_prefrence == "instant"
                                            ? "#000"
                                            : "#fff",
                                      }}
                                    >
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
                                  <div className="row">
                                    <div className="col-6">
                                      <p
                                        style={{
                                          color:
                                            value?.time_prefrence == "instant"
                                              ? "#000"
                                              : "#fff",
                                        }}
                                      >
                                        Payment
                                      </p>
                                      <img
                                        onClick={() =>
                                          setPaymentDetailsPopup(value)
                                        }
                                        src="/icons/eyeIcon.png"
                                        style={{
                                          height: "20px",
                                          filter:
                                            value?.time_prefrence == "instant"
                                              ? "brightness(1) invert(0)"
                                              : "brightness(0) invert(1)",
                                        }}
                                      />
                                    </div>
                                    <div className="col-6">
                                      <p
                                        style={{
                                          color:
                                            value?.time_prefrence == "instant"
                                              ? "#000"
                                              : "#fff",
                                        }}
                                      >
                                        Time Choice
                                      </p>
                                      <h3
                                        style={{
                                          color:
                                            value?.time_prefrence == "instant"
                                              ? "#000"
                                              : "#fff",
                                        }}
                                      >
                                        {value?.time_choice == "pickupat"
                                          ? "Pick Up"
                                          : "Drop Off"}
                                      </h3>
                                    </div>
                                  </div>
                                  {/* <div className="mb-3">
                                  <p style={{ color: "#000" }}>
                                    First Pickup Time
                                  </p>
                                  <h3 style={{ color: "#000" }}>
                                    {moment(
                                      value?.first_pickup_time,
                                      "HH:mm"
                                    ).format("hh:mm A")}
                                  </h3>
                                </div> */}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div
                          className="col-md-7"
                          style={{
                            marginBottom: `${
                              value?.pickup_points?.length +
                              value?.dropoff_points?.length * -50
                            }px`,
                          }}
                        >
                          <div>
                            {value?.assigned_drivers?.map((v, i) => {
                              return (
                                <div
                                  className="halfTopCard"
                                  style={{
                                    top: `-${i * 30}px`,
                                    background:
                                      i % 2 != 0
                                        ? "#000"
                                        : value?.time_prefrence != "instant"
                                        ? "#6B6B6B"
                                        : "#fff",
                                    borderRadius:
                                      i == value?.assigned_drivers?.length - 1
                                        ? "31px"
                                        : "31px 31px 0px 0px",
                                    color:
                                      i % 2 != 0
                                        ? "#fff"
                                        : value?.time_prefrence != "instant"
                                        ? "#fff"
                                        : "#000",
                                  }}
                                >
                                  <div className="d-flex justify-content-between px-4">
                                    <div className="d-flex align-items-center w-100 row mx-0">
                                      <p className="col-1 mb-auto">{i + 1}.</p>
                                      <div className="col-5">
                                        <div className="d-flex align-items-centeer">
                                          <img
                                            src={Image_Base_Url + v?.image}
                                            style={{
                                              height: "50px",
                                              width: "50px",
                                              borderRadius: "50%",
                                            }}
                                          />
                                          <div className="ms-3">
                                            <p>Driver ID : {v?.id}</p>
                                            <h5>{v?.first_name}</h5>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="row col-6">
                                        <div className="col-6 d-flex justify-content-center mb-auto">
                                          <div
                                            className="d-flex align-items-center justify-content-center w-100 p-1"
                                            style={{
                                              borderRadius: "4px",
                                              background:
                                                i % 2 != 0
                                                  ? "white"
                                                  : value?.time_prefrence !=
                                                    "instant"
                                                  ? "#fff"
                                                  : "#000",
                                            }}
                                          >
                                            <img
                                              style={{
                                                filter:
                                                  i % 2 == 0
                                                    ? value?.time_prefrence !=
                                                      "instant"
                                                      ? "brightness(1) invert(0)"
                                                      : "brightness(0) invert(1)"
                                                    : "brightness(1) invert(0)",
                                              }}
                                              src="https://cdn-icons-png.flaticon.com/128/89/89102.png"
                                            />
                                            <p
                                              className="ms-1"
                                              style={{
                                                color:
                                                  i % 2 == 0
                                                    ? value?.time_prefrence !=
                                                      "instant"
                                                      ? "#000"
                                                      : "#fff"
                                                    : "black",
                                              }}
                                            >
                                              {v?.vehicle_no}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="col-4  mb-auto">
                                          <p
                                            style={{
                                              margin: 0,
                                              overflowWrap: "break-word",
                                              wordBreak: "break-word",
                                              whiteSpace: "normal",
                                            }}
                                          >
                                            {v?.vehicle_size}
                                          </p>
                                        </div>

                                        <div className="col-2 d-flex justify-content-end">
                                          <img
                                            src={
                                              v?.status == "assigned"
                                                ? "https://cdn-icons-png.flaticon.com/128/14035/14035695.png"
                                                : "https://cdn-icons-png.flaticon.com/128/1828/1828666.png"
                                            }
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
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
        </div>
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
      {paymentDetailsPopup && <div className="modal-backdrop fade show"></div>}
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
            selectedItem="Assigned"
            sectedNavBg="#353535"
            selectedNavColor="#fff"
            isItemMoreThen8={true}
          />
        </div>

        {/* top nav ended  */}
        {/* table List started */}
        <div className="tableMain">
          {showSkelton
            ? [1, 2, 3, 4, 5, 6, 7, 8, 9]?.map((v, i) => {
                return (
                  <div
                    className={"tableBody py-4 my-4 px-4 borderRadius50All"}
                    style={{ background: "#363435" }}
                  >
                    <div className="row" style={{ borderRadius: "24px" }}>
                      <div className="col-md-5">
                        <div>
                          <Skeleton height={440} width="100%" />
                        </div>
                      </div>
                      <div className="col-md-7">
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
                    className={"tableBody py-4 my-4 px-4 borderRadius30All"}
                    style={{
                      background:
                        value?.time_prefrence == "instant" ? "#363435" : "#fff",
                      border: "0.5px solid #E5E5E5",
                    }}
                  >
                    <div className=" row " style={{ borderRadius: "24px" }}>
                      <div className="col-md-5">
                        <div
                          className="leftCardRoute d-flex align-items-center w-100"
                          style={{
                            background:
                              value?.time_prefrence == "instant"
                                ? "#D0FF13"
                                : "#353535",
                            height: "420px",
                            borderRadius: "20px",
                            filter: "none",
                          }}
                        >
                          <div className="w-100 ">
                            <div className="row d-flex align-items-center mb-4">
                              <div className="col-6">
                                <div className="d-flex justify-content-center">
                                  <div
                                    className="d-flex groupIdBtn  justify-content-center w-100  align-items-center"
                                    style={{
                                      filter: "none",
                                      background:
                                        value?.time_prefrence == "instant"
                                          ? "#000"
                                          : "#fff",
                                    }}
                                  >
                                    <div
                                      className="d-flex justify-content-center w-100 px-4"
                                      style={{
                                        color:
                                          value?.time_prefrence == "instant"
                                            ? "#fff"
                                            : "#000",
                                      }}
                                    >
                                      <div>Booking ID :- </div>
                                      <div className="ms-1">{value?.id}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-6">
                                <p
                                  style={{
                                    color:
                                      value?.time_prefrence == "instant"
                                        ? "#000"
                                        : "#fff",
                                  }}
                                >
                                  Username
                                </p>
                                <h3
                                  style={{
                                    color:
                                      value?.time_prefrence == "instant"
                                        ? "#000"
                                        : "#fff",
                                  }}
                                >
                                  {value?.user_details?.first_name +
                                    " " +
                                    value?.user_details?.last_name}
                                </h3>
                              </div>
                            </div>

                            <div className="row">
                              <div className="col-12 ">
                                <div className="mb-3">
                                  <p
                                    style={{
                                      color:
                                        value?.time_prefrence == "instant"
                                          ? "#000"
                                          : "#fff",
                                    }}
                                  >
                                    Source
                                  </p>
                                  <h3
                                    style={{
                                      color:
                                        value?.time_prefrence == "instant"
                                          ? "#000"
                                          : "#fff",
                                    }}
                                  >
                                    {value?.source?.length > 20
                                      ? value?.source?.substring(0, 25) + "..."
                                      : value?.source}
                                  </h3>
                                </div>
                                <div className="mb-3">
                                  <p
                                    style={{
                                      color:
                                        value?.time_prefrence == "instant"
                                          ? "#000"
                                          : "#fff",
                                    }}
                                  >
                                    Destination
                                  </p>
                                  <h3
                                    style={{
                                      color:
                                        value?.time_prefrence == "instant"
                                          ? "#000"
                                          : "#fff",
                                    }}
                                  >
                                    {value?.destination?.length > 20
                                      ? value?.destination?.substring(0, 25)
                                      : value?.destination}
                                  </h3>
                                </div>
                                <div className="mb-3">
                                  <p
                                    style={{
                                      color:
                                        value?.time_prefrence == "instant"
                                          ? "#000"
                                          : "#fff",
                                    }}
                                  >
                                    Booking Date & Time
                                  </p>
                                  <h3
                                    style={{
                                      color:
                                        value?.time_prefrence == "instant"
                                          ? "#000"
                                          : "#fff",
                                    }}
                                  >
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
                                <div className="row">
                                  <div className="col-6">
                                    <p
                                      style={{
                                        color:
                                          value?.time_prefrence == "instant"
                                            ? "#000"
                                            : "#fff",
                                      }}
                                    >
                                      Payment
                                    </p>
                                    <img
                                      onClick={() =>
                                        setPaymentDetailsPopup(value)
                                      }
                                      src="/icons/eyeIcon.png"
                                      style={{
                                        height: "20px",
                                        filter:
                                          value?.time_prefrence == "instant"
                                            ? "brightness(1) invert(0)"
                                            : "brightness(0) invert(1)",
                                      }}
                                    />
                                  </div>
                                  <div className="col-6">
                                    <p
                                      style={{
                                        color:
                                          value?.time_prefrence == "instant"
                                            ? "#000"
                                            : "#fff",
                                      }}
                                    >
                                      Time Choice
                                    </p>
                                    <h3
                                      style={{
                                        color:
                                          value?.time_prefrence == "instant"
                                            ? "#000"
                                            : "#fff",
                                      }}
                                    >
                                      {value?.time_choice == "pickupat"
                                        ? "Pick Up"
                                        : "Drop Off"}
                                    </h3>
                                  </div>
                                </div>
                                {/* <div className="mb-3">
                                  <p style={{ color: "#000" }}>
                                    First Pickup Time
                                  </p>
                                  <h3 style={{ color: "#000" }}>
                                    {moment(
                                      value?.first_pickup_time,
                                      "HH:mm"
                                    ).format("hh:mm A")}
                                  </h3>
                                </div> */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        className="col-md-7"
                        style={{
                          marginBottom: `${
                            value?.pickup_points?.length +
                            value?.dropoff_points?.length * -50
                          }px`,
                        }}
                      >
                        <div>
                          {value?.assigned_drivers?.map((v, i) => {
                            return (
                              <div
                                className="halfTopCard"
                                style={{
                                  top: `-${i * 30}px`,
                                  background:
                                    i % 2 != 0
                                      ? "#000"
                                      : value?.time_prefrence != "instant"
                                      ? "#6B6B6B"
                                      : "#fff",
                                  borderRadius:
                                    i == value?.assigned_drivers?.length - 1
                                      ? "31px"
                                      : "31px 31px 0px 0px",
                                  color:
                                    i % 2 != 0
                                      ? "#fff"
                                      : value?.time_prefrence != "instant"
                                      ? "#fff"
                                      : "#000",
                                }}
                              >
                                <div className="d-flex justify-content-between px-4">
                                  <div className="d-flex align-items-center w-100 row mx-0">
                                    <p className="col-1 mb-auto">{i + 1}.</p>
                                    <div className="col-5">
                                      <div className="d-flex align-items-centeer">
                                        <img
                                          src={Image_Base_Url + v?.image}
                                          style={{
                                            height: "50px",
                                            width: "50px",
                                            borderRadius: "50%",
                                          }}
                                        />
                                        <div className="ms-3">
                                          <p>Driver ID : {v?.id}</p>
                                          <h5>{v?.first_name}</h5>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="row col-6">
                                      <div className="col-6 d-flex justify-content-center mb-auto">
                                        <div
                                          className="d-flex align-items-center justify-content-center w-100 p-1"
                                          style={{
                                            borderRadius: "4px",
                                            background:
                                              i % 2 != 0
                                                ? "white"
                                                : value?.time_prefrence !=
                                                  "instant"
                                                ? "#fff"
                                                : "#000",
                                          }}
                                        >
                                          <img
                                            style={{
                                              filter:
                                                i % 2 == 0
                                                  ? value?.time_prefrence !=
                                                    "instant"
                                                    ? "brightness(1) invert(0)"
                                                    : "brightness(0) invert(1)"
                                                  : "brightness(1) invert(0)",
                                            }}
                                            src="https://cdn-icons-png.flaticon.com/128/89/89102.png"
                                          />
                                          <p
                                            className="ms-1"
                                            style={{
                                              color:
                                                i % 2 == 0
                                                  ? value?.time_prefrence !=
                                                    "instant"
                                                    ? "#000"
                                                    : "#fff"
                                                  : "black",
                                            }}
                                          >
                                            {v?.vehicle_no}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="col-4  mb-auto">
                                        <p
                                          style={{
                                            margin: 0,
                                            overflowWrap: "break-word",
                                            wordBreak: "break-word",
                                            whiteSpace: "normal",
                                          }}
                                        >
                                          {v?.vehicle_size}
                                        </p>
                                      </div>

                                      <div className="col-2 d-flex justify-content-end">
                                        <img
                                          src={
                                            v?.status == "assigned"
                                              ? "https://cdn-icons-png.flaticon.com/128/14035/14035695.png"
                                              : "https://cdn-icons-png.flaticon.com/128/1828/1828666.png"
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
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

export default PersonalAssignedBooking;
