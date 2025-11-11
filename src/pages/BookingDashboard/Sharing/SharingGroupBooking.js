import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/Sidebar";
import TopNav from "../../../components/TopNav";
import TableNav from "../../../components/TableNav";
import {
  getGroupBookingRecordServ,
  createMannualOptimiseRouteServ,
  getBookingListForMnualAssign,
  assignBookingToExistingGroupServ,
  unlinkGroupServ,
  cancelSharingBookingServ,
  switchRideServ,
  getUpcomingDateServ,
  mergeBookingToExistingGroupServ,
  switchTimeRideServ,
} from "../../../services/bookingDashboard.services";
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
import NewSidebar from "../../../components/NewSidebar";
import CustomTopNav from "../../../components/CustomTopNav";
import CustomPagination from "../../../components/CustomPazination";
import SecondaryTopNav from "../../../components/SecondaryTopNav";
import { Image_Base_Url } from "../../../utils/api_base_url_configration";
function SharingGroupBooking() {
  const { setGlobalState, globalState } = useGlobalState();
  const [payload, setPayload] = useState({
    per_page: 10,
    page_no: 1,
    first_pickup_date: "",
    group_type: "",
    booking_date: "",
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
      let response = await getGroupBookingRecordServ(payload);
      if (response?.data?.statusCode == "200") {
        setList(response?.data?.data?.data);
        setPageData({
          total_pages: response?.data?.data?.last_page,
          current_page: response?.data?.data?.current_page,
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

    return () => {
      ably.close();
    };
  }, [payload]);
  const [showRoutePopupId, setShowRoutePopupId] = useState(null);
  const [buttonLoader, setButtonLoader] = useState();
  const createMannualOptimiseRouteFunc = async (group_id) => {
    setButtonLoader(group_id);
    try {
      let response = await createMannualOptimiseRouteServ({ group_id });
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        handleGetListFunc();
        setShowRoutePopupId(null);
      }
    } catch (error) {
      toast.error("Internal Server Erroe");
    }
    setButtonLoader();
  };
  const [manualPopupDetails, setManualPopupDetails] = useState(null);
  const openManualPopUp = (value) => {
    try {
      console.log(value);
      setManualPopupDetails(value);
    } catch (error) {}
  };
  const [groupList, setGroupList] = useState([]);
  const [alreadrExistGroupList, setAlreadyExistGroupList] = useState([]);
  const [manualAssignFormData, setManualAssignFormData] = useState({
    booking_id: "",
    group_id: "",
  });
  const [selectedBooking, setSelectedBooking] = useState();
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
  const [moveBtnLoader, setMoveBtnLoader] = useState(false);
  const assignBookingToExistingGroup = async () => {
    setMoveBtnLoader(true);
    try {
      let response;
      if (isSelectedInputSelect == "select") {
        response = await assignBookingToExistingGroupServ(manualAssignFormData);
      } else {
        response = await mergeBookingToExistingGroupServ(manualAssignFormData);
      }

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
      } else if (response?.data?.statusCod == "400") {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Internal Server Error");
      setMoveBtnLoader(false);
    }
    setMoveBtnLoader(false);
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
        return v.category == "new_booking" && v?.is_read == 0;
      })
      ?.map((v, i) => {
        updateNotificationStatusFunc(v?.id);
      });
  });
  const [paymentDetailsPopup, setPaymentDetailsPopup] = useState(null);
  const [userDetailsPopup, setUserDetailsPopup] = useState(null);
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

  const [cancelLoader, setCancelLoader] = useState(false);
  const [switchLoader, setSwitchLoader] = useState(false);
  const [unLinkLoader, setUnlinkLoader] = useState(false);

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
        setShowCancelPopup(false);
        handleGetListFunc();
      } else {
        toast.success(response?.data?.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
    setCancelLoader(false);
  };
  const handleUnlinkFunc = async () => {
    setUnlinkLoader(true);
    try {
      let response = await unlinkGroupServ({ booking_id: selectedBooking });
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        setManualPopupDetails(false);
        setSelectedBooking(null);
        handleGetListFunc();
        setShowUnlinkPopup(false);
      } else {
        toast.success(response?.data?.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
    setUnlinkLoader(false);
  };
  const [showSwitchPopupId, setShowSwitchPopupId] = useState(null);
  const [switchBtnLoader, setSwitchBtnLoader] = useState(null);
  const handleSwitchRideFunc = async (id) => {
    setSwitchBtnLoader(id);
    try {
      let response = await switchRideServ({ booking_id: id });
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        getDateListFunc();
        setShowSwitchPopupId(null);
      }
    } catch (error) {
      toast.error(error);
    }
    setSwitchBtnLoader(null);
  };
  const switchTimeSlotFunc = async () => {
    try {
      setSwitchLoader(true);
      // alert(selectedBooking)
    } catch (error) {}
  };
  const [tipForm, setTipForm] = useState({
    show: false,
    tip_status: "",
    booking_id: "",
    group_id: "",
    tip_amount: "",
  });
  const assignBookingToExistingGroupWithTip = async (tip_status) => {
    setMoveBtnLoader(true);
    try {
      let response = await assignBookingToExistingGroupServ({
        tip_status: tip_status,
        booking_id: tipForm.booking_id,
        group_id: tipForm.group_id,
      });

      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        handleGetListFunc();
        setTipForm({
          show: false,
          tip_status: "",
          booking_id: "",
          group_id: "",
          tip_amount: "",
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
  const decreaseTipAmountFunc = async (data) => {
    setMoveBtnLoader(true);
    try {
      let response = await assignBookingToExistingGroupServ({
        tip_status: data?.tip_status,
        booking_id: tipForm.booking_id,
        group_id: tipForm.group_id,
        decreas_amount: data?.decreas_amount,
      });

      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        handleGetListFunc();
        setTipForm({
          show: false,
          tip_status: "",
          booking_id: "",
          group_id: "",
          tip_amount: "",
          decreas_amount: "",
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
  const [decreaseTipAmount, setDecreaseTipAmount] = useState(0);
  const getDateListFunc = () => {
    const days = Array.from(
      { length: 14 },
      (_, i) => moment().add(i, "days").format("DD MMM") // e.g. "03 Oct"
    );
    return days;
  };
  const [upcomingDates, setUpcomingDates] = useState([]);
  const getUpcomingDateFunc = async () => {
    try {
      let response = await getUpcomingDateServ();
      if (response?.data?.statusCode == "200") {
        setUpcomingDates(response?.data?.data);
      }
    } catch (error) {}
  };
  useEffect(() => {
    getUpcomingDateFunc();
  }, []);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showUnlinkPopup, setShowUnlinkPopup] = useState(false);
  const [isSelectedInputSelect, setIsSelectedInputSelect] = useState("select");
  const [switchType, setSwitchType] = useState("personal");
  const [switchFormData, setSwitchFormData] = useState({
    booking_id: "",
    group_id: "",
    pickup_datetime: "",
    dropoff_datetime: "",
    show: false,
  });
  const [switchTimeLoader, setSwitchTimeLoader] = useState(false);
  const switchWithTimeFunc = async () => {
  setSwitchTimeLoader(true);
  try {
    // 🕒 Format date-times properly
    const formattedData = {
      ...switchFormData,
      
      pickup_datetime:
        switchFormData?.pickup_datetime?.replace("T", " ") + ":00",
      dropoff_datetime:
        switchFormData?.dropoff_datetime?.replace("T", " ") + ":00",
    };

    let response = await switchTimeRideServ(formattedData);

    if (response?.data?.statusCode == "200") {
      toast.success(response?.data?.message);

      // Reset form
      setSwitchFormData({
        booking_id: "",
        group_id: "",
        pickup_datetime: "",
        dropoff_datetime: "",
        show: false,
      
      });
    } else {
      toast.error("Something went wrong");
    }
  } catch (error) {
    toast.error(error?.response?.data?.message || "Something went wrong");
  }
  setSwitchTimeLoader(false);
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
              selectedNav="Current Group"
              navBg="#E5E5E5"
              navColor="#1C1C1C"
              selectedNavBg="#353535"
              selectedNavColor="#fff"
            />
            
          </div>
          <div className="tableOuterContainer bgDark mt-4">
            <div>
              <table className="table mb-0">
                {list?.length != 0 && !showSkelton && (
                  <>
                    <thead>
                      <tr className="bgSuccess">
                        <th
                          scope="col"
                          style={{ borderRadius: "25px 0px 0px 25px" }}
                        >
                          <div className="d-flex justify-content-center ">
                            <span className="mx-1">Sr. No</span>
                          </div>
                        </th>
                        <th scope="col">Group ID</th>
                        <th scope="col">Booking ID</th>
                        <th scope="col">Username</th>
                        <th scope="col" style={{ width: "120px" }}>
                          <div>Booking On</div>
                        </th>
                        <th
                          scope="col"
                          style={{ width: "120px", textAlign: "left" }}
                        >
                          Source
                        </th>
                        <th
                          scope="col"
                          style={{ width: "120px", textAlign: "left" }}
                        >
                          Destination
                        </th>
                        <th scope="col">Persons</th>
                        <th scope="col">Payment</th>
                        <th scope="col">Time Choice</th>
                        <th scope="col">Placed On</th>
                        <th
                          scope="col"
                          style={{ borderRadius: "0px 25px 25px 0px" }}
                        >
                          <span className="mx-2">Action</span>
                        </th>
                      </tr>
                    </thead>
                    <div className="pt-3 pb-2 "></div>
                  </>
                )}

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
                          <td>
                            <Skeleton width={70} />
                          </td>
                          <td>
                            <Skeleton width={70} />
                          </td>
                        </tr>
                      );
                    })
                  : list?.map((value, index) => {
                      return (
                        <>
                          <tbody className="bgWhite">
                            {value?.map((v, i) => {
                              return (
                                <tr className=" ">
                                  <td
                                    scope="row"
                                    style={{
                                      borderTopLeftRadius:
                                        i == 0 ? "20px" : "0px",
                                      borderBottomLeftRadius:
                                        i + 1 == value?.length ? "20px" : "0px",
                                    }}
                                  >
                                    {i == 0 &&
                                      index +
                                        1 +
                                        (pageData?.current_page - 1) * 10}
                                  </td>
                                  <td>
                                    {i == 0 && (
                                      <span
                                        style={{
                                          background: " #1C1C1E",
                                          color: "#D0FF13",
                                          borderRadius: "5px",
                                        }}
                                        className="px-3 py-1"
                                      >
                                        {" "}
                                        {v?.group_id}
                                      </span>
                                    )}
                                  </td>
                                  <td>{v?.id}</td>

                                  <td>
                                    <div
                                      className="userNameDiv"
                                      onClick={() => setUserDetailsPopup(v)}
                                    >
                                      <p className="mb-0 bgWhite text-dark radius3">
                                        ID:{v?.user_details?.id}
                                      </p>
                                      <p className="mb-0 text-light">
                                        {v?.user_details?.first_name}
                                      </p>
                                    </div>
                                  </td>
                                  <td>
                                    <div
                                      style={{
                                        background: " #D0FF13",
                                        color: "#1C1C1C",
                                        borderRadius: "5px",
                                        padding: "4px 6px",
                                        textAlign: "left",
                                      }}
                                    >
                                      <p className="mb-0">
                                        {moment(v?.booking_date).format(
                                          "DD MMM, YYYY"
                                        )}{" "}
                                      </p>
                                      <p className="mb-0">
                                        (
                                        {moment(
                                          v?.booking_time,
                                          "HH:mm"
                                        ).format("hh:mm A")}
                                        )
                                      </p>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="d-flex justify-content-center">
                                      <div
                                        style={{
                                          width: "100px",
                                          wordWrap: "break-word",
                                          whiteSpace: "pre-wrap",
                                          textAlign: "left",
                                        }}
                                      >
                                        {v?.source}
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="d-flex justify-content-center">
                                      <div
                                        style={{
                                          width: "100px",
                                          wordWrap: "break-word",
                                          whiteSpace: "pre-wrap",
                                          textAlign: "left",
                                        }}
                                      >
                                        {v?.destination}
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="d-flex justify-content-center align-items-center">
                                      <div
                                        style={{
                                          background: " #D0FF13",
                                          color: "#1C1C1C",
                                          borderRadius: "5px",
                                          padding: "4px",
                                          height: "30px",
                                          width: "40px",
                                        }}
                                      >
                                        <p
                                          className="mb-0 "
                                          style={{ marginTop: "3px" }}
                                        >
                                          {v?.number_of_people || 1}
                                        </p>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div
                                      onClick={() => setPaymentDetailsPopup(v)}
                                    >
                                      <img
                                        src="/imagefolder/eyeIcon.png"
                                        style={{ height: "20px" }}
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    {v?.time_choice == "pickupat"
                                      ? "Pickup"
                                      : " Dropoff"}
                                  </td>
                                  <td>
                                    <div className="d-flex justify-content-center">
                                      <div>
                                        <div style={{ textAlign: "left" }}>
                                          {moment(v?.created_at).format(
                                            "DD MMM, YYYY"
                                          )}
                                        </div>
                                        <div style={{ textAlign: "left" }}>
                                          {moment(v?.created_at).format(
                                            "hh:mm A"
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td
                                    style={{
                                      borderTopRightRadius:
                                        i == 0 ? "20px" : "0px",
                                      borderBottomRightRadius:
                                        i + 1 == value?.length ? "20px" : "0px",
                                    }}
                                  >
                                    <div className="d-flex justify-content-center ">
                                      {value?.length == 1 && i == 0 && (
                                        <div>
                                          <div
                                            className="py-2 mx-2 shadow "
                                            style={{
                                              background: "#353535",
                                              color: "#D0FF13",
                                              borderRadius: "5px",
                                              height: "30px",
                                              width: "90px",
                                              marginBottom: "5px",
                                              cursor: "pointer",
                                            }}
                                            onClick={() =>
                                              setShowRoutePopupId(v?.group_id)
                                            }
                                          >
                                            To Route
                                          </div>
                                          {v?.total_number_of_people == 1 && (
                                            <div
                                              className="py-2 mx-2 shadow "
                                              style={{
                                                background: "#353535",
                                                color: "#D0FF13",
                                                borderRadius: "5px",
                                                height: "30px",
                                                width: "90px",
                                                marginBottom: "5px",
                                                cursor: "pointer",
                                                opacity: "1",
                                              }}
                                              onClick={() =>
                                                setSwitchFormData({
                                                  ...switchFormData,
                                                  show: true,
                                                  booking_id: v?.id,
                                                  group_id: "",
                                                  
                                                })
                                              }
                                            >
                                              Switch Ride
                                            </div>
                                          )}

                                          <div
                                            className="py-2 mx-2 shadow "
                                            style={{
                                              background: "#353535",
                                              color: "#D0FF13",
                                              borderRadius: "5px",
                                              height: "30px",
                                              width: "90px",

                                              cursor: "pointer",
                                            }}
                                            onClick={() =>
                                              openManualPopUp(value)
                                            }
                                          >
                                            Manage
                                          </div>
                                        </div>
                                      )}
                                      {value?.length == 2 && i == 1 && (
                                        <div style={{ marginTop: "-55px" }}>
                                          <div
                                            className="py-2 mx-2 shadow "
                                            style={{
                                              background: "#353535",
                                              color: "#D0FF13",
                                              borderRadius: "5px",
                                              height: "30px",
                                              width: "90px",
                                              marginBottom: "5px",
                                              cursor: "pointer",
                                            }}
                                            onClick={() =>
                                              setShowRoutePopupId(v?.group_id)
                                            }
                                          >
                                            To Route
                                          </div>
                                          {v?.total_number_of_people == 1 && (
                                            <div
                                              className="py-2 mx-2 shadow "
                                              style={{
                                                background: "#353535",
                                                color: "#D0FF13",
                                                borderRadius: "5px",
                                                height: "30px",
                                                width: "90px",
                                                marginBottom: "5px",
                                                cursor: "pointer",
                                                opacity: "1",
                                              }}
                                              onClick={() =>
                                                setSwitchFormData({
                                                  ...switchFormData,
                                                  show: true,
                                                  booking_id: v?.id,
                                                  group_id: "",
                                                  
                                                })
                                              }
                                            >
                                              Switch Ride
                                            </div>
                                          )}

                                          <div
                                            className="py-2 mx-2 shadow "
                                            style={{
                                              background: "#353535",
                                              color: "#D0FF13",
                                              borderRadius: "5px",
                                              height: "30px",
                                              width: "90px",

                                              cursor: "pointer",
                                            }}
                                            onClick={() =>
                                              openManualPopUp(value)
                                            }
                                          >
                                            Manage
                                          </div>
                                        </div>
                                      )}
                                      {value?.length == 3 && i == 1 && (
                                        <div
                                          style={{
                                            marginTop: "-0px",
                                            marginBottom: "0px",
                                          }}
                                        >
                                          <div
                                            className="py-2 mx-2 shadow "
                                            style={{
                                              background: "#353535",
                                              color: "#D0FF13",
                                              borderRadius: "5px",
                                              height: "30px",
                                              width: "90px",
                                              marginBottom: "5px",
                                              cursor: "pointer",
                                              opacity:
                                                buttonLoader == v?.group_id
                                                  ? "0.5"
                                                  : "1",
                                            }}
                                            onClick={() =>
                                              setShowRoutePopupId(v?.group_id)
                                            }
                                          >
                                            To Route
                                          </div>
                                          {v?.total_number_of_people == 1 && (
                                            <div
                                              className="py-2 mx-2 shadow "
                                              style={{
                                                background: "#353535",
                                                color: "#D0FF13",
                                                borderRadius: "5px",
                                                height: "30px",
                                                width: "90px",
                                                marginBottom: "5px",
                                                cursor: "pointer",
                                                opacity: "1",
                                              }}
                                              onClick={() =>
                                                setSwitchFormData({
                                                  ...switchFormData,
                                                  show: true,
                                                  booking_id: v?.id,
                                                  group_id: "",
                                                
                                                })
                                              }
                                            >
                                              Switch Ride
                                            </div>
                                          )}

                                          <div
                                            className="py-2 mx-2 shadow "
                                            style={{
                                              background: "#353535",
                                              color: "#D0FF13",
                                              borderRadius: "5px",
                                              height: "30px",
                                              width: "90px",

                                              cursor: "pointer",
                                            }}
                                            onClick={() =>
                                              openManualPopUp(value)
                                            }
                                          >
                                            Manage
                                          </div>
                                        </div>
                                      )}
                                      {value?.length == 4 && i == 2 && (
                                        <div style={{ marginTop: "-55px" }}>
                                          <div
                                            className="py-2 mx-2 shadow "
                                            style={{
                                              background: "#353535",
                                              color: "#D0FF13",
                                              borderRadius: "5px",
                                              height: "30px",
                                              width: "90px",
                                              marginBottom: "5px",
                                              cursor: "pointer",
                                            }}
                                            onClick={() =>
                                              setShowRoutePopupId(v?.group_id)
                                            }
                                          >
                                            To Route
                                          </div>
                                          {v?.total_number_of_people == 1 && (
                                            <div
                                              className="py-2 mx-2 shadow "
                                              style={{
                                                background: "#353535",
                                                color: "#D0FF13",
                                                borderRadius: "5px",
                                                height: "30px",
                                                width: "90px",
                                                marginBottom: "5px",
                                                cursor: "pointer",
                                                opacity: "1",
                                              }}
                                              onClick={() =>
                                                setSwitchFormData({
                                                  ...switchFormData,
                                                  show: true,
                                                  booking_id: v?.id,
                                                  group_id: "",
                                                 
                                                })
                                              }
                                            >
                                              Switch Ride
                                            </div>
                                          )}

                                          <div
                                            className="py-2 mx-2 shadow "
                                            style={{
                                              background: "#353535",
                                              color: "#D0FF13",
                                              borderRadius: "5px",
                                              height: "30px",
                                              width: "90px",

                                              cursor: "pointer",
                                            }}
                                            onClick={() =>
                                              openManualPopUp(value)
                                            }
                                          >
                                            Manage
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                          {index + 1 != list?.length && (
                            <div className="mb-4"></div>
                          )}
                        </>
                      );
                    })}
              </table>

              {list.length == 0 && !showSkelton && (
                <NoRecordFound theme="dark" marginTop="0px" />
              )}
            </div>
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
                    <div className="paymentUserDetails d-flex align-items-center">
                      <div>
                        <img
                          src={
                            paymentDetailsPopup?.user_details?.image
                              ? Image_Base_Url +
                                paymentDetailsPopup?.user_details?.image
                              : "https://cdn-icons-png.flaticon.com/128/16872/16872811.png"
                          }
                        />
                      </div>
                      <div className="ms-2">
                        <h5>
                          User ID :- {paymentDetailsPopup?.user_details?.id}
                        </h5>
                        <p>
                          {paymentDetailsPopup?.user_details?.first_name +
                            " " +
                            paymentDetailsPopup?.user_details?.last_name}
                        </p>
                      </div>
                    </div>
                    <button className="textSuccess">
                      Booking ID :- {paymentDetailsPopup?.id}
                    </button>
                    <div className="paymentDetailsDiv">
                      <h5>Payment Receipt – Sharing Ride</h5>
                      <div className="d-flex justify-content-between">
                        <p>No. of Person </p>
                        <p style={{ fontWeight: "700", fontSize: "18px" }}>
                          {paymentDetailsPopup?.number_of_people}
                        </p>
                      </div>
                      <div className="d-flex justify-content-between">
                        <p>Booking Amount per Person</p>
                        <p style={{ fontWeight: "700", fontSize: "18px" }}>
                          {paymentDetailsPopup?.total_trip_cost /
                            paymentDetailsPopup?.number_of_people}
                        </p>
                      </div>
                      <div className="d-flex justify-content-between">
                        <p>HST (0%) </p>
                        <p style={{ fontWeight: "700", fontSize: "18px" }}>
                          N/A
                        </p>
                      </div>
                      <div className="d-flex justify-content-between">
                        <p>Location Discount</p>
                        <p style={{ fontWeight: "700", fontSize: "18px" }}>
                          {paymentDetailsPopup?.location_discount}
                        </p>
                      </div>
                      <div className="d-flex justify-content-between">
                        <p>Coupon Discount</p>
                        <p style={{ fontWeight: "700", fontSize: "18px" }}>
                          {paymentDetailsPopup?.coupon_amount}
                        </p>
                      </div>
                      <div className="d-flex justify-content-between">
                        <h6>Total Amount</h6>
                        <h6 style={{ fontSize: "18px" }}>
                          {paymentDetailsPopup?.total_trip_cost}
                        </h6>
                      </div>
                    </div>
                    <button>
                      Paid via {paymentDetailsPopup?.payment_method}
                    </button>
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
                      {manualPopupDetails?.map((v, i) => {
                        return (
                          <div
                            className="d-flex justify-content-between align-items-center  py-2 managePopUpTable"
                            style={{
                              background:
                                selectedBooking == v?.id
                                  ? "#353535"
                                  : "#F7F7F7",
                            }}
                            onClick={() => {
                              fetchGroupId(v.id);
                            }}
                          >
                            <div className="px-3">
                              <button
                                style={{
                                  background:
                                    selectedBooking == v?.id
                                      ? "#D0FF13"
                                      : "#000",
                                  color:
                                    selectedBooking == v?.id
                                      ? "#000"
                                      : "#D0FF13",
                                }}
                              >
                                Booking ID : {v?.id}
                              </button>
                            </div>
                            <div className="d-flex align-items-center px-3">
                              <img src="/imagefolder/locationGreenIcon.png" />
                              <p
                                className="ms-2"
                                style={{
                                  color:
                                    selectedBooking == v?.id
                                      ? "#fff"
                                      : "#1C1C1C",
                                }}
                              >
                                {v?.source}
                              </p>
                            </div>
                            <div className="d-flex align-items-center">
                              <img src="/imagefolder/locationRedIcon.png" />
                              <p
                                className="ms-2"
                                style={{
                                  color:
                                    selectedBooking == v?.id
                                      ? "#fff"
                                      : "#1C1C1C",
                                }}
                              >
                                {v?.destination}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="col-4 m-0 p-0">
                    <div className="managepopupgroupleft ms-2">
                      <div className="d-flex">
                        <input
                          type="radio"
                          name="groupInputType"
                          checked={isSelectedInputSelect === "select"}
                          onChange={() => {
                            setIsSelectedInputSelect("select");
                            setManualAssignFormData({
                              ...manualAssignFormData,
                              group_id: "",
                            });
                          }}
                        />
                        <select
                          className="ms-2 form-select"
                          disabled={isSelectedInputSelect !== "select"}
                          style={{
                            opacity:
                              isSelectedInputSelect === "select" ? "1" : "0.5",
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

                      <div className="d-flex mt-3">
                        <input
                          type="radio"
                          name="groupInputType"
                          checked={isSelectedInputSelect === "manual"}
                          onChange={() => setIsSelectedInputSelect("manual")}
                        />
                        <input
                          type="number"
                          className="ms-2 form-control"
                          placeholder="Enter Group ID manually"
                          disabled={isSelectedInputSelect !== "manual"}
                          style={{
                            background: "#F7F7F7",
                            borderRadius: "10px",
                            height: "40px",
                          }}
                          value={
                            isSelectedInputSelect == "manual"
                              ? manualAssignFormData?.group_id
                              : ""
                          }
                          onChange={(e) =>
                            setManualAssignFormData({
                              ...manualAssignFormData,
                              group_id: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="d-flex mt-4">
                        <div className="w-100 ">
                          {manualAssignFormData.booking_id &&
                          manualAssignFormData?.group_id ? (
                            <button
                              className="shiftButton w-100"
                              style={{ background: "#D0FF13", color: "#000" }}
                              onClick={
                                !moveBtnLoader && assignBookingToExistingGroup
                              }
                            >
                              {moveBtnLoader ? "Shifting ..." : "Shift"}{" "}
                            </button>
                          ) : (
                            <button
                              className="shiftButton w-100"
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
                    </div>
                    <div className="managepopupgroupleft mt-4 ms-2">
                      <div className="mb-3">
                        <button
                          className="shiftButton"
                          style={{
                            opacity: selectedBooking ? "1" : 0.5,
                            color: "#D0FF13",
                            backgroundColor: "#353535",
                          }}
                          onClick={() => {
                            setShowUnlinkPopup(true);
                            setManualPopupDetails(null);
                          }}
                        >
                          Unlink
                        </button>
                      </div>
                      <div className="">
                        <button
                          className="shiftButton"
                          style={{
                            opacity: selectedBooking ? "1" : 0.5,
                            color: "#D0FF13",
                            backgroundColor: "#353535",
                          }}
                          onClick={() => {
                            setShowCancelPopup(true);
                            setManualPopupDetails(null);
                          }}
                        >
                          Cancel
                        </button>
                      </div>
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
      {tipForm.show && (
        <div
          className="modal fade show d-flex align-items-center   justify-content-center "
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content tipPopUp">
              <div className="d-flex justify-content-center tipPopUpHeading">
                <p className="mb-0">Tip Confirmation</p>
              </div>

              <div className="modal-body tipPopUpBody">
                <div
                  style={{
                    wordWrap: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                  className="d-flex justify-content-center w-100 "
                >
                  <div className="w-100">
                    <p
                      className="text-center "
                      style={{ marginBottom: "40px" }}
                    >
                      Existing tip on this route: <b>$ {tipForm?.tip_amount}</b>
                    </p>

                    {buttonLoader ? (
                      <div
                        className="d-flex justify-content-center "
                        style={{ opacity: "0.5" }}
                      >
                        <button style={{ opacity: "0.5", color: "#1C1C1E" }}>
                          Keep
                        </button>
                      </div>
                    ) : (
                      <div className="d-flex justify-content-center">
                        <button
                          className="textDark"
                          style={{ color: "#1C1C1E" }}
                          onClick={() =>
                            assignBookingToExistingGroupWithTip("keep")
                          }
                        >
                          Keep
                        </button>
                      </div>
                    )}
                    <p style={{ marginTop: "10px", marginBottom: "30px" }}>
                      Total Driver Payout :{" "}
                      <b>
                        {parseInt(tipForm?.total_trip_amount || 0) +
                          parseInt(tipForm?.tip_amount || 0) +
                          parseInt(tipForm?.booking_driver_earning || 0) -
                          parseInt(decreaseTipAmount || 0)}
                      </b>
                    </p>
                    <div className="d-flex justify-content-center">
                      <button
                        className=" bg-dark"
                        style={{
                          opacity:
                            tipForm?.tip_amount < decreaseTipAmount
                              ? "0.5"
                              : "1",
                        }}
                        onClick={() =>
                          decreaseTipAmountFunc({
                            tip_status: "debit",
                            decreas_amount: decreaseTipAmount,
                          })
                        }
                      >
                        Change Tip
                      </button>
                    </div>
                    <div className="d-flex justify-content-center">
                      <input
                        className="form-control"
                        type="number"
                        max={tipForm?.tip_amount}
                        value={decreaseTipAmount}
                        onChange={(e) => setDecreaseTipAmount(e?.target.value)}
                        min={1}
                      />
                    </div>
                    {tipForm?.tip_amount < decreaseTipAmount && (
                      <small className="text-danger">
                        You can not descrease more than given tip amount
                      </small>
                    )}
                    <p>
                      Total Driver Payout :{" "}
                      <b>
                        {parseInt(tipForm?.total_trip_amount || 0) +
                          parseInt(tipForm?.tip_amount || 0) +
                          parseInt(tipForm?.booking_driver_earning || 0) -
                          parseInt(decreaseTipAmount || 0)}
                      </b>
                    </p>
                  </div>
                </div>
                <div className="d-flex justify-content-center"></div>
              </div>
            </div>
          </div>
        </div>
      )}
      {tipForm.show && <div className="modal-backdrop fade show"></div>}
      {showSwitchPopupId && (
        <div
          className="modal fade show d-flex align-items-center   justify-content-center "
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content routePopup">
              <div className="modal-body ">
                <div
                  style={{
                    wordWrap: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                  className="d-flex justify-content-center w-100 "
                >
                  <div className="w-100">
                    <div className="d-flex justify-content-center">
                      <img src="/imageFolder/switchIcon.png" />
                    </div>
                    <p>Switching to Personal</p>
                    <div className="routeButtonGroup d-flex justify-content-between w-100">
                      <button onClick={() => setShowSwitchPopupId(null)}>
                        No
                      </button>
                      {switchBtnLoader ? (
                        <button
                          className=" textWhite"
                          style={{ background: "#1C1C1C", opacity: 0.5 }}
                        >
                          Switching ...
                        </button>
                      ) : (
                        <button
                          className=" textWhite"
                          style={{ background: "#1C1C1C" }}
                          onClick={() =>
                            handleSwitchRideFunc(showSwitchPopupId)
                          }
                        >
                          Yes
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-center"></div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showSwitchPopupId && <div className="modal-backdrop fade show"></div>}
      {showRoutePopupId && (
        <div
          className="modal fade show d-flex align-items-center   justify-content-center "
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content routePopup">
              <div className="modal-body ">
                <div
                  style={{
                    wordWrap: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                  className="d-flex justify-content-center w-100 "
                >
                  <div className="w-100">
                    <div className="d-flex justify-content-center">
                      <img src="/imageFolder/routeIcon.png" />
                    </div>
                    <p>Send to Route</p>
                    <div className="routeButtonGroup d-flex justify-content-between w-100">
                      <button onClick={() => setShowRoutePopupId(null)}>
                        No
                      </button>
                      {buttonLoader ? (
                        <button
                          className=" textWhite"
                          style={{ background: "#1C1C1C", opacity: 0.5 }}
                        >
                          Sending ...
                        </button>
                      ) : (
                        <button
                          className=" textWhite"
                          style={{ background: "#1C1C1C" }}
                          onClick={() =>
                            createMannualOptimiseRouteFunc(showRoutePopupId)
                          }
                        >
                          Yes
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-center"></div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showRoutePopupId && <div className="modal-backdrop fade show"></div>}
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
                        <img
                          src={
                            userDetailsPopup?.user_details?.image
                              ? Image_Base_Url +
                                userDetailsPopup?.user_details?.image
                              : "https://cdn-icons-png.flaticon.com/128/16872/16872811.png"
                          }
                        />
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
      {switchFormData?.show && (
        <div
          className="modal fade show d-flex align-items-center   justify-content-center "
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content tipPopUp" style={{ width: "600px" }}>
              <div className="d-flex justify-content-center tipPopUpHeading">
                <p className="mb-0">Request User to Switch Ride</p>
              </div>

              <div
                className="modal-body tipPopUpBody routeRequest"
                style={{ padding: "20px 40px" }}
              >
                <div
                  style={{
                    wordWrap: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                  className="d-flex justify-content-center w-100 "
                >
                  <div className="w-100">
                    <p style={{ fontSize: "18px", fontWeight: "700" }}>
                      Select one option below to request the user to switch
                      their current ride
                    </p>
                    <div className="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="flexCheckDefault"
                        style={{ height: "20px", width: "20px" }}
                        checked={switchType === "personal"}
                        onChange={() =>
                          setSwitchType(
                            switchType === "personal" ? "" : "personal"
                          )
                        }
                      />
                      <p
                        className=" text-left "
                        style={{
                          fontSize: "16px",
                          position: "relative",
                          top: "13px",
                          fontWeight: "700",
                          textAlign: "left",
                        }}
                      >
                        Switch to Personal Ride
                      </p>
                    </div>
                    <div className="d-flex justify-content-center mt-4 mb-3">
                      {switchType == "personal" ? (
                        <button
                          className="bgDark textWhite"
                          onClick={() => {
                            setShowSwitchPopupId(
                              switchFormData?.booking_id
                            );
                            setSwitchFormData({
                              booking_id: "",
                              group_id: "",
                              pickup_datetime: "",
                              dropoff_datetime: "",
                              show: false,
                            
                            });
                          }}
                        >
                          Switch to Personal Ride
                        </button>
                      ) : (
                        <button
                          className="bgDark textWhite"
                          style={{ opacity: "0.5" }}
                        >
                          Switch to Personal Ride
                        </button>
                      )}
                    </div>
                    <p
                      className="mb-0"
                      style={{ fontSize: "20px", fontWeight: "700" }}
                    >
                      Or
                    </p>
                    <div className="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="flexCheckDefault"
                        style={{ height: "20px", width: "20px" }}
                        checked={switchType === "time"}
                        onChange={() =>
                          setSwitchType(switchType === "time" ? "" : "time")
                        }
                      />
                      <p
                        className=" text-left "
                        style={{
                          fontSize: "16px",
                          position: "relative",
                          top: "13px",
                          fontWeight: "700",
                          textAlign: "left",
                        }}
                      >
                        Suggest New Timings
                      </p>
                    </div>
                    <div className="mt-3">
                      <label className="mb-0">Group ID</label>
                      <input
                        className="form-control"
                        style={{ textAlign: "left" }}
                        onChange={(e) =>
                          setSwitchFormData({
                            ...switchFormData,
                            group_id: e?.target?.value,
                          })
                        }
                      />
                    </div>
                    <p
                      className=" text-left mb-0"
                      style={{
                        fontSize: "16px",
                        position: "relative",
                        top: "13px",
                        fontWeight: "700",
                        textAlign: "left",
                      }}
                    >
                      Enter the ideal timing below :
                    </p>
                    <div className="row">
                      <div className="mt-3 col-6">
                        <label className="mb-0">Pickup Date & Time</label>
                        <input
                          onChange={(e) =>
                            setSwitchFormData({
                              ...switchFormData,
                              pickup_datetime: e?.target?.value,
                            })
                          }
                          className="form-control"
                          type="datetime-local"
                          style={{ textAlign: "left" }}
                        />
                      </div>
                      <div className="mt-3 col-6">
                        <label className="mb-0">Drop-off Date & Time</label>
                        <input
                          onChange={(e) =>
                            setSwitchFormData({
                              ...switchFormData,
                              dropoff_datetime: e?.target?.value,
                            })
                          }
                          min={switchFormData?.pickup_datetime}
                          className="form-control "
                          type="datetime-local"
                          style={{ textAlign: "left" }}
                        />
                      </div>
                    </div>
                    <div className="d-flex justify-content-center mt-4 mb-3">
                      {switchType == "time" &&
                      switchFormData?.dropoff_datetime &&
                      switchFormData?.pickup_datetime &&
                      switchFormData?.group_id ? (
                        switchTimeLoader ? <button
                          className=" textDark"
                          style={{opacity:"0.5"}}
                        >
                         Sending request ...
                        </button>: <button
                          className=" textDark"
                          onClick={() => switchWithTimeFunc()}
                        >
                          Request for this Time
                        </button> 
                       
                      ) : (
                        <button
                          className=" textDark"
                          style={{ opacity: "0.5" }}
                        >
                          Request for this Time
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-center mt-2">
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/660/660252.png"
                    style={{ height: "50px" }}
                    onClick={() => {
                      setSelectedBooking(null);
                      setSwitchFormData({
                        booking_id: "",
                        group_id: "",
                        pickup_datetime: "",
                        dropoff_datetime: "",
                        show: false,
                        
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {switchFormData?.show && <div className="modal-backdrop fade show"></div>}
      {showCancelPopup && (
        <div
          className="modal fade show d-flex align-items-center   justify-content-center "
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content routePopup">
              <div className="modal-body ">
                <div
                  style={{
                    wordWrap: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                  className="d-flex justify-content-center w-100 "
                >
                  <div className="w-100">
                    <div className="d-flex justify-content-center">
                      <img src="https://cdn-icons-png.flaticon.com/128/15836/15836356.png" />
                    </div>
                    <p>Do you really want to cancel the booking ?</p>
                    <div className="routeButtonGroup d-flex justify-content-between w-100">
                      <button onClick={() => setShowCancelPopup(false)}>
                        No
                      </button>
                      {cancelLoader ? (
                        <button
                          className=" textWhite"
                          style={{ background: "#1C1C1C", opacity: 0.5 }}
                        >
                          Sending ...
                        </button>
                      ) : (
                        <button
                          className=" textWhite"
                          style={{ background: "#1C1C1C" }}
                          onClick={() => handleCancelFunc()}
                        >
                          Yes
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-center"></div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showCancelPopup && <div className="modal-backdrop fade show"></div>}
      {showUnlinkPopup && (
        <div
          className="modal fade show d-flex align-items-center   justify-content-center "
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content routePopup">
              <div className="modal-body ">
                <div
                  style={{
                    wordWrap: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                  className="d-flex justify-content-center w-100 "
                >
                  <div className="w-100">
                    <div className="d-flex justify-content-center">
                      <img
                        style={{ opacity: "0.7" }}
                        src="https://cdn-icons-png.flaticon.com/128/4662/4662575.png"
                      />
                    </div>
                    <p>Do you really want to unlink the booking ?</p>
                    <div className="routeButtonGroup d-flex justify-content-between w-100">
                      <button onClick={() => setShowUnlinkPopup(false)}>
                        No
                      </button>
                      {unLinkLoader ? (
                        <button
                          className=" textWhite"
                          style={{ background: "#1C1C1C", opacity: 0.5 }}
                        >
                          Unlinking ...
                        </button>
                      ) : (
                        <button
                          className=" textWhite"
                          style={{ background: "#1C1C1C" }}
                          onClick={() => handleUnlinkFunc()}
                        >
                          Yes
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-center"></div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showUnlinkPopup && <div className="modal-backdrop fade show"></div>}
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
            selectedItem="Group"
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
                    <th scope="col">Group ID</th>
                    <th scope="col">Booking ID</th>
                    <th scope="col">Username</th>
                    <th scope="col">Booking Date & Time</th>
                    <th scope="col">Source</th>
                    <th scope="col">Destination</th>
                    <th scope="col">Payment</th>
                    <th scope="col" style={{ width: "100px" }}>
                      Time Choice
                    </th>
                    <th scope="col">Booking Placed</th>
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
                          <td>
                            <Skeleton width={70} />
                          </td>
                        </tr>
                      );
                    })
                  : list?.map((value, index) => {
                      return (
                        <>
                          <tbody className="bg-light groupTab">
                            {value?.map((v, i) => {
                              return (
                                <tr className=" ">
                                  <td
                                    scope="row"
                                    style={{
                                      borderTopLeftRadius:
                                        i == 0 ? "24px" : "0px",
                                      borderBottomLeftRadius:
                                        i + 1 == value?.length ? "24px" : "0px",
                                    }}
                                  >
                                    {i == 0 &&
                                      index +
                                        1 +
                                        (pageData?.current_page - 1) * 10}
                                  </td>
                                  <td>
                                    {i == 0 && (
                                      <span
                                        style={{
                                          background: " #1C1C1E",
                                          color: "#D0FF13",
                                          borderRadius: "5px",
                                        }}
                                        className="px-3 py-1"
                                      >
                                        {" "}
                                        {v?.group_id}
                                      </span>
                                    )}
                                  </td>
                                  <td>{v?.id}</td>

                                  <td>{v?.user_details?.first_name}</td>
                                  <td>
                                    <span
                                      style={{
                                        background: " #D0FF13",
                                        color: "#1C1C1C",
                                        borderRadius: "5px",
                                        padding: "4px",
                                      }}
                                    >
                                      {moment(v?.booking_date).format(
                                        "DD MMM, YYYY"
                                      )}{" "}
                                      (
                                      {moment(v?.booking_time, "HH:mm").format(
                                        "hh:mm A"
                                      )}
                                      )
                                    </span>
                                  </td>
                                  <td>
                                    <div
                                      style={{
                                        width: "120px",
                                        wordWrap: "break-word",
                                        whiteSpace: "pre-wrap",
                                      }}
                                    >
                                      {v?.source}
                                    </div>
                                  </td>
                                  <td>
                                    <div
                                      style={{
                                        width: "120px",
                                        wordWrap: "break-word",
                                        whiteSpace: "pre-wrap",
                                      }}
                                    >
                                      {v?.destination}
                                    </div>
                                  </td>

                                  <td>
                                    <div
                                      onClick={() => setPaymentDetailsPopup(v)}
                                    >
                                      <img
                                        src="/icons/eyeIcon.png"
                                        style={{ height: "20px" }}
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    {v?.time_choice == "pickupat"
                                      ? "Pickup"
                                      : " Dropoff"}
                                  </td>
                                  <td>
                                    <div>
                                      {moment(v?.created_at).format(
                                        "DD MMM, YYYY"
                                      )}
                                    </div>
                                    <div>
                                      {moment(v?.created_at).format("hh:mm A")}
                                    </div>
                                  </td>
                                  <td
                                    style={{
                                      borderTopRightRadius:
                                        i == 0 ? "24px" : "0px",
                                      borderBottomRightRadius:
                                        i + 1 == value?.length ? "24px" : "0px",
                                    }}
                                  >
                                    <div className="d-flex justify-content-center ">
                                      {value?.length == 1 && i == 0 && (
                                        <div style={{ marginTop: "0px" }}>
                                          <div
                                            onClick={() =>
                                              createMannualOptimiseRouteFunc(
                                                v?.group_id
                                              )
                                            }
                                            style={{
                                              background: "#353535",
                                              border: "none",
                                              width: "90px",
                                              opacity:
                                                buttonLoader == v?.group_id
                                                  ? "0.5"
                                                  : "1",
                                            }}
                                            className="btn btn-primary shadow btnHeight25 d-flex justify-content-center align-items-center"
                                          >
                                            <span
                                              style={{
                                                marginLeft: "6px",
                                                color: "#D0FF13",
                                                fontSize: "12px",
                                              }}
                                            >
                                              {buttonLoader == v?.group_id
                                                ? "Sending ..."
                                                : "To Route"}{" "}
                                            </span>
                                          </div>

                                          <div
                                            onClick={() =>
                                              switchBtnLoader != v?.id &&
                                              handleSwitchRideFunc(v?.id)
                                            }
                                            style={{
                                              background: "#353535",
                                              border: "none",
                                              width: "90px",
                                              opacity:
                                                switchBtnLoader == v?.id
                                                  ? " 0.5"
                                                  : "1",
                                            }}
                                            className="btn btn-primary shadow btnHeight25 d-flex justify-content-center align-items-center"
                                          >
                                            <span
                                              style={{
                                                marginLeft: "6px",
                                                color: "#D0FF13",
                                                fontSize: "12px",
                                              }}
                                            >
                                              {switchBtnLoader == v?.id
                                                ? "Loading ..."
                                                : "Switch Ride"}
                                            </span>
                                          </div>

                                          <div
                                            onClick={() =>
                                              openManualPopUp(value)
                                            }
                                            style={{
                                              background: "#353535",
                                              border: "none",
                                              width: "90px",
                                            }}
                                            className="btn btn-primary shadow btnHeight25 d-flex justify-content-center align-items-center"
                                          >
                                            <span
                                              style={{
                                                marginLeft: "6px",
                                                color: "#D0FF13",
                                                fontSize: "12px",
                                              }}
                                            >
                                              Manage
                                            </span>
                                          </div>
                                        </div>
                                      )}
                                      {value?.length == 2 && i == 1 && (
                                        <div style={{ marginTop: "-55px" }}>
                                          <div
                                            onClick={() =>
                                              createMannualOptimiseRouteFunc(
                                                v?.group_id
                                              )
                                            }
                                            style={{
                                              background: "#353535",
                                              border: "none",
                                              width: "90px",
                                              opacity:
                                                buttonLoader == v?.group_id
                                                  ? "0.5"
                                                  : "1",
                                            }}
                                            className="btn btn-primary shadow btnHeight25 d-flex justify-content-center align-items-center"
                                          >
                                            <span
                                              style={{
                                                marginLeft: "6px",
                                                color: "#D0FF13",
                                                fontSize: "12px",
                                              }}
                                            >
                                              {buttonLoader == v?.group_id
                                                ? "Sending ..."
                                                : "To Route"}{" "}
                                            </span>
                                          </div>

                                          <div
                                            onClick={() =>
                                              switchBtnLoader != v?.id &&
                                              handleSwitchRideFunc(v?.id)
                                            }
                                            style={{
                                              background: "#353535",
                                              border: "none",
                                              width: "90px",
                                              opacity:
                                                switchBtnLoader == v?.id
                                                  ? " 0.5"
                                                  : "1",
                                            }}
                                            className="btn btn-primary shadow btnHeight25 d-flex justify-content-center align-items-center"
                                          >
                                            <span
                                              style={{
                                                marginLeft: "6px",
                                                color: "#D0FF13",
                                                fontSize: "12px",
                                              }}
                                            >
                                              {switchBtnLoader == v?.id
                                                ? "Loading ..."
                                                : "Switch Ride"}
                                            </span>
                                          </div>

                                          <div
                                            onClick={() =>
                                              openManualPopUp(value)
                                            }
                                            style={{
                                              background: "#353535",
                                              border: "none",
                                              width: "90px",
                                            }}
                                            className="btn btn-primary shadow btnHeight25 d-flex justify-content-center align-items-center"
                                          >
                                            <span
                                              style={{
                                                marginLeft: "6px",
                                                color: "#D0FF13",
                                                fontSize: "12px",
                                              }}
                                            >
                                              Manage
                                            </span>
                                          </div>
                                        </div>
                                      )}
                                      {value?.length == 3 && i == 1 && (
                                        <div
                                          style={{
                                            marginTop: "-30px",
                                            marginBottom: "-30px",
                                          }}
                                        >
                                          <div
                                            onClick={() =>
                                              createMannualOptimiseRouteFunc(
                                                v?.group_id
                                              )
                                            }
                                            style={{
                                              background: "#353535",
                                              border: "none",
                                              width: "90px",
                                              opacity:
                                                buttonLoader == v?.group_id
                                                  ? "0.5"
                                                  : "1",
                                            }}
                                            className="btn btn-primary shadow btnHeight25 d-flex justify-content-center align-items-center"
                                          >
                                            <span
                                              style={{
                                                marginLeft: "6px",
                                                color: "#D0FF13",
                                                fontSize: "12px",
                                              }}
                                            >
                                              {buttonLoader == v?.group_id
                                                ? "Sending ..."
                                                : "To Route"}{" "}
                                            </span>
                                          </div>

                                          <div
                                            onClick={() =>
                                              switchBtnLoader != v?.id &&
                                              handleSwitchRideFunc(v?.id)
                                            }
                                            style={{
                                              background: "#353535",
                                              border: "none",
                                              width: "90px",
                                              opacity:
                                                switchBtnLoader == v?.id
                                                  ? " 0.5"
                                                  : "1",
                                            }}
                                            className="btn btn-primary shadow btnHeight25 d-flex justify-content-center align-items-center"
                                          >
                                            <span
                                              style={{
                                                marginLeft: "6px",
                                                color: "#D0FF13",
                                                fontSize: "12px",
                                              }}
                                            >
                                              {switchBtnLoader == v?.id
                                                ? "Loading ..."
                                                : "Switch Ride"}
                                            </span>
                                          </div>

                                          <div
                                            onClick={() =>
                                              openManualPopUp(value)
                                            }
                                            style={{
                                              background: "#353535",
                                              border: "none",
                                              width: "90px",
                                            }}
                                            className="btn btn-primary shadow btnHeight25 d-flex justify-content-center align-items-center"
                                          >
                                            <span
                                              style={{
                                                marginLeft: "6px",
                                                color: "#D0FF13",
                                                fontSize: "12px",
                                              }}
                                            >
                                              Manage
                                            </span>
                                          </div>
                                        </div>
                                      )}
                                      {value?.length == 4 && i == 2 && (
                                        <div
                                          style={{
                                            marginTop: "-55px",
                                            marginBottom: "-55px",
                                          }}
                                        >
                                          <div
                                            onClick={() =>
                                              createMannualOptimiseRouteFunc(
                                                v?.group_id
                                              )
                                            }
                                            style={{
                                              background: "#353535",
                                              border: "none",
                                              width: "90px",
                                              opacity:
                                                buttonLoader == v?.group_id
                                                  ? "0.5"
                                                  : "1",
                                            }}
                                            className="btn btn-primary shadow btnHeight25 d-flex justify-content-center align-items-center"
                                          >
                                            <span
                                              style={{
                                                marginLeft: "6px",
                                                color: "#D0FF13",
                                                fontSize: "12px",
                                              }}
                                            >
                                              {buttonLoader == v?.group_id
                                                ? "Sending ..."
                                                : "To Route"}{" "}
                                            </span>
                                          </div>

                                          <div
                                            onClick={() =>
                                              switchBtnLoader != v?.id &&
                                              handleSwitchRideFunc(v?.id)
                                            }
                                            style={{
                                              background: "#353535",
                                              border: "none",
                                              width: "90px",
                                              opacity:
                                                switchBtnLoader == v?.id
                                                  ? " 0.5"
                                                  : "1",
                                            }}
                                            className="btn btn-primary shadow btnHeight25 d-flex justify-content-center align-items-center"
                                          >
                                            <span
                                              style={{
                                                marginLeft: "6px",
                                                color: "#D0FF13",
                                                fontSize: "12px",
                                              }}
                                            >
                                              {switchBtnLoader == v?.id
                                                ? "Loading ..."
                                                : "Switch Ride"}
                                            </span>
                                          </div>

                                          <div
                                            onClick={() =>
                                              openManualPopUp(value)
                                            }
                                            style={{
                                              background: "#353535",
                                              border: "none",
                                              width: "90px",
                                            }}
                                            className="btn btn-primary shadow btnHeight25 d-flex justify-content-center align-items-center"
                                          >
                                            <span
                                              style={{
                                                marginLeft: "6px",
                                                color: "#D0FF13",
                                                fontSize: "12px",
                                              }}
                                            >
                                              Manage
                                            </span>
                                          </div>
                                        </div>
                                      )}
                                      {value?.length == 5 && i == 2 && (
                                        <div
                                          style={{
                                            marginTop: "-30px",
                                            marginBottom: "-30px",
                                          }}
                                        >
                                          <div
                                            onClick={() =>
                                              createMannualOptimiseRouteFunc(
                                                v?.group_id
                                              )
                                            }
                                            style={{
                                              background: "#353535",
                                              border: "none",
                                              width: "90px",
                                              opacity:
                                                buttonLoader == v?.group_id
                                                  ? "0.5"
                                                  : "1",
                                            }}
                                            className="btn btn-primary shadow btnHeight25 d-flex justify-content-center align-items-center"
                                          >
                                            <span
                                              style={{
                                                marginLeft: "6px",
                                                color: "#D0FF13",
                                                fontSize: "12px",
                                              }}
                                            >
                                              {buttonLoader == v?.group_id
                                                ? "Sending ..."
                                                : "To Route"}{" "}
                                            </span>
                                          </div>

                                          <div
                                            onClick={() =>
                                              switchBtnLoader != v?.id &&
                                              handleSwitchRideFunc(v?.id)
                                            }
                                            style={{
                                              background: "#353535",
                                              border: "none",
                                              width: "90px",
                                              opacity:
                                                switchBtnLoader == v?.id
                                                  ? " 0.5"
                                                  : "1",
                                            }}
                                            className="btn btn-primary shadow btnHeight25 d-flex justify-content-center align-items-center"
                                          >
                                            <span
                                              style={{
                                                marginLeft: "6px",
                                                color: "#D0FF13",
                                                fontSize: "12px",
                                              }}
                                            >
                                              {switchBtnLoader == v?.id
                                                ? "Loading ..."
                                                : "Switch Ride"}
                                            </span>
                                          </div>

                                          <div
                                            onClick={() =>
                                              openManualPopUp(value)
                                            }
                                            style={{
                                              background: "#353535",
                                              border: "none",
                                              width: "90px",
                                            }}
                                            className="btn btn-primary shadow btnHeight25 d-flex justify-content-center align-items-center"
                                          >
                                            <span
                                              style={{
                                                marginLeft: "6px",
                                                color: "#D0FF13",
                                                fontSize: "12px",
                                              }}
                                            >
                                              Manage
                                            </span>
                                          </div>
                                        </div>
                                      )}
                                      {value?.length == 6 && i == 3 && (
                                        <div style={{ marginTop: "-80px" }}>
                                          <div
                                            onClick={() =>
                                              createMannualOptimiseRouteFunc(
                                                v?.group_id
                                              )
                                            }
                                            style={{
                                              background: "#353535",
                                              border: "none",
                                              width: "90px",
                                              opacity:
                                                buttonLoader == v?.group_id
                                                  ? "0.5"
                                                  : "1",
                                            }}
                                            className="btn btn-primary shadow btnHeight25 d-flex justify-content-center align-items-center"
                                          >
                                            <span
                                              style={{
                                                marginLeft: "6px",
                                                color: "#D0FF13",
                                                fontSize: "12px",
                                              }}
                                            >
                                              {buttonLoader == v?.group_id
                                                ? "Sending ..."
                                                : "To Route"}{" "}
                                            </span>
                                          </div>

                                          <div
                                            onClick={() =>
                                              switchBtnLoader != v?.id &&
                                              handleSwitchRideFunc(v?.id)
                                            }
                                            style={{
                                              background: "#353535",
                                              border: "none",
                                              width: "90px",
                                              opacity:
                                                switchBtnLoader == v?.id
                                                  ? " 0.5"
                                                  : "1",
                                            }}
                                            className="btn btn-primary shadow btnHeight25 d-flex justify-content-center align-items-center"
                                          >
                                            <span
                                              style={{
                                                marginLeft: "6px",
                                                color: "#D0FF13",
                                                fontSize: "12px",
                                              }}
                                            >
                                              {switchBtnLoader == v?.id
                                                ? "Loading ..."
                                                : "Switch Ride"}
                                            </span>
                                          </div>

                                          <div
                                            onClick={() =>
                                              openManualPopUp(value)
                                            }
                                            style={{
                                              background: "#353535",
                                              border: "none",
                                              width: "90px",
                                            }}
                                            className="btn btn-primary shadow btnHeight25 d-flex justify-content-center align-items-center"
                                          >
                                            <span
                                              style={{
                                                marginLeft: "6px",
                                                color: "#D0FF13",
                                                fontSize: "12px",
                                              }}
                                            >
                                              Manage
                                            </span>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                          <div className="mb-4"></div>
                        </>
                      );
                    })}
              </table>
              {list?.length == 0 && !showSkelton && (
                <NoRecordFound theme="light" removeMarginTop={true} />
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
      {/* sectionLayout ended */}
      {manualPopupDetails && (
        <div
          className="modal fade show d-flex align-items-center manualSetPopup  justify-content-center "
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content managepopupgroup">
              <div className="modal-body">
                <div className="row">
                  <div className="col-8">
                    <div className="managepopupgroupleft">
                      {manualPopupDetails?.map((v, i) => {
                        return (
                          <div
                            className="d-flex justify-content-between align-items-center mb-3 py-3 px-4"
                            style={{
                              background:
                                selectedBooking == v?.id
                                  ? "#353535"
                                  : "#F7F7F7",
                              borderRadius: "20px",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              fetchGroupId(v.id);
                            }}
                          >
                            <div>
                              <button
                                style={{
                                  background:
                                    selectedBooking == v?.id
                                      ? "#D0FF13"
                                      : "#000",
                                  color:
                                    selectedBooking == v?.id
                                      ? "#000"
                                      : "#D0FF13",
                                }}
                              >
                                Booking ID : {v?.id}
                              </button>
                            </div>
                            <div className="d-flex align-items-center">
                              <img src="/icons/locationGreenIcon.png" />
                              <p
                                className="ms-2"
                                style={{
                                  color:
                                    selectedBooking == v?.id
                                      ? "#fff"
                                      : "#1C1C1C",
                                }}
                              >
                                {v?.source}
                              </p>
                            </div>
                            <div className="d-flex align-items-center">
                              <img src="/icons/locationRedIcon.png" />
                              <p
                                className="ms-2"
                                style={{
                                  color:
                                    selectedBooking == v?.id
                                      ? "#fff"
                                      : "#1C1C1C",
                                }}
                              >
                                {v?.destination}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="managepopupgroupleft">
                      <select
                        style={{ opacity: groupList.length > 0 ? "1" : "0.5" }}
                        onChange={(e) =>
                          setManualAssignFormData({
                            ...manualAssignFormData,
                            group_id: e.target.value,
                          })
                        }
                      >
                        <option value="">Group ID</option>
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
                      <div className="mt-5">
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
                    <div className="managepopupgroupleft mt-4">
                      <div className="mb-3">
                        {unLinkLoader ? (
                          <button
                            className="shiftButton"
                            style={{
                              opacity: 0.5,
                              color: "#D0FF13",
                              backgroundColor: "#000",
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
                              backgroundColor: "#000",
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
                              backgroundColor: "#000",
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
                              backgroundColor: "#000",
                            }}
                            onClick={() => handleCancelFunc()}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                      {manualPopupDetails.length == 1 && (
                        <div className="mt-3">
                          {switchLoader ? (
                            <button
                              className="shiftButton"
                              style={{
                                opacity: 0.5,
                                color: "#D0FF13",
                                backgroundColor: "#000",
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
                                backgroundColor: "#000",
                              }}
                              onClick={() =>
                                selectedBooking && switchTimeSlotFunc()
                              }
                            >
                              Switch Time Slot
                            </button>
                          )}
                        </div>
                      )}
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
      {tipForm?.show && (
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
                  <u>Confirm Tip Status</u>
                </p>
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
                  <div className="w-100">
                    <p className="text-center">
                      You have added a tip amount of{" "}
                      <b>$ {tipForm?.tip_amount}</b> for the booking.
                    </p>
                    <p className="text-center">
                      Before Moving further please confirm !
                    </p>
                    {buttonLoader ? (
                      <div className="d-flex" style={{ opacity: "0.5" }}>
                        <button className="me-2" style={{ opacity: "0.5" }}>
                          Keep
                        </button>
                      </div>
                    ) : (
                      <div className="d-flex">
                        <button
                          className="me-2"
                          onClick={() =>
                            assignBookingToExistingGroupWithTip("keep")
                          }
                        >
                          Keep
                        </button>
                      </div>
                    )}
                    <div className="mt-3">
                      <label>Decrease Tip Amount </label>
                      <input
                        className="form-control"
                        type="number"
                        max={tipForm?.tip_amount}
                        value={decreaseTipAmount}
                        onChange={(e) => setDecreaseTipAmount(e?.target.value)}
                      />
                      {tipForm?.tip_amount < decreaseTipAmount && (
                        <small className="text-danger">
                          You can not descrease more than given tip amount
                        </small>
                      )}
                      <button
                        className="mt-2 bg-dark"
                        style={{
                          opacity:
                            tipForm?.tip_amount < decreaseTipAmount
                              ? "0.5"
                              : "1",
                        }}
                        onClick={() =>
                          decreaseTipAmountFunc({
                            tip_status: "debit",
                            decreas_amount: decreaseTipAmount,
                          })
                        }
                      >
                        Decrease
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
      {tipForm.show && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}

export default SharingGroupBooking;
