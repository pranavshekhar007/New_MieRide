import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import TopNav from "../../../components/TopNav";
import TableNav from "../../../components/TableNav";
import {
  getScheduledNotification,
  updateScheduleNotification,
} from "../../../services/broadcast.service";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import NoRecordFound from "../../../components/NoRecordFound";
import { useGlobalState } from "../../../GlobalProvider";
import { toast } from "react-toastify";
import moment from "moment";
import "react-toastify/dist/ReactToastify.css";
import { updateNotificationStatusServ } from "../../../services/notification.services";
import { getNavItems } from "../../../utils/TopNavItemData/bookingDashboard";
import BroadcastNotificationNav from "../../../components/BroadcastNotificationNav";
import Pagination from "../../../components/Pagination";
function BroadcastUserScheduleBookingPersonal() {
  const { setGlobalState, globalState } = useGlobalState();
  const [payload, setPayload] = useState({
      per_page: 10,
      page_no: 1,
      user_type: "user",
      type: "personal_booking",
      category:"scheduled",
    });
  const [pageData, setPageData] = useState({
      total_pages: "",
      current_page: "",
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
  const topNav = [
    {
      name: "Overview",
      path: "/broadcast-overview",
    },
    {
      name: "User Fixed",
      path: "/broadcast-user-fixed",
    },
    {
      name: "User Scheduled",
      path: "/broadcast-user-schedule-booking-sharing",
    },
    {
      name: "User Prompt",
      path: "/broadcast-user-prompt-booking-sharing",
    },
    {
      name: "Driver Fixed",
      path: "/broadcast-driver-fixed",
    },
    {
      name: "Driver Scheduled",
      path: "/broadcast-driver-schedule-booking-sharing",
    },
    {
      name: "Driver Prompt",
      path: "/broadcast-driver-prompt-booking-sharing",
    },
    {
      name: "Instant",
      path: "/broadcast-instant",
    },
  ];
  const tableNav = [
    {
      name: "Booking - Sharing",
      path: "/broadcast-user-schedule-booking-sharing",
    },
    {
      name: "Booking - Personal",
      path: "/broadcast-user-schedule-booking-personal",
    },
    {
      name: "Deals",
      path: "/broadcast-user-schedule-deals",
    },
    {
      name: "Holidays",
      path: "/broadcast-user-schedule-holidays",
    },
    {
      name: "App Update",
      path: "/broadcast-user-schedule-app-update",
    },

    {
      name: "Maintenance",
      path: "/broadcast-user-schedule-maintenance",
    },
  ];
  const [showSkelton, setShowSkelton] = useState(false);
  const [list, setList] = useState([]);
  const getScheduledNotificationFunc = async () => {
    if (list.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await getScheduledNotification(payload);
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
  useEffect(() => {
    getScheduledNotificationFunc();
  }, []);

  const [editNotificationForm, setEditNotificationForm] = useState(null);
  const [editLoader, setEditLoader] = useState(false);
  const handleUpdateNotification = async () => {
    setEditLoader(true);
    try {
      let response = await updateScheduleNotification({
        ...editNotificationForm,
        scheduled_times: [JSON.parse(editNotificationForm?.scheduled_times)[0]],
      });

      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        setEditNotificationForm(null);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
    setEditLoader(false);
  };
  return (
    <div className="main_layout  bgBlack d-flex">
      {/* sidebar started */}
      <Sidebar selectedItem="Broadcast Manager" />
      {/* sidebar ended */}

      {/* sectionLayout started */}
      <section
        className="section_layout"
        style={{
          marginLeft: globalState?.isFillSidebarWidth100 ? "260px" : "80px",
          padding: "0px 30px 45px 30px",
        }}
      >
        {/* top nav started  */}
        <div className="sticky-top bg-light" style={{ paddingTop: "45px" }}>
          <TopNav
            navItems={topNav}
            navColor="#fff"
            navBg="#363435"
            divideRowClass="col-xl-6 col-lg-6 col-md-12 col-12"
            selectedItem="User Scheduled"
            sectedNavBg="#D0FF13"
            selectedNavColor="#000"
            broadcast={true}
          />
          <div className="py-2 mt-1"></div>
          <BroadcastNotificationNav
            navItems={tableNav}
            navColor="#000"
            navBg="#e5e5e5"
            divideRowClass="col-xl-4 col-lg-4 col-md-12 col-12"
            selectedItem="Booking - Personal"
            sectedNavBg="#353535"
            selectedNavColor="#fff"
            isItemMoreThen8={true}
            payload={{user_type:"user", type:"personal_booking", category:"scheduled",}}
            getScheduledNotificationFunc={getScheduledNotificationFunc}
          />
        </div>
        {/* top nav ended  */}
        {/* table List started */}
        <div className="tableMain">
          {/* <TableNav tableNav={tableNav} selectedItem="Confirmed" sectedItemBg="#363435" selectedNavColor="#fff" /> */}
          <div
            className="tableBody py-1 px-3 borderRadius30All"
            style={{ background: "#363435" }}
          >
            <div style={{ margin: "20px 10px" }}>
              <table className="table bookingTable outOfArea">
                <thead>
                  <tr style={{ background: "#D0FF13", color: "#000" }}>
                    <th
                      scope="col"
                      style={{ borderRadius: "24px 0px 0px 24px" }}
                    >
                      <div className="d-flex justify-content-center ms-2">
                        <span>Sr. No</span>
                      </div>
                    </th>
                    <th scope="col" style={{width:"250px"}}>Notification Title</th>
                    <th scope="col" style={{width:"300px"}}>Notification Message</th>
                    <th scope="col">Status</th>

                    <th scope="col">Date & Time</th>
                    <th
                      scope="col"
                      style={{ borderRadius: "0px 24px 24px 0px" }}
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <div className="py-2"></div>
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
                          </tr>
                        );
                      })
                    : list?.map((v, i) => {
                        return (
                          <>
                            <tr className="bg-light mb-2">
                              <td
                                scope="row"
                                style={{
                                  borderTopLeftRadius: "30px",
                                  borderBottomLeftRadius: "30px",
                                }}
                              >
                                {i + 1}
                              </td>
                              <td>{v?.title}</td>
                              <td>{v?.message}</td>
                              <td>
                                {v?.is_sent ? (
                                  <button
                                    className="viewShiftBtn"
                                    style={{ background: "#00A431" }}
                                  >
                                    <span>Delivered</span>
                                  </button>
                                ) : (
                                  <button
                                    className="viewShiftBtn"
                                    style={{
                                      background: "#FFB500",
                                      color: "#1C1C1E",
                                    }}
                                  >
                                    <span>Queued</span>
                                  </button>
                                )}
                              </td>

                              <td>
                                <div>
                                  {moment(v?.scheduled_date).format(
                                    "DD MMM, YYYY"
                                  )}{" "}
                                  {moment(
                                    JSON.parse(v?.scheduled_times)[0],
                                    "HH:mm"
                                  ).format("hh:mm A")}
                                </div>
                              </td>

                              <td
                                style={{
                                  borderTopRightRadius: "30px",
                                  borderBottomRightRadius: "30px",
                                }}
                              >
                                <button
                                  className="viewShiftBtn"
                                  style={{ background: "#1C1C1E" }}
                                  onClick={() => setEditNotificationForm(v)}
                                >
                                  Edit
                                </button>
                              </td>
                            </tr>
                            <div className="py-2"></div>
                          </>
                        );
                      })}
                </tbody>
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
      {/* sectionLayout ended */}

      {editNotificationForm?.id && (
        <div
          className="modal fade show d-flex align-items-center manualSetPopup  justify-content-center "
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div
              className="modal-content"
              style={{
                borderRadius: "20px",
                // background: "#353535",
                width: "580px",
              }}
            >
              <div className="modal-body p-0" style={{ fontFamily: "poppins" }}>
                <div
                  style={{
                    wordWrap: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                  className="d-flex justify-content-center w-100"
                >
                  <div
                    className="w-100"
                    style={{
                      borderRadius: "15px 15px 0px 0px",
                      padding: "20px",
                      background: "#353535",
                      color: "#fff",
                    }}
                  >
                    <p className="text-center">Edit User Notification</p>
                  </div>
                </div>
                <div className="notificationFormContent">
                  <div className="d-flex justify-content-between">
                    <div className="categorySelectedDiv">
                      Booked - Personal Ride
                    </div>
                    <div className="dateDiv">
                      {moment(editNotificationForm?.scheduled_date).format(
                        "MMM DD, YYYY"
                      )}
                      {" - "}
                      {moment(
                        JSON.parse(editNotificationForm?.scheduled_times)[0],
                        "HH:mm"
                      ).format("hh:mm A")}
                    </div>
                  </div>
                  <input
                    className="form-control my-3"
                    placeholder="Enter Title"
                    value={editNotificationForm?.title}
                    onChange={(e) =>
                      setEditNotificationForm({
                        ...editNotificationForm,
                        title: e?.target.value,
                      })
                    }
                  />
                  <textarea
                    className="form-control"
                    placeholder="Enter Message"
                    value={editNotificationForm?.message}
                    onChange={(e) =>
                      setEditNotificationForm({
                        ...editNotificationForm,
                        message: e?.target.value,
                      })
                    }
                  />
                  <div className="my-3">
                    <label>Schedule Date & Time</label>
                    <div className="d-flex">
                      <input
                        className="form-control me-2"
                        type="date"
                        onChange={(e) =>
                          setEditNotificationForm({
                            ...editNotificationForm,
                            scheduled_date: e?.target?.value,
                          })
                        }
                      />
                      <input
                        className="form-control ms-2"
                        type="time"
                        onChange={(e) =>
                          setEditNotificationForm({
                            ...editNotificationForm,
                            scheduled_times: JSON.stringify([e.target.value]),
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="d-flex justify-content-end notificationFormActionBtn mt-4">
                    <button
                      onClick={() => setEditNotificationForm(null)}
                      style={{ background: "#fff" }}
                      className="me-4"
                    >
                      Cancel
                    </button>
                    {editNotificationForm?.title &&
                    editNotificationForm?.message &&
                    editNotificationForm?.scheduled_date &&
                    editNotificationForm?.scheduled_times ? (
                      editLoader ? (
                        <button
                          style={{
                            background: "#1C1C1C",
                            color: "#fff",
                            opacity: "0.5",
                          }}
                        >
                          Updating ...
                        </button>
                      ) : (
                        <button
                          onClick={handleUpdateNotification}
                          style={{ background: "#1C1C1C", color: "#fff" }}
                        >
                          Schedule
                        </button>
                      )
                    ) : (
                      <button
                        onClick={handleUpdateNotification}
                        style={{
                          background: "#1C1C1C",
                          color: "#fff",
                          opacity: "0.5",
                        }}
                      >
                        Schedule
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {editNotificationForm?.id && (
        <div className="modal-backdrop fade show"></div>
      )}
    </div>
  );
}

export default BroadcastUserScheduleBookingPersonal;
