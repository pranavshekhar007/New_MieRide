import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import {
  getSupportRecordServ,
  deleteSupportRecordServ,
  addSupportRecordServ,
  updateSupportRecordServ,
  contactQueryListServ,
} from "../../services/support.services";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useGlobalState } from "../../GlobalProvider";
function SupportContactQueryList() {
  const { setGlobalState, globalState } = useGlobalState();
  const navItems = [
    {
      name: "Faq",
      path: "/support-faq-user",
    },
    {
      name: "Terms And Condition",
      path: "/support-tc-user",
    },
    {
      name: "Privacy Policy",
      path: "/support-pp-user",
    },
    {
      name: "Support",
      path: "/support-all",
    },
    {
      name: "Contact Queries",
      path: "/support-query-list",
    },
  ];
  const [list, setList] = useState([]);
  const getContactListFunc = async () => {
    try {
      let response = await contactQueryListServ();
      if (response?.data?.statusCode == "200") {
        setList(response?.data?.data);
      }
    } catch (error) {}
  };
  useEffect(() => {
    getContactListFunc();
  }, []);

  return (
    <div className="main_layout  bgBlack d-flex">
      {/* sidebar started */}
      <Sidebar selectedItem="Support" />
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
          navItems={navItems}
          navColor="#fff"
          navBg="#040707"
          divideRowClass="col-xl-6 col-lg-6 col-md-12 col-12"
          selectedItem="Contact Queries"
          sectedNavBg="#fff"
          selectedNavColor="#030303"
        />
        {/* top nav ended  */}
        {/* table List started */}
        <div className="tableMain supportForm my-5 mx-3">
          {list?.map((v, i) => {
            return (
              <div className="border p-3 shadow-sm rounded mb-3">
                <p>{v?.first_name + " " + v?.last_name}</p>
                <p>{v?.email}</p>
                <p>
                  <b>{v?.subject}</b>
                </p>
                <p>
                  <b>{v?.message}</b>
                </p>
              </div>
            );
          })}
        </div>
        {/* table List ended */}
      </section>
      {/* sectionLayout ended */}
    </div>
  );
}

export default SupportContactQueryList;
