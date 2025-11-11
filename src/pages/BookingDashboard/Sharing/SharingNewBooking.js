import React from "react";
import Sidebar from "../../../components/Sidebar";
import TopNav from "../../../components/TopNav";
import TableNav from "../../../components/TableNav";
import { useGlobalState } from "../../../GlobalProvider";
function SharingNewBooking() {
  const { setGlobalState, globalState } = useGlobalState();
  const navItems = [
    {
      name: "Sharing",
      path: "/sharing-group-booking",  
    },
    {
      name: "Personal",
      path: "/personal-assigned-booking",
    },
    {
      name: "Airport",
      path: "/airport-comming-soon",
    },
    {
      name: "Drive Test",
      path: "/drive-test-new-booking",
    },
    {
      name: "Intercity",
      path: "/intercity-comming-soon",
    },
    {
      name: "Driver's Availability",
      path: "/availability-confirmed",
      notificationLength:globalState?.notificationList
      ?.filter((v) => {
        return v.category == "driver_availability" && v?.is_read ==0;
      })
      ?.length
    },
    {
      name: "Driver's Route",
      path: "/route-new-booking",
    },
    {
      name: "Out Of Area",
      path: "/out-of-area",
      notificationLength:globalState?.notificationList
      ?.filter((v) => {
        return v.category == "out_of_area" && v?.is_read ==0;
      })
      ?.length
    },
  ];
  const tableNav = [
    
    {
      name: "Group",
      path: "/sharing-group-booking",
    },
    {
      name: "Route",
      path: "/sharing-route-booking",
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
      name: "Manual",
      path: "/sharing-manual-booking",
    },
    {
      name: "Missed",
      path: "/sharing-missed-booking",
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
  return (
    <div className="main_layout  bgBlack d-flex">
      {/* sidebar started */}
      <Sidebar selectedItem="Booking Dashboard" />
      {/* sidebar ended */}

      {/* sectionLayout started */}
      <section className="section_layout" style={{minWidth:"1350px",  marginLeft :globalState?.isFillSidebarWidth100 ? "260px": "80px" }}>
        {/* top nav started  */}
        <TopNav
          navItems={navItems}
          navColor="#fff"
          navBg="#000"
          divideRowClass="col-xl-6 col-lg-6 col-md-12 col-12"
          selectedItem="Sharing"
          sectedNavBg="#139F01"
          selectedNavColor="#fff"
        />
        {/* top nav ended  */}
        {/* table List started */}
        <div className="tableMain">
          <TableNav tableNav={tableNav} selectedItem="New Booking" sectedItemBg="#363435" selectedNavColor="#fff" />
          <div className="tableBody py-2 px-4 borderRadius50exceptTopLeft" style={{ background: "#363435" }}>
            <div style={{ margin: "20px 10px" }}>
              <table className="table bookingTable" >
                <thead>
                  <tr style={{ background: "#139F01", color:"#fff" }}>
                    <th scope="col" style={{ borderRadius: "24px 0px 0px 24px" }}>
                    <div className="d-flex justify-content-center ms-2">
                        <span>Sr. No</span>
                      </div>
                    </th>
                    <th scope="col">Booking ID</th>
                    <th scope="col">Source Address</th>
                    <th scope="col">Destination Address</th>
                    <th scope="col">Username</th>
                    <th scope="col">Booking Date</th>
                    <th scope="col">Booking Time</th>
                    <th scope="col">Time Choice</th>
                    <th scope="col">Total Amount</th>
                    <th scope="col">Admin Fee</th>
                    <th scope="col">Driver Earn</th>
                    <th scope="col">Booking Placed</th>
                    <th scope="col" style={{ borderRadius: "0px 24px 24px 0px" }}>
                      Action
                    </th>
                  </tr>
                </thead>
                <div className="py-2"></div>
                <tbody >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9]?.map((v, i) => {
                    return (
                        <>
                        <tr className="bg-light mb-2">
                        <td scope="row" style={{ borderTopLeftRadius: "24px", borderBottomLeftRadius: "24px" }}>
                          {i + 1}
                        </td>
                        <td>12</td>
                        <td>8400, Helay</td>
                        <td>9 Iganu Trail</td>
                        <td>Sandy</td>
                        <td>12/10/2024</td>
                        <td>04:15 pm</td>
                        <td>Pickup</td>
                        <td>$80</td>
                        <td>$30</td>
                        <td>$10</td>
                        <td>04:20 pm</td>
                        <td
                          style={{ borderTopRightRadius: "24px", borderBottomRightRadius: "24px", overflow: "hidden" }}
                        >
                          <div
                            className="d-flex justify-content-center align-items-center"
                            style={{ borderRadius: "12px", width: "100%", height: "100%" }}
                          >
                            <select>
                              <option>Cancel</option>
                              <option>Accept</option>
                              <option>Reject</option>
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
            </div>
          </div>
        </div>
        {/* table List ended */}
      </section>
      {/* sectionLayout ended */}
    </div>
  );
}

export default SharingNewBooking;
