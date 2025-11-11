import React from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import TableNav from "../../components/TableNav";
import { useGlobalState } from "../../GlobalProvider";
function PricingCancel() {
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

  return (
    <div className="main_layout  bgBlack d-flex">
      {/* sidebar started */}
      <Sidebar selectedItem="Settings" />
      {/* sidebar ended */}

      {/* sectionLayout started */}
      <section className="section_layout" style={{ marginLeft: globalState?.isFillSidebarWidth100 ? "260px" : "80px" }}>
        {/* top nav started  */}
        <TopNav
          navItems={navItems}
          navColor="#fff"
          navBg="red"
          divideRowClass="col-xl-6 col-lg-6 col-md-6 col-6"
          selectedItem="Cancel"
          sectedNavBg="#fff"
          selectedNavColor="#030303"
          isItemMoreThen8={true}
        />
        {/* top nav ended  */}

        <div className="vh80 d-flex justify-content-center align-items-center">
          <h1>Comming Soon</h1>
        </div>
      </section>
      {/* sectionLayout ended */}
    </div>
  );
}

export default PricingCancel;
