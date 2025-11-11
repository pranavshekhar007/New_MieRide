import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import {
  addCommissionServ,
  getCommissionListServ,
  editCommissionServ,
} from "../../services/priceAndCity.services";
import { toast } from "react-toastify";
import { useGlobalState } from "../../GlobalProvider";
import NewSidebar from "../../components/NewSidebar";
import CustomTopNav from "../../components/CustomTopNav";

function PricingCommission() {
  const { setGlobalState, globalState } = useGlobalState();
  const navItems = [
    [
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
        name: "Commission",
        path: "/pricing-commission",
      },
      {
        name: "Payment & Payout ",
        path: "/pricing-payout-info",
      },{
        name: "Geo Deals ",
        path: "/geo-deals",
      },
    ],
  ];
  const [sharingFormData, setSharingFormData] = useState({
    category_id: "1",
    our_commission: "",
    driver_commission: "",
    is_editable: false,
  });
  const [personalFormData4Seater, setPersonalFormData4Seater] = useState({
    category_id: "2",
    four_seater_our_commission: "",
    four_seater_driver_commission: "",
    is_editable: false,
  });
  const [personalFormData6Seater, setPersonalFormData6Seater] = useState({
    category_id: "2",
    six_seater_our_commission: "",
    six_seater_driver_commission: "",
    is_editable: false,
  });
  const handleAddCommission = async () => {
    try {
      let response = await addCommissionServ(sharingFormData);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
      }
      if (response?.data?.statusCode == "409") {
        toast.error("A commission for this category already exists");
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
  };
  const handleAddCommission4seaterPersonal = async () => {
    try {
      let response = await addCommissionServ(personalFormData4Seater);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
      }
      if (response?.data?.statusCode == "409") {
        toast.error("A commission for this category already exists");
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
  };
  const handleAddCommission6seaterPersonal = async () => {
    try {
      let response = await addCommissionServ(personalFormData6Seater);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
      }
      if (response?.data?.statusCode == "409") {
        toast.error("A commission for this category already exists");
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
  };
  const [commissionList, setCommissionList] = useState();
  const handleGetCommissionListFunc = async () => {
    try {
      let response = await getCommissionListServ();
      if (response?.data?.statusCode == "200") {
        setCommissionList(response?.data?.data);
        setSharingFormData({
          category_id: "1",
          our_commission: response?.data?.data[0].our_commission,
          driver_commission: response?.data?.data[0].driver_commission,
          is_editable: false,
        });
        setPersonalFormData4Seater({
          category_id: "2",
          four_seater_our_commission:
            response?.data?.data[1].four_seater_our_commission,
          four_seater_driver_commission:
            response?.data?.data[1].four_seater_driver_commission,
          is_editable: false,
        });
        setPersonalFormData6Seater({
          category_id: "2",
          six_seater_our_commission:
            response?.data?.data[1].six_seater_our_commission,
          six_seater_driver_commission:
            response?.data?.data[1].six_seater_driver_commission,
          is_editable: false,
        });
      }
    } catch (error) {}
  };
  useEffect(() => {
    handleGetCommissionListFunc();
  }, []);
  const [personalIs6seater, setPersonalIs6seater] = useState(false);
  return (
    <div className="mainBody">
      <NewSidebar selectedItem="Settings" />
      <div className="contentLayout">
        <div className="bgWhite borderRadius30 p-4 minHeight100vh">
          <div className="sticky-top bgWhite">
            <CustomTopNav navItems={navItems} selectedNav="Commission" />
          </div>
          <div className="  mt-4">
            <div className="d-flex justify-content-between">
              <div className="commissionVerticalCard">
                    <div className="d-flex justify-content-center">
                      <img src="/imagefolder/sharingRideIcon.png" style={{height:"100px"}}/>
                    </div>
                    <h1>Sharing Ride</h1>
                    <div className="d-flex toggleCommission">
                      <p>Availability</p>
                      <p className="bgDark textWhite">Route</p>
                    </div>
                    <div className="d-flex toggleCommission mt-4" style={{opacity:"0"}}>
                      <p>Availability</p>
                      <p>Route</p>
                    </div>
                    <div className="mt-4">
                      <label>Mie Ride Commission</label>
                      <div className="inputDivCommission">
                        <input value="15"/>
                        <img src="https://cdn-icons-png.flaticon.com/128/468/468194.png" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label>Driver Commission</label>
                      <div className="inputDivCommission">
                        <input value="15"/>
                        <img src="https://cdn-icons-png.flaticon.com/128/468/468194.png" />
                      </div>
                    </div>
                    <div className="d-flex justify-content-between mx-4 mt-4 commissionBtnGroup">
                      <button>Edit</button>
                      <button className=" textWhite" style={{background:"#1C1C1C"}}>Save</button>
                    </div>
                  </div>
                   <div className="commissionVerticalCard bgDark">
                    <div className="d-flex justify-content-center">
                      <img src="/imagefolder/sharingRideIcon.png" style={{height:"100px"}}/>
                    </div>
                    <h1 className="textSuccess">Personal Ride</h1>
                    <div className="d-flex toggleCommission bgSuccess">
                      <p className="bgDark textWhite">Availability</p>
                      <p className="bgSuccess textDark">Route</p>
                    </div>
                    <div className="d-flex toggleCommission mt-4 bgWhite">
                      <p className="textWhite bgDark">4-Seater</p>
                      <p>6-Seater</p>
                    </div>
                    <div className="mt-4">
                      <label className="textSuccess">Mie Ride Commission</label>
                      <div className="inputDivCommission">
                        <input value="15"/>
                        <img src="https://cdn-icons-png.flaticon.com/128/468/468194.png" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="textSuccess">Driver Commission</label>
                      <div className="inputDivCommission">
                        <input value="15"/>
                        <img src="https://cdn-icons-png.flaticon.com/128/468/468194.png" />
                      </div>
                    </div>
                    <div className="d-flex justify-content-between mx-4 mt-4 commissionBtnGroup">
                      <button className="bgDark textSuccess" style={{borderColor:"#D0FF13",}}>Edit</button>
                      <button className="bgSuccess textDark" style={{border:"none"}}>Save</button>
                    </div>
                  </div>
                   <div className="commissionVerticalCard">
                    <div className="d-flex justify-content-center">
                      <img src="/imagefolder/commissionFamily.png" style={{height:"100px"}}/>
                    </div>
                    <h1>Family Ride</h1>
                    
                    <div className="d-flex justify-content-center align-items-center" style={{height:"280px"}}>
                      <p style={{fontSize:"30px", fontFamily:"nexa", fontWeight:"400"}}>In Progress</p>
                    </div>
                  </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <div className="main_layout  bgBlack d-flex">
      {/* sidebar started */}
      <Sidebar selectedItem="Settings" />
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
          navColor="#030303"
          navBg="#F3E638"
          divideRowClass="col-xl-6 col-lg-6 col-md-6 col-6"
          selectedItem="Commission"
          sectedNavBg="#fff"
          selectedNavColor="#030303"
          isItemMoreThen8={true}
        />
        {/* top nav ended  */}

        {/* commission main div started */}
        <div className="categoriesMainDiv d-flex justify-content-between w-100 ">
          <div
            className="categoriesBox me-2 p-4"
            style={{ background: "#62929E" }}
          >
            <div className="categoryHeadingDiv">
              <h1>Sharing</h1>
              <h1>Ride</h1>
            </div>
            <div className="commissionForm">
              <label>MieRide Commission</label>
              <div className="d-flex justify-content-between align-items-center commissionInput">
                <input
                  className=""
                  placeholder="Enter Here"
                  value={sharingFormData?.our_commission}
                  onChange={(e) =>
                    setSharingFormData({
                      ...sharingFormData,
                      our_commission: e.target.value,
                      driver_commission: 100 - e.target.value,
                    })
                  }
                  readOnly={!sharingFormData.is_editable}
                />
                <p className="mb-0">%</p>
              </div>
              <label>Driver Commission</label>
              <div
                className="d-flex justify-content-between align-items-center commissionInput"
                style={{ background: "#C3C4C5" }}
              >
                <input
                  className=""
                  placeholder="Enter Here"
                  value={sharingFormData?.driver_commission}
                  onChange={(e) =>
                    setSharingFormData({
                      ...sharingFormData,
                      driver_commission: e.target.value,
                    })
                  }
                  readOnly={true}
                  style={{ background: "#C3C4C5" }}
                />
                <p className="mb-0">%</p>
              </div>
              <div className="d-flex justify-content-center commissionStatusBox">
                <p className="mb-0">Status : </p>
                <span className="mb-0">Live</span>
              </div>
              <div className="commissionBtnGroup">
                <div className="">
                  <button
                    className=""
                    onClick={() => {
                      setSharingFormData({
                        ...sharingFormData,
                        is_editable: true,
                      });
                      toast.success("Start Editing the form");
                    }}
                  >
                    Edit
                  </button>
                </div>
                <div>
                  {sharingFormData.driver_commission &&
                  sharingFormData?.our_commission &&
                  sharingFormData.is_editable ? (
                    <button
                      className=""
                      style={{ background: "#139F01" }}
                      onClick={handleAddCommission}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      className=""
                      style={{ background: "#139F01", opacity: "0.5" }}
                    >
                      Save
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div
            className="categoriesBox me-2 p-4"
            style={{ background: "#546A7B" }}
          >
            <div className="categoryHeadingDiv">
              <h1>Personal</h1>
              <h1>Ride</h1>
            </div>
            <div
              className="d-flex mt-5 bg-dark"
              style={{ borderRadius: "20px" }}
            >
              <h6
                onClick={() => setPersonalIs6seater(false)}
                className={
                  "text-light w-50 text-center  mb-0 p-2 " +
                  (!personalIs6seater && "bgSuccess")
                }
                style={{ borderRadius: "20px", cursor: "pointer" }}
              >
                4 Seater
              </h6>
              <h6
                onClick={() => setPersonalIs6seater(true)}
                className={
                  "text-light w-50 text-center mb-0 p-2 " +
                  (personalIs6seater && " bgSuccess")
                }
                style={{ borderRadius: "20px", cursor: "pointer" }}
              >
                6 Seater
              </h6>
            </div>
            {personalIs6seater ? (
              <div className="commissionForm">
                <label>MieRide Commission</label>
                <div className="d-flex justify-content-between align-items-center commissionInput">
                  <input
                    className=""
                    placeholder="Enter Here"
                    value={personalFormData6Seater?.six_seater_our_commission}
                    onChange={(e) =>
                      setPersonalFormData6Seater({
                        ...personalFormData6Seater,
                        six_seater_our_commission: e.target.value,
                        six_seater_driver_commission: 100 - e.target.value,
                      })
                    }
                    readOnly={!personalFormData6Seater.is_editable}
                  />
                  <p className="mb-0">%</p>
                </div>
                <label>Driver Commission</label>
                <div
                  className="d-flex justify-content-between align-items-center commissionInput"
                  style={{ background: "#C3C4C5" }}
                >
                  <input
                    className=""
                    placeholder="Enter Here"
                    value={
                      personalFormData6Seater?.six_seater_driver_commission
                    }
                    onChange={(e) =>
                      setPersonalFormData6Seater({
                        ...personalFormData6Seater,

                        six_seater_driver_commission: e.target.value,
                      })
                    }
                    readOnly={true}
                    style={{ background: "#C3C4C5" }}
                  />
                  <p className="mb-0">%</p>
                </div>
                <div className="d-flex justify-content-center commissionStatusBox">
                  <p className="mb-0">Status : </p>
                  <span className="mb-0">Live</span>
                </div>
                {/* <div className="commissionBtnGroup">
                <div className="">
                  <button className="">Edit</button>
                </div>
                <div>
                  <button
                    className=""
                    style={{ background: "#139F01", opacity: "0.8" }}
                    onClick={() => alert("Comising Soon")}
                  >
                    Save
                  </button>
                </div>
              </div> */}
                <div className="commissionBtnGroup">
                  <div className="">
                    <button
                      className=""
                      onClick={() => {
                        setPersonalFormData6Seater({
                          ...personalFormData6Seater,
                          is_editable: true,
                        });
                        toast.success("Start Editing the form");
                      }}
                    >
                      Edit
                    </button>
                  </div>
                  <div>
                    {personalFormData6Seater.six_seater_driver_commission &&
                    personalFormData6Seater?.six_seater_our_commission &&
                    personalFormData6Seater.is_editable ? (
                      <button
                        className=""
                        style={{ background: "#139F01" }}
                        onClick={handleAddCommission6seaterPersonal}
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        className=""
                        style={{ background: "#139F01", opacity: "0.5" }}
                      >
                        Save
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="commissionForm">
                <label>MieRide Commission</label>
                <div className="d-flex justify-content-between align-items-center commissionInput">
                  <input
                    className=""
                    placeholder="Enter Here"
                    value={personalFormData4Seater?.four_seater_our_commission}
                    onChange={(e) =>
                      setPersonalFormData4Seater({
                        ...personalFormData4Seater,
                        four_seater_our_commission: e.target.value,
                        four_seater_driver_commission: 100 - e.target.value,
                      })
                    }
                    readOnly={!personalFormData4Seater.is_editable}
                  />
                  <p className="mb-0">%</p>
                </div>
                <label>Driver Commission</label>
                <div
                  className="d-flex justify-content-between align-items-center commissionInput"
                  style={{ background: "#C3C4C5" }}
                >
                  <input
                    className=""
                    placeholder="Enter Here"
                    value={
                      personalFormData4Seater?.four_seater_driver_commission
                    }
                    onChange={(e) =>
                      setPersonalFormData4Seater({
                        ...personalFormData4Seater,

                        four_seater_driver_commission: e.target.value,
                      })
                    }
                    readOnly={true}
                    style={{ background: "#C3C4C5" }}
                  />
                  <p className="mb-0">%</p>
                </div>
                <div className="d-flex justify-content-center commissionStatusBox">
                  <p className="mb-0">Status : </p>
                  <span className="mb-0">Live</span>
                </div>
                <div className="commissionBtnGroup">
                  <div className="">
                    <button
                      className=""
                      onClick={() => {
                        setPersonalFormData4Seater({
                          ...personalFormData4Seater,
                          is_editable: true,
                        });
                        toast.success("Start Editing the form");
                      }}
                    >
                      Edit
                    </button>
                  </div>
                  <div>
                    {personalFormData4Seater.four_seater_driver_commission &&
                    personalFormData4Seater?.four_seater_our_commission &&
                    personalFormData4Seater.is_editable ? (
                      <button
                        className=""
                        style={{ background: "#139F01" }}
                        onClick={handleAddCommission4seaterPersonal}
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        className=""
                        style={{ background: "#139F01", opacity: "0.5" }}
                      >
                        Save
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div
            className="categoriesBox me-2 p-4"
            style={{ background: "#C6C5B9", opacity: "0.3" }}
          >
            <div className="categoryHeadingDiv">
              <h1 style={{ color: "#393d3f" }}>Airport</h1>
            </div>
            <div className="commissionForm">
              <label>MieRide Commission</label>
              <div className="d-flex justify-content-between align-items-center commissionInput">
                <input className="" placeholder="Enter Here" />
                <p className="mb-0">%</p>
              </div>
              <label>Driver Commission</label>
              <div className="d-flex justify-content-between align-items-center commissionInput">
                <input className="" placeholder="Enter Here" />
                <p className="mb-0">%</p>
              </div>
              <div className="d-flex justify-content-center commissionStatusBox">
                <p className="mb-0">Status : </p>
                <span className="mb-0">Live</span>
              </div>
              <div className="commissionBtnGroup">
                <div className="">
                  <button className="">Edit</button>
                </div>
                <div>
                  <button
                    className=""
                    style={{ background: "#139F01", opacity: "0.8" }}
                    onClick={() => alert("Comising Soon")}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div
            className="categoriesBox me-2 p-4"
            style={{ background: "#393D3F", opacity: "0.3" }}
          >
            <div className="categoryHeadingDiv">
              <h1>Drive</h1>
              <h1>Test</h1>
            </div>
            <div className="commissionForm">
              <label>MieRide Commission</label>
              <div className="d-flex justify-content-between align-items-center commissionInput">
                <input className="" placeholder="Enter Here" />
                <p className="mb-0">%</p>
              </div>
              <label>Driver Commission</label>
              <div className="d-flex justify-content-between align-items-center commissionInput">
                <input className="" placeholder="Enter Here" />
                <p className="mb-0">%</p>
              </div>
              <div className="d-flex justify-content-center commissionStatusBox">
                <p className="mb-0">Status : </p>
                <span className="mb-0">Live</span>
              </div>
              <div className="commissionBtnGroup">
                <div className="">
                  <button className="">Edit</button>
                </div>
                <div>
                  <button
                    className=""
                    style={{ background: "#139F01", opacity: "0.8" }}
                    onClick={() => alert("Comising Soon")}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            className="categoriesBox me-2 p-4"
            style={{ background: "#F7C1BB", opacity: "0.3" }}
          >
            <div className="categoryHeadingDiv">
              <h1 style={{ color: "#000" }}>Intercity</h1>
            </div>
            <div className="commissionForm">
              <label>MieRide Commission</label>
              <div className="d-flex justify-content-between align-items-center commissionInput">
                <input className="" placeholder="Enter Here" />
                <p className="mb-0">%</p>
              </div>
              <label>Driver Commission</label>
              <div className="d-flex justify-content-between align-items-center commissionInput">
                <input className="" placeholder="Enter Here" />
                <p className="mb-0">%</p>
              </div>
              <div className="d-flex justify-content-center commissionStatusBox">
                <p className="mb-0">Status : </p>
                <span className="mb-0">Live</span>
              </div>
              <div className="commissionBtnGroup">
                <div className="">
                  <button className="">Edit</button>
                </div>
                <div>
                  <button
                    className=""
                    style={{ background: "#139F01", opacity: "0.8" }}
                    onClick={() => alert("Comising Soon")}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* commission main div end */}
      </section>
      {/* sectionLayout ended */}
    </div>
  );
}

export default PricingCommission;
