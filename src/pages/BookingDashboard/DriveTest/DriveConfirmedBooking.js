import React from "react";
import Sidebar from "../../../components/Sidebar";
import TopNav from "../../../components/TopNav";
import TableNav from "../../../components/TableNav";

import { useGlobalState } from "../../../GlobalProvider";
function DriveConfirmedBooking() {
  const { setGlobalState, globalState } = useGlobalState();
  const navItems = [
    {
      name: "Sharing",
      path: "/sharing-group-booking",
    },
    {
      name: "Personal",
      path: "/personal-new-booking",
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
    },
    {
      name: "Driver's Route",
      path: "/route-new-booking",
    },
    {
      name: "Out Of Area",
      path: "/out-of-area",
    },
  ];
  const tableNav = [
    {
      name: "New Booking",
      path: "/drive-test-new-booking",
    },
    {
      name: "Confirmed",
      path: "/drive-test-confirmed-booking",
    },
    {
      name: "Group",
      path: "/drive-test-group-booking",
    },
    {
      name: "Assigned",
      path: "/drive-test-assigned-booking",
    },
    {
      name: "Accepted",
      path: "/drive-test-accepted-booking",
    },
    {
      name: "Enroute",
      path: "/drive-test-enroute-booking",
    },
    {
      name: "Completed",
      path: "/drive-test-completed-booking",
    },
    {
      name: "Cancelled",
      path: "/drive-test-cancelled-booking",
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
          selectedItem="Drive Test"
          sectedNavBg="#165F6D"
          selectedNavColor="#fff"
        />
        {/* top nav ended  */}
        {/* table List started */}
        <div className="tableMain">
          <TableNav tableNav={tableNav} selectedItem="Confirmed" sectedItemBg="#363435" selectedNavColor="#fff" />
          <div className="tableBody py-2 px-4 borderRadius50All" style={{ background: "#363435" }}>
          <div className="vh80 d-flex justify-content-center align-items-center">
                <h1 className="text-light">Comming Soon</h1>
            </div>
          </div>
        </div>
        {/* table List ended */}
      </section>
      {/* sectionLayout ended */}
    </div>
  );
}

export default DriveConfirmedBooking;
