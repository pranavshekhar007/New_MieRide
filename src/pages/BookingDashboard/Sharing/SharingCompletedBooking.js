import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/Sidebar";
import TopNav from "../../../components/TopNav";
import TableNav from "../../../components/TableNav";
import {
  getCompletedBookingRecordServ,
  getCompletedBookingRecordServFlatedArray,
} from "../../../services/bookingDashboard.services";
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
import NewSidebar from "../../../components/NewSidebar";
import SecondaryTopNav from "../../../components/SecondaryTopNav";
import CustomTopNav from "../../../components/CustomTopNav";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
function SharingCompletedBooking() {
  const { setGlobalState, globalState } = useGlobalState();

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
      let response = await getCompletedBookingRecordServFlatedArray(payload);
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
  const [completeReceiptPopup, setCompleteReceiptPopup] = useState(null);
  const handleDownload = () => {
    const input = document.getElementById("refundDetailsContent");
    const refundBox = input.querySelector(".refundDetailsBox");

    // original styles save
    const originalHeight = refundBox.style.height;
    const originalOverflow = refundBox.style.overflowY;

    // temporarily expand for full capture
    refundBox.style.height = "auto";
    refundBox.style.overflowY = "visible";

    setTimeout(() => {
      html2canvas(input, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        // 1st page
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;

        // extra pages if needed
        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pdfHeight;
        }

        pdf.save(`RefundDetails_${completeReceiptPopup?.id}.pdf`);

        // restore original scroll styles
        refundBox.style.height = originalHeight;
        refundBox.style.overflowY = originalOverflow;
      });
    }, 300);
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
              selectedNav="Completed"
              navBg="#E5E5E5"
              navColor="#1C1C1C"
              selectedNavBg="#353535"
              selectedNavColor="#fff"
            />
          </div>
          <div className="tableOuterContainer bgDark mt-4">
            <div>
              <table className="table">
                <thead className="">
                  <tr>
                    <th
                      scope="col"
                      style={{ borderRadius: "20px 0px 0px 20px" }}
                    >
                      <div className="d-flex justify-content-center ms-2">
                        <span className="mx-2">Sr. No</span>
                      </div>
                    </th>
                    <th scope="col">Group ID</th>
                    <th scope="col">Driver Name</th>
                    <th scope="col">Pick City</th>
                    <th scope="col">Drop-off city</th>

                    <th scope="col">Booking Date & Time</th>
                    <th scope="col">Time Choice</th>
                    <th scope="col">Complete Receipt</th>
                    <th scope="col">Earning Status</th>

                    <th
                      scope="col"
                      style={{ borderRadius: "0px 20px 20px 0px" }}
                    >
                      <span className="me-3">Action</span>
                    </th>
                  </tr>
                </thead>
                <div className="pt-4"></div>
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
                          </tr>
                        );
                      })
                    : list?.map((v, i) => {
                        return (
                          <>
                            <tr className="bgWhite">
                              <td
                                scope="row"
                                style={{
                                  borderRadius: "24px 0px 0px 24px",
                                }}
                              >
                                {i + 1 + (pageData?.current_page - 1) * 10}
                              </td>
                              <td>{v?.group_id}</td>
                              <td>{v?.driverDetails?.first_name}</td>
                              <td>
                                {v?.pickup_city
                                  ? `${v.pickup_city.substring(0, 15)}${
                                      v.pickup_city.length > 15 ? "..." : ""
                                    }`
                                  : ""}
                              </td>
                              <td>
                                {v?.dropoff_city
                                  ? `${v.dropoff_city.substring(0, 15)}${
                                      v.dropoff_city.length > 15 ? "..." : ""
                                    }`
                                  : ""}
                              </td>

                              <td>
                                {moment(v?.first_pickup_date).format(
                                  "DD/MM/YYYY"
                                )}{" "}
                                (
                                {moment(v?.first_pickup_time, "HH:mm").format(
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
                                <div onClick={() => setCompleteReceiptPopup(v)}>
                                  <img
                                    src="/imagefolder/eyeIcon.png"
                                    style={{ height: "20px" }}
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="d-flex justify-content-center">
                                  {v?.profit_or_loss_status == "Profit" ? (
                                    <div className="profitBtn">Profit Ride</div>
                                  ) : v?.profit_or_loss_status == "Loss" ? (
                                    <div
                                      className="profitBtn"
                                      style={{ background: "#DD4132" }}
                                    >
                                      Loss Ride
                                    </div>
                                  ) : (
                                    <div
                                      className="profitBtn"
                                      style={{
                                        background: "#FCCE01",
                                        color: "#1C1C1C",
                                      }}
                                    >
                                      Break-even Ride
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td
                                style={{
                                  borderRadius: "0px 24px 24px 0px",

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
                            <div
                              className={i == list.length - 1 ? " " : " pb-3"}
                            ></div>
                          </>
                        );
                      })}
                </tbody>
              </table>

              {list.length == 0 && !showSkelton && (
                <NoRecordFound theme="light" marginTop="-20px" />
              )}
            </div>
          </div>
          {false && (
            <div
              className="modal fade show d-flex align-items-center   justify-content-center "
              tabIndex="-1"
            >
              <div className="modal-dialog">
                <div className="modal-content completedPopup">
                  <div className="modal-body p-0">
                    <div className="completedPopupDriverDetails">
                      <div className="row">
                        <div className="col-3">
                          <div className="mb-3">
                            <img
                              src={
                                Image_Base_Url +
                                popupDetails?.driverDetails?.image
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
                            <h5>
                              {popupDetails?.driverDetails?.vehicle_colour}
                            </h5>
                          </div>
                        </div>
                        <div className="col-3 " style={{ marginTop: "30px" }}>
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
                            {renderStarFunc(popupDetails?.driver_rating)}
                          </div>
                        </div>
                        <div className="col-3 mt-auto">
                          <div className="mb-3">
                            <p>Booking Amount</p>
                            <h5>${popupDetails?.total_trip_cost}</h5>
                          </div>
                          <div className="mb-3">
                            <p>Surge Amount</p>
                            <h5>${popupDetails?.total_extra_charge}</h5>
                          </div>
                          <div>
                            <p>Total Amount</p>
                            <h5>${popupDetails?.total_trip_cost}</h5>
                          </div>
                        </div>
                        <div className="col-3 mt-4">
                          <div className="mb-3">
                            <p>Admin Fee</p>
                            <h5>${popupDetails?.total_admin_commission}</h5>
                          </div>
                          <div>
                            <p>Driver Earn</p>
                            <h5>${popupDetails?.total_driver_earning}</h5>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div
                        className="table-container completPopupTable"
                        style={{ maxHeight: "290px", overflow: "auto" }}
                      >
                        <table className="table mb-0">
                          <thead className="table-dark">
                            <tr>
                              <th
                                style={{
                                  borderRadius: "20px 0px 0px 0px",
                                  width: "70px",
                                }}
                              >
                                Sr No.
                              </th>
                              <th>Booking ID</th>
                              <th>Username</th>
                              <th>Source</th>
                              <th>Destination</th>
                              <th>Persons</th>
                              <th>Booking Amt</th>
                              <th style={{ borderRadius: "0px 20px 0px 0px" }}>
                                Booking Date &amp; Time
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {popupDetails?.pickup_points.map((v, i) => (
                              <tr key={i}>
                                <td
                                  style={{ borderRadius: "0px 0px 20px 0px" }}
                                >
                                  {i + 1}
                                </td>
                                <td>{v?.booking?.id}</td>
                                <td>{v?.booking?.username}</td>
                                <td>
                                  {" "}
                                  <p
                                    style={{
                                      margin: 0,
                                      width: "90px",
                                      overflowWrap: "break-word",
                                      wordBreak: "break-word",
                                      whiteSpace: "normal",
                                    }}
                                  >
                                    {v?.booking?.source}
                                  </p>
                                </td>
                                <td>
                                  <p
                                    style={{
                                      margin: 0,
                                      width: "90px",
                                      overflowWrap: "break-word",
                                      wordBreak: "break-word",
                                      whiteSpace: "normal",
                                    }}
                                  >
                                    {v?.booking?.destination}
                                  </p>
                                </td>
                                <td>
                                  <div className="d-flex justify-content-center">
                                    <div
                                      style={{
                                        height: "30px",
                                        width: "40px",
                                        borderRadius: "4px",
                                        fontWeight: "700",
                                        fontSize: "700",
                                        background: "#D0FF13",
                                      }}
                                      className="d-flex justify-content-center align-items-center"
                                    >
                                      {v?.booking?.number_of_people}
                                    </div>{" "}
                                  </div>
                                </td>
                                <td>${v?.booking?.booking_amount}</td>
                                <td>
                                  {moment(v?.booking?.booking_date).format(
                                    "DD MMM YYYY"
                                  )}{" "}
                                  (
                                  {moment(
                                    v?.booking?.booking_time,
                                    "HH:mm"
                                  ).format("hh:mm A")}
                                  )
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
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
          {false && <div className="modal-backdrop fade show"></div>}
          {popupDetails?.id && (
            <div
              className="modal fade show d-flex align-items-center justify-content-center"
              tabIndex="-1"
            >
              <div className="modal-dialog">
                <div className="modal-content completedPopup">
                  <div className="modal-body p-0">
                    {/* <div className="completedPopupDriverDetails">
                      <div className="row">
                        <div className="col-3">
                          <div className="mb-3">
                            <img
                              src={
                                Image_Base_Url +
                                popupDetails?.driverDetails?.image
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
                            <h5>
                              {popupDetails?.driverDetails?.vehicle_colour}
                            </h5>
                          </div>
                        </div>
                        <div className="col-3 " style={{ marginTop: "30px" }}>
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
                            {renderStarFunc(popupDetails?.driver_rating)}
                          </div>
                        </div>
                        <div className="col-3 mt-auto">
                          <div className="mb-3">
                            <p>Booking Amount</p>
                            <h5>${popupDetails?.total_trip_cost}</h5>
                          </div>
                          <div className="mb-3">
                            <p>Surge Amount</p>
                            <h5>${popupDetails?.total_extra_charge}</h5>
                          </div>
                          <div>
                            <p>Total Amount</p>
                            <h5>${popupDetails?.total_trip_cost}</h5>
                          </div>
                        </div>
                        <div className="col-3 mt-4">
                          <div className="mb-3">
                            <p>Admin Fee</p>
                            <h5>${popupDetails?.total_admin_commission}</h5>
                          </div>
                          <div>
                            <p>Driver Earn</p>
                            <h5>${popupDetails?.total_driver_earning}</h5>
                          </div>
                        </div>
                      </div>
                    </div> */}
                    <div className="row m-0 p-0">
                      <div className="col-7 m-0 p-0">
                        <div className="driverDetailsDiv">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <img
                                src={
                                  Image_Base_Url +
                                  popupDetails?.driverDetails?.image
                                }
                                alt="driver"
                              />
                              <div className="ms-2 mt-1">
                                <p className="driverId">
                                  ID : {popupDetails?.driverDetails?.unique_id}
                                </p>
                                <h6>
                                  {popupDetails?.driverDetails?.first_name}{" "}
                                  {popupDetails?.driverDetails?.last_name}
                                </h6>
                                <div className="reviewDiv">
                                  <span>
                                    (
                                    {Number(
                                      popupDetails?.driver_rating || 0
                                    ).toFixed(1)}
                                    )
                                  </span>
                                  <img src="https://cdn-icons-png.flaticon.com/128/1828/1828884.png" />
                                </div>
                              </div>
                            </div>
                            <div>
                              <p className="carName">
                                {popupDetails?.driverDetails?.vehicle_name} (
                                {popupDetails?.driverDetails?.vehicle_colour})
                              </p>
                              <h6 className="carNumber">
                                {popupDetails?.driverDetails?.vehicle_no}
                              </h6>
                            </div>
                          </div>
                        </div>

                        <div className="row mt-2">
                          <div className="col-6">
                            <div className="completeItem">
                              <p>Pickup City</p>
                              <h5>{popupDetails?.pickup_city}</h5>
                            </div>
                            <div className="completeItem">
                              <p>Booking Date & Time</p>
                              <h5>
                                {moment(popupDetails?.first_pickup_date).format(
                                  "DD MMM, YYYY"
                                )}{" "}
                                (
                                {moment(
                                  popupDetails?.first_pickup_time,
                                  "HH:mm"
                                ).format("hh:mm A")}
                                )
                              </h5>
                            </div>
                            <div className="completeItem">
                              <p>Scheduled Pickup Time</p>
                              <h5>
                                {moment(
                                  popupDetails?.first_pickup_time,
                                  "HH:mm"
                                ).format("hh:mm A")}
                              </h5>
                            </div>
                            <div className="completeItem">
                              <p>Scheduled Route Time</p>
                              <h5>
                                {popupDetails?.total_trip_time || "00:00"}
                              </h5>
                            </div>
                          </div>

                          <div className="col-6">
                            <div className="completeItem">
                              <p>Drop-off City</p>
                              <h5>{popupDetails?.dropoff_city}</h5>
                            </div>
                            <div className="completeItem">
                              <p>Time Choice</p>
                              <h5>
                                {popupDetails?.time_choice === "pickupat"
                                  ? "Pickup"
                                  : "Dropoff"}
                              </h5>
                            </div>
                            <div className="completeItem">
                              <p>Actual Pickup Time</p>
                              <h5>
                                {popupDetails?.actual_enroute_time
                                  ? moment(
                                      popupDetails?.actual_enroute_time
                                    ).format("hh:mm A")
                                  : "--"}
                              </h5>
                            </div>
                            <div className="completeItem">
                              <p>Actual Route Time</p>
                              <h5>
                                {popupDetails?.actual_route_time || "00:00"}
                              </h5>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-5 pe-0">
                        <div className="driverBoxComplete">
                          <div className="driverBoxCompleteItem">
                            <span>No. of Person</span>
                            <p>{popupDetails?.total_number_of_people}</p>
                          </div>
                          <div className="driverBoxCompleteItem">
                            <span>Booking Amount per Person</span>
                            <p>
                              $
                              {(popupDetails?.total_trip_cost || 0) /
                                (popupDetails?.total_number_of_people || 1)}
                            </p>
                          </div>
                          <div className="driverBoxCompleteItem">
                            <span>HST (13%)</span>
                            <p>{"N/A"}</p>
                          </div>
                          <div className="driverBoxCompleteItem borderBottom pb-2">
                            <b>Total Amount</b>
                            <p>${(popupDetails?.total_trip_cost).toFixed(2)}</p>
                          </div>

                          <div className="driverBoxCompleteItem pt-2">
                            <span>Driver Commission</span>
                            <p>${popupDetails?.total_driver_earning}</p>
                          </div>
                          <div className="driverBoxCompleteItem">
                            <span>Driver HST (13%)</span>
                            <p>{"N/A"}</p>
                          </div>
                          <div className="driverBoxCompleteItem">
                            <span>Admin Commission</span>
                            <p>${popupDetails?.total_admin_commission}</p>
                          </div>
                          <div className="driverBoxCompleteItem pb-2">
                            <span>Admin HST (13%)</span>
                            <p>{"N/A"}</p>
                          </div>
                          <div className="driverBoxCompleteItem borderBottom py-2">
                            <b>Bonus Amount</b>
                            <p>${popupDetails?.tip_amount || 0}</p>
                          </div>
                          <div className="driverBoxCompleteItem borderBottom py-2">
                            <b>Chaupehra Sahib (50% Off)</b>
                            <p>
                              $
                              {(popupDetails?.total_location_discount).toFixed(
                                2
                              )}
                            </p>
                          </div>
                          <div className="driverBoxCompleteItem mt-2">
                            <b>Final Paid to Driver</b>
                            <p>
                              $
                              {(
                                (Number(
                                  popupDetails?.amount_paid_to_driver
                                ) || 0) +
                                (Number(popupDetails?.tip_amount) || 0)
                              ).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div
                        className="table-container completPopupTable"
                        style={{ maxHeight: "290px", overflow: "auto" }}
                      >
                        <table className="table mb-0">
                          <thead className="table-dark">
                            <tr>
                              <th
                                style={{
                                  borderRadius: "20px 0px 0px 0px",
                                  width: "70px",
                                }}
                              >
                                Sr No.
                              </th>
                              <th>Booking ID</th>
                              <th>Username</th>
                              <th>Source</th>
                              <th>Destination</th>
                              <th>Persons</th>
                              <th>Booking Amt</th>
                              <th style={{ borderRadius: "0px 20px 0px 0px" }}>
                                Booking Date &amp; Time
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {popupDetails?.pickup_points.map((v, i) => (
                              <tr key={i}>
                                <td
                                  style={{ borderRadius: "0px 0px 20px 0px" }}
                                >
                                  <div className="ps-2">{i + 1}</div>
                                </td>
                                <td>{v?.booking?.id}</td>
                                <td>{v?.booking?.username}</td>
                                <td>
                                  {" "}
                                  <p
                                    style={{
                                      margin: 0,
                                      width: "90px",
                                      overflowWrap: "break-word",
                                      wordBreak: "break-word",
                                      whiteSpace: "normal",
                                    }}
                                  >
                                    {v?.booking?.source}
                                  </p>
                                </td>
                                <td>
                                  <p
                                    style={{
                                      margin: 0,
                                      width: "90px",
                                      overflowWrap: "break-word",
                                      wordBreak: "break-word",
                                      whiteSpace: "normal",
                                    }}
                                  >
                                    {v?.booking?.destination}
                                  </p>
                                </td>
                                <td>
                                  <div className="d-flex justify-content-center">
                                    <div
                                      style={{
                                        height: "30px",
                                        width: "40px",
                                        borderRadius: "4px",
                                        fontWeight: "700",
                                        fontSize: "700",
                                        background: "#D0FF13",
                                      }}
                                      className="d-flex justify-content-center align-items-center"
                                    >
                                      {v?.booking?.number_of_people}
                                    </div>{" "}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-center">
                                    ${v?.booking?.booking_amount}
                                  </div>
                                </td>
                                <td>
                                  {moment(v?.booking?.booking_date).format(
                                    "DD MMM, YYYY"
                                  )}{" "}
                                  (
                                  {moment(
                                    v?.booking?.booking_time,
                                    "HH:mm"
                                  ).format("hh:mm A")}
                                  )
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="completeBottomBtn my-3">
                      Ride Completed On :- <span>19 May, 2025 (03:30 PM)</span>
                    </div>
                    <div className="d-flex justify-content-center ">
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
          {completeReceiptPopup?.id && (
            <div
              className="modal fade show d-flex align-items-center justify-content-center"
              tabIndex="-1"
            >
              <div className="modal-dialog">
                <div className="modal-content cancelReceiptPopup">
                  <div className="modal-body p-0">
                    <div id="refundDetailsContent">
                      <div className="refundHeading">Completed Receipt</div>
                      <div className="cancelRefundBody">
                        <div className="d-flex justify-content-between">
                          <div>
                            <button>
                              Booking ID :- {completeReceiptPopup?.id}
                            </button>
                            <div>
                              <span>Username :- </span>
                              <b>
                                {
                                  completeReceiptPopup
                                    ?.bookings_with_user_details?.[0]
                                    ?.user_details?.first_name
                                }{" "}
                                {
                                  completeReceiptPopup
                                    ?.bookings_with_user_details?.[0]
                                    ?.user_details?.last_name
                                }
                              </b>
                            </div>
                            <div>
                              <span>Pickup :- </span>
                              <b>{completeReceiptPopup?.pickup_city}</b>
                            </div>
                            <div>
                              <span>Drop Off :- </span>
                              <b>{completeReceiptPopup?.dropoff_city}</b>
                            </div>
                            <div>
                              <span>Booking Date :- </span>
                              <b>
                                {moment(
                                  completeReceiptPopup?.first_pickup_date
                                ).format("DD MMM YYYY")}{" "}
                                (
                                {moment(
                                  completeReceiptPopup?.first_pickup_time,
                                  "HH:mm"
                                ).format("hh:mm A")}
                                )
                              </b>
                            </div>
                            <div>
                              <span>Booking Placed :- </span>
                              <b>
                                {moment(
                                  completeReceiptPopup?.assign_time
                                ).format("DD MMM YYYY")}
                              </b>
                            </div>
                          </div>
                          <div>
                            <img
                              src="/imagefolder/blackBrandlogo.png"
                              alt="brand"
                            />
                          </div>
                        </div>

                        <div
                          className="p-2 my-2"
                          style={{
                            background: "#F7F7F7",
                            borderRadius: "10px",
                          }}
                        >
                          <div className="driverDetailsDivMini">
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="d-flex align-items-center">
                                <img
                                  src={
                                    Image_Base_Url +
                                    completeReceiptPopup?.driverDetails?.image
                                  }
                                />
                                <div className="ms-2 mt-1">
                                  <p className="driverIdMini">
                                    ID :{" "}
                                    {
                                      completeReceiptPopup?.driverDetails
                                        ?.unique_id
                                    }
                                  </p>
                                  <h6>
                                    {
                                      completeReceiptPopup?.driverDetails
                                        ?.first_name
                                    }{" "}
                                    {
                                      completeReceiptPopup?.driverDetails
                                        ?.last_name
                                    }
                                  </h6>
                                  <div className="reviewDivMini">
                                    <span>
                                      (
                                      {Number(
                                        completeReceiptPopup?.driver_rating || 0
                                      ).toFixed(1)}
                                      )
                                    </span>
                                    <img src="https://cdn-icons-png.flaticon.com/128/1828/1828884.png" />
                                  </div>
                                </div>
                              </div>
                              <div>
                                <p className="carNameMini">
                                  {
                                    completeReceiptPopup?.driverDetails
                                      ?.vehicle_name
                                  }{" "}
                                  (
                                  {
                                    completeReceiptPopup?.driverDetails
                                      ?.vehicle_colour
                                  }
                                  )
                                </p>
                                <h6 className="carNumberMini">
                                  {
                                    completeReceiptPopup?.driverDetails
                                      ?.vehicle_no
                                  }
                                </h6>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* ----- Payment Summary Box ----- */}
                        <div
                          className="refundDetailsBox px-3 py-1"
                          style={{ height: "270px" }}
                        >
                          <div className="d-flex justify-content-between align-items-center px-4 py-1">
                            <p>No. of Person</p>
                            <h5>
                              {completeReceiptPopup?.total_number_of_people ||
                                1}
                            </h5>
                          </div>
                          <div className="d-flex justify-content-between align-items-center px-4 py-1">
                            <p>Booking Amount per Person</p>
                            <h5>
                              $
                              {(completeReceiptPopup?.total_trip_cost || 0) /
                                (completeReceiptPopup?.total_number_of_people ||
                                  1)}
                            </h5>
                          </div>
                          <div className="d-flex justify-content-between align-items-center px-4 py-1">
                            <p>HST (13%)</p>
                            <h5>{"N/A"}</h5>
                          </div>
                          <div
                            className="d-flex justify-content-between align-items-center px-4 py-1"
                            style={{ borderBottom: "0.5px solid #E5E5E5" }}
                          >
                            <p style={{ fontWeight: "700" }}>Total Amount</p>
                            <h5>${completeReceiptPopup?.total_trip_cost}</h5>
                          </div>
                          <div className="d-flex justify-content-between align-items-center px-4 py-1 pt-2">
                            <p>Driver Commission</p>
                            <h5>
                              $
                              {(completeReceiptPopup?.total_driver_earning).toFixed(
                                2
                              )}
                            </h5>
                          </div>
                          <div className="d-flex justify-content-between align-items-center px-4 py-1">
                            <p>Driver HST (13%)</p>
                            <h5>{"N/A"}</h5>
                          </div>
                          <div className="d-flex justify-content-between align-items-center px-4 py-1">
                            <p>Admin Commission</p>
                            <h5>
                              ${completeReceiptPopup?.total_admin_commission}
                            </h5>
                          </div>
                          <div
                            className="d-flex justify-content-between align-items-center px-4 py-1"
                            style={{ borderBottom: "0.5px solid #E5E5E5" }}
                          >
                            <p>Admin HST (13%)</p>
                            <h5>{"N/A"}</h5>
                          </div>
                          <div className="d-flex justify-content-between align-items-center px-4 py-1 pt-2">
                            <p>Bonus Amount</p>
                            <h5>${completeReceiptPopup?.tip_amount || 0}</h5>
                          </div>
                          <div
                            className="d-flex justify-content-between align-items-center px-4 py-1 pt-2"
                            style={{ borderBottom: "0.5px solid #B2B2B2" }}
                          >
                            <p>Refund</p>
                            <h5>${completeReceiptPopup?.refund_amount || 0}</h5>
                          </div>
                          <div className="d-flex justify-content-between align-items-center px-4 py-1 pt-2">
                            <p>Final Paid to Driver</p>
                            <h5>
                              $
                              {(
                                (Number(
                                  completeReceiptPopup?.amount_paid_to_driver
                                ) || 0) +
                                (Number(completeReceiptPopup?.tip_amount) || 0)
                              ).toFixed(2)}
                            </h5>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-end cancelRefundButton px-4">
                      <div className="d-flex">
                        <button
                          className="mx-2 bgWhite textDark"
                          onClick={() => setCompleteReceiptPopup(null)}
                        >
                          Close
                        </button>
                        <button onClick={handleDownload}>Download</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {completeReceiptPopup?.id && (
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
                    <th scope="col">Group ID</th>
                    <th scope="col">Driver Name</th>
                    <th scope="col">Pick Address</th>
                    <th scope="col">Drop Address</th>

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
                          <td>{v?.group_id}</td>
                          <td>{v?.driverDetails?.first_name}</td>
                          <td>
                            {v?.pickup_city
                              ? `${v.pickup_city.substring(0, 15)}${
                                  v.pickup_city.length > 15 ? "..." : ""
                                }`
                              : ""}
                          </td>
                          <td>
                            {v?.dropoff_city
                              ? `${v.dropoff_city.substring(0, 15)}${
                                  v.dropoff_city.length > 15 ? "..." : ""
                                }`
                              : ""}
                          </td>

                          <td>
                            {moment(v?.first_pickup_date).format("DD/MM/YYYY")}{" "}
                            (
                            {moment(v?.first_pickup_time, "HH:mm").format(
                              "hh:mm A"
                            )}
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
            <div className="modal-content completedPopup">
              <div className="modal-body">
                <div className="completedPopupDriverDetails">
                  <div className="row">
                    <div className="col-3">
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
                    <div className="col-3 mt-auto">
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
                        {renderStarFunc(popupDetails?.driver_rating)}
                      </div>
                    </div>
                    <div className="col-3 mt-auto">
                      <div className="mb-3">
                        <p>Booking Amount</p>
                        <h5>${popupDetails?.total_trip_cost}</h5>
                      </div>
                      <div className="mb-3">
                        <p>Surge Amount</p>
                        <h5>${popupDetails?.total_extra_charge}</h5>
                      </div>
                      <div>
                        <p>Total Amount</p>
                        <h5>${popupDetails?.total_trip_cost}</h5>
                      </div>
                    </div>
                    <div className="col-3 mt-4">
                      <div className="mb-3">
                        <p>Admin Fee</p>
                        <h5>${popupDetails?.total_admin_commission}</h5>
                      </div>
                      <div>
                        <p>Driver Earn</p>
                        <h5>${popupDetails?.total_driver_earning}</h5>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div
                    className="table-container completPopupTable"
                    style={{ maxHeight: "290px", overflow: "auto" }}
                  >
                    <table className="table mb-0">
                      <thead className="table-dark">
                        <tr>
                          <th
                            style={{
                              borderRadius: "20px 0px 0px 0px",
                              width: "70px",
                            }}
                          >
                            Sr No.
                          </th>
                          <th>Booking ID</th>
                          <th>Username</th>
                          <th>Source</th>
                          <th>Destination</th>
                          <th>Booking Amount</th>
                          <th style={{ borderRadius: "0px 20px 0px 0px" }}>
                            Booking Date &amp; Time
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {popupDetails?.pickup_points.map((v, i) => (
                          <tr key={i}>
                            <td style={{ borderRadius: "0px 0px 20px 0px" }}>
                              {i + 1}
                            </td>
                            <td>{v?.booking?.id}</td>
                            <td>{v?.booking?.username}</td>
                            <td>
                              {" "}
                              <p
                                style={{
                                  margin: 0,
                                  width: "90px",
                                  overflowWrap: "break-word",
                                  wordBreak: "break-word",
                                  whiteSpace: "normal",
                                }}
                              >
                                {v?.booking?.source}
                              </p>
                            </td>
                            <td>
                              <p
                                style={{
                                  margin: 0,
                                  width: "90px",
                                  overflowWrap: "break-word",
                                  wordBreak: "break-word",
                                  whiteSpace: "normal",
                                }}
                              >
                                {v?.booking?.destination}
                              </p>
                            </td>
                            <td>${v?.booking?.booking_amount}</td>
                            <td>
                              {moment(v?.booking?.booking_date).format(
                                "DD MMM YYYY"
                              )}{" "}
                              (
                              {moment(v?.booking?.booking_time, "HH:mm").format(
                                "hh:mm A"
                              )}
                              )
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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

export default SharingCompletedBooking;
