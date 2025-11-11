import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { getDriverByIdServ, updateDriverServ, deleteDriverServ } from "../../services/driver.services";
import "react-loading-skeleton/dist/skeleton.css";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TableNav from "../../components/TableNav";
import { useGlobalState } from "../../GlobalProvider";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { addDriverByAdminServ } from "../../services/driver.services";
function AddDriver() {
  const { setGlobalState, globalState } = useGlobalState();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const vehicleColorList = [
    "White",
    "Black",
    "Gray",
    "Silver",
    "Beige",
    "Red",
    "Blue",
    "Yellow",
    "Green",
    "Orange",
    "Purple",
    "Metallic Silver",
    "Metallic Gray",
    "Metallic Blue",
    "Metallic Red",
    "Metallic Gold",
    "Pearl White",
    "Matte Black",
    "Glossy Red",
    "Chrome",
    "Two-Tone",
  ];
  const yearList = [
    "2000",
    "2001",
    "2002",
    "2003",
    "2004",
    "2005",
    "2006",
    "2007",
    "2008",
    "2009",
    "2010",
    "2011",
    "2012",
    "2013",
    "2014",
    "2015",
    "2016",
    "2017",
    "2018",
    "2019",
    "2020",
    "2021",
    "2022",
    "2023",
    "2024",
    "2025",
  ];
  const brandToModels = [
    {
      brand: "Toyota",
      modal: ["Corolla", "Camry", "RAV4", "Highlander", "Tacoma", "Tundra", "Prius"],
    },
    {
      brand: "Honda",
      modal: ["Civic", "Accord", "CR-V", "HR-V", "Pilot", "Ridgeline"],
    },
    {
      brand: "Ford",
      modal: ["F-150", "Escape", "Edge", "Explorer", "Mustang", "Maverick"],
    },
    {
      brand: "Chevrolet",
      modal: ["Silverado", "Equinox", "Traverse", "Malibu", "Tahoe", "Bolt EV"],
    },
    {
      brand: "Nissan",
      modal: ["Sentra", "Altima", "Rogue", "Murano", "Pathfinder", "Frontier"],
    },
    {
      brand: "Hyundai",
      modal: ["Elantra", "Sonata", "Tucson", "Santa Fe", "Kona", "Palisade"],
    },
    {
      brand: "Kia",
      modal: ["Forte", "Optima", "Sportage", "Sorento", "Telluride", "Seltos"],
    },
    {
      brand: "Volkswagen",
      modal: ["Jetta", "Golf", "Tiguan", "Passat", "Atlas", "ID.4"],
    },
    {
      brand: "Subaru",
      modal: ["Impreza", "Legacy", "Forester", "Outback", "Crosstrek", "Ascent"],
    },
    {
      brand: "Mazda",
      modal: ["Mazda3", "Mazda6", "CX-30", "CX-5", "CX-9", "MX-5 Miata"],
    },
    {
      brand: "BMW",
      modal: ["3 Series", "5 Series", "X3", "X5", "X7", "i4"],
    },
    {
      brand: "Mercedes-Benz",
      modal: ["C-Class", "E-Class", "GLC", "GLE", "GLS", "EQB"],
    },
    {
      brand: "Audi",
      modal: ["A3", "A4", "A6", "Q3", "Q5", "Q7", "e-tron"],
    },
    {
      brand: "Tesla",
      modal: ["Model 3", "Model Y", "Model S", "Model X"],
    },
    {
      brand: "GMC",
      modal: ["Sierra", "Terrain", "Acadia", "Yukon", "Canyon"],
    },
    {
      brand: "Jeep",
      modal: ["Wrangler", "Cherokee", "Grand Cherokee", "Compass", "Gladiator"],
    },
    {
      brand: "Dodge",
      modal: ["Challenger", "Charger", "Durango", "Grand Caravan"],
    },
    {
      brand: "Ram",
      modal: ["1500", "2500", "ProMaster"],
    },
    {
      brand: "Lexus",
      modal: ["RX", "NX", "ES", "UX", "GX", "LS"],
    },
    {
      brand: "Acura",
      modal: ["ILX", "TLX", "RDX", "MDX", "Integra"],
    },
    {
      brand: "Volvo",
      modal: ["XC40", "XC60", "XC90", "S60", "V60", "C40"],
    },
    {
      brand: "Mitsubishi",
      modal: ["Mirage", "Lancer", "Outlander", "Eclipse Cross"],
    },
    {
      brand: "Land Rover",
      modal: ["Range Rover", "Discovery", "Defender", "Evoque", "Velar"],
    },
    {
      brand: "Porsche",
      modal: ["911", "Macan", "Cayenne", "Taycan", "Panamera"],
    },
    {
      brand: "Mini",
      modal: ["Cooper", "Countryman", "Clubman"],
    },
    {
      brand: "Cadillac",
      modal: ["CT4", "CT5", "XT4", "XT5", "Escalade", "Lyriq"],
    },
    {
      brand: "Infiniti",
      modal: ["Q50", "Q60", "QX50", "QX60", "QX80"],
    },
    {
      brand: "Jaguar",
      modal: ["XE", "XF", "F-Pace", "E-Pace", "I-Pace", "F-Type"],
    },
    {
      brand: "Alfa Romeo",
      modal: ["Giulia", "Stelvio", "Tonale"],
    },
    {
      brand: "Fiat",
      modal: ["500X", "500L", "Panda"],
    },
  ];

  const vehicleSizeList = ["4 Seater", "6 Seater"];
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    country_code: "",
    contact: "",
    password: "",
    confirmPassword: "",
    vehicle_brand: "",
    vehicle_date: "",
    vehicle_name: "",
    vehicle_size: "",
    vehicle_colour: "",
    vehicle_image:"",
    vehicle_no: "",
    image: "",
    insurance_image: "",
    licence_image: "",
    ownership_image: "",
    wallet_balance:""
  });
  const handlePhoneChange = (value, data) => {
    console.log(value);
    setFormData({
      ...formData,
      country_code: value,
      flag: `https://flagcdn.com/w320/${data.countryCode}.png`, // Flag URL
    });
  };
    const handleSubmitFunc = async () => {
      if(formData?.password != formData?.confirmPassword){
        toast.error("Please confirm the password")
        return
      }
      setLoader(true);
      const userFormData = new FormData();
      userFormData.append("first_name", formData?.first_name);
      userFormData.append("last_name", formData?.last_name);
      userFormData.append("email", formData?.email);
      userFormData.append("contact", formData?.contact);
      userFormData.append("country_code", formData?.country_code);
      userFormData.append("password", formData?.password);
      userFormData.append("confirmPassword", formData?.confirmPassword);
      userFormData.append("vehicle_brand", formData?.vehicle_brand);
      userFormData.append("vehicle_date", formData?.vehicle_date);
      userFormData.append("vehicle_name", formData?.vehicle_name);
      userFormData.append("vehicle_size", formData?.vehicle_size);
      userFormData.append("vehicle_colour", formData?.vehicle_colour);
      userFormData.append("vehicle_image", formData?.vehicle_image);
      userFormData.append("vehicle_no", formData?.vehicle_no);
      userFormData.append("insurance_image", formData?.insurance_image);
      userFormData.append("password", formData?.password);
      userFormData.append("image", formData?.image);
      userFormData.append("licence_image", formData?.licence_image);
      userFormData.append("ownership_image", formData?.ownership_image);
      userFormData.append("wallet_balance", formData?.wallet_balance);
     
      try {
        let response = await addDriverByAdminServ(userFormData);
        if (response?.data?.statusCode == "200") {
          toast.success(response?.data?.message);
          setFormData({
            first_name: "",
            last_name: "",
            email: "",
            country_code: "",
            contact: "",
            password: "",
            confirmPassword: "",
            vehicle_brand: "",
            vehicle_date: "",
            vehicle_name: "",
            vehicle_size: "",
            vehicle_colour: "",
            vehicle_image:"",
            vehicle_no: "",
            image: "",
            insurance_image: "",
            licence_image: "",
            ownership_image: "",
          });
          navigate("/driver-list");
        } else {
          toast.error(response?.data?.message);
        }
        console.log(formData);
      } catch (error) {
        toast.error(error?.response?.data?.data?.vehicle_no[0]);
        toast.error("Internal Server Error");
      }
      setLoader(false);
    };
  return (
    <div className="main_layout  bgBlack d-flex">
      {/* sidebar started */}
      <Sidebar selectedItem="Driver" />
      {/* sidebar ended */}

      {/* sectionLayout started */}
      <section
        className="section_layout"
        style={{ marginLeft: globalState?.isFillSidebarWidth100 ? "260px" : "80px", paddingTop: "30px" }}
      >
        {/* top nav started  */}

        {/* top nav ended  */}
        {/* table List started */}
        <div className="">
          <div
            className="tableBody py-2 px-4 driverDetailsLabelInput borderRadius50All"
            style={{ background: "#FDEEE7" }}
          >
            <div className=" p-5  my-4" style={{ borderRadius: "20px", background: "#fff" }}>
              <div className="d-flex align-items-center justify-content-between">
                <h5>Personal Details</h5>
                <div
                  onClick={() => navigate("/driver-list")}
                  className="addUserBtn d-flex justify-content-between align-items-center "
                  style={{ background: "#EC5C13", cursor: "pointer" }}
                >
                  <p className="mb-0 me-2">Driver List</p>
                  <img src="/icons/sidebarIcons/driver.png" />
                </div>
              </div>
              <div className="row d-flex justify-content-between">
                <div className="col-8 ">
                  <label className=" col-form-label">First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData?.first_name}
                    onChange={(e) => {
                      setFormData({ ...formData, first_name: e.target.value });
                    }}
                  />
                  <label className=" col-form-label">Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData?.last_name}
                    onChange={(e) => {
                      setFormData({ ...formData, last_name: e.target.value });
                    }}
                  />
                  <label className=" col-form-label">Email Address</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData?.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                    }}
                  />
                  <label className=" col-form-label">Phone Number</label>
                  <div className="d-flex align-items-center mb-5 " style={{ borderRadius: "9px" }}>
                    <PhoneInput
                      country="ca" // Default country
                      onChange={handlePhoneChange}
                      inputStyle={{
                        width: "100px",
                        height: "40px",
                        fontSize: "16px",
                        background: "#fff",
                        border: "none",
                      }}
                      buttonStyle={{
                        background: "#fff",
                        border: "none",
                        padding: "0px",
                      }}
                    />
                    <input
                      placeholder=""
                      className="form-control"
                      value={formData?.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      style={{ marginBottom: "0px", padding: "6px", lineHeight: "0px", outline: "none" }}
                    />
                  </div>

                  <div className="row">
                    <div className="col-4">
                      <label className=" col-form-label">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={formData?.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      />
                    </div>
                    <div className="col-4">
                      <label className=" col-form-label">Re-Enter Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={formData?.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      />
                    </div>
                    <div className="col-4">
                      <label className=" col-form-label">Wallet</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData?.wallet_balance}
                        onChange={(e) => setFormData({ ...formData, wallet_balance: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-3 ">
                  <div className="d-flex justify-content-center mt-3">
                    <input
                      type="file"
                      id={`file-upload`} // Unique id for each input
                      style={{ display: "none", height: "80px", width: "80px" }} // Hide the actual input
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          img_prev: URL.createObjectURL(e.target.files[0]),
                          image: e.target.files[0],
                        })
                      } // Handle the file change
                    />
                    <img
                      className="btn btn-primary "
                      style={{
                        padding: formData?.img_prev ? "0px" : "20px",
                        background: "#DDDDDD",
                        borderRadius: "50%",
                        border: "none",
                        color: "#000",
                        height: "150px",
                        width: "150px",
                      }}
                      onClick={() => document.getElementById(`file-upload`).click()} // Trigger input click
                      src={
                        formData?.img_prev
                          ? formData?.img_prev
                          : "https://cdn-icons-png.flaticon.com/128/711/711191.png"
                      }
                    />
                  </div>
                  <div className="d-flex justify-content-center mt-2">
                  <label >Profile Image</label>
                  </div>
                </div>
              </div>
              <h5 className="mt-4" style={{ marginBottom: "-15px" }}>
                Vehicle Details
              </h5>
              <div className="row col-10">
                <div className="col-6">
                  <label className=" col-form-label">Choose Vehicle Brand</label>
                  <select
                    className="form-control"
                    value={formData?.vehicle_brand}
                    onChange={(e) => setFormData({ ...formData, vehicle_brand: e?.target?.value })}
                  >
                    <option>Select</option>
                    {brandToModels?.map((v, i) => {
                      return <option value={v?.brand}>{v?.brand}</option>;
                    })}
                  </select>
                </div>
                <div className="col-6">
                  <label className=" col-form-label">Choose (Year Of Manufacture)</label>
                  <select className="form-control"  onChange={(e) => setFormData({ ...formData, vehicle_date: e?.target?.value })}>
                    <option>Select</option>
                    {yearList?.map((v, i) => {
                      return <option>{v}</option>;
                    })}
                  </select>
                </div>
                <div className="col-6">
                  <label className=" col-form-label">Choose Vehicle Model</label>
                  <select
                    className="form-control"
                    value={formData?.vehicle_name || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, vehicle_name: e.target.value }))}
                  >
                    <option value="">Select</option>
                    {brandToModels
                      ?.find((item) => item?.brand === formData?.vehicle_brand)
                      ?.modal?.map((model, index) => (
                        <option key={index} value={model}>
                          {model}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="col-6">
                  <label className=" col-form-label">Pick Vehicle Size</label>
                  <select className="form-control" onChange={(e)=>setFormData({...formData, vehicle_size:e?.target.value})}>
                    <option>Select</option>
                    {vehicleSizeList?.map((v, i) => {
                      return <option>{v}</option>;
                    })}
                  </select>
                </div>
                <div className="col-6">
                  <label className=" col-form-label">Choose Vehicle Colour</label>
                  <select className="form-control" onChange={(e)=>setFormData({...formData, vehicle_colour:e?.target.value})}>
                    <option>Select</option>
                    {vehicleColorList?.map((v, i) => {
                      return <option>{v}</option>;
                    })}
                  </select>
                </div>
                <div className="col-6">
                  <label className=" col-form-label">Enter Vehicle Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData?.vehicle_no}
                    onChange={(e) => {
                      setFormData({ ...formData, vehicle_no: e.target.value });
                    }}
                  />
                </div>
              </div>
              <h5 className="my-4">Documents Upload</h5>
              <div className="row">
                <div className="col-3 d-flex align-items-center">
                <label className="me-3">Driving License</label>
                <div className="d-flex align-items-center ">
                    <input
                      type="file"
                      id={`file-upload-license`} // Unique id for each input
                      style={{ display: "none", height: "70px", width: "70px" }} // Hide the actual input
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          licence_image_prev: URL.createObjectURL(e.target.files[0]),
                          licence_image: e.target.files[0],
                        })
                      } // Handle the file change
                    />
                    <img
                      className="btn btn-primary "
                      style={{
                        padding: formData?.licence_image_prev ? "0px" : "20px",
                        background: "#DDDDDD",
                        borderRadius: "50%",
                        border: "none",
                        color: "#000",
                        height: "70px",
                        width: "70px",
                      }}
                      onClick={() => document.getElementById(`file-upload-license`).click()} // Trigger input click
                      src={
                        formData?.licence_image_prev
                          ? formData?.licence_image_prev
                          : "https://cdn-icons-png.flaticon.com/128/711/711191.png"
                      }
                    />
                  </div>
                  
                </div>
                <div className="col-3 d-flex  align-items-center">
                <label className="me-3">Ownership</label>
                <div className="d-flex align-items-center ">
                    <input
                      type="file"
                      id={`file-upload-ownership`} // Unique id for each input
                      style={{ display: "none", height: "70px", width: "70px" }} // Hide the actual input
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          ownership_image_prev: URL.createObjectURL(e.target.files[0]),
                          ownership_image: e.target.files[0],
                        })
                      } // Handle the file change
                    />
                    <img
                      className="btn btn-primary "
                      style={{
                        padding: formData?.ownership_image_prev ? "0px" : "20px",
                        background: "#DDDDDD",
                        borderRadius: "50%",
                        border: "none",
                        color: "#000",
                        height: "70px",
                        width: "70px",
                      }}
                      onClick={() => document.getElementById(`file-upload-ownership`).click()} // Trigger input click
                      src={
                        formData?.ownership_image_prev
                          ? formData?.ownership_image_prev
                          : "https://cdn-icons-png.flaticon.com/128/711/711191.png"
                      }
                    />
                  </div>
                  
                </div>
                <div className="col-3 d-flex  align-items-center">
                <label className="me-3">Insurance</label>
                <div className="d-flex align-items-center ">
                    <input
                      type="file"
                      id={`file-upload-insurance`} // Unique id for each input
                      style={{ display: "none", height: "70px", width: "70px" }} // Hide the actual input
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          insurance_image_prev: URL.createObjectURL(e.target.files[0]),
                          insurance_image: e.target.files[0],
                        })
                      } // Handle the file change
                    />
                    <img
                      className="btn btn-primary "
                      style={{
                        padding: formData?.insurance_image_prev ? "0px" : "20px",
                        background: "#DDDDDD",
                        borderRadius: "50%",
                        border: "none",
                        color: "#000",
                        height: "70px",
                        width: "70px",
                      }}
                      onClick={() => document.getElementById(`file-upload-insurance`).click()} // Trigger input click
                      src={
                        formData?.insurance_image_prev
                          ? formData?.insurance_image_prev
                          : "https://cdn-icons-png.flaticon.com/128/711/711191.png"
                      }
                    />
                  </div>
                  
                </div>
                <div className="col-3 d-flex  align-items-center">
                <label className="me-3">Vehicle Image</label>
                <div className="d-flex align-items-center ">
                    <input
                      type="file"
                      id={`file-upload-image`} // Unique id for each input
                      style={{ display: "none", height: "70px", width: "70px" }} // Hide the actual input
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          vehicle_image_prev: URL.createObjectURL(e.target.files[0]),
                          vehicle_image: e.target.files[0],
                        })
                      } // Handle the file change
                    />
                    <img
                      className="btn btn-primary "
                      style={{
                        padding: formData?.vehicle_image_prev ? "0px" : "20px",
                        background: "#DDDDDD",
                        borderRadius: "50%",
                        border: "none",
                        color: "#000",
                        height: "70px",
                        width: "70px",
                      }}
                      onClick={() => document.getElementById(`file-upload-image`).click()} // Trigger input click
                      src={
                        formData?.vehicle_image_prev
                          ? formData?.vehicle_image_prev
                          : "https://cdn-icons-png.flaticon.com/128/711/711191.png"
                      }
                    />
                  </div>
                  
                </div>
              </div>
              <div className="row d-flex justify-content-around mt-3">
              <div className="col-6">
                  {formData?.first_name &&
                  formData?.last_name &&
                  formData?.email &&
                  formData?.country_code &&
                  formData?.contact &&
                  formData?.password &&
                  formData?.confirmPassword &&
                  formData?.image &&
                  formData?.vehicle_brand &&
                  formData?.vehicle_colour &&
                  formData?.vehicle_image &&
                  formData?.vehicle_date &&
                  formData?.vehicle_no &&
                  formData?.vehicle_size &&
                  formData?.vehicle_name &&
                  formData?.licence_image &&
                  formData?.insurance_image &&
                  formData?.ownership_image
                  
                ? (
                    <button
                      className="btn btn-primary w-100"
                      style={{ background: "#139F01" }}
                      onClick={handleSubmitFunc}
                    >
                      {loader ? "Saving ..." : "Save"}
                    </button>
                  ) : (
                    <button className="btn btn-primary w-100" style={{ background: "#139F01", opacity: "0.6" }}>
                      Save
                    </button>
                  )}
                </div>
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

export default AddDriver;
