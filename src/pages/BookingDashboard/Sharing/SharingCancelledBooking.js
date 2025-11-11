import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/Sidebar";
import TopNav from "../../../components/TopNav";
import TableNav from "../../../components/TableNav";
import {
  getCanceledBookingRecordServ,
  cancelRefundServ,
} from "../../../services/bookingDashboard.services";
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
import SecondaryTopNav from "../../../components/SecondaryTopNav";
import NewSidebar from "../../../components/NewSidebar";
import CustomTopNav from "../../../components/CustomTopNav";
import CustomPagination from "../../../components/CustomPazination";
import { toast } from "react-toastify";

function SharingCancelledBooking() {
  const [userDetailsPopup, setUserDetailsPopup] = useState(null);
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
    per_page: "10",
    page_no: 1,
    first_pickup_date: "",
  });
  const [totalRecord, setTotalRecord] = useState(0);
  const [pageData, setPageData] = useState({
    total_pages: "",
    current_page: "",
  });

  const handleGetListFunc = async () => {
    if (list?.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await getCanceledBookingRecordServ({
        ...payload,
        booking_date: payload.first_pickup_date,
      });
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
  const [cancelReceiptPopup, setcancelReceiptPopup] = useState();
  const [refundDetailsPopup, setRefundDetailsPopup] = useState(null);
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

      pdf.save(`RefundDetails_${cancelReceiptPopup?.id}.pdf`);

      // restore original scroll styles
      refundBox.style.height = originalHeight;
      refundBox.style.overflowY = originalOverflow;
    });
  }, 300);
};


  const [refundForm, setRefundForm] = useState({
    booking_id: "",
    refund_amount: "",
    refund_reason: "",
  });
  const refundFunc = async () => {
    try {
      let response = await cancelRefundServ(refundForm);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        setRefundDetailsPopup(null);
        setRefundForm({
          booking_id: "",
          refund_amount: "",
          refund_reason: "",
        });
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
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
              selectedNav="Cancelled"
              navBg="#E5E5E5"
              navColor="#1C1C1C"
              selectedNavBg="#353535"
              selectedNavColor="#fff"
            />
          </div>
          <div className="tableOuterContainer bgDark mt-4">
            <div>
              <table className="table mb-0">
                <thead className="">
                  <tr>
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
                    <th scope="col">Persons</th>
                    <th scope="col">Booked On</th>
                    <th scope="col">Total Amt.</th>
                    <th scope="col">Cancelled On</th>
                    <th scope="col">Cancel By</th>
                    <th scope="col" style={{width:"25px"}}>Cancel Receipt</th>
                    <th
                      scope="col"
                      style={{ borderRadius: "0px 24px 24px 0px" }}
                    >
                      <span className="me-3">Refund</span>
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
                              <td>{v?.id}</td>
                              <td><div
                                      className="userNameDiv"
                                      onClick={() => setUserDetailsPopup(v)}
                                    >
                                      <p className="mb-0 bgWhite text-dark radius3">
                                        ID:{v?.user_details?.id}
                                      </p>
                                      <p className="mb-0 text-light">
                                        {v?.user_details?.first_name}
                                      </p>
                                    </div></td>
                              <td className="destinationCell">
                                {v?.source || ""}
                              </td>
                              <td className="destinationCell">
                                {v?.destination || ""}
                              </td>
                              <td>
                                <div className="d-flex justify-content-center">
                                  <div
                                    className="d-flex justify-content-center align-items-center"
                                    style={{
                                      background: "#D0FF13",
                                      color: "#1C1C1E",
                                      fontSize: "14px",
                                      fontWeight: "700",
                                      borderRadius: "4px",
                                      width: "40px",
                                      height: "30px",
                                    }}
                                  >
                                    {v?.number_of_people}
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div>{moment(v?.booking_date).format("DD MMM, YYYY")}{" "}</div>
                                <div>(
                                {moment(v?.booking_time, "HH:mm").format(
                                  "hh:mm A"
                                )}
                                )</div>
                                
                              </td>

                              <td>${v?.total_trip_cost}</td>
                              <td>
                                <div>{moment(v?.booking_date).format("DD MMM, YYYY")}{" "}</div>
                                <div>(
                                {moment(v?.booking_time, "HH:mm").format(
                                  "hh:mm A"
                                )}
                                )</div>
                                
                              </td>
                              <td>
                                <div className="d-flex justify-content-center">
                                  <div
                                    className="d-flex justify-content-center align-items-center"
                                    style={{
                                      background: "#D0FF13",
                                      color: "#1C1C1E",
                                      fontSize: "12px",
                                      fontWeight: "500",
                                      borderRadius: "4px",
                                      width: "90px",
                                      height: "30px",
                                    }}
                                  >
                                    {v?.cancel_by.toUpperCase()}
                                  </div>
                                </div>
                              </td>

                              <td style={{ color: "#3B82F6" }}>
                                <div onClick={() => setcancelReceiptPopup(v)}>
                                  <img
                                    src="/imagefolder/eyeIcon.png"
                                    style={{ height: "25px" }}
                                  />
                                </div>
                              </td>

                              <td
                                style={{
                                  borderRadius: "0px 24px 24px 0px",
                                }}
                              >
                                {v?.cancel_by == "admin" ? (
                                  <></>
                                ) : v?.total_trip_cost != v?.refund_amount ? (
                                  <button
                                    className="refundBtn bgWhite textDark"
                                    onClick={() => {
                                      setRefundDetailsPopup(v);
                                      setRefundForm({
                                        ...refundForm,
                                        booking_id: v?.id,
                                      });
                                    }}
                                  >
                                    Refund
                                  </button>
                                ) : (
                                  <button className="refundBtn">
                                    Refunded
                                  </button>
                                )}
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
          <CustomPagination
            current_page={pageData?.current_page}
            onPerPageChange={onPerPageChange}
            last_page={pageData?.total_pages}
            per_page={payload?.per_page}
            onPageChange={onPageChange}
          />
        </div>
      </div>

      {cancelReceiptPopup?.id && (
        <div
          className="modal fade show d-flex align-items-center   justify-content-center "
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content cancelReceiptPopup">
              <div className="modal-body p-0">
                <div id="refundDetailsContent">
                  <div className="refundHeading">Cancel Recipt</div>
                  <div className="cancelRefundBody">
                    <div className="d-flex justify-content-between">
                      <div>
                        <button>Booking ID :- {cancelReceiptPopup?.id}</button>
                        <div className="">
                          <span>Username :- </span>
                          <b>
                            {cancelReceiptPopup?.user_details?.first_name +
                              " " +
                              cancelReceiptPopup?.user_details?.last_name}
                          </b>
                        </div>
                        <div>
                          <span>Pickup :- </span>
                          <b>{cancelReceiptPopup?.source}</b>
                        </div>
                        <div>
                          <span>Drop Off :- </span>
                          <b>{cancelReceiptPopup?.destination}</b>
                        </div>
                        <div>
                          <span>Booking Date :- </span>
                          <b>
                            {moment(cancelReceiptPopup?.booking_date).format(
                              "DD MMM YYYY"
                            ) +
                              " (" +
                              moment(
                                cancelReceiptPopup?.booking_time,
                                "HH:mm"
                              ).format("hh:mm A") +
                              ")"}
                          </b>
                        </div>
                        <div>
                          <span>Booking Placed :- </span>
                          <b>
                            {" "}
                            {moment(cancelReceiptPopup?.confirm_time).format(
                              "DD MMM YYYY"
                            )}
                          </b>
                        </div>
                      </div>
                      <div>
                        <img src="/imagefolder/blackBrandlogo.png" />
                      </div>
                    </div>
                    <div className="py-2 px-4 my-2" style={{background:"#F7F7F7", borderRadius:"10px"}}>
                      <div>
                        <div >
                          <span>Cancelled By:- </span>
                        <b className="bgSuccess p-1 rounded">{cancelReceiptPopup?.cancel_by} </b>
                        {/* <b className="bgDark textSuccess ms-2 p-1 rounded">{cancelReceiptPopup?.cancel_by} </b> */}
                        </div>
                      </div>
                      <div>
                        <span>Cancelled on:- </span>
                        <b>
                          {moment(cancelReceiptPopup?.cancel_time).format(
                            "DD MMM YYYY"
                          ) +
                            " (" +
                            moment(
                              cancelReceiptPopup?.cancel_time,
                              "HH:mm"
                            ).format("hh:mm A") +
                            ")"}
                        </b>
                      </div>
                      <div>
                        <span>Cancel Reason:- </span>
                        <b>{cancelReceiptPopup?.reason || "Not provided"}</b>
                      </div>
                    </div>
                    
                      
                      <div className="refundDetailsBox px-3 py-1">
                        <div className="d-flex justify-content-between align-items-center px-4 py-1">
                          <div className="d-flex align-items-center">
                            
                            <p>No. of Person</p>
                          </div>
                          <h5>{cancelReceiptPopup?.number_of_people}</h5>
                        </div>
                        <div className="d-flex justify-content-between align-items-center px-4 py-1">
                          <div className="d-flex align-items-center">
                            
                            <p>Booking Amount per Person</p>
                          </div>
                          <h5>{cancelReceiptPopup?.number_of_people}</h5>
                        </div>
                        <div className="d-flex justify-content-between align-items-center px-4 py-1">
                          <div className="d-flex align-items-center">
                            
                            <p>HST (13%)</p>
                          </div>
                          <h5>{cancelReceiptPopup?.number_of_people}</h5>
                        </div>
                        <div className="d-flex justify-content-between align-items-center px-4 py-1" style={{borderBottom: "0.5px solid #E5E5E5"}}>
                          <div className="d-flex align-items-center">
                            
                            <p style={{fontWeight:"700"}}>Total Amount</p>
                          </div>
                          <h5>{cancelReceiptPopup?.number_of_people}</h5>
                        </div>
                        
                        <div className="d-flex justify-content-between align-items-center px-4 py-1 pt-2">
                          <div className="d-flex align-items-center">
                            
                            <p>Driver Commission</p>
                          </div>
                          <h5>
                            ${" "}
                            {cancelReceiptPopup?.total_trip_cost -
                              cancelReceiptPopup?.refund_amount}
                          </h5>
                        </div>
                        <div className="d-flex justify-content-between align-items-center px-4 py-1">
                          <div className="d-flex align-items-center">
                            
                            <p>Driver HST (13%)</p>
                          </div>
                          <h5>
                            ${" "}
                            {cancelReceiptPopup?.total_trip_cost -
                              cancelReceiptPopup?.refund_amount}
                          </h5>
                        </div>
                        <div className="d-flex justify-content-between align-items-center px-4 py-1 ">
                          <div className="d-flex align-items-center">
                            
                            <p>Admin Commission</p>
                          </div>
                          <h5>
                            ${" "}
                            {cancelReceiptPopup?.total_trip_cost -
                              cancelReceiptPopup?.refund_amount}
                          </h5>
                        </div>
                        <div className="d-flex justify-content-between align-items-center px-4 py-1"  style={{borderBottom: "0.5px solid #E5E5E5"}}>                           <div className="d-flex align-items-center">
                            
                            <p>Admin HST (12%)</p>
                          </div>
                          <h5>$ {cancelReceiptPopup?.refund_amount}</h5>
                        </div>
                         <div className="d-flex justify-content-between align-items-center px-4 py-1 pt-2"  style={{borderBottom: "0.5px solid #E5E5E5"}}>                           <div className="d-flex align-items-center">
                            
                            <p>Bonus Amount</p>
                          </div>
                          <h5>$ {cancelReceiptPopup?.refund_amount}</h5>
                        </div>
                        <div className="d-flex justify-content-between align-items-center px-4 py-1 pt-2"  style={{borderBottom: "0.5px solid #B2B2B2"}}>                           <div className="d-flex align-items-center">
                            
                            <p>Refund</p>
                          </div>
                          <h5>$ {cancelReceiptPopup?.refund_amount}</h5>
                        </div>
                        <div className="d-flex justify-content-between align-items-center px-4 py-1 pt-2"  >                           <div className="d-flex align-items-center">
                            
                            <p>Final Paid to Driver</p>
                          </div>
                          <h5>$ {cancelReceiptPopup?.refund_amount}</h5>
                        </div>
                        
                        
                      </div>
                    
                    <div className="mt-3 note">
                      <b> Note: </b>
                      <br />
                      Cancellation charges are applied as per our
                      cancellation policy.
                    </div>
                  </div>
                </div>
                <div className=" d-flex justify-content-between cancelRefundButton px-4">
                  <button
                    className=" bgSuccess textDark "
                    onClick={() => setcancelReceiptPopup(null)}
                    style={{border:"none"}}
                  >
                    Refund Issue
                  </button>
                  <div className="d-flex">
                    <button
                    className="mx-2 bgWhite textDark"
                    onClick={() => setcancelReceiptPopup(null)}
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
      {cancelReceiptPopup?.id && (
        <div className="modal-backdrop fade show"></div>
      )}
      {refundDetailsPopup?.id && (
        <div
          className="modal fade show d-flex align-items-center   justify-content-center "
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content refundPopup">
              <div className="modal-body p-0">
                <div>
                  <h2>Refund Cancellation</h2>
                </div>
                <div className="d-flex justify-content-center">
                  <div className="d-flex align-items-center  justify-content-between px-3 amountChargeDiv">
                    <p>Amount charged :-</p>
                    <h3>
                      {(refundDetailsPopup?.total_trip_cost - refundDetailsPopup?.refund_amount)?.toFixed(2)}

                    </h3>
                  </div>
                </div>
                <div className="mt-3">
                  <label>Refund Amount</label>
                  <div>
                    <input
                      type="number"
                      step="0.01" // decimal allow karne ke liye
                      min={1}
                      max={
                        parseFloat(refundDetailsPopup?.total_trip_cost) -
                        parseFloat(refundDetailsPopup?.refund_amount)
                      }
                      value={refundForm?.refund_amount}
                      onChange={(e) => {
                        let value = parseFloat(e.target.value) || 0;
                        let maxValue =
                          parseFloat(refundDetailsPopup?.total_trip_cost) -
                          parseFloat(refundDetailsPopup?.refund_amount);

                        if (value < 1) value = 1;
                        if (value > maxValue) value = maxValue;

                        setRefundForm({...refundForm, refund_amount:e?.target?.value});
                      }}
                    />
                  </div>
                  <div>
                    <select
                      value={refundForm?.refund_reason}
                      onChange={(e) =>
                        setRefundForm({
                          ...refundForm,
                          refund_reason: e?.target?.value,
                        })
                      }
                    >
                      <option>Select refund reason</option>
                      <option value="Driver Cancelled the Ride">
                        Driver Cancelled the Ride
                      </option>
                      <option value="No Driver Assigned">
                        No Driver Assigned
                      </option>
                      <option value="Driver Did Not Arrive on Time">
                        Driver Did Not Arrive on Time
                      </option>
                    </select>
                  </div>
                </div>
                <div className="mb-4 mt-5 d-flex justify-content-around cancelRefundButton ">
                  <button
                    className=" bgWhite textDark "
                    onClick={() => setRefundDetailsPopup(null)}
                    style={{ width: "145px" }}
                  >
                    Close
                  </button>
                  {refundForm?.refund_amount && refundForm?.refund_reason ? (
                    <button onClick={refundFunc} style={{ width: "145px" }}>
                      Refund
                    </button>
                  ) : (
                    <button style={{ width: "145px", opacity: "0.5" }}>
                      Refund
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {refundDetailsPopup?.id && (
        <div className="modal-backdrop fade show"></div>
      )}
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
                    <th scope="col">Pick Address</th>
                    <th scope="col">Drop Address</th>

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
                          <td>
                            <div
                              style={{
                                background: "#D0FF13",
                                color: "#1C1C1E",
                                fontSize: "12px",
                                padding: "4px 0px",
                                borderRadius: "5px",
                              }}
                            >
                              {v?.cancel_by.toUpperCase()}
                            </div>
                          </td>

                          <td style={{ color: "#3B82F6" }}>
                            <div onClick={() => setcancelReceiptPopup(v)}>
                              <img
                                src="/icons/eyeIcon.png"
                                style={{ height: "20px" }}
                              />
                            </div>
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
      {cancelReceiptPopup?.id && (
        <div
          className="modal fade show d-flex align-items-center manualSetPopup  justify-content-center "
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content cancelReceiptPopup">
              <div className="modal-body p-0">
                <div id="refundDetailsContent">
                  <div className="refundHeading">Cancel Recipt</div>
                  <div className="cancelRefundBody">
                    <div className="d-flex justify-content-between">
                      <div>
                        <div>
                          <span>Date :- </span>
                          <b>
                            {moment(cancelReceiptPopup?.booking_date).format(
                              "DD MMM YYYY"
                            ) +
                              " (" +
                              moment(
                                cancelReceiptPopup?.booking_time,
                                "HH:mm"
                              ).format("hh:mm A") +
                              ")"}
                          </b>
                        </div>
                        <div>
                          <span>Booking ID :- </span>
                          <b>{cancelReceiptPopup?.id}</b>
                        </div>
                        <div>
                          <span>Cancel By :- </span>
                          <b>{cancelReceiptPopup?.cancel_by} </b>
                        </div>
                        <div>
                          <span>Username :- </span>
                          <b>
                            {cancelReceiptPopup?.user_details?.first_name +
                              " " +
                              cancelReceiptPopup?.user_details?.last_name}
                          </b>
                        </div>
                        <div>
                          <span>Booking Placed :- </span>
                          <b>
                            {" "}
                            {moment(cancelReceiptPopup?.confirm_time).format(
                              "DD MMM YYYY"
                            )}
                          </b>
                        </div>
                        <div>
                          <span>Pickup Address :- </span>
                          <b>{cancelReceiptPopup?.source}</b>
                        </div>
                        <div>
                          <span>Drop Address :- </span>
                          <b>{cancelReceiptPopup?.destination}</b>
                        </div>
                        <div>
                          <span>Cancelled At:-</span>
                          <b>
                            {moment(cancelReceiptPopup?.cancel_time).format(
                              "DD MMM YYYY"
                            ) +
                              " (" +
                              moment(
                                cancelReceiptPopup?.cancel_time,
                                "HH:mm"
                              ).format("hh:mm A") +
                              ")"}
                          </b>
                        </div>
                        <div>
                          <span>Cancel Reason:-</span>
                          <b>{cancelReceiptPopup?.reason}</b>
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
                            {cancelReceiptPopup?.total_trip_cost -
                              cancelReceiptPopup?.refund_amount}
                          </h6>
                        </div>
                        <div className="row d-flex align-items-center py-1">
                          <i className="fa fa-circle col-2" />
                          <p className="col-8">User Refund :-</p>
                          <h6 className="col-2">
                            $ {cancelReceiptPopup?.refund_amount}
                          </h6>
                        </div>
                        <div className="row d-flex align-items-center py-1">
                          <i className="fa fa-circle col-2" />
                          <p className="col-8">Admin Earned :-</p>
                          <h6 className="col-2">
                            $ {cancelReceiptPopup?.admin_commission}
                          </h6>
                        </div>
                        <div className="row d-flex align-items-center py-1">
                          <i className="fa fa-circle col-2" />
                          <p className="col-8">Driver Earned :-</p>
                          <h6 className="col-2">
                            $ {cancelReceiptPopup?.driver_earning}
                          </h6>
                        </div>
                        <div className="row d-flex align-items-center py-1">
                          <i className="fa fa-circle col-2" />
                          <p className="col-8">Surge Amount :-</p>
                          <h6 className="col-2">
                            $ {cancelReceiptPopup?.extra_charge}
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
                            $ {cancelReceiptPopup?.total_trip_cost}
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
                    onClick={() => setcancelReceiptPopup(null)}
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
      {cancelReceiptPopup?.id && (
        <div className="modal-backdrop fade show"></div>
      )}
      {/* sectionLayout ended */}
    </div>
  );
}

export default SharingCancelledBooking;
