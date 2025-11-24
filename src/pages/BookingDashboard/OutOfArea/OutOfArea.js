import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/Sidebar";
import TopNav from "../../../components/TopNav";
import TableNav from "../../../components/TableNav";
import { getOutOfAreaListServ } from "../../../services/bookingDashboard.services";
import moment from "moment";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useGlobalState } from "../../../GlobalProvider";
import NoRecordFound from "../../../components/NoRecordFound";
import { updateNotificationStatusServ } from "../../../services/notification.services";
import { getNavItems } from "../../../utils/TopNavItemData/bookingDashboard";
import NewSidebar from "../../../components/NewSidebar";
import CustomTopNav from "../../../components/CustomTopNav";
import SecondaryTopNav from "../../../components/SecondaryTopNav";
function OutOfArea() {
  const { setGlobalState, globalState } = useGlobalState();

  const tableNav = [
    {
      name: "New Booking",
      path: "/sharing-new-booking",
    },
    {
      name: "Confirmed",
      path: "/sharing-confirmed-booking",
    },
    {
      name: "Group",
      path: "/sharing-group-booking",
    },
    {
      name: "Assigned",
      path: "/sharing-assigned-booking",
    },
    {
      name: "Accepted",
      path: "/sharing-accepted-booking",
    },
    {
      name: "Enroute",
      path: "/sharing-enroute-booking",
    },
    {
      name: "Completed",
      path: "/sharing-completed-booking",
    },
    {
      name: "Cancelled",
      path: "/sharing-cancelled-booking",
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
  const [outOfAreaList, setOutOfAreaList] = useState([]);
  const [showSkelton, setShowSkelton] = useState(false);
  const getOutOfAreaFunc = async () => {
    if (outOfAreaList?.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await getOutOfAreaListServ({});
      if (response?.data?.statusCode == "200") {
        setOutOfAreaList(response?.data?.data);
      }
    } catch (error) {}
    setShowSkelton(false);
  };
  useEffect(() => {
    getOutOfAreaFunc();
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
        return v.category == "out_of_area" && v?.is_read == 0;
      })
      ?.map((v, i) => {
        updateNotificationStatusFunc(v?.id);
      });
  });

  const countryFlagMap = {
    91: "IN",
    1: "US",
    44: "GB",
    61: "AU",
    81: "JP",
    86: "CN",
    7: "RU",
    971: "AE",
    49: "DE",
    33: "FR",
    // add more as needed
  };

  return (
    <div className="mainBody">
      <NewSidebar selectedItem="Booking Dashboard" />
      <div className="contentLayout">
        <div className="bgWhite borderRadius30 p-4 minHeight100vh">
          <div className="sticky-top bgWhite">
            <CustomTopNav navItems={navItems} selectedNav="Out Of Area" />
            <SecondaryTopNav
              navItems={tableNav}
              selectedNav="Personal Later"
              navBg="#E5E5E5"
              navColor="#1C1C1C"
              selectedNavBg="#353535"
              selectedNavColor="#fff"
            />
          </div>
          {/* <div className="row">
          <div className="col-3">
            <div>
              <img src=""/>
              <input className="form-control"/>
            </div>
          </div>
          <div className="col-3">
            <div>
              <img src=""/>
              <input className="form-control"/>
            </div>
          </div>
          <div className="col-3">
            <div>
              <img src=""/>
              <input className="form-control"/>
            </div>
          </div>
          <div className="col-3">
            <div>
              <img src=""/>
              <input className="form-control"/>
            </div>
          </div>
        </div> */}
          {/* table List started */}
          <div className="tableMain">
            <div className="tableOuterContainer bgDark mt-4">
              <div>
                <table className="table">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        style={{ borderRadius: "24px 0px 0px 24px" }}
                      >
                        <div className="d-flex justify-content-center ms-2">
                          <span>Sr. No</span>
                        </div>
                      </th>
                      <th scope="col">User Id</th>
                      <th scope="col">Username</th>
                      <th scope="col">Source Address</th>
                      <th scope="col">Destination Address</th>
                      <th scope="col">Category</th>
                      <th scope="col">Phone Number</th>
                      <th
                        scope="col"
                        style={{ borderRadius: "0px 24px 24px 0px" }}
                      >
                        Date & Time
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
                            </tr>
                          );
                        })
                      : outOfAreaList?.map((v, i) => {
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
                                  {v?.user_details?.first_name +
                                    " " +
                                    v?.user_details?.last_name}
                                </td>
                                <td>
                                  <div className="d-flex justify-content-center">
                                    <div
                                      style={{
                                        padding: "3px 6px",
                                        textAlign: "start",
                                        borderRadius: "8px",
                                        width: "150px",
                                        wordWrap: "break-word",
                                        whiteSpace: "normal",
                                      }}
                                    >
                                      {v?.source}
                                    </div>
                                  </div>{" "}
                                </td>
                                <td>
                                  <div className="d-flex justify-content-center">
                                    <div
                                      style={{
                                        padding: "3px 6px",
                                        borderRadius: "8px",
                                        textAlign: "start",
                                        width: "150px",
                                        wordWrap: "break-word",
                                        whiteSpace: "normal",
                                      }}
                                    >
                                      {v?.destination}
                                    </div>
                                  </div>{" "}
                                </td>

                                <td>
                                  <div>
                                    <button className="outOfAreaCategoryBtn">
                                      {v?.category_details?.name}
                                    </button>
                                  </div>
                                </td>

                                <td className="phoneCell">
                                  <div className="phoneWrapper">
                                    <img
                                      className="countryFlag"
                                      src={`https://flagsapi.com/${
                                        countryFlagMap[
                                          v?.user_details?.country_code
                                        ]
                                      }/flat/32.png`}
                                      alt="flag"
                                    />

                                    <span className="phoneNumber">
                                      {v?.user_details?.contact}
                                    </span>
                                  </div>
                                </td>

                                {/* <td>{moment(v?.created_at).format("DD/MM/YYYY")}</td> */}

                                <td
                                  className="outOfAreaDateTimeCell"
                                  style={{
                                    borderTopRightRadius: "24px",
                                    borderBottomRightRadius: "24px",
                                    overflow: "hidden",
                                  }}
                                >
                                  {moment(v?.created_at).format(
                                    "DD MMM, YYYY (hh:mm A)"
                                  )}
                                </td>
                              </tr>
                              <div className="py-2"></div>
                            </>
                          );
                        })}
                  </tbody>
                </table>
                {outOfAreaList?.length == 0 && !showSkelton && (
                  <NoRecordFound theme="light" />
                )}
              </div>
            </div>
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
          marginLeft: globalState?.isFillSidebarWidth100 ? "260px" : "80px",
        }}
      >
        {/* top nav started  */}
        <TopNav
          navItems={getNavItems(globalState)}
          navColor="#fff"
          navBg="#363435"
          divideRowClass="col-xl-6 col-lg-6 col-md-12 col-12"
          selectedItem="Out Of Area"
          sectedNavBg="#D0FF13"
          selectedNavColor="#000"
          bookingTop={true}
        />
        {/* top nav ended  */}
        <div className="row">
          <div className="col-3">
            <div>
              <img src="" />
              <input className="form-control" />
            </div>
          </div>
          <div className="col-3">
            <div>
              <img src="" />
              <input className="form-control" />
            </div>
          </div>
          <div className="col-3">
            <div>
              <img src="" />
              <input className="form-control" />
            </div>
          </div>
          <div className="col-3">
            <div>
              <img src="" />
              <input className="form-control" />
            </div>
          </div>
        </div>
        {/* table List started */}
        <div className="tableMain">
          <div
            className="tableBody py-1 px-3 borderRadius30All"
            style={{ background: "#363435" }}
          >
            <div style={{ margin: "20px 10px" }}>
              <table className="table bookingTable outOfArea">
                <thead>
                  <tr style={{ background: "#FFFD82", color: "#000" }}>
                    <th
                      scope="col"
                      style={{ borderRadius: "24px 0px 0px 24px" }}
                    >
                      <div className="d-flex justify-content-center ms-2">
                        <span>Sr. No</span>
                      </div>
                    </th>
                    <th scope="col">User Id</th>
                    <th scope="col">Username</th>
                    <th scope="col">Source Address</th>
                    <th scope="col">Destination Address</th>
                    <th scope="col">Category</th>
                    <th scope="col">Phone Number</th>
                    <th
                      scope="col"
                      style={{ borderRadius: "0px 24px 24px 0px" }}
                    >
                      Date & Time
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
                          </tr>
                        );
                      })
                    : outOfAreaList?.map((v, i) => {
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
                              <td>{v?.user_details?.id}</td>
                              <td>
                                {v?.user_details?.first_name +
                                  " " +
                                  v?.user_details?.last_name}
                              </td>
                              <td>
                                <div className="d-flex justify-content-center">
                                  <div
                                    style={{
                                      padding: "3px 6px",

                                      borderRadius: "8px",
                                      width: "150px",
                                      wordWrap: "break-word",
                                      whiteSpace: "normal",
                                    }}
                                  >
                                    {v?.source}
                                  </div>
                                </div>{" "}
                              </td>
                              <td>
                                <div className="d-flex justify-content-center">
                                  <div
                                    style={{
                                      padding: "3px 6px",
                                      borderRadius: "8px",
                                      width: "150px",
                                      wordWrap: "break-word",
                                      whiteSpace: "normal",
                                    }}
                                  >
                                    {v?.destination}
                                  </div>
                                </div>{" "}
                              </td>

                              <td>
                                <div>
                                  <button className="outOfAreaCategoryBtn">
                                    {v?.category_details?.name}
                                  </button>
                                </div>
                              </td>

                              <td>
                                {v?.user_details?.country_code}{" "}
                                {v?.user_details?.contact}
                              </td>
                              {/* <td>{moment(v?.created_at).format("DD/MM/YYYY")}</td> */}

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
                                    height: "100%",
                                  }}
                                >
                                  {moment(v?.created_at).format("hh:mm A")}
                                </div>
                              </td>
                            </tr>
                            <div className="py-2"></div>
                          </>
                        );
                      })}
                </tbody>
              </table>
              {outOfAreaList?.length == 0 && !showSkelton && (
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

export default OutOfArea;
