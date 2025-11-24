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
import AssignedTimer from "../../../components/AssignedTimer";
import PersonalBookingTicket from "../../../components/PersonalBookingTicket";
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

  const handleViewMore = (id) => {
    setList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isOpen: true } : item))
    );
  };

  // View Less
  const handleViewLess = (id) => {
    setList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isOpen: false } : item))
    );
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
                  if (!value?.isOpen) {
                    return (
                      <table
                        className={
                          "table " + (i + 1 != list?.length ? " mb-4" : " mb-0")
                        }
                      >
                        <tbody className="bgWhite w-100 routeMinTBody">
                          <tr>
                            <td style={{ borderRadius: "15px 0px 0px 15px" }}>
                              <div className="groupBtn ms-3">
                                <p>Booking ID :- {value?.id}</p>
                              </div>
                            </td>
                            <td>
                              <div style={{ width: "180px" }}>
                                <h5>Source City</h5>
                                <h6>{value?.source}</h6>
                              </div>
                            </td>
                            <td>
                              <div style={{ width: "180px" }}>
                                <h5>Destination City</h5>
                                <h6>{value?.destination}</h6>
                              </div>
                            </td>
                            <td>
                              <div>
                                <h5>Booking Date</h5>
                                <h6>
                                  {moment(value?.first_pickup_date).format(
                                    "DD MMM, YYYY"
                                  )}
                                </h6>
                              </div>
                            </td>
                            <td>
                              <div>
                                <h5>Vehicle Size</h5>
                                <h6>
                                  {value?.assigned_drivers?.[0]?.vehicle_size}
                                </h6>
                              </div>
                            </td>

                            <td>
                              <div>
                                <h6
                                  style={{
                                    background:
                                      value?.time_prefrence?.toLowerCase() ===
                                      "instant"
                                        ? "#D0FF13"
                                        : "#1C1C1C",
                                    color:
                                      value?.time_prefrence?.toLowerCase() ===
                                      "instant"
                                        ? "#000000"
                                        : "#D0FF13",
                                    padding: "14px 20px 6px 20px",
                                    borderRadius: "10px",
                                    fontWeight: "600",
                                    fontSize: "16px",
                                    textAlign: "center",
                                    width: "110px",
                                    height: "40px",
                                  }}
                                >
                                  {value?.time_prefrence
                                    ? value?.time_prefrence
                                        .charAt(0)
                                        .toUpperCase() +
                                      value?.time_prefrence.slice(1)
                                    : "--"}
                                </h6>
                              </div>
                            </td>
                            <td style={{ borderRadius: "0px 15px 15px 0px" }}>
                              <div
                                className="d-flex justify-content-end me-3"
                                onClick={() => handleViewMore(value.id)}
                                style={{ cursor: "pointer" }}
                              >
                                <span className="mx-2">View More</span>
                                <img src="/imagefolder/downArrow.png" />
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    );
                  } else {
                    return (
                      <div
                        className="routeMain"
                        style={{
                          marginBottom:
                            i + 1 != list?.length ? " 20px" : " 0px",
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-center routeTopNav">
                          <div className="groupBtn">
                            <p>Booking ID :- {value?.id}</p>
                          </div>
                          <div
                            onClick={() => handleViewLess(value.id)}
                            style={{ cursor: "pointer" }}
                          >
                            <span className="mx-2">View Less</span>
                            <img src="/imagefolder/upArrow.png" />
                          </div>
                        </div>
                        <div className="row mt-4">
                          <div className="row col-4 m-0 p-0">
                            <div>
                              <div
                                className="routeLeftCard mb-4"
                                style={{ position: "relative" }}
                              >
                                <div
                                  style={{
                                    position: "absolute",
                                    right: "-1px",
                                    top: "50%",
                                    transform:
                                      "translateY(-50%) rotate(180deg)",
                                    background: "#353535",
                                    color: "#fff",
                                    padding: "40px 8px",
                                    borderRadius: "0px 8px 8px 0px",
                                    writingMode: "vertical-rl",
                                    textOrientation: "mixed",
                                    fontWeight: 600,
                                  }}
                                >
                                  {value?.time_prefrence === "instant"
                                    ? "Instant"
                                    : "Later"}
                                </div>

                                <div className="d-flex justify-content-between">
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
                                  <div className="mb-4 pe-5">
                                    <p
                                      style={{
                                        paddingBottom: "10px",
                                      }}
                                    >
                                      Vehicle Size
                                    </p>
                                    <h5>
                                      {
                                        value?.assigned_drivers?.[0]
                                          ?.vehicle_size
                                      }
                                    </h5>
                                  </div>
                                </div>

                                <div className="mb-4">
                                  <p>Source</p>
                                  <h5>{value?.source || "N/A"}</h5>
                                </div>
                                <div className="mb-4">
                                  <p>Destination</p>
                                  <h5>{value?.destination || "N/A"}</h5>
                                </div>
                                <div className="mb-4">
                                  <p>Booking Date & Time</p>
                                  <h5>
                                    {moment(value?.booking_date).format(
                                      "DD MMM, YYYY"
                                    )}{" "}
                                    (
                                    {moment(
                                      value?.booking_time,
                                      "HH:mm"
                                    ).format("hh:mm A")}
                                    )
                                  </h5>
                                </div>

                                <div className="mb-4">
                                  <p>Total Route Time</p>
                                  <h5>
                                    {moment
                                      .duration(
                                        value?.total_trip_time,
                                        "minutes"
                                      )
                                      .hours()}{" "}
                                    hr{" "}
                                    {moment
                                      .duration(
                                        value?.total_trip_time,
                                        "minutes"
                                      )
                                      .minutes()}{" "}
                                    min
                                  </h5>
                                </div>
                                <div className="d-flex gap-3">
                                  <button
                                    onClick={() =>
                                      setPaymentDetailsPopup(value)
                                    }
                                  >
                                    <img
                                      src="/imagefolder/eyeIcon.png"
                                      style={{
                                        filter: "brightness(0) invert(1)",
                                        marginRight: "10px",
                                      }}
                                    />
                                    Payment
                                  </button>
                                  <button
                                    onClick={() =>
                                      alert("Cancel Assign Clicked")
                                    }
                                  >
                                    Cancel Assign
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-8">
                            {value?.assigned_drivers?.map((driver, index) => (
                              <PersonalBookingTicket
                                key={index}
                                i={index}
                                driver={driver}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  }
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
            <div className="modal-content paymentReceiptPopup">
              <div className="modal-body p-0">
                <div className="text-center mb-4">
                  <h3 className="popupTitle">Payment Receipt – Persona Ride</h3>
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
                      {Number(paymentDetailsPopup?.total_trip_cost || 0) +
                        Number(paymentDetailsPopup?.tip_amount || 0)}
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
