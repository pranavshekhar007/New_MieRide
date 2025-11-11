import React from "react";
import Sidebar from "../../../components/Sidebar";
import TopNav from "../../../components/TopNav";
import TableNav from "../../../components/TableNav";

import { useGlobalState } from "../../../GlobalProvider";
function AirportCommingSoon() {
  const { setGlobalState, globalState } = useGlobalState();
  const navItems = [
    {
      name: "Sharing",
      path: "/sharing-group-booking",
    },
    {
      name: "Personal",
      path: "/personal-confirmed-booking",
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
  return (
    <div className="main_layout  bgBlack d-flex">
      {/* sidebar started */}
      <Sidebar selectedItem="Booking Dashboard" />
      {/* sidebar ended */}

      {/* sectionLayout started */}
      <section className="section_layout" style={{ marginLeft :globalState?.isFillSidebarWidth100 ? "260px": "80px" }}>
        {/* top nav started  */}
        <TopNav
          navItems={navItems}
          navColor="#fff"
          navBg="#000"
          divideRowClass="col-xl-6 col-lg-6 col-md-12 col-12"
          selectedItem="Airport"
          sectedNavBg="#139F01"
          selectedNavColor="#fff"
        />
        {/* top nav ended  */}
        {/* table List started */}
        <div className="tableMain">
        <div className="vh80 d-flex justify-content-center align-items-center">
                <h1 className="text-dark">Comming Soon</h1>
            </div>
        </div>
        {/* table List ended */}
      </section>
      {/* sectionLayout ended */}
    </div>
  );
}

export default AirportCommingSoon;
