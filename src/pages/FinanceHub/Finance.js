import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import TableNav from "../../components/TableNav";
import { useGlobalState } from "../../GlobalProvider";
import {
  getListReferalServ,
  storeReferalCommissionServ,
  updateReferalCommissionServ,
} from "../../services/financeHub.services";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import NoRecordFound from "../../components/NoRecordFound";
import NewSidebar from "../../components/NewSidebar";
function Finance() {
  const { setGlobalState, globalState } = useGlobalState();
  const navItems = [
    {
      name: "Finance",
      path: "/finance-details",
    },
    {
      name: "Bonus",
      path: "/bonus-list",
    },
  ];
  const [userFormData, setUserFormData] = useState({
    type: "agent",
    app_type: "user",
    commission: "",
  });
  const [driverFormData, setDriverFormData] = useState({
    type: "agent",
    app_type: "driver",
    commission: "",
  });
  const handleGetFinanceDetailsFunc = async () => {
    try {
      let response = await getListReferalServ({ type: "agent" });
      if (response?.data?.statusCode == "200") {
        response?.data?.data?.map((v, i) => {
          if (v?.app_type == "user") {
            setUserFormData(v);
          } else {
            setDriverFormData(v);
          }
        });
      }
    } catch (error) {
      console.log("Internal Server Error");
    }
  };

  useState(() => {
    handleGetFinanceDetailsFunc();
  }, []);
  const [isUserInpReadable, setIsUserInpReadable] = useState(false);
  const [isDriverInpReadable, setIsDriverInpReadable] = useState(false);
  const handleStoreReferralFunc = async (type) => {
    try {
      let response = await storeReferalCommissionServ(type == "user" ? userFormData : driverFormData);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        handleGetFinanceDetailsFunc();
        setIsUserInpReadable(false);
        setIsDriverInpReadable(false);
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
  };
  const handleUpdateReferralFunc = async (type) => {
    try {
      let response = await updateReferalCommissionServ(type == "user" ? userFormData : driverFormData);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        handleGetFinanceDetailsFunc();
        setIsUserInpReadable(false);
        setIsDriverInpReadable(false);
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
  };
 return(
    <div className="mainBody">
      <NewSidebar selectedItem="Rewards" />
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
  )
  return (
    <div className="main_layout  bgBlack d-flex">
      {/* sidebar started */}
      <Sidebar selectedItem="Finance Hub" />
      {/* sidebar ended */}

      {/* sectionLayout started */}
      <section className="section_layout" style={{ marginLeft: globalState?.isFillSidebarWidth100 ? "260px" : "80px" }}>
        {/* top nav started  */}
        <TopNav
          navItems={navItems}
          navColor="#000"
          divideRowClass="col-xl-8 col-lg-8 col-md-12 col-12"
          selectedItem="Finance"
          sectedNavBg="#000"
          selectedNavColor="#fff"
          navBg="#B7B1F1"
        />
        {/* top nav ended  */}
        {/* table List started */}
        <div className="tableMain">
          {/* <TableNav tableNav={tableNav} selectedItem="Weekly Withdraw" sectedItemBg="#f2fbff" /> */}
          <div className="tableBody vh-100 p-5 borderRadius50All financeMain" style={{ background: "#F3F3F3" }}>
            <div className="row d-flex align-items-center mx-5 mt-4">
              <div className="col-3">
                <h3 className="mb-0">App Name</h3>
              </div>
              <div className="col-5">
                <h4 className="mb-0 text-center">Price</h4>
              </div>
            </div>
            <div className="row d-flex align-items-center mx-5 mt-5">
              <div className="col-3">
                <h5 className="mb-0">User App</h5>
              </div>
              <div className="col-5">
                <div className="d-flex align-items-center">
                  <input
                    value={userFormData?.commission}
                    onChange={(e) => setUserFormData({ ...userFormData, commission: e?.target?.value })}
                    className="form-control shadow-sm"
                    style={{ border: "none" }}
                    readOnly={!isUserInpReadable}
                  />
                  <span style={{ position: "relative", left: "-20px" }}>$</span>
                </div>
              </div>
              <div className="col-2 d-flex justify-content-center">
                <button
                  className=" btn btn-danger w-100"
                  onClick={() => setIsUserInpReadable(true)}
                  style={{ background: "#D61108", borderRadius: "8px", opacity: isUserInpReadable ? "0.5" : "1" }}
                >
                  Edit
                </button>
              </div>
              <div className="col-2 d-flex justify-content-center">
              {isUserInpReadable && userFormData?.commission ? <button
                  onClick={() => userFormData?.id ? handleUpdateReferralFunc("user"): handleStoreReferralFunc("user")}
                  className=" btn btn-success w-100"
                  style={{ background: "#139F02", borderRadius: "8px", opacity: "1" }}
                >
                  Submit
                </button>: <button
                  
                  className=" btn btn-success w-100"
                  style={{ background: "#139F02", borderRadius: "8px", opacity: "0.5" }}
                >
                  Submit
                </button>}
              </div>
            </div>
            <div className="row d-flex align-items-center mx-5 mt-5">
              <div className="col-3">
                <h5 className="mb-0">Driver App</h5>
              </div>
              <div className="col-5">
                <div className="d-flex align-items-center">
                  <input
                    value={driverFormData?.commission}
                    onChange={(e) => setDriverFormData({ ...driverFormData, commission: e?.target?.value })}
                    className="form-control shadow-sm"
                    style={{ border: "none" }}
                    readOnly={!isDriverInpReadable}
                  />
                  <span style={{ position: "relative", left: "-20px" }}>$</span>
                </div>
              </div>
              <div className="col-2 d-flex justify-content-center">
                <button
                  className=" btn btn-danger w-100"
                  onClick={() => setIsDriverInpReadable(true)}
                  style={{ background: "#D61108", borderRadius: "8px", opacity: isDriverInpReadable ? "0.5" : "1" }}
                >
                  Edit
                </button>
              </div>
              <div className="col-2 d-flex justify-content-center">
              {isDriverInpReadable && driverFormData?.commission ? <button
                  onClick={() => driverFormData?.id ? handleUpdateReferralFunc("driver"): handleStoreReferralFunc("driver")}
                  className=" btn btn-success w-100"
                  style={{ background: "#139F02", borderRadius: "8px", opacity: "1" }}
                >
                  Submit
                </button>: <button
                  
                  className=" btn btn-success w-100"
                  style={{ background: "#139F02", borderRadius: "8px", opacity: "0.5" }}
                >
                  Submit
                </button>}
                
              </div>
            </div>
          </div>
        </div>
        {/* table List ended */}
      </section>
      {/* sectionLayout ended */}
    </div>
  );
}

export default Finance;
