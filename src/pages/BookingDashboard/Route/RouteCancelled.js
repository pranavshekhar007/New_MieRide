import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import TopNav from "../../../components/TopNav";
import TableNav from "../../../components/TableNav";
import { getDriverRouteListServ } from "../../../services/bookingDashboard.services";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useGlobalState } from "../../../GlobalProvider";
import NoRecordFound from "../../../components/NoRecordFound";
import moment from "moment";
import { getNavItems } from "../../../utils/TopNavItemData/bookingDashboard";
import { updateNotificationStatusServ } from "../../../services/notification.services";
function RouteCancelled() {
  const { setGlobalState, globalState } = useGlobalState();
  const tableNav = [
    {
      name: "New Booking",
      path: "/route-new-booking",
      notificationLength: globalState?.notificationList?.filter((v) => {
        return v.category == "driver_share_route" && v?.is_read == 0;
      })?.length,
    },
    {
      name: "Confirmed",
      path: "/route-confirmed",
    },
    {
      name: "Cancelled",
      path: "/route-cancelled",
    },
  ];
  const [showSkelton, setShowSkelton] = useState(false);
  const [routeList, setRouteList] = useState([]);
  const handleGetDriverRouteList = async () => {
    if (routeList.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await getDriverRouteListServ({ status: "-1" });
      if (response?.data?.statusCode == "200") {
        setRouteList(response?.data?.data);
      }
    } catch (error) {}
    setShowSkelton(false);
  };
  useEffect(() => {
    handleGetDriverRouteList();
  }, []);
  
  return (
    <div className="main_layout  bgBlack d-flex">
      {/* sidebar started */}
      <Sidebar selectedItem="Booking Dashboard" />
      {/* sidebar ended */}

      {/* sectionLayout started */}
      <section className="section_layout" style={{minWidth:"1350px",  marginLeft :globalState?.isFillSidebarWidth100 ? "260px": "80px" }}>
        {/* top nav started  */}
        <TopNav
          navItems={getNavItems(globalState)}
          navColor="#fff"
          navBg="#000"
          divideRowClass="col-xl-6 col-lg-6 col-md-12 col-12"
          selectedItem="Driver's Route"
          sectedNavBg="#B56B46"
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
                  <tr style={{ background: "#B56B46", color: "#fff" }}>
                    <th scope="col" style={{ borderRadius: "24px 0px 0px 24px" }}>
                      <div className="d-flex justify-content-center ms-2">
                        <span>Sr. No</span>
                      </div>
                    </th>
                    <th scope="col">Request ID</th>
                    <th scope="col">Driver Name</th>
                    <th scope="col">Vehicle Number</th>
                    <th scope="col">Source Address</th>
                    <th scope="col">Destination Address</th>
                    <th scope="col">Start Date Time</th>
                    <th scope="col">End Date Time</th>
                   

                    <th scope="col" style={{ borderRadius: "0px 24px 24px 0px" }}>
                    No of Seats
                    </th>
                  </tr>
                </thead>
                <div className="py-2"></div>
                <tbody>
                  {showSkelton
                    ? [1, 2, 3, 4, 5, 6, 7, 8, 9]?.map((v, i) => {
                      return(
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
                      )
                       
                      }): routeList?.map((v, i) => {
                    return (
                      <>
                        <tr className="bg-light mb-2">
                          <td scope="row" style={{ borderTopLeftRadius: "24px", borderBottomLeftRadius: "24px" }}>
                            {i + 1}
                          </td>
                          <td>{v?.id}</td>
                          <td>{v?.driver_details?.first_name} {v?.driver_details?.last_name}</td>
                              <td>{v?.driver_details?.vehicle_no}</td>
                          <td>
                            <div className="d-flex justify-content-center">
                            <div
                              style={{
                                padding: "3px 6px",
                                width: "150px",
                                background: "#D20001",
                                border: "none",
                                color: "white",
                                borderRadius: "8px",
                                wordWrap: "break-word",
                                whiteSpace: "normal",
                              }}
                            >
                              {v?.start_point}, {v?.start_city}
                            </div>
                            </div>
                           
                          </td>
                          <td>
                          <div className="d-flex justify-content-center">
                            <div
                              style={{
                                padding: "3px 6px",
                                width: "150px",
                                background: "#870184",
                                border: "none",
                                color: "white",
                                borderRadius: "8px",
                                wordWrap: "break-word",
                                whiteSpace: "normal",
                              }}
                            >
                             {v?.end_point}, {v?.end_city}
                            </div>
                            </div>
                            
                          </td>
                          <td style={{ color: "#006198" }}>
                                                          <div>{moment(v?.start_date).format("DD/MM/YYYY")} </div>
                                                          <div>{moment(v?.start_time, "HH:mm").format("hh:mm A")} </div>
                                                        </td>
                                                        <td style={{ color: "#B56B46" }}>
                                                          <div>{moment(v?.reach_date).format("DD/MM/YYYY")} </div>
                                                          <div>{moment(v?.reach_time, "HH:mm").format("hh:mm A")} </div>
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
                              style={{ borderRadius: "12px", width: "100%", height: "100%" , color:"#870184"}}
                            >
                              {v?.seat_available}
                            </div>
                          </td>
                        </tr>
                        <div className="py-2"></div>
                      </>
                    );
                  })}
                </tbody>
              </table>
              {routeList?.length == 0 && !showSkelton && (
                <NoRecordFound theme="light"/>
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

export default RouteCancelled;
