import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import TopNav from "../../../components/TopNav";
import TableNav from "../../../components/TableNav";
import {
  getDriverAvailabilityListServ,
  updateDriverAvailabilityServ,
} from "../../../services/bookingDashboard.services";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NoRecordFound from "../../../components/NoRecordFound";
import { useGlobalState } from "../../../GlobalProvider";
import { updateNotificationStatusServ } from "../../../services/notification.services";
import { getNavItems } from "../../../utils/TopNavItemData/bookingDashboard";
import NewSidebar from "../../../components/NewSidebar";
import CustomTopNav from "../../../components/CustomTopNav";
import SecondaryTopNav from "../../../components/SecondaryTopNav";
function AvailabilityNewBooking() {
  const { setGlobalState, globalState } = useGlobalState();
  const tableNav = [
    {
      name: "Confirmed",
      path: "/availability-confirmed",
    },
    {
      name: "Cancelled",
      path: "/availability-cancelled",
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

  const [showSkelton, setShowSkelton] = useState(false);
  const [availabilityList, setAvailabilityList] = useState([]);
  const handleGetDriverAvailibilityList = async () => {
    if (availabilityList.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await getDriverAvailabilityListServ({ status: "0" });
      if (response?.data?.statusCode == "200") {
        setAvailabilityList(response?.data?.data);
      }
    } catch (error) {}
    setShowSkelton(false);
  };
  useEffect(() => {
    handleGetDriverAvailibilityList();
  }, []);
  const updateStatusFunc = async (formData) => {
    try {
      let response = await updateDriverAvailabilityServ(formData);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        handleGetDriverAvailibilityList();
      }
    } catch (error) {
      toast.error("Internal Server Error");
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
        return v.category == "driver_availability" && v?.is_read == 0;
      })
      ?.map((v, i) => {
        updateNotificationStatusFunc(v?.id);
      });
  });
  return (
    <div className="mainBody">
      <NewSidebar selectedItem="Booking Dashboard" />
      <div className="contentLayout">
        <div className="bgWhite borderRadius30 p-4 minHeight100vh">
          <div className="sticky-top bgWhite">
            <CustomTopNav navItems={navItems} selectedNav="Driver's Availability" />
            <SecondaryTopNav
              navItems={tableNav}
              selectedNav="Completed"
              navBg="#E5E5E5"
              navColor="#1C1C1C"
              selectedNavBg="#353535"
              selectedNavColor="#fff"
            />
          </div>
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
          minWidth: "1350px",
          marginLeft: globalState?.isFillSidebarWidth100 ? "260px" : "80px",
        }}
      >
        {/* top nav started  */}
        <TopNav
          navItems={getNavItems(globalState)}
          navColor="#fff"
          navBg="#000"
          divideRowClass="col-xl-6 col-lg-6 col-md-12 col-12"
          selectedItem="Driver's Availability"
          sectedNavBg="#FE6A35"
          selectedNavColor="#fff"
        />
        {/* top nav ended  */}
        {/* table List started */}
        <div className="tableMain">
          <TableNav
            tableNav={tableNav}
            selectedItem="New Booking"
            sectedItemBg="#363435"
            selectedNavColor="#fff"
          />
          <div
            className="tableBody py-2 px-4 borderRadius50exceptTopLeft"
            style={{ background: "#363435" }}
          >
            <div style={{ margin: "20px 10px" }}>
              <table className="table bookingTable">
                <thead>
                  <tr style={{ background: "#FE6A35", color: "#fff" }}>
                    <th
                      scope="col"
                      style={{ borderRadius: "24px 0px 0px 24px" }}
                    >
                      <div className="d-flex justify-content-center ms-2">
                        <span>Sr. No</span>
                      </div>
                    </th>
                    <th scope="col">Request ID</th>
                    <th scope="col">Driver Name</th>
                    <th scope="col">Vehicle Number</th>
                    <th scope="col">Source City</th>
                    <th scope="col">Destination Cities</th>
                    <th scope="col">Start Date Time</th>
                    <th scope="col">End Date Time</th>

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
                    : availabilityList?.map((v, i) => {
                        return (
                          <>
                            <tr className="bg-light mb-2">
                              <td
                                scope="row"
                                style={{
                                  borderTopLeftRadius: "24px",
                                  borderBottomLeftRadius: "24px",
                                }}
                              >
                                {i + 1}
                              </td>
                              <td>{v?.id}</td>
                              <td>
                                {v?.driver_details?.first_name}{" "}
                                {v?.driver_details?.last_name}
                              </td>
                              <td>{v?.driver_details?.vehicle_no}</td>
                              <td>
                                <div>
                                  <button
                                    className="btn btn-primary"
                                    style={{
                                      padding: "3px 6px",
                                      background: "#B46B44",
                                      border: "none",
                                    }}
                                  >
                                    {v?.start_city}
                                  </button>
                                </div>
                              </td>
                              <td>
                                <div>
                                  {JSON.parse(v?.drop_cities)?.map((v, i) => {
                                    return (
                                      <div>
                                        <button
                                          className="btn btn-primary mb-2"
                                          style={{
                                            padding: "3px 6px",
                                            background: "#19659C",
                                            border: "none",
                                            width: "150px",
                                          }}
                                        >
                                          {v}
                                        </button>
                                      </div>
                                    );
                                  })}
                                </div>
                              </td>
                              <td style={{ color: "#006198" }}>
                                <div>{v?.start_date}</div>
                                <div>{v?.start_time}</div>
                              </td>
                              <td style={{ color: "#B56B46" }}>
                                <div>{v?.end_date}</div>
                                <div>{v?.end_date}</div>
                                <div>{v?.end_time}</div>
                              </td>
                              <td
                                style={{
                                  borderTopRightRadius: "24px",
                                  borderBottomRightRadius: "24px",
                                  overflow: "hidden",
                                }}
                              >
                                <div
                                  className="d-flex justify-content-center align-items-center"
                                  style={{
                                    borderRadius: "12px",
                                    width: "100%",
                                    height: "100%",
                                  }}
                                >
                                  <select
                                    onChange={(e) =>
                                      updateStatusFunc({
                                        id: v.id,
                                        status: e.target.value,
                                      })
                                    }
                                  >
                                    <option>Action</option>
                                    <option
                                      value="1"
                                      style={{
                                        color: "#144E02",
                                        background: "white",
                                      }}
                                    >
                                      Approve
                                    </option>
                                    <option
                                      value="-1"
                                      style={{
                                        color: "#D20001",
                                        background: "white",
                                      }}
                                    >
                                      Reject
                                    </option>
                                  </select>
                                </div>
                              </td>
                            </tr>
                            <div className="py-2"></div>
                          </>
                        );
                      })}
                </tbody>
              </table>
              {availabilityList?.length == 0 && !showSkelton && (
                <NoRecordFound theme="light" />
              )}
            </div>
          </div>
        </div>
        {/* table List ended */}
      </section>
      {/* sectionLayout ended */}
    </div>
  );
}

export default AvailabilityNewBooking;
