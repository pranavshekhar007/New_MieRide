import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import TopNav from "../../../components/TopNav";
import TableNav from "../../../components/TableNav";
import { getDriverAvailabilityListServ } from "../../../services/bookingDashboard.services";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import NoRecordFound from "../../../components/NoRecordFound";
import { useGlobalState } from "../../../GlobalProvider";
import moment from "moment";
import { updateNotificationStatusServ } from "../../../services/notification.services";
import { getNavItems } from "../../../utils/TopNavItemData/bookingDashboard";
function AvailabilityCancelledBooking() {
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
  const [showSkelton, setShowSkelton] = useState(false);
  const [availabilityList, setAvailabilityList] = useState([]);
  const handleGetDriverAvailibilityList = async () => {
    if (availabilityList.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await getDriverAvailabilityListServ({ status: "-1" });
      if (response?.data?.statusCode == "200") {
        setAvailabilityList(response?.data?.data);
      }
    } catch (error) {}
    setShowSkelton(false);
  };
  useEffect(() => {
    handleGetDriverAvailibilityList();
  }, []);
  const updateNotificationStatusFunc = async (id) => {
    try {
      let response = await updateNotificationStatusServ({ notification_id: id });
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
    <div className="main_layout  bgBlack d-flex">
      {/* sidebar started */}
      <Sidebar selectedItem="Booking Dashboard" />
      {/* sidebar ended */}

      {/* sectionLayout started */}
      <section
        className="section_layout"
        style={{ minWidth: "1350px", marginLeft: globalState?.isFillSidebarWidth100 ? "260px" : "80px" }}
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
          <TableNav tableNav={tableNav} selectedItem="Cancelled" sectedItemBg="#363435" selectedNavColor="#fff" />
          <div className="tableBody py-2 px-4 borderRadius50All" style={{ background: "#363435" }}>
            <div style={{ margin: "20px 10px" }}>
              <table className="table bookingTable">
                <thead>
                  <tr style={{ background: "#FE6A35", color: "#fff" }}>
                    <th scope="col" style={{ borderRadius: "24px 0px 0px 24px" }}>
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

                    <th scope="col" style={{ borderRadius: "0px 24px 24px 0px" }}>
                      End Date Time
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
                    : availabilityList?.map((v, i) => {
                        return (
                          <>
                            <tr className="bg-light mb-2">
                              <td scope="row" style={{ borderTopLeftRadius: "24px", borderBottomLeftRadius: "24px" }}>
                                {i + 1}
                              </td>
                              <td>{v?.id}</td>
                              <td>
                                {v?.driver_details?.first_name} {v?.driver_details?.last_name}
                              </td>
                              <td>{v?.driver_details?.vehicle_no}</td>
                              <td>
                                {v?.start_cities?.map((v, i) => {
                                  return (
                                    <div>
                                      <button
                                        className="btn btn-primary mb-2"
                                        style={{
                                          padding: "3px 6px",
                                          background: "#CC3A11",
                                          border: "none",
                                          width: "150px",
                                        }}
                                      >
                                        {v}
                                      </button>
                                    </div>
                                  );
                                })}
                              </td>
                              <td>
                                <div>
                                  {v?.drop_cities?.map((v, i) => {
                                    return (
                                      <div>
                                        <button
                                          className="btn btn-primary mb-2"
                                          style={{
                                            padding: "3px 6px",
                                            background: "#019740",
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
                                <div>{moment(v?.start_date).format("DD/MM/YYYY")} </div>

                                <div>{moment(v?.start_time, "HH:mm").format("hh:mm A")} </div>
                              </td>
                              <td
                                style={{
                                  color: "#B56B46",
                                  borderTopRightRadius: "24px",
                                  borderBottomRightRadius: "24px",
                                }}
                              >
                                <div>{moment(v?.start_date).format("DD/MM/YYYY")} </div>
                                <div>{moment(v?.end_time, "HH:mm").format("hh:mm A")} </div>
                              </td>
                            </tr>
                            <div className="py-2"></div>
                          </>
                        );
                      })}
                </tbody>
              </table>
              {availabilityList?.length == 0 && !showSkelton && <NoRecordFound theme="light" />}
            </div>
          </div>
        </div>
        {/* table List ended */}
      </section>
      {/* sectionLayout ended */}
    </div>
  );
}

export default AvailabilityCancelledBooking;
