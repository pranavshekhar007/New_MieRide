import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import TableNav from "../../components/TableNav";
import axios from "axios";
import {
  addSharingPriceServ,
  listProvinceServ,
  sharingLocationListServ,
  deletePriceFairServ,
  editPriceFairServ,
  getProvinceViseLocation,
  getPriceTriesServ,
  fetchPriceBySourceAndDestinationServ,
  addPriceTrieServ,
  editPriceTrieServ,
  deletePriceTierServ,
} from "../../services/priceAndCity.services";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import { useGlobalState } from "../../GlobalProvider";
import LocationAutoComplete from "../../components/LocationAutoComplete";
import NewSidebar from "../../components/NewSidebar";
import CustomTopNav from "../../components/CustomTopNav";
import CustomPagination from "../../components/CustomPazination";
import SecondaryTopNav from "../../components/SecondaryTopNav";
import NoRecordFound from "../../components/NoRecordFound";
function SharingLocation() {
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
  const [showSkelton, setShowSkelton] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showListSkelton, setShowListSkelton] = useState(false);
  const [list, setList] = useState([]);
  const getProvinceViseLocationFunc = async () => {
    setShowSkelton(true);
    setShowListSkelton(true);
    try {
      let response = await getProvinceViseLocation();
      if (response?.data?.statusCode == "200") {
        setList(response?.data?.data);
      }
    } catch (error) {}
    setShowListSkelton(false);
    setShowSkelton(false);
  };
  const [formData, setFormData] = useState({
    category_id: 1,
    source: "",
    destination: "",
    sharing_price: 0,
    distance: 0,
    price_tier_id: "",
    source_long: "",
    source_lat: "",
    destination_long: "",
    destination_lat: "",
    is_swap_data: false,
  });
  const [clearInput, setClearInput] = useState(false);
  const handleSubmitStorePrice = async () => {
    try {
      let response = await addSharingPriceServ({
        ...formData,
        is_swap_data: formData?.is_swap_data ? 1 : 0,
      });
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        setFormData({
          category_id: 1,
          source: "",
          destination: "",
          sharing_price: "",
          source_long: "",
          source_lat: "",
          destination_long: "",
          destination_lat: "",
          is_swap_data: false,
          distance: 0,
        });
        setClearInput(true);
        getProvinceViseLocationFunc();
      } else {
        toast.error("Something went wrong");
        setClearInput(true);
      }
    } catch (error) {
      toast.error("Internal Server Error");
      setClearInput(true);
    }
    setClearInput(true);
  };

  useEffect(() => {
    getProvinceViseLocationFunc();
  }, []);
  const setSourceLocationFunc = (obj) => {
    setFormData({
      ...formData,
      source: obj.cityName,
      source_long: obj.lng,
      source_lat: obj.lat,
    });
  };
  const setDestinationLocationFunc = (obj) => {
    setFormData({
      ...formData,
      destination: obj.cityName,
      destination_long: obj.lng,
      destination_lat: obj.lat,
    });
  };
  const deletePriceFunc = async (id) => {
    console.log(id);
    const isConfirmed = window.confirm(
      "Are you sure you want to delete the price record?"
    );

    if (isConfirmed) {
      try {
        let response = await deletePriceFairServ(id);
        if (response?.data?.statusCode == "200") {
          toast.success(response?.data?.message);
          getProvinceViseLocationFunc();
        }
      } catch (error) {
        toast.error("Internal Server Error");
      }
    }
  };
  const deletePriceTrieFunc = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete the price tier?"
    );

    if (isConfirmed) {
      try {
        let response = await deletePriceTierServ(id);
        if (response?.data?.statusCode == "200") {
          toast.success(response?.data?.message);
          getPriceTriesFunc();
        }
      } catch (error) {
        toast.error("Internal Server Error");
      }
    }
  };
  const [editFormData, setEditFormData] = useState({
    source: "",
    destination: "",
    sharing_price: "",
    category_id: "1",
    id: "",
  });
  const handleEditPriceFairFunc = async () => {
    try {
      let response = await editPriceFairServ(editFormData);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        setEditFormData({
          source: "",
          destination: "",
          sharing_price: "",
          category_id: "1",
          id: "",
        });
        getProvinceViseLocationFunc();
      }
    } catch (error) {
      console.log(error?.response);
      toast.error("Internal Server Error");
    }
  };
  const [priceTriesPopup, setPriceTriesPopup] = useState({
    show: false,
  });
  const fetchPriceAndDistanceFunc = async (data) => {
    try {
      let response = await fetchPriceBySourceAndDestinationServ(data);
      if (response?.data?.statusCode == "200") {
        setFormData((prev) => ({
          ...prev,
          sharing_price: response.data.price,
          distance: response.data.distance,
          price_tier_id: response.data.id,
        }));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      setFormData((prev) => ({
        ...prev,
        sharing_price: "",
        distance: "",
        price_tier_id: "",
      }));
    }
  };

  useEffect(() => {
    if (formData?.source && formData?.destination) {
      fetchPriceAndDistanceFunc(formData);
    }
  }, [formData.source, formData.destination]);

  const getPriceTriesFunc = async () => {
    try {
      let response = await getPriceTriesServ();
      if (response?.data?.statusCode == "200") {
        setPriceList(response?.data?.data);
      }
    } catch (error) {
      toast.error(error?.response?.data?.error);
    }
  };
  useEffect(() => {
    getPriceTriesFunc();
  }, []);
  const [priceForm, setPriceForm] = useState({
    from: "",
    to: "",
    price: "",
  });
  const [priceList, setPriceList] = useState([]);
  const [addLoader, setAddLoader] = useState(false);
  const addPriceTrieFunc = async () => {
    setAddLoader(true);
    try {
      let response = await addPriceTrieServ(priceForm);
      if (response?.data?.statusCode == "200") {
        getPriceTriesFunc();
        setPriceForm({
          from: "",
          to: "",
          price: "",
        });
        toast.success(response?.data?.message);
      }
    } catch (error) {
      toast.info(error?.response?.data?.message);
    }
    setAddLoader(false);
  };
  const editPriceFunc = async () => {
    try {
      let response = await editPriceTrieServ(priceForm);
      if (response?.data?.statusCode == "200") {
        getPriceTriesFunc();
        setPriceForm({
          from: "",
          to: "",
          price: "",
        });
        toast.success(response?.data?.message);
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
            <CustomTopNav navItems={navItems} selectedNav="Location" />
            <SecondaryTopNav
              navItems={tableNav}
              selectedNav="Sharing"
              navBg="#E5E5E5"
              navColor="#1C1C1C"
              selectedNavBg="#353535"
              selectedNavColor="#fff"
            />
          </div>
          <div className="sharingLocationTopActionDiv row mx-0">
            <div className="col-4 ps-0">
              <div className="fundSearchBtn">
                <img src="https://cdn-icons-png.flaticon.com/128/2811/2811790.png" />
                <input
                  placeholder="Search City"
                  // onChange={(e) => handleSearch(e.target.value)}
                  // value={query}
                  // readOnly={formData?.name}
                />
              </div>
            </div>
            <div className="col-4">
              <button>Add City</button>
            </div>
            <div className="col-4 d-flex justify-content-end pe-0">
              <button className="bgSuccess textDark">Price Tiers</button>
            </div>
          </div>
          <div className="provienceHorizontalListDiv d-flex">
            {showSkelton
              ? [1, 2, 3, 4, 5, 6, 7, 8]?.map((v, i) => {
                  return (
                    <div className="me-2">
                      <Skeleton width={140} height={50} />
                    </div>
                  );
                })
              : list?.map((v, i) => {
                  return (
                    <div
                      className="d-flex justify-content-between align-items-center provItem me-2"
                      style={{ background: i == selectedIndex && "#FFE5E5" }}
                    >
                      <img
                        src={
                          i == selectedIndex
                            ? "/imagefolder/redLocation.png"
                            : "/imagefolder/greenLocation.png"
                        }
                        alt="province icon"
                      />
                      <p className="mb-0">{v?.provinceName}</p>
                      <p className="mb-0">({v?.prices?.length})</p>
                    </div>
                  );
                })}
          </div>
          <div className="tableOuterContainer bgDark">
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
                    <th scope="col">Province</th>

                    <th
                      scope="col"
                      style={{
                        borderRadius: "0px 24px 24px 0px",
                        width: "33%",
                      }}
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
                    : list[selectedIndex]?.prices?.map((v, i) => {
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
                                {i + 1}
                              </td>
                              <td> {v?.source}</td>

                              <td
                                style={{
                                  borderTopRightRadius: "30px",
                                  borderBottomRightRadius: "30px",
                                }}
                              >
                                <div className="d-flex justify-content-center">
                                  <button
                                    className="deleteBtn"
                                    onClick={() => deletePriceFunc(v?.id)}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                            <div
                              className={
                                i == list[selectedIndex]?.prices?.length - 1
                                  ? " "
                                  : " pb-3"
                              }
                            ></div>
                          </>
                        );
                      })}
                </tbody>
              </table>
              {list[selectedIndex]?.prices?.length == 0 && !showSkelton && (
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
          padding: "0px 30px 45px 30px",
        }}
      >
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
            selectedItem="Sharing"
            sectedNavBg="#353535"
            selectedNavColor="#fff"
            isItemMoreThen8={true}
          />
        </div>
        <div className="tableMain">
          <div
            className="tableBody py-2 px-2 borderRadius20All"
            style={{ background: "#fff", border: "1px solid #E5E5E5" }}
          >
            <div className="row mx-0 p-0 justify-content-around py-3">
              <div className="col-lg-8 row m-0 p-0">
                <div className="col-lg-4  m-0 ">
                  {/* <div className="d-flex justify-content-between align-items-center locationSearchBtn">
                    <input
                      onChange={(e) => handleSourceSearch(e.target.value)}
                      value={sourceQuery}
                      readOnly={formData?.source}
                      placeholder="Search Source"
                      style={{ width: "100%" }}
                    />
                    {formData?.source ? (
                      <i
                        className="fa fa-close"
                        onClick={() => {
                          setFormData({ ...formData, source_long: "", source_lat: "", source: "" });
                          setSourceQuery("");
                          setSourceLocation([]);
                        }}
                      ></i>
                    ) : (
                      <img src="https://cdn-icons-png.flaticon.com/128/751/751463.png" />
                    )}
                  </div> */}
                  <LocationAutoComplete
                    placeholder="Search Source"
                    callBackFunc={setSourceLocationFunc}
                    clearInput={clearInput}
                  />
                  {/* {sourceLocation.length > 0 && formData?.source === "" && (
                    <ul className="priceCityUl shadow-sm">
                      {sourceLocation.map((v, i) => {
                        // Try to find the component with "administrative_area_level_3"
                        let stateComponent = v?.address_components.find((component) =>
                          component.types.includes("administrative_area_level_3")
                        );

                        // If not found, look for the component with "locality"
                        if (!stateComponent) {
                          stateComponent = v?.address_components.find((component) =>
                            component.types.includes("locality")
                          );
                        }

                        // Only render if a valid component is found
                        return stateComponent ? (
                          <li
                            onClick={() => {
                              setSourceQuery(stateComponent.long_name);
                              console.log(stateComponent);
                              setFormData({
                                ...formData,
                                source: stateComponent.long_name,
                                source_long: v?.geometry?.location.lng,
                                source_lat: v?.geometry?.location.lat,
                              });
                            }}
                            key={i}
                          >
                            {stateComponent.long_name}
                          </li>
                        ) : null;
                      })}
                    </ul>
                  )} */}
                </div>
                <div className="col-lg-4 m-0">
                  {/* <div className="d-flex justify-content-between align-items-center locationSearchBtn">
                    <input
                      onChange={(e) => handleDestinationSearch(e.target.value)}
                      value={destinationQuery}
                      readOnly={formData?.destination}
                      placeholder="Search Source"
                      style={{ width: "100%" }}
                    />
                    {formData?.destination ? (
                      <i
                        className="fa fa-close"
                        onClick={() => {
                          setFormData({ ...formData, destination_long: "", destination_lat: "", destination: "" });
                          setDestinationQuery("");
                          setDestinationLocation([]);
                        }}
                      ></i>
                    ) : (
                      <img src="https://cdn-icons-png.flaticon.com/128/751/751463.png" />
                    )}
                  </div>
                  {destinationLocation.length > 0 && formData?.destination === "" && (
                    <ul className="priceCityUl shadow-sm">
                      {destinationLocation.map((v, i) => {
                        // Try to find the component with "administrative_area_level_3"
                        let stateComponent = v?.address_components.find((component) =>
                          component.types.includes("administrative_area_level_3")
                        );

                        // If not found, look for the component with "locality"
                        if (!stateComponent) {
                          stateComponent = v?.address_components.find((component) =>
                            component.types.includes("locality")
                          );
                        }

                        // Only render if a valid component is found
                        return stateComponent ? (
                          <li
                            onClick={() => {
                              setDestinationQuery(stateComponent.long_name);
                              setFormData({
                                ...formData,
                                destination: stateComponent.long_name,
                                destination_long: v?.geometry?.location.lng,
                                destination_lat: v?.geometry?.location.lat,
                              });
                            }}
                            key={i}
                          >
                            {stateComponent.long_name}
                          </li>
                        ) : null;
                      })}
                    </ul>
                  )} */}
                  <LocationAutoComplete
                    placeholder="Search Destination"
                    callBackFunc={setDestinationLocationFunc}
                    clearInput={clearInput}
                  />
                </div>
                <div className="col-lg-4 m-0">
                  {/* <div className="d-flex justify-content-between align-items-center locationSearchBtn">
                    <p className="mb-0 me-2">$</p>
                    <input
                      value={formData?.sharing_price}
                      placeholder="Enter Price"
                      style={{ width: "100%" }}
                      type="number"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sharing_price: e.target.value,
                        })
                      }
                    />
                  </div> */}
                  <div className="d-flex w-100  justify-content-between">
                    <div className="distanceBtn">{formData?.distance} KM</div>
                    {formData?.distance == 0 && formData?.destination ? (
                      <input
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            sharing_price: e?.target?.value,
                            price_tier_id: 0,
                          });
                        }}
                        value={formData?.sharing_price}
                        placeholder="Enter Price"
                        className="form-control mx-2"
                        type="number"
                      />
                    ) : (
                      <div
                        className="distanceBtn"
                        style={{ background: "#00A431" }}
                      >
                        $ {formData?.sharing_price || 0}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-lg-4 row m-0 p-0">
                <div className="col-lg-4    ">
                  <div className="d-flex justify-content-center align-items-center ">
                    <div
                      className="customSelect d-flex justify-content-center align-items-center"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          is_swap_data: !formData?.is_swap_data,
                        })
                      }
                    >
                      {formData?.is_swap_data && (
                        <img src="https://cdn-icons-png.flaticon.com/128/447/447147.png" />
                      )}
                    </div>
                    <button
                      className="btn btn-success  bgSuccess"
                      style={{ border: "none", background: "#000000" }}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          is_swap_data: !formData?.is_swap_data,
                        })
                      }
                    >
                      Swap
                    </button>
                  </div>
                </div>

                <div className="col-lg-8   ">
                  {/* <div className="d-flex justify-content-between align-items-center ">
                    {formData?.destination &&
                    formData?.sharing_price &&
                    formData?.source ? (
                      <button
                        className="btn btn-success w-100 bgSuccess"
                        style={{ border: "none" }}
                        onClick={handleSubmitStorePrice}
                      >
                        Submit
                      </button>
                    ) : (
                      <button
                        className="btn btn-success w-100 bgSuccess"
                        style={{ border: "none", opacity: "0.5" }}
                      >
                        Submit
                      </button>
                    )}
                  </div> */}
                  <div className="d-flex justify-content-between">
                    {formData?.destination &&
                    formData?.sharing_price &&
                    formData?.source ? (
                      <div
                        className="addRoute me-2"
                        onClick={handleSubmitStorePrice}
                        style={{ cursor: "pointer" }}
                      >
                        Add Route
                      </div>
                    ) : (
                      <div className="addRoute me-2" style={{ opacity: "0.5" }}>
                        Add Route
                      </div>
                    )}

                    <div
                      className="addRoute "
                      onClick={() =>
                        setPriceTriesPopup({ ...priceTriesPopup, show: true })
                      }
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
          <div
            className="tableBody py-2 px-4 mt-4 borderRadius30All"
            style={{ background: "#F3F3F3" }}
          >
            <div className="provienceListMain" style={{ marginBottom: "0px" }}>
              <div className="row-8-cols">
                {showSkelton
                  ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]?.map(
                      (v, i) => {
                        return (
                          <div className="col-custom-8">
                            <Skeleton width={140} height={100} />
                          </div>
                        );
                      }
                    )
                  : list?.map((v, i) => (
                      <div
                        className="col-custom-8"
                        key={i}
                        style={{ cursor: "pointer" }}
                        onClick={() => setSelectedIndex(i)}
                      >
                        <div
                          className="provienceItem d-flex justify-content-center"
                          style={{ background: i == selectedIndex && "pink" }}
                        >
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
          </div>
          <div
            style={{
              margin: "20px 0px",
              padding: "25px",
              background: "#353535",
              borderRadius: "30px",
            }}
          >
            <table className="table settingTable">
              <thead>
                <tr style={{ background: "#D0FF13" }}>
                  <th scope="col" style={{ borderRadius: "20px 0px 0px 20px" }}>
                    Sr. No
                  </th>
                  <th scope="col">Source</th>
                  <th scope="col">Destination</th>
                  <th scope="col">Price</th>
                  <th scope="col">Distance</th>

                  <th scope="col" style={{ borderRadius: "0px 20px 20px 0px" }}>
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
                        <td>
                          <Skeleton width={80} />
                        </td>
                      </tr>
                    ))
                  : list[selectedIndex]?.prices?.map((v, i) => {
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
                            <td style={{ color: i % 2 == 0 ? "#000" : "#fff" }}>
                              {v?.source}
                            </td>
                            <td style={{ color: i % 2 == 0 ? "#000" : "#fff" }}>
                              {v?.destination}
                            </td>

                            <td className="d-flex justify-content-center">
                              <div
                                className="settingTableBtn"
                                style={{ background: "#00A431", color: "#fff" }}
                              >
                                ${v?.sharing_price}
                              </div>
                            </td>
                            <td className="">
                              <div className="d-flex justify-content-center">
                                <div
                                  className="settingTableBtn"
                                  style={{
                                    background: i % 2 == 0 ? "#353535" : "#fff",
                                    color: i % 2 == 0 ? "#fff" : "#000",
                                  }}
                                >
                                  {v?.distance ? v?.distance + "KM" : "N/A"}
                                </div>
                              </div>
                            </td>

                            <td style={{ borderRadius: "0px 25px 25px 0px" }}>
                              {/* <select
                                value={actionValue}
                                  onChange={(e) => {
                                    if (e.target.value === "Delete") {
                                      deletePriceFunc(v?.id);
                                      setActionValue("")
                                    } else if (e.target.value === "Edit") {
                                      setEditFormData({
                                        source: v?.source,
                                        destination: v?.destination,
                                        sharing_price: v?.sharing_price,
                                        category_id: "1",
                                        id: v?.id,
                                      });
                                      setActionValue("")
                                    }
                                  }}
                                >
                                  <option value="">Action</option>
                                  <option value="Edit">Edit</option>
                                  <option value="Delete">Delete</option>
                                </select> */}
                              <img
                                onClick={() => deletePriceFunc(v?.id)}
                                style={{ height: "25px" }}
                                src="https://cdn-icons-png.flaticon.com/128/6861/6861362.png"
                              />
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
        {/* table List ended */}
      </section>
      {/* sectionLayout ended */}

      {editFormData.id && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Price</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() =>
                    setEditFormData({
                      source: "",
                      destination: "",
                      sharing_price: "",
                      category_id: "1",
                      id: "",
                    })
                  }
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <label>Source</label>
                <input
                  className="form-control mb-3"
                  value={editFormData?.source}
                  readOnly
                />
                <label>Destination</label>
                <input
                  className="form-control mb-3"
                  value={editFormData?.destination}
                  readOnly
                />
                <label>Charge</label>
                <input
                  className="form-control"
                  value={editFormData?.sharing_price}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      sharing_price: e.target.value,
                    })
                  }
                  type="number"
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() =>
                    setEditFormData({
                      source: "",
                      destination: "",
                      sharing_price: "",
                      category_id: "1",
                      id: "",
                    })
                  }
                >
                  Close
                </button>
                {editFormData.sharing_price ? (
                  <button
                    onClick={handleEditPriceFairFunc}
                    type="button"
                    className="btn btn-primary"
                  >
                    Submit
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ opacity: "0.5" }}
                  >
                    Submit
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {priceTriesPopup?.show && (
        <div
          className="modal fade show d-flex align-items-center manualSetPopup  justify-content-center "
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div
              className="modal-content"
              style={{
                borderRadius: "16px",
                background: "#f7f7f5",
                width: "550px",
              }}
            >
              <div className="d-flex justify-content-between pt-4 pb-0 px-4">
                <p className="mb-0">
                  <u>Price Tiers</u>
                </p>
                {/* <i
                    className="fa fa-close text-secondary"
                    onClick={() => {
                      // setPaymentDetailsPopup(null);
                    }}
                  ></i> */}
              </div>
              {/* <hr className="mt-0" /> */}
              <div
                className="modal-body retryContainer"
                style={{ fontFamily: "poppins" }}
              >
                <div
                  style={{
                    wordWrap: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                  // className="d-flex justify-content-center w-100"
                >
                  <div
                    className="row m-0 p-0 py-3 d-flex align-items-center "
                    style={{
                      borderRadius: "10px 10px 0px 0px",
                      background: "#D0FF13",
                    }}
                  >
                    <div className="col-3">From (KM)</div>
                    <div className="col-3">To (KM)</div>
                    <div className="col-3">Price (CAD)</div>
                    <div className="col-3">Action</div>
                  </div>
                  <div
                    className="row m-0 p-0 py-3 d-flex align-items-center "
                    style={
                      {
                        // borderRadius: "10px 10px 0px 0px",
                        // background: "#D0FF13",
                      }
                    }
                  >
                    <div className="col-3">
                      <input
                        className="form-control w-100 "
                        onChange={(e) =>
                          setPriceForm({ ...priceForm, from: e?.target?.value })
                        }
                        readOnly={priceForm?.id}
                        placeholder="From (KM)"
                        value={priceForm?.from}
                        type="number"
                      />
                    </div>
                    <div className="col-3">
                      <input
                        className="form-control w-100"
                        onChange={(e) =>
                          setPriceForm({ ...priceForm, to: e?.target?.value })
                        }
                        readOnly={priceForm?.id}
                        value={priceForm?.to}
                        placeholder="To (KM)"
                        type="number"
                      />
                    </div>
                    <div className="col-3">
                      <input
                        className="form-control w-100"
                        onChange={(e) =>
                          setPriceForm({
                            ...priceForm,
                            price: e?.target?.value,
                          })
                        }
                        value={priceForm?.price}
                        type="number"
                        placeholder="Price (CAD)"
                      />
                    </div>
                    <div className="col-3">
                      {!priceForm?.id ? (
                        !addLoader ? (
                          <img
                            src="/icons/addIcon.png"
                            onClick={addPriceTrieFunc}
                          />
                        ) : (
                          <span
                            className="text-light px-4 border py-1 bg-success"
                            // onClick={editPriceFunc}
                            style={{ cursor: "pointer", opacity: "0.5" }}
                          >
                            Adding...
                          </span>
                        )
                      ) : (
                        <span
                          className="text-light px-4 border py-1 bg-success"
                          onClick={editPriceFunc}
                          style={{ cursor: "pointer" }}
                        >
                          Update
                        </span>
                      )}
                    </div>
                  </div>
                  {priceList?.map((v, i) => {
                    return (
                      <div
                        className={
                          "row m-0 px-0 py-2 align-items-center d-flex " +
                          (v?.id == priceForm?.id
                            ? " shadow borderBlue my-1"
                            : " ")
                        }
                        style={{
                          background: i % 2 == 0 ? "#F7F7F7" : "#353535",
                          color: i % 2 == 0 ? "#000" : "#fff",
                        }}
                      >
                        <div className="col-3">{v?.from} KM</div>
                        <div className="col-3">{v?.to} KM</div>
                        <div className="col-3 d-flex justify-content-center">
                          <div
                            className="px-2 py-1"
                            style={{
                              border: "0.5px solid #6B6B6B",
                              borderRadius: "5px",
                              color: i % 2 != 0 ? "#D0FF13" : "#000",
                            }}
                          >
                            $ {v?.price}
                          </div>
                        </div>

                        <div className="col-3 d-flex justify-content-center">
                          <img
                            onClick={(e) => setPriceForm(v)}
                            style={{ height: "20px", marginRight: "8px" }}
                            src="https://cdn-icons-png.flaticon.com/128/10336/10336582.png"
                          />
                          <img
                            onClick={(e) => deletePriceTrieFunc(v?.id)}
                            style={{ height: "20px" }}
                            src="https://cdn-icons-png.flaticon.com/128/6861/6861362.png"
                          />
                        </div>
                      </div>
                    );
                  })}
                  <div className="mt-4 d-flex justify-content-end retryBtnGroup">
                    <button
                      className="me-3"
                      onClick={() =>
                        setPriceTriesPopup({ ...priceTriesPopup, show: false })
                      }
                    >
                      Cancel
                    </button>
                  </div>
                </div>
                <div className="d-flex justify-content-center"></div>
              </div>
            </div>
          </div>
        </div>
      )}
      {priceTriesPopup?.show && (
        <div className="modal-backdrop fade show"></div>
      )}
    </div>
  );
}

export default SharingLocation;
