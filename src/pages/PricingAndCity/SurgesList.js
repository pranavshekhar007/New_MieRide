import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import axios from "axios";
import {
  addProvinceServ,
  listProvinceServ,
  deleteProvinceServ,
} from "../../services/priceAndCity.services";
import {
  getSurgesListServ,
  addSurgesServ,
  deleteSurgesServ,
  editSurgesServ,
} from "../../services/priceAndCity.services";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useGlobalState } from "../../GlobalProvider";
import NewSidebar from "../../components/NewSidebar";
import CustomTopNav from "../../components/CustomTopNav";
import CustomPagination from "../../components/CustomPazination";
import NoRecordFound from "../../components/NoRecordFound";
function SurgesList() {
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
        name: "Surges",
        path: "/pricing-surges",
      },
      {
        name: "Commission",
        path: "/pricing-commission",
      },
      {
        name: "Payment & Payout ",
        path: "/pricing-payout-info",
      },
      {
        name: "Geo Deals ",
        path: "/pricing-payout-info",
      },
    ],
  ];
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState([]);
  const API_KEY = "AIzaSyD6KJOHKQLUWMAh9Yl5NQrEAI9bxrvYCqQ";
  const [formData, setFormData] = useState({
    name: "",
    long: "",
    lat: "",
  });
  const [showLoader, setShowLoader] = useState(false);
  const handleSearch = async (input) => {
    setQuery(input);

    if (input.length > 0) {
      // Start searching after 3 characters
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        input
      )}&key=${API_KEY}`;

      try {
        const response = await axios.get(url);
        console.log(response?.data.results);
        setLocation(response?.data.results);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    }
  };

  const handleSubmitProvince = async () => {
    try {
      setShowLoader(true);
      let response = await addProvinceServ(formData);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        setFormData({
          name: "",
          long: "",
          lat: "",
        });
        setQuery("");
        setLocation([]);
        handleGetProvinceListFunc();
      } else if (response?.data?.statusCode == "400") {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
    setShowLoader(false);
  };
  const [showSkelton, setShowSkelton] = useState(false);
  const [provinceList, setProvienceList] = useState([]);
  const handleGetProvinceListFunc = async () => {
    if (provinceList?.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await listProvinceServ();
      if (response?.data?.statusCode == "200") {
        setProvienceList(response?.data?.data);
      }
    } catch (error) {}
    setShowSkelton(false);
  };
  useEffect(() => {
    handleGetProvinceListFunc();
  }, []);

  const handleProvinceDeleteFunc = async (id) => {
    // Ask for confirmation before proceeding
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this province?"
    );

    if (isConfirmed) {
      try {
        let response = await deleteProvinceServ(id);
        if (response?.data?.statusCode === "200") {
          toast.success(response?.data?.message);
          handleGetProvinceListFunc();
        }
      } catch (error) {
        toast.error("Internal Server Error");
      }
    }
  };
  return (
    <div className="mainBody">
      <NewSidebar selectedItem="Settings" />
      <div className="contentLayout">
        <div className="bgWhite borderRadius30 p-4 minHeight100vh">
          <div className="sticky-top bgWhite">
            <CustomTopNav navItems={navItems} selectedNav="Surges" />
          </div>

          <div className="tableOuterContainer bgDark mt-4">
            <div>
              <table className="table">
                <thead className="">
                  <tr>
                    <th
                      scope="col"
                      style={{ borderRadius: "24px 0px 0px 24px" }}
                    >
                      Sr. No
                    </th>
                    <th scope="col">Surge Title</th>
                    <th scope="col">Surge Time</th>
                    <th scope="col">Charges %</th>
                    <th
                      scope="col"
                      style={{ borderRadius: "0px 24px 24px 0px" }}
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <div className="pt-4"></div>
                <tbody>
                  {showSkelton
                    ? [1, 2, 3, 4, 5, 6, 7, 8, 9]?.map((v, i) => {
                        return (
                          <tr key={i}>
                            <td>
                              <Skeleton width={50} />
                            </td>
                            <td>
                              <Skeleton width={100} />
                            </td>

                            <td>
                              <Skeleton width={100} />
                            </td>
                          </tr>
                        );
                      })
                    : provinceList?.map((v, i) => {
                        return (
                          <>
                            <tr className="bgWhite ">
                              <td
                                scope="row"
                                style={{
                                  borderTopLeftRadius: "30px",
                                  borderBottomLeftRadius: "30px",
                                }}
                              >
                                {/* {i + 1 + (pageData?.current_page - 1) * 10} */}
                                1
                              </td>
                              <td>{v?.name}</td>

                              <td
                                style={{
                                  borderTopRightRadius: "30px",
                                  borderBottomRightRadius: "30px",
                                }}
                              >
                                <div className="d-flex justify-content-center">
                                  <button
                                    className="deleteBtn"
                                    onClick={() =>
                                      handleProvinceDeleteFunc(v?.id)
                                    }
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                            <div
                              className={
                                i == provinceList?.length - 1 ? " " : " pb-3"
                              }
                            ></div>
                          </>
                        );
                      })}
                </tbody>
              </table>
              {provinceList.length == 0 && !showSkelton && (
                <NoRecordFound theme="light" marginTop="-20px" />
              )}
            </div>
          </div>
          {/* <CustomPagination
            current_page={pageData?.current_page}
            onPerPageChange={onPerPageChange}
            last_page={pageData?.total_pages}
            per_page={payload?.per_page}
            onPageChange={onPageChange}
          /> */}
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
          navBg="orange"
          divideRowClass="col-xl-6 col-lg-6 col-md-6 col-6"
          selectedItem="Province"
          sectedNavBg="#fff"
          selectedNavColor="#030303"
          isItemMoreThen8={true}
        />
        {/* top nav ended  */}
        {/* table List started */}
        <div className="tableMain">
          <div
            className="tableBody py-2 px-4 borderRadius50All"
            style={{ background: "#F3F3F3" }}
          >
            <div className="row mx-0 p-0  marginY35">
              <div className="col-lg-8 row m-0 p-0">
                <div className="col-lg-6  m-0 ">
                  <div className="d-flex justify-content-between align-items-center locationSearchBtn">
                    <input
                      placeholder="Search Source"
                      style={{ width: "70%" }}
                      onChange={(e) => handleSearch(e.target.value)}
                      value={query}
                      readOnly={formData?.name}
                    />
                    {formData?.name ? (
                      <i
                        className="fa fa-close"
                        onClick={() => {
                          setFormData({
                            name: "",
                            long: "",
                            lat: "",
                          });
                          setQuery("");
                          setLocation([]);
                        }}
                      ></i>
                    ) : (
                      <img src="https://cdn-icons-png.flaticon.com/128/751/751463.png" />
                    )}
                  </div>
                  {location.length > 0 && formData?.name == "" && (
                    <ul className="priceCityUl shadow-sm">
                      {location.map((v, i) => {
                        const stateComponent = v?.address_components.find(
                          (component) =>
                            component.types.includes(
                              "administrative_area_level_1"
                            )
                        );

                        // Only render if the state component is found
                        return stateComponent ? (
                          <li
                            onClick={() => {
                              setQuery(stateComponent.long_name);
                              setFormData({
                                name: stateComponent.long_name,
                                long: v?.geometry?.location.lng,
                                lat: v?.geometry?.location.lat,
                              });
                            }}
                            key={i}
                          >
                            {stateComponent.long_name}
                          </li>
                        ) : null;
                      })}
                    </ul>
                  )}
                </div>
                <div className="col-lg-4 m-0 ">
                  <div className="d-flex justify-content-between align-items-center ">
                    {showLoader ? (
                      <button
                        className="btn btn-success w-100 bgSuccess disabled"
                        style={{ opacity: "0.8" }}
                      >
                        <div
                          className="spinner-border text-light me-2"
                          role="status"
                          style={{ height: "15px", width: "15px" }}
                        ></div>
                        Submitting. . .
                      </button>
                    ) : (
                      <button
                        className="btn btn-success w-100 bgSuccess"
                        onClick={() => {
                          handleSubmitProvince();
                        }}
                        style={{ border: "none" }}
                      >
                        Submit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ margin: "0px 10px" }}>
              <table className="table">
                <thead>
                  <tr style={{ background: "#DCE4E7" }}>
                    <th scope="col" style={{ borderRadius: "8px 0px 0px 8px" }}>
                      Sr. No
                    </th>
                    <th scope="col">Province</th>
                    <th scope="col" style={{ borderRadius: "0px 8px 8px 0px" }}>
                      <div className="d-flex justify-content-end align-items-center me-4">
                        Action
                      </div>
                    </th>
                  </tr>
                </thead>
                <div className="py-2"></div>
                <tbody>
                  {showSkelton
                    ? // Show Skeletons while loading
                      Array.from({ length: 5 }).map((_, index) => (
                        <tr key={index}>
                          <td>
                            <Skeleton width={20} height={25} />
                          </td>
                          <td>
                            <Skeleton width={100} height={25} />
                          </td>
                          <td className="d-flex justify-content-end align-items-center">
                            <Skeleton width={50} height={25} />
                          </td>
                        </tr>
                      ))
                    : // Render province list when loaded
                      provinceList.map((v, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{v?.name}</td>
                          <td className="d-flex justify-content-end align-items-center">
                            <button
                              className="p-2"
                              onClick={() => handleProvinceDeleteFunc(v?.id)}
                              style={{
                                background: "#E8210A",
                                fontSize: "12px",
                                color: "#fff",
                                border: "none",
                                width: "100px",
                                borderRadius: "7px",
                                marginTop: "-6px",
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
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

export default SurgesList;
