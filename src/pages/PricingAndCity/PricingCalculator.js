import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import { calculatePriceServ } from "../../services/priceAndCity.services";
import { toast } from "react-toastify";
import { useGlobalState } from "../../GlobalProvider";
import LocationAutoComplete from "../../components/LocationAutoComplete";
function PricingCalculator() {
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

  const [formData, setFormData] = useState({
    source: "",
    source_long: "",
    source_lat: "",
    destination: "",
    destination_long: "",
    destination_lat: "",
    mileage: "",
    fuel_price: "",
    vehicle_size: "",
  });
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
  const [loader, setLoader] = useState(false);
  const [popup, setPopup] = useState(false);
  const [clearInput, setClearInput] = useState(false);
  const handleSubmitFunc = async () => {
    setLoader(true);
    try {
      let response = await calculatePriceServ(formData);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        setFormData({
          source: "",
          source_long: "",
          source_lat: "",
          destination: "",
          destination_long: "",
          destination_lat: "",
          mileage: "",
          fuel_price: "",
          vehicle_size: "",
        });
        setClearInput(true);
        setPopup({
            show:true,
            distance_km:response?.data?.distance_km,
            totalPrice:response?.data?.totalPrice
        })
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
    setLoader(false)
  };
  return (
    <div className="main_layout  bgBlack d-flex">
      {/* sidebar started */}
      <Sidebar selectedItem="Pricing & Cities" />
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
          navBg="#B1CF5F"
          divideRowClass="col-xl-6 col-lg-6 col-md-6 col-6"
          selectedItem="Price Calculator"
          sectedNavBg="#fff"
          selectedNavColor="#030303"
          isItemMoreThen8={true}
        />
        {/* top nav ended  */}

        <div
          className="vh80 d-flex  justify-content-center align-items-center gtMainDiv"
          style={{ background: "#f8f4f9", borderRadius: "14px" }}
        >
          <div style={{ width: "550px" }}>
            <h1 className="text-center">Price Calculator </h1>
            <label className="mt-4">Source Location</label>
            <LocationAutoComplete
              placeholder="Search Sourse"
              callBackFunc={setSourceLocationFunc}
              clearInput={clearInput}
            />
            <label className="mt-4">Destination Location</label>
            <LocationAutoComplete
              placeholder="Search Destination"
              callBackFunc={setDestinationLocationFunc}
              clearInput={clearInput}
            />
            {popup?.show && <div className="p-2 my-2 border rounded d-flex justify-content-between">
              <button className="mb-0 btn btn-success " style={{width:"45%"}}>Distance : {popup?.distance_km}</button>
              <button className="mb-0 btn btn-primary " style={{width:"45%"}}>Total Price : {popup?.totalPrice}</button>
              </div>}
            
            {formData?.source &&
            formData?.destination 
            ? (
              loader ? (
                <button
                  className="btn btn-success w-100 shadow mt-4 bgSuccess"
                  style={{
                    border: "none",
                    borderRadius: "20px",
                    opacity: "0.5",
                  }}
                >
                  Calculating ...
                </button>
              ) : (
                <button
                  className="btn btn-success w-100 shadow mt-4 bgSuccess"
                  onClick={() => handleSubmitFunc()}
                  style={{ border: "none", borderRadius: "20px" }}
                >
                  Submit
                </button>
              )
            ) : (
              <button
                className="btn btn-success w-100 shadow mt-4 bgSuccess"
                style={{ border: "none", borderRadius: "20px", opacity: "0.5" }}
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </section>
      {/* sectionLayout ended */}
      {/* {popup?.show && (
        <div
          className="modal fade show d-flex align-items-center justify-content-center userHistoryPopUp"
          tabIndex="-1"
        >
          <div className="modal-dialog" style={{ width: "370px" }}>
            <div className="modal-content fundsPopUpDiv p-4">
              <div className="d-flex justify-content-end p-2">
                <i
                  className="fa fa-close text-secondary"
                  onClick={()=>{
                    setPopup(null)
                  }}
                ></i>
              </div>
              <h6 className="mb-4">Result</h6>
              <div className="modal-body p-0">
                <div className="d-flex justify-content-between align-items-center mb-2">
                <lebel>Fuel Cost</lebel>
                <input className="form-control w-50  " value={popup?.fuel_cost}/>
                  </div>
                <div className="d-flex justify-content-between align-items-center">
                <lebel>Price/Person</lebel>
                <input className="form-control w-50 " value={popup?.price_per_person}/>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      )}
      {popup?.show && <div className="modal-backdrop fade show"></div>} */}
    </div>
  );
}

export default PricingCalculator;
