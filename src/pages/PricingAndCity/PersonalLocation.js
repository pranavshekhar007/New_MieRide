import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import TableNav from "../../components/TableNav";
import { useGlobalState } from "../../GlobalProvider";
import LocationAutoComplete from "../../components/LocationAutoComplete";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import {
  storePersonalRideOperationalCityServ,
  storePersonalRideRateServ,
  getPriceRateOfPersonalServ,
  getProvinceViseLocationOfPersonal,
} from "../../services/personalBookingServices";
function PersonalLocation() {
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
  const tableNav = [
    {
      name: "Sharing",
      path: "/pricing-sharing-location",
    },
    {
      name: "Personal",
      path: "/pricing-personal-location",
    },
    {
      name: "Family",
      path: "/pricing-to-airport",
    },
  ];
  const [fourSeaterFormData, setFourSeaterFormData] = useState({
    vehicle_type: "4",
    "5_10_price": "",
    "45_50_price": "",
  });
  const [sixSeaterFormData, setSixSeaterFormData] = useState({
    vehicle_type: "6",
    "5_10_price": "",
    "45_50_price": "",
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const getPriceRateOfPersonalFunc = async () => {
    try {
      let response = await getPriceRateOfPersonalServ();
      if (response?.data?.statusCode == "200") {
        for (let i = 0; i < response?.data?.data?.length; i++) {
          if (response?.data?.data[i].vehicle_type == "4") {
            setFourSeaterFormData({
              vehicle_type: "4",
              "5_10_price": response?.data?.data[i]["5_10_price"],
              "45_50_price": response?.data?.data[i]["45_50_price"],
            });
          }
          if (response?.data?.data[i].vehicle_type == "6") {
            setSixSeaterFormData({
              vehicle_type: "6",
              "5_10_price": response?.data?.data[i]["5_10_price"],
              "45_50_price": response?.data?.data[i]["45_50_price"],
            });
          }
        }
      }
    } catch (error) {}
  };
  useEffect(() => {
    getPriceRateOfPersonalFunc();
  }, []);
  const [formData, setFormData] = useState({
    city: "",
    long: "",
    lat: "",
    province: "",
  });

  const setCityLocationFunc = (obj) => {
    setFormData({
      city: obj.cityName,
      long: obj.lng,
      lat: obj.lat,
      province: obj.provienceName,
    });
  };

  const [clearInput, setClearInput] = useState(false);
  const [cityAddBtnLoader, setCityAddBtnLoader] = useState(false);
  const handleSubmitCityLocation = async () => {
    setCityAddBtnLoader(true);
    try {
      let response = await storePersonalRideOperationalCityServ(formData);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        setFormData({
          city: "",
          long: "",
          lat: "",
          province: "",
        });
        getProvinceViseLocationFunc();
        setClearInput(true);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
    setCityAddBtnLoader(false);
  };

  const [priceStoreBtnLoader, setPriceStoreBtnLoader] = useState(null);
  const handleSubmitPersonalPriceFunc = async (vehicle_type) => {
    try {
      let formData;
      if (vehicle_type == "4seater") {
        formData = fourSeaterFormData;
        setPriceStoreBtnLoader("4seater");
      }
      if (vehicle_type == "6seater") {
        formData = sixSeaterFormData;
        setPriceStoreBtnLoader("6seater");
      }
      let response = await storePersonalRideRateServ(formData);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        getPriceRateOfPersonalFunc();
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
    setPriceStoreBtnLoader(null);
  };
  const [showListSkelton, setShowListSkelton] = useState(false);
  const [showSkelton, setShowSkelton] = useState(false);
  const [list, setList] = useState([]);
  const getProvinceViseLocationFunc = async () => {
    setShowSkelton(true);
    setShowListSkelton(true);
    try {
      let response = await getProvinceViseLocationOfPersonal();
      if (response?.data?.statusCode == "200") {
        setList(response?.data?.data);
      }
    } catch (error) {}
    setShowListSkelton(false);
    setShowSkelton(false);
  };
  useEffect(() => {
    getProvinceViseLocationFunc();
  }, []);
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
          padding: "0px 30px 45px 30px",
        }}
      >
        {/* top nav started  */}
        <div className="sticky-top bg-light" style={{ paddingTop: "45px" }}>
          <TopNav
            navItems={navItems}
            navColor="#fff"
            navBg="#363435"
            divideRowClass="col-xl-6 col-lg-6 col-md-12 col-12"
            selectedItem="Location"
            sectedNavBg="#D0FF13"
            selectedNavColor="#000"
            isItemMoreThen8={true}
          />
          <div className="py-2 mt-1"></div>
          <TopNav
            navItems={tableNav}
            navColor="#000"
            navBg="#e5e5e5"
            divideRowClass="col-xl-4 col-lg-4 col-md-12 col-12"
            selectedItem="Personal"
            sectedNavBg="#353535"
            selectedNavColor="#fff"
            isItemMoreThen8={true}
          />
        </div>
        {/* top nav ended  */}
        {/* table List started */}
        <div className="tableMain">
          <div
            className="tableBody py-2 px-2 borderRadius20All"
            style={{ background: "#fff", border: "1px solid #E5E5E5" }}
          >
            <div className="row mx-0 p-0 justify-content-between py-3">
              <div className="col-lg-6 row m-0 p-0">
                <div className="col-lg-8  m-0 ">
                  <LocationAutoComplete
                    placeholder="Search Source"
                    callBackFunc={setCityLocationFunc}
                    clearInput={clearInput}
                  />
                </div>
                <div className="col-lg-4 m-0">
                  {formData?.destination &&
                  formData?.sharing_price &&
                  formData?.source ? (
                    <div
                      className="addRoute me-2"
                      // onClick={handleSubmitStorePrice}
                      style={{ cursor: "pointer" }}
                    >
                      Add Route
                    </div>
                  ) : (
                    <div className="addRoute me-2" style={{ opacity: "0.5" }}>
                      Add Route
                    </div>
                  )}
                </div>
              </div>
              <div className="col-lg-4 row m-0 p-0">
                <div className="col-lg-12   ">
                  <div className="d-flex justify-content-end">
                    <div
                      className="addRoute "
                      // onClick={() =>
                      //   setPriceTriesPopup({ ...priceTriesPopup, show: true })
                      // }
                      style={{
                        background: "#D0FF13",
                        color: "#000",
                        cursor: "pointer",
                      }}
                    >
                      Price Tiers
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="tableBody py-2 px-4 mt-4 borderRadius30All"
            style={{ background: "#353535" }}> */}
          {/* <div className="personalLocationTopForm marginY35">
              <div className="row mb-4 ">
                <div className="col-9 row">
                  <div className="col-4"></div>
                  <div className="col-4 d-flex justify-content-center align-items-center">
                    <h4 className="mb-0">Price/Km</h4>
                  </div>
                  <div className="col-4">
                    <LocationAutoComplete
                      placeholder="Search City"
                      callBackFunc={setCityLocationFunc}
                      clearInput={clearInput}
                    />
                  </div>
                </div>
                <div className="col-3 d-flex justify-content-end">
                  {formData?.city && formData?.lat && formData?.long && formData?.province ? (
                    cityAddBtnLoader ? (
                      <button
                        className="btn  btn-success w-50"
                        style={{
                          background: "#139F01",
                          borderRadius: "8px",
                          border: "none",
                          opacity: "0.5",
                          height: "42px",
                        }}
                      >
                        Saving ...
                      </button>
                    ) : (
                      <button
                        className="btn  btn-success w-50"
                        style={{ background: "#139F01", borderRadius: "8px", border: "none", height: "42px" }}
                        onClick={handleSubmitCityLocation}
                      >
                        Submit
                      </button>
                    )
                  ) : (
                    <button
                      className="btn  btn-success w-50"
                      style={{
                        background: "#139F01",
                        borderRadius: "8px",
                        border: "none",
                        opacity: "0.5",
                        height: "42px",
                      }}
                    >
                      Submit
                    </button>
                  )}
                </div>
              </div>
              <div className="row mb-4 ">
                <div className="col-9 row">
                  <div className="col-4">
                     <p className="ms-2 ">Select Vechile Type</p>
                    <input className="form-control shadow-sm" value="4 Seater" style={{ border: "none" }} />
                  </div>
                  <div className="col-4">
                  <p className="ms-2 ">5-10 mins</p>
                    <input
                      className="form-control shadow-sm"
                      placeholder="Price/Km"
                      style={{ border: "none" }}
                      value={fourSeaterFormData?.["5_10_price"]}
                      onChange={(e) => setFourSeaterFormData({ ...fourSeaterFormData, "5_10_price": e.target.value })}
                    />
                    
                  </div>
                  <div className="col-4">
                  <p className="ms-2 ">45-50 mins</p>
                    <input
                      className="form-control shadow-sm"
                      placeholder="Price/Km"
                      style={{ border: "none" }}
                      value={fourSeaterFormData?.["45_50_price"]}
                      onChange={(e) => setFourSeaterFormData({ ...fourSeaterFormData, "45_50_price": e.target.value })}
                    />
                    
                  </div>
                </div>
                <div className="col-3 d-flex justify-content-end align-items-end">
                  {fourSeaterFormData?.["5_10_price"] && fourSeaterFormData?.["45_50_price"] ? (
                    priceStoreBtnLoader == "4seater" ? (
                      <button
                        className="btn  btn-success w-50"
                        style={{ background: "#139F01", borderRadius: "8px", border: "none", opacity: "0.5", height:"40px" }}
                      >
                        Saving ...
                      </button>
                    ) : (
                      <button
                        className="btn  btn-success w-50"
                        style={{ background: "#139F01", borderRadius: "8px", border: "none", height:"40px" }}
                        onClick={() => handleSubmitPersonalPriceFunc("4seater")}
                      >
                        Submit
                      </button>
                    )
                  ) : (
                    <button
                      className="btn  btn-success w-50"
                      style={{ background: "#139F01", borderRadius: "8px", border: "none", opacity: "0.5", height:"40px" }}
                    >
                      Submit
                    </button>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-9 row">
                  <div className="col-4">
                    <input className="form-control shadow-sm" value="6 Seater" style={{ border: "none" }} />
                  </div>
                  <div className="col-4">
                    <input
                      className="form-control shadow-sm"
                      placeholder="Price/Km"
                      style={{ border: "none" }}
                      value={sixSeaterFormData?.["5_10_price"]}
                      onChange={(e) => setSixSeaterFormData({ ...sixSeaterFormData, "5_10_price": e.target.value })}
                    />
                    
                  </div>
                  <div className="col-4">
                    <input
                      className="form-control shadow-sm"
                      placeholder="Price/Km"
                      style={{ border: "none" }}
                      value={sixSeaterFormData?.["45_50_price"]}
                      onChange={(e) => setSixSeaterFormData({ ...sixSeaterFormData, "45_50_price": e.target.value })}
                    />
                    
                  </div>
                </div>
                <div className="col-3 d-flex justify-content-end">
                  {sixSeaterFormData?.["5_10_price"] && sixSeaterFormData?.["45_50_price"] ? (
                    priceStoreBtnLoader == "6seater" ? (
                      <button
                        className="btn  btn-success w-50"
                        style={{ background: "#139F01", borderRadius: "8px", border: "none", opacity: "0.5" }}
                      >
                        Saving ...
                      </button>
                    ) : (
                      <button
                        className="btn  btn-success w-50"
                        style={{ background: "#139F01", borderRadius: "8px", border: "none" }}
                        onClick={() => handleSubmitPersonalPriceFunc("6seater")}
                      >
                        Submit
                      </button>
                    )
                  ) : (
                    <button
                      className="btn  btn-success w-50"
                      style={{ background: "#139F01", borderRadius: "8px", border: "none", opacity: "0.5" }}
                    >
                      Submit
                    </button>
                  )}
                </div>
              </div>
            </div> */}
          {/* <div className="provienceListMain">
              <div className="row-8-cols">
                {showSkelton
                  ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]?.map((v, i) => {
                      return (
                        <div className="col-custom-8">
                          <Skeleton width={140} height={100} />
                        </div>
                      );
                    })
                  : list?.map((v, i) => (
                      <div className="col-custom-8" key={i} style={{cursor:"pointer"}} onClick={()=>setSelectedIndex(i)}>
                        <div className="provienceItem d-flex justify-content-center" style={{background:i==selectedIndex && "pink"}}>
                          <div className="text-center">
                            <img
                              src="https://cdn-icons-png.flaticon.com/128/535/535188.png"
                              alt="province icon"
                              style={{ width: "40px", height: "40px" }} // Adjust size if needed
                            />
                            <p className="my-1">{v?.provinceName}</p>
                            <p className="mb-0">{v?.prices?.length}</p>
                          </div>
                        </div>
                      </div>
                    ))}
              </div>
            </div>

            <div style={{ margin: "0px 10px" }}>
              <table className="table">
                <thead>
                  <tr style={{ background: "#DCE4E7" }}>
                    <th scope="col" style={{ borderRadius: "8px 0px 0px 8px" }}>
                      Sr. No
                    </th>
                    <th scope="col">City</th>
                    <th scope="col" style={{ borderRadius: "0px 8px 8px 0px" }}>
                      Action
                    </th>
                  </tr>
                </thead>
                <div className="py-2"></div>
                <tbody>
                                  {showListSkelton
                                    ? Array.from({ length: 5 }).map((_, index) => (
                                        <tr key={index}>
                                          <td>
                                            <Skeleton width={80} />
                                          </td>
                
                                          <td>
                                            <Skeleton width={140} />
                                          </td>
                                          <td>
                                            <Skeleton width={140} />
                                          </td>
                                          <td>
                                            <Skeleton width={80} />
                                          </td>
                
                                          <td>
                                            <Skeleton width={80} />
                                          </td>
                                        </tr>
                                      ))
                                    : list[selectedIndex]?.cities?.map((v, i) => {
                                        return (
                                          <tr>
                                            <td scope="row">{i + 1}</td>
                                            <td>{v?.city}</td>
                                            
                
                                            <td className="d-flex justify-content-center align-items-center">
                                            <select
                                                // value={actionValue}
                                                  // onChange={(e) => {
                                                  //   if (e.target.value === "Delete") {
                                                  //     deletePriceFunc(v?.id);
                                                  //     setActionValue("")
                                                  //   } else if (e.target.value === "Edit") {
                                                  //     setEditFormData({
                                                  //       source: v?.source,
                                                  //       destination: v?.destination,
                                                  //       sharing_price: v?.sharing_price,
                                                  //       category_id: "1",
                                                  //       id: v?.id,
                                                  //     });
                                                  //     setActionValue("")
                                                  //   }
                                                  // }}
                                                >
                                                  <option value="">Action</option>
                                                  <option value="Edit">Edit</option>
                                                  <option value="Delete">Delete</option>
                                                </select>
                                            </td>
                                          </tr>
                                        );
                                      })}
                                </tbody>
              </table>
            </div> */}
          {/* </div> */}
          <div
            className="tableBody pt-4  px-4 mt-4 borderRadius30All"
            style={{ background: "#E5E5E5" }}
          >
            <div className="row">
              {showSkelton
                ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]?.map((v, i) => {
                    return (
                      <div className="col-2 mb-4">
                        <Skeleton width={140} height={60} />
                      </div>
                    );
                  })
                : list?.map((v, i) => {
                    return (
                      <div className="col-2 mb-4">
                        <div
                          className="personalSettingLocationCard d-flex justify-content-between align-items-center"
                          style={{
                            border:
                              i == selectedIndex ? "3px solid #363535" : "none",
                          }}
                          onClick={() => setSelectedIndex(i)}
                        >
                          <div className="text-center">
                            <img src="icons/greenLocation.png" />
                            <p className="mt-1">{v?.provinceName}</p>
                          </div>
                          <div>
                            <img
                              src="icons/redDeleteIcon.png"
                              onClick={() => alert("Work in progress")}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
            </div>
          </div>
          <div
            className="tableBody pt-4 px-4 mt-4 borderRadius30All"
            style={{ background: "#353535" }}
          >
            <div style={{ margin: "0px 10px" }}>
              <table className="table settingTable">
                <thead>
                  <tr style={{ background: "#D0FF13" }}>
                    <th
                      scope="col"
                      style={{ borderRadius: "20px 0px 0px 20px" }}
                    >
                      Sr. No
                    </th>
                    <th scope="col">City</th>
                    <th
                      scope="col"
                      style={{ borderRadius: "0px 20px 20px 0px" }}
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <div className="py-2"></div>
                <tbody>
                  {showListSkelton
                    ? Array.from({ length: 5 }).map((_, index) => (
                        <tr key={index}>
                          <td>
                            <Skeleton width={80} />
                          </td>

                          <td>
                            <Skeleton width={140} />
                          </td>
                          <td>
                            <Skeleton width={140} />
                          </td>
                          <td>
                            <Skeleton width={80} />
                          </td>

                          <td>
                            <Skeleton width={80} />
                          </td>
                        </tr>
                      ))
                    : list[selectedIndex]?.cities?.map((v, i) => {
                        return (
                          <>
                            <tr
                              style={{
                                background: i % 2 == 0 ? "#fff" : "#1C1C1E",
                              }}
                            >
                              <td
                                scope="row"
                                style={{
                                  borderRadius: "25px 0px 0px 25px",
                                  color: i % 2 == 0 ? "#000" : "#fff",
                                }}
                              >
                                {i + 1}
                              </td>
                              <td
                                style={{ color: i % 2 == 0 ? "#000" : "#fff" }}
                              >
                                {v?.city}
                              </td>

                              <td style={{ borderRadius: "0px 25px 25px 0px" }}>
                                <div className="d-flex justify-content-center align-items-center">
                                  <select
                                  // value={actionValue}
                                  //   onChange={(e) => {
                                  //     if (e.target.value === "Delete") {
                                  //       deletePriceFunc(v?.id);
                                  //       setActionValue("")
                                  //     } else if (e.target.value === "Edit") {
                                  //       setEditFormData({
                                  //         source: v?.source,
                                  //         destination: v?.destination,
                                  //         sharing_price: v?.sharing_price,
                                  //         category_id: "1",
                                  //         id: v?.id,
                                  //       });
                                  //       setActionValue("")
                                  //     }
                                  //   }}
                                  >
                                    <option value="">Action</option>
                                    <option value="Edit">Edit</option>
                                    <option value="Delete">Delete</option>
                                  </select>
                                </div>
                              </td>
                            </tr>
                            <div className="my-3"></div>
                          </>
                        );
                      })}
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

export default PersonalLocation;
