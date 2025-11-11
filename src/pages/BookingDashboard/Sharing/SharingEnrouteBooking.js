import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/Sidebar";
import TopNav from "../../../components/TopNav";
import TableNav from "../../../components/TableNav";
import {
  getEnrouteBookingRecordServ,
  unlinkGroupServ,
  cancelSharingBookingServ,
  getBookingListForMnualAssign,
  assignBookingToExistingGroupServ,
} from "../../../services/bookingDashboard.services";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import moment from "moment";
import { useGlobalState } from "../../../GlobalProvider";
import { Image_Base_Url } from "../../../utils/api_base_url_configration";
import NoRecordFound from "../../../components/NoRecordFound";
import Ably from "ably";
import { Tooltip } from "react-tooltip";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import LocationTicket from "../../../components/LocationTicket";
import { updateNotificationStatusServ } from "../../../services/notification.services";
import { getNavItems } from "../../../utils/TopNavItemData/bookingDashboard";
import Pagination from "../../../components/Pagination";
import SecondaryTopNav from "../../../components/SecondaryTopNav";
import NewSidebar from "../../../components/NewSidebar";
import CustomTopNav from "../../../components/CustomTopNav";
import CustomPagination from "../../../components/CustomPazination";
import { toast } from "react-toastify";
function SharingEnrouteBooking() {
  const { setGlobalState, globalState } = useGlobalState();
  const [tipForm, setTipForm] = useState({
    show: false,
    tip_status: "",
    booking_id: "",
    group_id: "",
    tip_amount: "",
  });
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
      name: "Analytics",
      path: "/sharing-analytics-booking",
      notificationLength: globalState?.notificationList?.filter((v) => {
        return v.category == "new_booking" && v?.is_read == 0;
      })?.length,
    },
    {
      name: "Upcoming Group",
      path: "/sharing-upcoming-group-booking",
      notificationLength: globalState?.notificationList?.filter((v) => {
        return v.category == "new_booking" && v?.is_read == 0;
      })?.length,
    },
    {
      name: "Current Group",
      path: "/sharing-group-booking",
      notificationLength: globalState?.notificationList?.filter((v) => {
        return v.category == "new_booking" && v?.is_read == 0;
      })?.length,
    },
    {
      name: "Route",
      path: "/sharing-route-booking",
      notificationLength: globalState?.notificationList?.filter((v) => {
        return v.category == "new_route_created" && v?.is_read == 0;
      })?.length,
    },
    {
      name: "Assigned",
      path: "/sharing-assigned-booking",
    },

    {
      name: "Accepted",
      path: "/sharing-accepted-booking",
      notificationLength: globalState?.notificationList?.filter((v) => {
        return (
          (v.category == "booking_accepted" ||
            v.category == "booking_rejected") &&
          v?.is_read == 0
        );
      })?.length,
    },
    {
      name: "Manual",
      path: "/sharing-manual-booking",
    },
    {
      name: "Missed",
      path: "/sharing-missed-booking",
      notificationLength: globalState?.notificationList?.filter((v) => {
        return v.category == "booking_missed" && v?.is_read == 0;
      })?.length,
    },
    {
      name: "Enroute",
      path: "/sharing-enroute-booking",
      notificationLength: globalState?.notificationList?.filter((v) => {
        return (
          (v.category == "booking_ride_started" ||
            v.category == "booking_arrived" ||
            v.category == "booking_pickup_started" ||
            v.category == "booking_drop_route_started" ||
            v.category == "booking_drop_started") &&
          v?.is_read == 0
        );
      })?.length,
    },
    {
      name: "Completed",
      path: "/sharing-completed-booking",
      notificationLength: globalState?.notificationList?.filter((v) => {
        return v.category == "booking_completed" && v?.is_read == 0;
      })?.length,
    },
    {
      name: "Cancelled",
      path: "/sharing-cancelled-booking",
      notificationLength: globalState?.notificationList?.filter((v) => {
        return (
          (v.category == "booking_canceled" ||
            v.category == "booking_ride_canceled") &&
          v?.is_read == 0
        );
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
      let response = await getEnrouteBookingRecordServ(payload);
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
  const [alreadrExistGroupList, setAlreadyExistGroupList] = useState([]);
  const [manualAssignFormData, setManualAssignFormData] = useState({
    booking_id: "",
    group_id: "",
  });
  const [groupList, setGroupList] = useState([]);
  const fetchGroupId = async (booking_id) => {
    setSelectedBooking(booking_id);
    setManualAssignFormData({
      ...manualAssignFormData,
      booking_id: booking_id,
    });
    try {
      let response = await getBookingListForMnualAssign({ booking_id });
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        if (
          response?.data?.message == "Matching groups retrieved successfully"
        ) {
          setGroupList(response?.data?.groups);
          setAlreadyExistGroupList(response?.data?.alreadyEnrouteGroups);
        }
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
    // setSelectedBooking()
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

    // Cleanup on component unmount
  }, [payload]);

  const renderBg = (status) => {
    if (status == "accepted") {
      return "#AD013D";
    }
    if (status == "enroute") {
      return "#00437C";
    }
    if (status == "canceled") {
      return "red";
    }
    if (status == "completed") {
      return "#139F01";
    }
  };
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
  const renderPickUpStatus = (status) => {
    if (status == "ride_started") {
      return "Ride Started";
    }
    if (status == "arrived") {
      return "Arrived At Location";
    }
    if (status == "pickup_started") {
      return "Pickup Started";
    }
    if (status == "drop_route_started") {
      return "Drop Route Started";
    }
    if (status == "drop_started") {
      return "Drop Started";
    }
  };
  const renderImage = (status) => {
    if (status == "Completed") {
      return (
        <img
          src="https://cdn-icons-png.flaticon.com/128/11450/11450152.png"
          alt="Icon"
          className="me-3"
          style={{ height: "20px" }}
        />
      );
    }
    if (status == "Incomplete") {
      return (
        <img
          src="https://cdn-icons-png.flaticon.com/128/5698/5698505.png"
          alt="Icon"
          className="me-3"
          style={{ height: "20px" }}
        />
      );
    }
    if (status == "Cancelled") {
      return (
        <img
          src="https://cdn-icons-png.flaticon.com/128/399/399274.png"
          alt="Icon"
          className="me-3"
          style={{ height: "20px" }}
        />
      );
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
        return (
          (v.category == "booking_ride_started" ||
            v.category == "booking_arrived" ||
            v.category == "booking_pickup_started" ||
            v.category == "booking_drop_route_started" ||
            v.category == "booking_drop_started") &&
          v?.is_read == 0
        );
      })
      ?.map((v, i) => {
        updateNotificationStatusFunc(v?.id);
      });
  });
  const [paymentDetailsPopup, setPaymentDetailsPopup] = useState(null);
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
  const [cancelLoader, setCancelLoader] = useState(false);
  const [switchLoader, setSwitchLoader] = useState(false);
  const [unLinkLoader, setUnlinkLoader] = useState(false);
  const [manualPopupDetails, setManualPopupDetails] = useState(null);
  const handleUnlinkFunc = async () => {
    setUnlinkLoader(true);
    try {
      let response = await unlinkGroupServ({ booking_id: selectedBooking });
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        setManualPopupDetails(false);
        setSelectedBooking(null);
        handleGetListFunc();
      } else {
        toast.success(response?.data?.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
    setUnlinkLoader(false);
  };
  const [selectedBooking, setSelectedBooking] = useState();
  const handleCancelFunc = async () => {
    setCancelLoader(true);
    try {
      let response = await cancelSharingBookingServ({
        booking_id: selectedBooking,
      });
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        setManualPopupDetails(false);
        setSelectedBooking(null);
        handleGetListFunc();
      } else {
        toast.success(response?.data?.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
    setCancelLoader(false);
  };
  const openManualPopUp = (value) => {
    try {
      console.log(value);
      setManualPopupDetails(value);
    } catch (error) {}
  };
  const [moveBtnLoader, setMoveBtnLoader] = useState(false);
  const assignBookingToExistingGroup = async () => {
    setMoveBtnLoader(true);
    try {
      let response = await assignBookingToExistingGroupServ(
        manualAssignFormData
      );

      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        handleGetListFunc();
        if (response?.data?.tip_amount) {
          setTipForm({
            show: true,
            tip_status: "",
            booking_id: manualAssignFormData.booking_id,
            group_id: manualAssignFormData.group_id,
            tip_amount: response?.data?.tip_amount,
          });
        }

        setManualAssignFormData({
          booking_id: "",
          group_id: "",
        });
        setGroupList([]);
        setManualPopupDetails(null);
        setSelectedBooking(null);
      } else {
        toast.info(response?.data?.message);
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
    setMoveBtnLoader(false);
  };
  const [userDetailsPopup, setUserDetailsPopup] = useState(null);
  return (
    <div className="mainBody">
      <NewSidebar selectedItem="Booking Dashboard" />
      <div className="contentLayout">
        <div className="bgWhite borderRadius30 p-4 minHeight100vh">
          <div className="sticky-top bgWhite">
            <CustomTopNav navItems={navItems} selectedNav="Sharing Ride" />
            <SecondaryTopNav
              navItems={tableNav}
              selectedNav="Enroute"
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
                      className={"tableBody py-0 my-4 px-2 borderRadius50All"}
                      style={{ background: "#363435" }}
                    >
                      <div className="row" style={{ borderRadius: "24px" }}>
                        <div className="col-md-3">
                          <div>
                            <Skeleton height={440} width="100%" />
                          </div>
                        </div>
                        <div className="col-md-9">
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
                                <p>Group ID :- {value?.group_id}</p>
                              </div>
                            </td>
                            <td>
                              <div style={{width:"180px"}}>
                                <h5>Source City</h5>
                                <h6>{value?.pickup_city}</h6>
                              </div>
                            </td>
                            <td>
                              <div style={{width:"180px"}}>
                                <h5>Destination City</h5>
                                <h6>{value?.dropoff_city}</h6>
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
                                <h5>First Pickup Time</h5>
                                <h6>
                                  {moment(
                                    value?.first_pickup_time,
                                    "HH:mm"
                                  ).format("hh:mm A")}
                                </h6>
                              </div>
                            </td>
                            <td>
                              <div>
                                <h5>No. of Person</h5>
                                <h6>
                                  {value?.pickup_points[0]?.number_of_person ||
                                    1}
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
                            <p>Group ID :- {value?.group_id}</p>
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
                          <div className="col-5">
                            <div className="acceptedDriverCard">
                              <div className="row mb-4">
                                <div className="col-5">
                                  <div className="d-flex  justify-content-between align-items-center">
                                    <img
                                      className="acceptedDriverIcon"
                                      src={
                                        Image_Base_Url +
                                        value?.driverDetails?.image
                                      }
                                    />
                                    <div className="mx-2">
                                      <div className="acceptedDriverId ">
                                        ID :- {value?.driverDetails?.id}
                                      </div>
                                      <h5>
                                        {value?.driverDetails?.first_name}
                                      </h5>
                                      <div className="ratingDiv">
                                        (3.7){" "}
                                        <img src="https://cdn-icons-png.flaticon.com/128/1828/1828884.png" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-7 ">
                                  <h4>
                                    {value?.driverDetails?.vehicle_name} (
                                    {value?.driverDetails?.vehicle_colour})
                                  </h4>
                                  <div className="whiteVechileNoDiv">
                                    {value?.driverDetails?.vehicle_no}
                                  </div>
                                </div>
                              </div>

                              <button
                                onClick={() => alert("Coming soon")}
                                className="callNowButton"
                              >
                                <img src="https://cdn-icons-png.flaticon.com/128/483/483947.png" />{" "}
                                Call Now
                              </button>
                            </div>
                            <div className="routeLeftCard mt-4">
                              <div className="row mb-4">
                                <div className="col-8">
                                  <p>Booking Date & Time</p>
                                  <h5>
                                    {moment(value?.first_pickup_date).format(
                                      "DD MMM, YYYY"
                                    )}{" "}
                                    (
                                    {moment(
                                      value?.first_pickup_time,
                                      "HH:mm"
                                    ).format("hh:mm A")}
                                    )
                                  </h5>
                                </div>
                                <div className="col-4">
                                  <p style={{ color: "#000" }}>Time Choice</p>
                                  <h5 style={{ color: "#000" }}>
                                    {value?.time_choice == "pickupat"
                                      ? "Pick Up"
                                      : "Drop Off"}
                                  </h5>
                                </div>
                                {/* <div className="col-3">
                              <p>Payment</p>
                              <img
                                src="/imagefolder/eyeIcon.png"
                                onClick={() => setPaymentDetailsPopup(value)}
                              />
                            </div> */}
                              </div>

                              <div className="row ">
                                <div className="col-12">
                                  <button
                                    className="bgWhite textDark"
                                    onClick={() => alert("work in progress")}
                                  >
                                    En route to{" "}
                                    {value?.driver_last_location?.length > 28
                                      ? value?.driver_last_location?.substring(
                                          0,
                                          25
                                        ) + "..."
                                      : value?.driver_last_location}
                                  </button>
                                </div>
                                <div className="col-6 mt-3">
                                  <button
                                    onClick={() =>
                                      setPaymentDetailsPopup(value)
                                    }
                                  >
                                    Payment
                                  </button>
                                </div>
                                <div className="col-6 mt-3">
                                  <button
                                    onClick={() => alert("work in progress")}
                                  >
                                    Manage
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-7">
                            {value?.pickup_points?.map((v, i) => {
                              return (
                                <LocationTicket
                                  i={i}
                                  v={v}
                                  key={i}
                                  value={value}
                                />
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  }
                })}
            {list?.length == 0 && !showSkelton && <NoRecordFound />}
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
          className="modal fade show d-flex align-items-center   justify-content-center "
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content paymentPopup">
              <div className="modal-body p-0">
                <div
                  style={{
                    wordWrap: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                  className="d-flex justify-content-center w-100"
                >
                  <div className="w-100">
                    <div className="px-2">
                      <div className="d-flex justify-content-between align-items-center paymentPopupLine mb-4">
                        <p>No. of Person </p>
                        <h5>{paymentDetailsPopup?.number_of_person || 1}</h5>
                      </div>
                      <div className="d-flex justify-content-between align-items-center paymentPopupLine mb-4">
                        <p>Booking Amount</p>
                        <h5> ${paymentDetailsPopup?.total_trip_cost}</h5>
                      </div>
                      <div className="d-flex justify-content-between align-items-center paymentPopupLine mb-4">
                        <p>Surge Amount</p>
                        <h5> ${paymentDetailsPopup?.total_extra_charge}</h5>
                      </div>

                      <div className="d-flex justify-content-between align-items-center paymentPopupLine mb-4">
                        <p>Admin Fee</p>
                        <h5>${paymentDetailsPopup?.total_admin_commission}</h5>
                      </div>
                      <div className="d-flex justify-content-between align-items-center paymentPopupLine ">
                        <p>Driver Earn</p>
                        <h5>${paymentDetailsPopup?.total_driver_earning}</h5>
                      </div>
                    </div>
                    <div className="borderLine"></div>
                    <div className="d-flex justify-content-between align-items-center paymentPopupLine ">
                      <h5>Total Payment</h5>
                      <h4>${paymentDetailsPopup?.total_trip_cost}</h4>
                    </div>
                    <button>Paid via wallet</button>
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
        </div>
      )}
      {paymentDetailsPopup && <div className="modal-backdrop fade show"></div>}
      {manualPopupDetails && (
        <div
          className="modal fade show d-flex align-items-center   justify-content-center "
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content managepopupgroup">
              <div className="modal-body p-0">
                <div className="row m-0 p-0">
                  <div className="col-8 m-0 p-0">
                    <div className="managepopupgroupleft me-3">
                      {manualPopupDetails?.pickup_points?.map((v, i) => {
                        return (
                          <div
                            className="d-flex justify-content-between align-items-center  py-2 managePopUpTable"
                            style={{
                              background:
                                selectedBooking == v?.booking?.id
                                  ? "#353535"
                                  : "#F7F7F7",
                            }}
                            onClick={() => {
                              fetchGroupId(v?.booking?.id);
                            }}
                          >
                            <div className="px-3">
                              <button
                                style={{
                                  background:
                                    selectedBooking == v?.booking.id
                                      ? "#D0FF13"
                                      : "#000",
                                  color:
                                    selectedBooking == v?.booking.id
                                      ? "#000"
                                      : "#D0FF13",
                                }}
                              >
                                Booking ID : {v?.booking.id}
                              </button>
                            </div>
                            <div className="d-flex align-items-center px-3">
                              <img src="/imagefolder/locationGreenIcon.png" />
                              <p
                                className="ms-2"
                                style={{
                                  color:
                                    selectedBooking == v?.booking?.id
                                      ? "#fff"
                                      : "#1C1C1C",
                                }}
                              >
                                {v?.booking?.source}
                              </p>
                            </div>
                            <div className="d-flex align-items-center">
                              <img src="/imagefolder/locationRedIcon.png" />
                              <p
                                className="ms-2"
                                style={{
                                  color:
                                    selectedBooking == v?.booking?.id
                                      ? "#fff"
                                      : "#1C1C1C",
                                }}
                              >
                                {v?.booking?.destination}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="col-4 m-0 p-0">
                    <div className="managepopupgroupleft ms-2">
                      <select
                        style={{ opacity: groupList.length > 0 ? "1" : "0.5" }}
                        onChange={(e) =>
                          setManualAssignFormData({
                            ...manualAssignFormData,
                            group_id: e.target.value,
                          })
                        }
                      >
                        <option value="">Select Group ID</option>
                        {groupList?.map((v, i) => {
                          return (
                            <option value={v?.group_id}>{v?.group_id}</option>
                          );
                        })}
                        {alreadrExistGroupList?.map((v, i) => {
                          return (
                            <option
                              style={{ background: "orange" }}
                              value={v?.group_id}
                            >
                              {v?.group_id} (Enroute Group)
                            </option>
                          );
                        })}
                      </select>
                      <div className="mt-4">
                        {manualAssignFormData.booking_id &&
                        manualAssignFormData?.group_id ? (
                          <button
                            className="shiftButton"
                            style={{ background: "#D0FF13", color: "#000" }}
                            onClick={
                              !moveBtnLoader && assignBookingToExistingGroup
                            }
                          >
                            {moveBtnLoader ? "Shifting ..." : "Shift"}{" "}
                          </button>
                        ) : (
                          <button
                            className="shiftButton"
                            style={{
                              background: "#D0FF13",
                              opacity: "0.5",
                              color: "#000",
                            }}
                          >
                            Shift
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="managepopupgroupleft mt-4 ms-2">
                      <div className="mb-3">
                        {unLinkLoader ? (
                          <button
                            className="shiftButton"
                            style={{
                              opacity: 0.5,
                              color: "#D0FF13",
                              backgroundColor: "#353535",
                            }}
                          >
                            Unlinking ...
                          </button>
                        ) : (
                          <button
                            className="shiftButton"
                            style={{
                              opacity: selectedBooking ? "1" : 0.5,
                              color: "#D0FF13",
                              backgroundColor: "#353535",
                            }}
                            onClick={() => handleUnlinkFunc()}
                          >
                            Unlink
                          </button>
                        )}
                      </div>
                      <div className="">
                        {cancelLoader ? (
                          <button
                            className="shiftButton"
                            style={{
                              opacity: 0.5,
                              color: "#D0FF13",
                              backgroundColor: "#353535",
                            }}
                          >
                            Cancelling ...
                          </button>
                        ) : (
                          <button
                            className="shiftButton"
                            style={{
                              opacity: selectedBooking ? "1" : 0.5,
                              color: "#D0FF13",
                              backgroundColor: "#353535",
                            }}
                            onClick={() => handleCancelFunc()}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                      {/* {manualPopupDetails.length == 1 && (
                        <div className="mt-3">
                          {switchLoader ? (
                            <button
                              className="shiftButton"
                              style={{
                                opacity: 0.5,
                                color: "#D0FF13",
                                backgroundColor: "#353535",
                              }}
                            >
                              Switching ...
                            </button>
                          ) : (
                            <button
                              className="shiftButton"
                              style={{
                                opacity: selectedBooking ? "1" : 0.5,
                                color: "#D0FF13",
                                backgroundColor: "#353535",
                              }}
                              onClick={() =>
                                selectedBooking && switchTimeSlotFunc()
                              }
                            >
                              Switch Time Slot
                            </button>
                          )}
                        </div>
                      )} */}
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-center mt-5">
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/660/660252.png"
                    style={{ height: "50px" }}
                    onClick={() => {
                      setManualPopupDetails(null);
                      setSelectedBooking(null);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {manualPopupDetails && <div className="modal-backdrop fade show"></div>}
      {userDetailsPopup && (
        <div
          className="modal fade show d-flex align-items-center   justify-content-center "
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content tipPopUp" style={{ width: "320px" }}>
              <div className="d-flex justify-content-center tipPopUpHeading">
                <p className="mb-0">User Details</p>
              </div>

              <div
                className="modal-body tipPopUpBody"
                style={{ padding: "20px" }}
              >
                <div
                  style={{
                    wordWrap: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                  className="d-flex justify-content-center w-100 "
                >
                  <div className="w-100">
                    <div className=" d-flex align-items-center userPopUpUserDetails">
                      <div>
                        <img src="https://cdn-icons-png.flaticon.com/128/16872/16872811.png" />
                      </div>
                      <div className="ms-2 ">
                        <h5>User ID :- {userDetailsPopup?.user_details?.id}</h5>
                        <p>
                          {userDetailsPopup?.user_details?.first_name +
                            " " +
                            userDetailsPopup?.user_details?.last_name}
                        </p>
                      </div>
                    </div>
                    <div className="userDetailsUl my-3">
                      <p>Email</p>
                      <h5>{userDetailsPopup?.user_details?.email}</h5>
                    </div>
                    <div className="userDetailsUl mb-3">
                      <p>Phone</p>
                      <div className="d-flex align-items-center">
                        <img src="https://cdn-icons-png.flaticon.com/128/14009/14009882.png" />

                        <h5 className="mb-0">
                          +{userDetailsPopup?.user_details?.country_code}{" "}
                          {userDetailsPopup?.user_details?.contact}
                        </h5>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between userPopupBtnGroup">
                      <button onClick={() => setUserDetailsPopup(null)}>
                        Close
                      </button>
                      <button
                        className="textWhite"
                        style={{ background: "#1C1C1E" }}
                        onClick={() => setUserDetailsPopup(null)}
                      >
                        Chat
                      </button>
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-center"></div>
              </div>
            </div>
          </div>
        </div>
      )}
      {userDetailsPopup && <div className="modal-backdrop fade show"></div>}
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
            selectedItem="Sharing Ride"
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
            selectedItem="Enroute"
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
                      <div className="col-md-3">
                        <div>
                          <Skeleton height={440} width="100%" />
                        </div>
                      </div>
                      <div className="col-md-9">
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
                    style={{ background: "#363435" }}
                  >
                    <div className=" row " style={{ borderRadius: "24px" }}>
                      <div className="col-md-5">
                        <div
                          className="leftCardRoute d-flex align-items-center w-100 px-3"
                          style={{
                            background: "#fff",
                            height: "260px",
                            borderRadius: "20px",
                          }}
                        >
                          <div className="w-100 row ">
                            <div className="col-4">
                              <img
                                className="mb-3"
                                style={{
                                  height: "80px",
                                  width: "80px",
                                  borderRadius: "50%",
                                }}
                                src={
                                  Image_Base_Url + value?.driverDetails?.image
                                }
                              />
                              <p style={{ color: "#000" }}>Driver Name</p>
                              <h3 style={{ color: "#000" }}>
                                {value?.driverDetails?.first_name}
                              </h3>
                              <p style={{ color: "#000" }}>Car Brand</p>
                              <h3 style={{ color: "#000" }}>
                                {value?.driverDetails?.vehicle_brand}
                              </h3>
                            </div>

                            <div className="col-8 row">
                              <div className="col-6">
                                <p style={{ color: "#000" }}>Car Model</p>
                                <h3
                                  className="mb-3"
                                  style={{ color: "#000", fontSize: "20px" }}
                                >
                                  {value?.driverDetails?.vehicle_name}
                                </h3>
                              </div>
                              <div className="col-6">
                                <p style={{ color: "#000" }}>Car Number</p>
                                <h3
                                  className="mb-3"
                                  style={{ color: "#000", fontSize: "20px" }}
                                >
                                  {value?.driverDetails?.vehicle_no}
                                </h3>
                              </div>
                              <div className="col-6">
                                <p style={{ color: "#000" }}>Car Color</p>
                                <h3
                                  className="mb-3"
                                  style={{ color: "#000", fontSize: "20px" }}
                                >
                                  {value?.driverDetails?.vehicle_colour}
                                </h3>
                              </div>
                              <div className="col-6">
                                <p style={{ color: "#000" }}>Driver Review</p>
                                {renderStarFunc(value?.driver_rating)}
                              </div>
                              <div className="col-12">
                                <div
                                  className="callButton"
                                  onClick={() => alert("Coming soon")}
                                >
                                  <img
                                    src="https://cdn-icons-png.flaticon.com/128/597/597177.png"
                                    style={{
                                      height: "20px",
                                      filter: "brightness(0) invert(1)",
                                    }}
                                  />
                                  <span
                                    style={{
                                      color: "white",
                                      fontSize: "14px",
                                      fontFamily: "poppins",
                                    }}
                                  >
                                    Call Now
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="leftCardRoute d-flex align-items-center w-100 mt-4"
                          style={{
                            background: "#D0FF13",
                            height: "200px",
                            borderRadius: "20px",
                          }}
                        >
                          <div className="w-100 ">
                            <div className="row">
                              <div className="col-4 mb-3">
                                <div className="d-flex justify-content-center">
                                  <div
                                    className="d-flex groupIdBtn mb-4 justify-content-center w-100  align-items-center"
                                    style={{ filter: "none" }}
                                  >
                                    <div className="d-flex justify-content-between w-100 px-4">
                                      <div>Group ID :- </div>
                                      <div className="ms-1">
                                        {value?.group_id}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-4 mb-3">
                                <p style={{ color: "#000" }}>Booking Date</p>
                                <h3 style={{ color: "#000" }}>
                                  {moment(value?.first_pickup_date).format(
                                    "DD-MM-YY"
                                  )}
                                </h3>
                              </div>
                              <div className="col-4 mb-3">
                                <p style={{ color: "#000" }}>Booking Time</p>
                                <h3 style={{ color: "#000" }}>
                                  {value?.first_pickup_time}
                                </h3>
                              </div>
                              <div className="col-4 mb-3">
                                <p style={{ color: "#000" }}>Total Trip Time</p>
                                <h3 style={{ color: "#000" }}>
                                  {moment
                                    .duration(value?.total_trip_time, "minutes")
                                    .hours()}{" "}
                                  hr{" "}
                                  {moment
                                    .duration(value?.total_trip_time, "minutes")
                                    .minutes()}{" "}
                                  min
                                </h3>
                              </div>

                              <div className="col-4 mb-3">
                                <p style={{ color: "#000" }}>Time Choice</p>
                                <h3 style={{ color: "#000" }}>
                                  {value?.time_choice == "pickupat"
                                    ? "Pick Up"
                                    : "Drop Off"}
                                </h3>
                              </div>

                              <div className="col-4">
                                <p style={{ color: "#000" }}>Payment</p>
                                <img
                                  onClick={() => setPaymentDetailsPopup(value)}
                                  src="/icons/eyeIcon.png"
                                  style={{ height: "20px" }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-7 row pe-0 me-0">
                        <div className="col-md-12">
                          <div
                            className="leftCardRoute d-flex align-items-center w-100"
                            style={{
                              background: "white",
                              height: "100px",
                              borderRadius: "20px",
                            }}
                          >
                            <div className="col-6">
                              <p style={{ color: "black" }}>Current Status</p>

                              <h3 style={{ color: "black" }}>
                                {value?.current_status}
                              </h3>
                            </div>
                            <div className="col-6">
                              <p style={{ color: "black" }}>Current Location</p>
                              <h3 style={{ color: "black" }}>
                                {value?.driver_last_location?.substring(0, 22)}
                                ...
                              </h3>
                            </div>
                          </div>
                        </div>
                        <div
                          className="col-md-12"
                          style={{
                            marginBottom: `${
                              value?.pickup_points?.length +
                              value?.dropoff_points?.length * -50
                            }px`,
                          }}
                        >
                          <div>
                            {value?.pickup_points?.map((v, i) => {
                              return (
                                <div
                                  className="halfTopCard"
                                  style={{
                                    top: `-${i * 42}px`,
                                    background: i % 2 != 0 ? "#000" : "#fff",
                                    borderRadius:
                                      i == 7 ? "31px" : "31px 31px 0px 0px",
                                    color: i % 2 != 0 ? " #fff" : "#000 ",
                                  }}
                                >
                                  <div className="d-flex justify-content-between px-4">
                                    <div className="d-flex align-items-center w-100 row">
                                      <p className="col-1 mb-auto">{i + 1}.</p>
                                      <p className="col-2 mb-auto">
                                        {v?.booking_id}
                                      </p>
                                      <p className="col-3 mb-auto">
                                        {v?.booking?.username}
                                      </p>
                                      <div
                                        className="col-3  mb-auto"
                                        style={{ padding: 0, minWidth: 0 }}
                                      >
                                        <p
                                          style={{
                                            margin: 0,
                                            overflowWrap: "break-word",
                                            wordBreak: "break-word",
                                            whiteSpace: "normal",
                                          }}
                                        >
                                          {v?.place_name}
                                        </p>
                                      </div>
                                      <p
                                        className="col-3 mb-auto"
                                        style={{ textAlign: "right" }}
                                      >
                                        {/* {v?.booking?.booking_time} */}
                                        {value?.time_choice == "pickupat"
                                          ? moment(
                                              v?.booking_time,
                                              "HH:mm"
                                            ).format("hh:mm A")
                                          : "--"}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                            {value?.dropoff_points?.map((v, i) => {
                              return (
                                <div
                                  className="halfTopCard"
                                  style={{
                                    top: `-${
                                      i * 42 + value?.pickup_points?.length * 42
                                    }px`,

                                    background:
                                      (value?.pickup_points?.length + i) % 2 !=
                                      0
                                        ? "#000"
                                        : "#fff",
                                    borderRadius:
                                      i == value?.dropoff_points?.length - 1
                                        ? "31px"
                                        : "31px 31px 0px 0px",
                                    color:
                                      (i + value?.pickup_points.length) % 2 != 0
                                        ? " #fff"
                                        : "#000 ",
                                  }}
                                >
                                  <div className="d-flex justify-content-between px-4">
                                    <div className="d-flex align-items-center w-100 row">
                                      <p className="col-1 mb-auto">
                                        {value?.pickup_points.length + i + 1}.
                                      </p>
                                      <p className="col-2 mb-auto">
                                        {v?.booking_id}
                                      </p>
                                      <p className="col-3 mb-auto">
                                        {v?.booking?.username}
                                      </p>
                                      <div
                                        className="col-3  mb-auto"
                                        style={{ padding: 0, minWidth: 0 }}
                                      >
                                        <p
                                          style={{
                                            margin: 0,
                                            overflowWrap: "break-word",
                                            wordBreak: "break-word",
                                            whiteSpace: "normal",
                                          }}
                                        >
                                          {v?.place_name}
                                        </p>
                                      </div>
                                      <p
                                        className="col-3 mb-auto"
                                        style={{ textAlign: "right" }}
                                      >
                                        {value?.time_choice == "dropoffby"
                                          ? moment(
                                              v?.booking_time,
                                              "HH:mm"
                                            ).format("hh:mm A")
                                          : "--"}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
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
                            ${paymentDetailsPopup?.total_driver_earning}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between px-2 mb-1">
                          <p>Admin Fee</p>
                          <span style={{ fontWeight: "500" }}>
                            ${paymentDetailsPopup?.total_admin_commission}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between px-2 mb-1">
                          <p>Surge Amount</p>
                          <span style={{ fontWeight: "500" }}>
                            ${paymentDetailsPopup?.total_extra_charge}
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

          {list?.length == 0 && !showSkelton && <NoRecordFound theme="dark" />}
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
    </div>
  );
}

export default SharingEnrouteBooking;
