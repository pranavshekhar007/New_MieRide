import React from "react";
import Sidebar from "../../../components/Sidebar";
import TopNav from "../../../components/TopNav";
import TableNav from "../../../components/TableNav";
import { useGlobalState } from "../../../GlobalProvider";
function PersonalDriveTestSurges() {
  const { setGlobalState, globalState } = useGlobalState();
  const navItems = [
    {
      name: "Categories",
      path: "/pricing-categories",
    },
    {
      name: "Province",
      path: "/pricing-province",
    },
    {
      name: "Location",
      path: "/pricing-sharing-location",
    },
    {
      name: "Surges",
      path: "/pricing-sharing-surges",
    },
    {
      name: "Commission",
      path: "/pricing-commission",
    },
   
    {
      name: "Interac Id",
      path: "/pricing-iterac-id",
    },
    {
      name: "Payout Info",
      path: "/pricing-payout-info",
    },
    {
      name: "Cancel",
      path: "/pricing-cancel",
    },
    {
      name: "Price Calculator",
      path: "/pricing-calculator",
    },
  ];
  const tableNav = [
    {
      name: "Sharing",
      path: "/pricing-sharing-surges",
    },
    {
      name: "Personal",
      path: "/pricing-personal-surges",
    },
    {
      name: "To Airport",
      path: "/pricing-to-airport-surges",
    },
    {
      name: "From Airport",
      path: "/pricing-from-airport-surges",
    },
    {
      name: "Drive Test",
      path: "/pricing-drive-test-surges",
    },
    {
      name: "Intercity",
      path: "/pricing-intercity-surges",
    },
  ];
  return (
    <div className="main_layout  bgBlack d-flex">
      {/* sidebar started */}
      <Sidebar selectedItem="Settings" />
      {/* sidebar ended */}

      {/* sectionLayout started */}
      <section className="section_layout" style={{ marginLeft :globalState?.isFillSidebarWidth100 ? "260px": "80px" }}>
        {/* top nav started  */}
        <TopNav
          navItems={navItems}
          navColor="#fff"
          navBg="#A5754D"
          divideRowClass="col-xl-6 col-lg-6 col-md-6 col-6"
          selectedItem="Surges"
          sectedNavBg="#fff"
          selectedNavColor="#030303"
          isItemMoreThen8={true}
        />
        {/* top nav ended  */}
        {/* table List started */}
        <div className="tableMain">
          <TableNav tableNav={tableNav} selectedItem="Drive Test" sectedItemBg="#F3F3F3" />
          <div className="tableBody vh80 d-flex justify-content-center align-items-center py-2 px-4 borderRadius50All" style={{ background: "#F3F3F3" }}>
          <h1>Coming Soon</h1>
          </div>
        </div>
        {/* table List ended */}
      </section>
      {/* sectionLayout ended */}
    </div>
  );
}

export default PersonalDriveTestSurges;
