import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/Sidebar";
import TopNav from "../../../components/TopNav";
import TableNav from "../../../components/TableNav";
import {
  getAcceptedBookingRecordServ,
  getBookingListForMnualAssign,
  assignBookingToExistingGroupServ,
  cancelSharingBookingServ,
  unlinkGroupServ,
  mergeBookingToExistingGroupServ,
} from "../../../services/bookingDashboard.services";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import moment from "moment";
import LocationTicket from "../../../components/LocationTicket";
import { useGlobalState } from "../../../GlobalProvider";
import {
  BASE_URL,
  Image_Base_Url,
} from "../../../utils/api_base_url_configration";
import NoRecordFound from "../../../components/NoRecordFound";
import Ably from "ably";
import { Tooltip } from "react-tooltip";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { updateNotificationStatusServ } from "../../../services/notification.services";
import { getNavItems } from "../../../utils/TopNavItemData/bookingDashboard";
import Pagination from "../../../components/Pagination";
import SecondaryTopNav from "../../../components/SecondaryTopNav";
import NewSidebar from "../../../components/NewSidebar";
import CustomTopNav from "../../../components/CustomTopNav";
import { toast } from "react-toastify";
import CustomPagination from "../../../components/CustomPazination";
function SharingAcceptedBooking() {
  const { setGlobalState, globalState } = useGlobalState();
  const [isSelectedInputSelect, setIsSelectedInputSelect] = useState("select");

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
  const [payload, setPayload] = useState({
    per_page: 10,
    page_no: 1,
    first_pickup_date: "",
  });
  const [pageData, setPageData] = useState({
    total_pages: "",
    current_page: "",
  });
  const [list, setList] = useState([]);
  const [tipForm, setTipForm] = useState({
    show: false,
    tip_status: "",
    booking_id: "",
    group_id: "",
    tip_amount: "",
  });
  const [cancelLoader, setCancelLoader] = useState(false);
  const [switchLoader, setSwitchLoader] = useState(false);
  const [unLinkLoader, setUnlinkLoader] = useState(false);
  const [showSkelton, setShowSkelton] = useState(false);
  const handleGetListFunc = async () => {
    if (list?.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await getAcceptedBookingRecordServ(payload);
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
          //  playNotificationSound();
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
          (v.category == "booking_accepted" ||
            v.category == "booking_rejected") &&
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
      page_no: 1,
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
  const [selectedBooking, setSelectedBooking] = useState();
  const [moveBtnLoader, setMoveBtnLoader] = useState(false);
  const assignBookingToExistingGroup = async () => {
    setMoveBtnLoader(true);

    try {
      let response;

      if (isSelectedInputSelect === "manual") {
        response = await mergeBookingToExistingGroupServ(manualAssignFormData);
      } else {
        response = await assignBookingToExistingGroupServ(manualAssignFormData);
      }

      if (response?.data?.statusCode === "200") {
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

        setManualAssignFormData({ booking_id: "", group_id: "" });
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

  const [manualAssignFormData, setManualAssignFormData] = useState({
    booking_id: "",
    group_id: "",
  });
  const [alreadrExistGroupList, setAlreadyExistGroupList] = useState([]);
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
  const switchTimeSlotFunc = async () => {
    try {
      setSwitchLoader(true);
      // alert(selectedBooking)
    } catch (error) {}
  };
  const openManualPopUp = (value) => {
    try {
      console.log(value);
      setManualPopupDetails(value);
    } catch (error) {}
  };
  return (
    <div className="mainBody">
      <NewSidebar selectedItem="Booking Dashboard" />
      <div className="contentLayout">
        <div className="bgWhite borderRadius30 p-4 minHeight100vh">
          <div className="sticky-top bgWhite">
            <CustomTopNav navItems={navItems} selectedNav="Sharing Ride" />
            <SecondaryTopNav
              navItems={tableNav}
              selectedNav="Accepted"
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
                              <div style={{ width: "160px" }}>
                                <h5>Source City</h5>
                                <h6>{value?.pickup_city}</h6>
                              </div>
                            </td>
                            <td>
                              <div style={{ width: "160px" }}>
                                <h5>Destination City</h5>
                                <h6>{value?.dropoff_city}</h6>
                              </div>
                            </td>
                            <td>
                              <div className="driverDetailsCard">
                                <p>
                                  Driver Name :{" "}
                                  <b>
                                    {value?.driverDetails?.first_name +
                                      " " +
                                      value?.driverDetails?.last_name}
                                  </b>
                                </p>
                                <button>
                                  <img src="https://cdn-icons-png.flaticon.com/128/89/89102.png" />
                                  <span>
                                    {value?.driverDetails?.vehicle_no}
                                  </span>
                                </button>
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
                          <div className="col-4">
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
                                <div className="col-4">
                                  <p style={{ color: "#000" }}>Time Choice</p>
                                  <h5 style={{ color: "#000" }}>
                                    {value?.time_choice == "pickupat"
                                      ? "Pick Up"
                                      : "Drop Off"}
                                  </h5>
                                </div>
                                <div className="col-4">
                                  <p>First Pickup Time</p>
                                  <h5>
                                    {moment(
                                      value?.first_pickup_time,
                                      "HH:mm"
                                    ).format("hh:mm A")}
                                  </h5>
                                </div>
                                <div className="col-4">
                                  <p>Payment</p>
                                  <img
                                    src="/imagefolder/eyeIcon.png"
                                    onClick={() =>
                                      setPaymentDetailsPopup(value)
                                    }
                                  />
                                </div>
                              </div>

                              <div className="row ">
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
                                  <button
                                    onClick={() => openManualPopUp(value)}
                                  >
                                    Manage
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-8">
                            {/* PICKUP POINTS */}
                            {value?.pickup_points?.map((v, i) => (
                              <LocationTicket
                                key={`pickup-${i}`}
                                i={i}
                                v={v}
                                value={value}
                                type="pickup"
                              />
                            ))}

                            {/* DROPOFF POINTS */}
                            {value?.dropoff_points?.map((v, i) => (
                              <LocationTicket
                                key={`drop-${i}`}
                                i={value?.pickup_points?.length + i} 
                                v={v}
                                value={value}
                                type="dropoff"
                              />
                            ))}
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
          className="modal fade show d-flex align-items-center justify-content-center"
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content paymentReceiptPopup">
              <div className="modal-body p-0">
                <div className="text-center mb-4">
                  <h3 className="popupTitle">Payment Receipt – Sharing Ride</h3>
                </div>

                <div className="px-3">
                  <div className="d-flex justify-content-between align-items-center mb-3 popupLine">
                    <p>No. of Person</p>
                    <h5>{paymentDetailsPopup?.total_number_of_people || 1}</h5>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-3 popupLine">
                    <p>Booking Amount per Person</p>
                    <h5>
                      $
                      {(paymentDetailsPopup?.total_trip_cost || 0) /
                        (paymentDetailsPopup?.total_number_of_people || 1)}
                    </h5>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-3 popupLine">
                    <p>HST (13%)</p>
                    <h5>{"N/A"}</h5>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-3 popupLine totalLine">
                    <p className="fw-bold">Total Amount</p>
                    <h5 className="fw-bold">
                      ${(paymentDetailsPopup?.total_trip_cost).toFixed(2)}
                    </h5>
                  </div>

                  <hr />

                  <div className="d-flex justify-content-between align-items-center mb-3 popupLine">
                    <p>Driver Commission</p>
                    <h5>${paymentDetailsPopup?.total_driver_earning || 0}</h5>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-3 popupLine">
                    <p>Driver HST (13%)</p>
                    <h5>{"N/A"}</h5>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-3 popupLine">
                    <p>Admin Commission</p>
                    <h5>${paymentDetailsPopup?.total_admin_commission || 0}</h5>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-3 popupLine">
                    <p>Admin HST (13%)</p>
                    <h5>{"N/A"}</h5>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-3 popupLine discountLine">
                    <p>Bonus Amount</p>
                    <h5>${paymentDetailsPopup?.tip_amount}</h5>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-3 popupLine discountLine">
                    <p>
                      Chaupehra Sahib <span>(50% Off)</span>
                    </p>
                    <h5>
                      $
                      {(paymentDetailsPopup?.total_location_discount).toFixed(
                        2
                      )}
                    </h5>
                  </div>

                  <hr />

                  <div className="d-flex justify-content-between align-items-center mb-3 popupLine finalLine">
                    <h4>Final Paid to Driver</h4>
                    <h4>
                      $
                      {(paymentDetailsPopup?.total_driver_earning || 0) +
                        (paymentDetailsPopup?.tip_amount || 0)}{" "}
                      {/* <span className="hstText">
                        +(HST $
                        {(
                          paymentDetailsPopup?.total_driver_earning * 0.13
                        ).toFixed(2)}
                        )
                      </span> */}
                    </h4>
                  </div>

                  <button className="payButton">Paid via Apple Pay</button>

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

      {manualPopupDetails && (
        <div
          className="modal fade show d-flex align-items-center justify-content-center"
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content managepopupgroup">
              <div className="modal-body p-0">
                <div className="row m-0 p-0">
                  {/* ---------- Left Section (List of Bookings) ---------- */}
                  <div className="col-8 m-0 p-0">
                    <div className="managepopupgroupleft me-3">
                      {manualPopupDetails?.pickup_points?.map((v, i) => (
                        <div
                          key={i}
                          className="d-flex justify-content-between align-items-center py-2 managePopUpTable"
                          style={{
                            background:
                              selectedBooking == v?.booking.id
                                ? "#353535"
                                : "#F7F7F7",
                          }}
                          onClick={() => fetchGroupId(v?.booking.id)}
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
                      ))}
                    </div>
                  </div>

                  {/* ---------- Right Section (Assign / Unlink / Cancel) ---------- */}
                  <div className="col-4 m-0 p-0">
                    <div className="managepopupgroupleft ms-2">
                      {/* 🔸 Radio + Select Group Option */}
                      <div className="d-flex align-items-center mb-3">
                        <input
                          type="radio"
                          name="groupInputType"
                          disabled={!selectedBooking}
                          checked={
                            selectedBooking &&
                            isSelectedInputSelect === "select"
                          }
                          onChange={() => {
                            if (!selectedBooking) return;
                            setIsSelectedInputSelect("select");
                            setManualAssignFormData({
                              ...manualAssignFormData,
                              group_id: "",
                            });
                          }}
                        />

                        <select
                          className="ms-2 form-select"
                          disabled={
                            !selectedBooking ||
                            isSelectedInputSelect !== "select"
                          }
                          style={{
                            opacity:
                              !selectedBooking ||
                              isSelectedInputSelect !== "select"
                                ? "0.5"
                                : "1",
                            background: "#F7F7F7",
                            borderRadius: "10px",
                            height: "40px",
                          }}
                          onChange={(e) =>
                            setManualAssignFormData({
                              ...manualAssignFormData,
                              group_id: e.target.value,
                            })
                          }
                        >
                          <option value="">Select Group ID</option>
                          {groupList?.map((v, i) => (
                            <option key={i} value={v?.group_id}>
                              {v?.group_id}
                            </option>
                          ))}
                          {alreadrExistGroupList?.map((v, i) => (
                            <option
                              key={`exist-${i}`}
                              style={{ background: "orange" }}
                              value={v?.group_id}
                            >
                              {v?.group_id} (Enroute Group)
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* 🔸 Radio + Manual Input Option */}
                      <div className="d-flex align-items-center">
                        <input
                          type="radio"
                          name="groupInputType"
                          disabled={!selectedBooking}
                          checked={
                            selectedBooking &&
                            isSelectedInputSelect === "manual"
                          }
                          onChange={() => {
                            if (!selectedBooking) return;
                            setIsSelectedInputSelect("manual");
                          }}
                        />

                        <input
                          type="number"
                          className="ms-2 form-control"
                          placeholder="Enter Group ID manually"
                          disabled={
                            !selectedBooking ||
                            isSelectedInputSelect !== "manual"
                          }
                          style={{
                            background: "#F7F7F7",
                            borderRadius: "10px",
                            height: "40px",
                          }}
                          min="1"
                          value={
                            isSelectedInputSelect === "manual"
                              ? manualAssignFormData?.group_id
                              : ""
                          }
                          onChange={(e) => {
                            const value = Number(e.target.value);

                            // Only allow positive integers greater than 0
                            if (value > 0) {
                              setManualAssignFormData({
                                ...manualAssignFormData,
                                group_id: value,
                              });
                            } else if (e.target.value === "") {
                              setManualAssignFormData({
                                ...manualAssignFormData,
                                group_id: "",
                              });
                            }
                          }}
                        />
                      </div>

                      {/* 🔸 Shift Button */}
                      <div className="mt-4">
                        {selectedBooking &&
                        manualAssignFormData?.group_id &&
                        manualAssignFormData.booking_id ? (
                          <button
                            className="shiftButton w-100"
                            style={{ background: "#D0FF13", color: "#000" }}
                            onClick={
                              !moveBtnLoader && assignBookingToExistingGroup
                            }
                          >
                            {moveBtnLoader ? "Shifting ..." : "Shift"}
                          </button>
                        ) : (
                          <button
                            className="shiftButton w-100"
                            disabled
                            style={{
                              background: "#D0FF13",
                              opacity: "0.5",
                              color: "#000",
                              cursor: "not-allowed",
                            }}
                          >
                            Shift
                          </button>
                        )}
                      </div>
                    </div>

                    {/* 🔸 Unlink / Cancel Buttons */}
                    <div className="managepopupgroupleft mt-4 ms-2">
                      <div className="mb-3">
                        <button
                          className="shiftButton"
                          disabled={!selectedBooking || unLinkLoader}
                          style={{
                            opacity: !selectedBooking || unLinkLoader ? 0.5 : 1,
                            color: "#D0FF13",
                            backgroundColor: "#353535",
                            cursor: !selectedBooking
                              ? "not-allowed"
                              : "pointer",
                          }}
                          onClick={() => selectedBooking && handleUnlinkFunc()}
                        >
                          {unLinkLoader ? "Unlinking ..." : "Unlink"}
                        </button>
                      </div>

                      <div>
                        <button
                          className="shiftButton"
                          disabled={!selectedBooking || cancelLoader}
                          style={{
                            opacity: !selectedBooking || cancelLoader ? 0.5 : 1,
                            color: "#D0FF13",
                            backgroundColor: "#353535",
                            cursor: !selectedBooking
                              ? "not-allowed"
                              : "pointer",
                          }}
                          onClick={() => selectedBooking && handleCancelFunc()}
                        >
                          {cancelLoader ? "Cancelling ..." : "Cancel"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ---------- Close Button ---------- */}
                <div className="d-flex justify-content-center mt-5">
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/660/660252.png"
                    style={{ height: "50px", cursor: "pointer" }}
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
            selectedItem="Accepted"
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
                          <Skeleton height={180} width="100%" />
                          <div className="py-2"></div>
                          <Skeleton height={250} width="100%" />
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
                    style={{ background: "#363435" }}
                  >
                    <div className=" row " style={{ borderRadius: "24px" }}>
                      <div className="col-md-5">
                        <div
                          className="leftCardRoute d-flex align-items-center w-100 px-5"
                          style={{
                            background: "#fff",
                            height: "230px",
                            borderRadius: "20px",
                          }}
                        >
                          <div className="w-100 d-flex justify-content-between align-items-center">
                            <div>
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
                            </div>
                            <div>
                              <p style={{ color: "#000" }}>
                                {value?.driverDetails?.vehicle_name}
                              </p>
                              <h3
                                className="mb-3"
                                style={{ color: "#000", fontSize: "20px" }}
                              >
                                {value?.driverDetails?.vehicle_no}
                              </h3>
                              <p style={{ color: "#000" }}>Driver Review</p>
                              {renderStarFunc(value?.driver_rating)}

                              <div
                                className="callButton mt-4"
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
                        <div
                          className="leftCardRoute d-flex align-items-center w-100 mt-4"
                          style={{
                            background: "#D0FF13",
                            height: "250px",
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
                                <p style={{ color: "#000" }}>Time Choice</p>
                                <h3 style={{ color: "#000" }}>
                                  {value?.time_choice == "pickupat"
                                    ? "Pick Up"
                                    : "Drop Off"}
                                </h3>
                              </div>
                              <div className="col-4">
                                <p style={{ color: "#000" }}>
                                  First Pickup Time
                                </p>
                                <h3 style={{ color: "#000" }}>
                                  {moment(
                                    value?.first_pickup_time,
                                    "HH:mm"
                                  ).format("hh:mm A")}
                                </h3>
                              </div>
                              <div className="col-4 mb-3">
                                <p style={{ color: "#000" }}>Booking Date</p>
                                <h3 style={{ color: "#000" }}>
                                  {moment(value?.first_pickup_date).format(
                                    "DD-MM-YY"
                                  )}
                                </h3>
                              </div>
                              <div className="col-8 mb-3">
                                <p style={{ color: "#000" }}>Assigned Time</p>
                                <h3 style={{ color: "#000" }}>
                                  {moment(value?.assign_time).format(
                                    "MMM DD YYYY (hh:mm A)"
                                  )}
                                </h3>
                              </div>
                              <div className="col-4 mb-3">
                                <p style={{ color: "#000" }}>Payment</p>
                                <img
                                  onClick={() => setPaymentDetailsPopup(value)}
                                  src="/icons/eyeIcon.png"
                                  style={{ height: "20px" }}
                                />
                              </div>
                              <div className="col-8 mb-3">
                                <p style={{ color: "#000" }}>Accept Time</p>
                                <h3 style={{ color: "#000" }}>
                                  {moment(value?.accept_time).format(
                                    "MMM DD YYYY (hh:mm A)"
                                  )}
                                </h3>
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
                                      className="col-3 d-flex mb-auto"
                                      style={{ padding: 0, minWidth: 0 }}
                                    >
                                      <img src="/icons/locationGreenIcon.png" />
                                      <p
                                        style={{
                                          margin: 0,
                                          overflowWrap: "break-word",
                                          wordBreak: "break-word",
                                          whiteSpace: "normal",
                                        }}
                                        className="ms-2"
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
                                            v?.booking?.booking_time,
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
                                    (value?.pickup_points?.length + i) % 2 != 0
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
                                      className="col-3 d-flex mb-auto"
                                      style={{ padding: 0, minWidth: 0 }}
                                    >
                                      <img src="/icons/locationRedIcon.png" />
                                      <p
                                        style={{
                                          margin: 0,
                                          overflowWrap: "break-word",
                                          wordBreak: "break-word",
                                          whiteSpace: "normal",
                                        }}
                                        className="ms-2"
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
                                            v?.booking?.booking_time,
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
                );
              })}
          {list?.length == 0 && !showSkelton && <NoRecordFound theme="dark" />}
          <Pagination
            current_page={pageData?.current_page}
            onPerPageChange={onPerPageChange}
            last_page={pageData?.total_pages}
            per_page={payload?.per_page}
            onPageChange={onPageChange}
          />
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
        {/* table List ended */}
      </section>
    </div>
  );
}
export default SharingAcceptedBooking;
