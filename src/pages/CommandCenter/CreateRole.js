import React from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import TableNav from "../../components/TableNav";
import NewSidebar from "../../components/NewSidebar";
import { useGlobalState } from "../../GlobalProvider";
function CreateRole() {
  const { setGlobalState, globalState } = useGlobalState();
  const navItems = [
    {
      name: "Create Role",
      path: "/create-role",
    },
    {
      name: "Permissions",
      path: "/permissions",
    },
    {
      name: "Assign Role",
      path: "/assign-role",
    },
    {
      name: "Organisation Tree",
      path: "/organisation-tree",
    },
  ];
 return (
    <div className="mainBody">
      <NewSidebar selectedItem="Command Center" />
      <div className="contentLayout">
        <div className="bgWhite borderRadius30 p-4 minHeight100vh">
          <div className="sticky-top bgWhite">
            
          </div>
          <div className="vh-100 bgDark d-flex justify-content-center align-items-center borderRadius30 ">
            <p
              style={{
                color: "#FFF",
                textAlign: "center",
                fontFamily: "Poppins",
                fontSize: "50px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "normal",
              }}
            >
              Work In Progress
            </p>
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <div className="main_layout  bgBlack d-flex">
      {/* sidebar started */}
      <Sidebar selectedItem="Command Center" />
      {/* sidebar ended */}

      {/* sectionLayout started */}
      <section className="section_layout" style={{ marginLeft :globalState?.isFillSidebarWidth100 ? "260px": "80px" }}>
        {/* top nav started  */}
        <TopNav
          navItems={navItems}
          navColor="#fff"
          navBg="#000000"
          divideRowClass="col-xl-8 col-lg-8 col-md-12 col-12"
          selectedItem="Create Role"
          sectedNavBg="#CD3939"
          selectedNavColor="#fff"
        />
        {/* top nav ended  */}
        {/* table List started */}
        <div className="tableMain">
          
          <div className="tableBody py-2 px-4 borderRadius50All" style={{ background: "#F3F3F3" }}>
          <div className="vh80 d-flex justify-content-center align-items-center">
                <h1>Comming Soon</h1>
            </div>
          </div>
        </div>
        {/* table List ended */}
      </section>
      {/* sectionLayout ended */}
    </div>
  );
}

export default CreateRole;
