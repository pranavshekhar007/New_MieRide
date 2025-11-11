import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import {
  getCategoryServ,
  getCategoryUpdateServ,
} from "../../services/priceAndCity.services";
import { toast } from "react-toastify";
import { useGlobalState } from "../../GlobalProvider";
import NewSidebar from "../../components/NewSidebar";
import CustomTopNav from "../../components/CustomTopNav";

function PricingCategories() {
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
  const [categoryList, setCategoryList] = useState([]);
  const getCategoryList = async () => {
    try {
      let response = await getCategoryServ();
      setCategoryList(response?.data?.data);
    } catch (error) {}
  };
  useEffect(() => {
    getCategoryList();
  }, []);

  const [sharingFormData, setShowSharingFormData] = useState({
    showActiveInactiveBox: false,
  });
  const [personalFormData, setShowPersonalFormData] = useState({
    showActiveInactiveBox: false,
  });
  const [driveFormData, setShowDriveFormData] = useState({
    showActiveInactiveBox: false,
  });
  const [intercityFormData, setShowIntercityFormData] = useState({
    showActiveInactiveBox: false,
  });
  const [airportFormData, setShowAirportFormData] = useState({
    showActiveInactiveBox: false,
  });

  const updateCategoryFunc = async (id, status) => {
    try {
      let response = await getCategoryUpdateServ(id, { status });
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        getCategoryList();
        setShowSharingFormData({
          showActiveInactiveBox: false,
        });
        setShowPersonalFormData({
          showActiveInactiveBox: false,
        });
        setShowDriveFormData({
          showActiveInactiveBox: false,
        });
        setShowIntercityFormData({
          showActiveInactiveBox: false,
        });
        setShowAirportFormData({
          showActiveInactiveBox: false,
        });
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
  };
  return (
    <div className="mainBody">
      <NewSidebar selectedItem="Settings" />
      <div className="contentLayout">
        <div className="bgWhite borderRadius30 p-4 minHeight100vh">
          <div className="sticky-top bgWhite">
            <CustomTopNav navItems={navItems} selectedNav="Categories" />
          </div>
          <div
            className="tableOuterContainer bgDark mt-4"
            style={{ padding: "0px 30px" }}
          >
            <div className="priceCategoryCard d-flex align-items-center w-100">
              <div className="d-flex align-items-center justify-content-between w-100">
                <div className="d-flex align-items-center">
                  <img src="/imagefolder/sharingRideIcon.png" />
                  <h1>Sharing Ride</h1>
                </div>
                <div className="d-flex align-items-center">
                  <div className="priceCategoryActionBtn">
                    <div className="mb-2">
                      <button>Activated</button>
                    </div>
                    <div>
                      <button style={{ background: "#DD4132" }}>
                        Deactivated
                      </button>
                    </div>
                  </div>
                  <div >
                    <img style={{height:"27px", marginLeft:"60px"}} src="https://cdn-icons-png.flaticon.com/128/93/93634.png" />
                  </div>
                </div>
              </div>
            </div>
            <div className="priceCategoryCard d-flex align-items-center w-100">
              <div className="d-flex align-items-center justify-content-between w-100">
                <div className="d-flex align-items-center">
                  <img src="/imagefolder/personalRideIcon.png" />
                  <h1>Personal Ride</h1>
                </div>
                <div className="d-flex align-items-center">
                  <div className="priceCategoryActionBtn">
                    <div className="mb-2">
                      <button>Activated</button>
                    </div>
                    <div>
                      <button style={{ background: "#DD4132" }}>
                        Deactivated
                      </button>
                    </div>
                  </div>
                  <div >
                    <img style={{height:"27px", marginLeft:"60px"}} src="https://cdn-icons-png.flaticon.com/128/93/93634.png" />
                  </div>
                </div>
              </div>
            </div>
            <div className="priceCategoryCard d-flex align-items-center w-100 priceCategoryDarkCard">
              <div className="d-flex align-items-center justify-content-between w-100">
                <div className="d-flex align-items-center">
                  <img src="/imagefolder/familyRideIcon.png" />
                  <h1 className="textWhite">Family Ride</h1>
                </div>
                <div className="d-flex align-items-center">
                  <div className="priceCategoryActionBtn">
                    <div className="mb-2">
                      <button>Activated</button>
                    </div>
                    <div>
                      <button style={{ background: "#DD4132" }}>
                        Deactivated
                      </button>
                    </div>
                  </div>
                  <div >
                    <img style={{height:"27px", marginLeft:"60px"}} src="https://cdn-icons-png.flaticon.com/128/93/93634.png" />
                  </div>
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
          navColor="#fff"
          navBg="#6A5B6E"
          divideRowClass="col-xl-4 col-lg-4 col-md-4 col-6"
          selectedItem="Categories"
          sectedNavBg="#fff"
          selectedNavColor="#030303"
          isItemMoreThen8={true}
        />
        {/* top nav ended  */}

        {/* categories main div started */}
        <div className="categoriesMainDiv d-flex justify-content-between w-100 ">
          <div
            className="categoriesBox me-2 p-4"
            style={{ background: "#E35E33" }}
          >
            <div className="d-flex justify-content-evenly align-items-center statusBtn">
              <div
                className={
                  categoryList[0]?.status == "1" ? "greenCircle" : "redCircle"
                }
              ></div>
              <h5
                className="mb-0"
                style={{
                  color: categoryList[0]?.status == "1" ? "#139f01" : "#e4040a",
                }}
              >
                {categoryList[0]?.status == "1" ? "Active" : "In-Active"}
              </h5>
            </div>
            <div className="my-xl-5 my-lg-4">
              <img
                src="/icons/priceAndCityIcons/sharing.png"
                className="priceCityIcon whiteIcon"
              />
            </div>
            <div className="categoryHeadingDiv">
              <h1>Sharing</h1>
              <h1>Ride</h1>
            </div>
            <div className="" style={{ height: "210px" }}>
              <div className="categoriesMessageBox">
                <p className="mb-0">Maintenance until 07:45</p>
                <p className="mb-0">PM till 27-07-2024.</p>
              </div>
              {sharingFormData.showActiveInactiveBox && (
                <div className="d-flex justify-content-center">
                  <div className="activeInactiveDiv">
                    <p
                      className="mb-0"
                      onClick={() => updateCategoryFunc(1, 1)}
                    >
                      Active
                    </p>
                    <div className="borderBottom"></div>
                    <p
                      className="mb-0"
                      onClick={() => updateCategoryFunc(1, 0)}
                    >
                      In-Active
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="d-flex justify-content-center align-items-center">
              <div
                className="arrowDiv d-flex justify-content-center align-items-center"
                onClick={() =>
                  setShowSharingFormData({
                    ...sharingFormData,
                    showActiveInactiveBox:
                      !sharingFormData.showActiveInactiveBox,
                  })
                }
              >
                <img src="/icons/priceAndCityIcons/uparrow.png" />
              </div>
            </div>
          </div>

          <div
            className="categoriesBox mx-2 p-4"
            style={{ background: "#F3E638", opacity: 1 }}
          >
            <div className="d-flex justify-content-evenly align-items-center statusBtn">
              <div
                className={
                  categoryList[1]?.status == "1" ? "greenCircle" : "redCircle"
                }
              ></div>
              <h5
                className="mb-0"
                style={{
                  color: categoryList[1]?.status == "1" ? "#139f01" : "#e4040a",
                }}
              >
                {categoryList[1]?.status == "1" ? "Active" : "In-Active"}
              </h5>
            </div>
            <div className="my-xl-5 my-lg-4">
              <img
                src="/icons/priceAndCityIcons/personalRide.png"
                className="priceCityIcon "
              />
            </div>

            <div className="categoryHeadingDiv">
              <h1 style={{ color: "#2f2f2f" }}>Personal</h1>
              <h1 style={{ color: "#2f2f2f" }}>Ride</h1>
            </div>
            <div className="" style={{ height: "210px" }}>
              <div className="categoriesMessageBox">
                <p className="mb-0">Maintenance until 07:45</p>
                <p className="mb-0">PM till 27-07-2024.</p>
              </div>
              {personalFormData.showActiveInactiveBox && (
                <div className="d-flex justify-content-center">
                  <div className="activeInactiveDiv">
                    <p
                      className="mb-0"
                      onClick={() => updateCategoryFunc(2, 1)}
                    >
                      Active
                    </p>
                    <div className="borderBottom"></div>
                    <p
                      className="mb-0"
                      onClick={() => updateCategoryFunc(2, 0)}
                    >
                      In-Active
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="d-flex justify-content-center align-items-center">
              <div
                className="arrowDiv d-flex justify-content-center align-items-center"
                onClick={() =>
                  setShowPersonalFormData({
                    ...personalFormData,
                    showActiveInactiveBox:
                      !personalFormData.showActiveInactiveBox,
                  })
                }
              >
                <img src="/icons/priceAndCityIcons/uparrow.png" />
              </div>
            </div>
          </div>
          <div
            className="categoriesBox mx-2 p-4"
            style={{
              background: "#DB46AC",
              opacity: airportFormData?.showActiveInactiveBox ? "1" : "0.3",
            }}
          >
            <div className="d-flex justify-content-evenly align-items-center statusBtn">
              <div
                className={
                  categoryList[2]?.status == "1" ? "greenCircle" : "redCircle"
                }
              ></div>
              <h5
                className="mb-0"
                style={{
                  color: categoryList[2]?.status == "1" ? "#139f01" : "#e4040a",
                }}
              >
                {categoryList[2]?.status == "1" ? "Active" : "In-Active"}
              </h5>
            </div>
            <div className="my-xl-5 my-lg-4">
              <img
                src="/icons/priceAndCityIcons/airport.png"
                className="priceCityIcon whiteIcon"
              />
            </div>
            <div className="categoryHeadingDiv">
              <h1>Airport</h1>
            </div>
            <div className="" style={{ height: "210px" }}>
              <div className="categoriesMessageBox">
                <p className="mb-0">Maintenance until 07:45</p>
                <p className="mb-0">PM till 27-07-2024.</p>
              </div>
              {airportFormData.showActiveInactiveBox && (
                <div className="d-flex justify-content-center">
                  <div className="activeInactiveDiv">
                    <p
                      className="mb-0"
                      onClick={() => updateCategoryFunc(3, 1)}
                    >
                      Active
                    </p>
                    <div className="borderBottom"></div>
                    <p
                      className="mb-0"
                      onClick={() => updateCategoryFunc(3, 0)}
                    >
                      In-Active
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="d-flex justify-content-center align-items-center">
              <div
                className="arrowDiv d-flex justify-content-center align-items-center"
                onClick={() =>
                  setShowAirportFormData({
                    ...airportFormData,
                    showActiveInactiveBox:
                      !airportFormData.showActiveInactiveBox,
                  })
                }
              >
                <img src="/icons/priceAndCityIcons/uparrow.png" />
              </div>
            </div>
          </div>
          <div
            className="categoriesBox mx-2 p-4"
            style={{
              background: "#000000",
              opacity: driveFormData?.showActiveInactiveBox ? "1" : "0.3",
            }}
          >
            <div className="d-flex justify-content-evenly align-items-center statusBtn">
              <div
                className={
                  categoryList[3]?.status == "1" ? "greenCircle" : "redCircle"
                }
              ></div>
              <h5
                className="mb-0"
                style={{
                  color: categoryList[3]?.status == "1" ? "#139f01" : "#e4040a",
                }}
              >
                {categoryList[3]?.status == "1" ? "Active" : "In-Active"}
              </h5>
            </div>
            <div className="my-xl-5 my-lg-4">
              <img
                src="/icons/priceAndCityIcons/driveTest.png"
                className="priceCityIcon whiteIcon"
              />
            </div>
            <div className="categoryHeadingDiv">
              <h1>Drive</h1>
              <h1>Test</h1>
            </div>
            <div className="" style={{ height: "210px" }}>
              <div className="categoriesMessageBox">
                <p className="mb-0">Maintenance until 07:45</p>
                <p className="mb-0">PM till 27-07-2024.</p>
              </div>
              {driveFormData.showActiveInactiveBox && (
                <div className="d-flex justify-content-center">
                  <div className="activeInactiveDiv">
                    <p
                      className="mb-0"
                      onClick={() => updateCategoryFunc(4, 1)}
                    >
                      Active
                    </p>
                    <div className="borderBottom"></div>
                    <p
                      className="mb-0"
                      onClick={() => updateCategoryFunc(4, 0)}
                    >
                      In-Active
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="d-flex justify-content-center align-items-center">
              <div
                className="arrowDiv d-flex justify-content-center align-items-center"
                onClick={() =>
                  setShowDriveFormData({
                    ...driveFormData,
                    showActiveInactiveBox: !driveFormData.showActiveInactiveBox,
                  })
                }
              >
                <img src="/icons/priceAndCityIcons/uparrow.png" />
              </div>
            </div>
          </div>
          <div
            className="categoriesBox ms-2 p-4"
            style={{
              background: "#68AD6C",
              opacity: intercityFormData?.showActiveInactiveBox ? "1" : "0.3",
            }}
          >
            <div className="d-flex justify-content-evenly align-items-center statusBtn">
              <div
                className={
                  categoryList[4]?.status == "1" ? "greenCircle" : "redCircle"
                }
              ></div>
              <h5
                className="mb-0"
                style={{
                  color: categoryList[4]?.status == "1" ? "#139f01" : "#e4040a",
                }}
              >
                {categoryList[4]?.status == "1" ? "Active" : "In-Active"}
              </h5>
            </div>
            <div className="my-xl-5 my-lg-4">
              <img
                src="/icons/priceAndCityIcons/sharing.png"
                className="priceCityIcon whiteIcon"
              />
            </div>
            <div className="categoryHeadingDiv">
              <h1>Intercity</h1>
            </div>
            <div className="" style={{ height: "210px" }}>
              <div className="categoriesMessageBox">
                <p className="mb-0">Maintenance until 07:45</p>
                <p className="mb-0">PM till 27-07-2024.</p>
              </div>
              {intercityFormData.showActiveInactiveBox && (
                <div className="d-flex justify-content-center">
                  <div className="activeInactiveDiv">
                    <p
                      className="mb-0"
                      onClick={() => updateCategoryFunc(5, 1)}
                    >
                      Active
                    </p>
                    <div className="borderBottom"></div>
                    <p
                      className="mb-0"
                      onClick={() => updateCategoryFunc(5, 0)}
                    >
                      In-Active
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="d-flex justify-content-center align-items-center">
              <div
                className="arrowDiv d-flex justify-content-center align-items-center"
                onClick={() =>
                  setShowIntercityFormData({
                    ...intercityFormData,
                    showActiveInactiveBox:
                      !intercityFormData.showActiveInactiveBox,
                  })
                }
              >
                <img src="/icons/priceAndCityIcons/uparrow.png" />
              </div>
            </div>
          </div>
        </div>
        {/* categories main div end */}
      </section>
      {/* sectionLayout ended */}
    </div>
  );
}

export default PricingCategories;
