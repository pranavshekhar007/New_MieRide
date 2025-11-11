import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import "react-loading-skeleton/dist/skeleton.css";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useGlobalState } from "../../GlobalProvider";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { addAgentByAdminServ } from "../../services/agent.service";
function AddAgent() {
  const { setGlobalState, globalState } = useGlobalState();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);  
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    country_code: "1",
    contact: "",
    password: "",
    confirmPassword:"",
    gender:"",
    address:"",
    image:""
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
      if(formData?.image){
          userFormData.append("image", formData?.image);
      }
      userFormData.append("first_name", formData?.first_name);
      userFormData.append("last_name", formData?.last_name);
      userFormData.append("email", formData?.email);
      userFormData.append("contact", formData?.contact);
      userFormData.append("country_code", formData?.country_code);
      userFormData.append("password", formData?.password);
      userFormData.append("address", formData?.address);
      userFormData.append("gender", formData?.gender);
      try {
        let response = await addAgentByAdminServ(userFormData);
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
            gender:"",
            address:""
          });
          navigate("/agent-list");
        } else {
          toast.error(response?.data?.message);
        }
        console.log(formData);
      } catch (error) {
        
        toast.error("Internal Server Error");
      }
      setLoader(false);
    };
  return (
    <div className="main_layout  bgBlack d-flex">
      {/* sidebar started */}
      <Sidebar selectedItem="Agent" />
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
            style={{ background: "#DDD5FE" }}
          >
            <div className=" p-5  my-4" style={{ borderRadius: "20px", background: "#fff" }}>
              <div className="d-flex align-items-center justify-content-between">
                <h5>Personal Details</h5>
                <div
                  onClick={() => navigate("/agent-list")}
                  className="addUserBtn d-flex justify-content-between align-items-center "
                  style={{ background: "#F7D444", cursor: "pointer", }}
                >
                  <p className="mb-0 me-2" style={{color:"#000"}}>Agent List</p>
                  <img src="https://cdn-icons-png.flaticon.com/128/126/126327.png"  style={{ filter: "brightness(1) invert(0)" }}/>
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
                  <label className=" col-form-label">Gender</label>
                  <select className="form-control" onChange={(e) => {
                      setFormData({ ...formData, gender: e.target.value });
                    }}>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <label className=" col-form-label">Address</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData?.address}
                    onChange={(e) => {
                      setFormData({ ...formData, address: e.target.value });
                    }}
                  />
                  <div className="row">
                    <div className="col-5">
                      <label className=" col-form-label">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={formData?.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      />
                    </div>
                    <div className="col-5">
                      <label className=" col-form-label">Re-Enter Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={formData?.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
              
              <div className="row d-flex justify-content-around mt-3">
              <div className="col-6">
                  {formData?.first_name &&
                  formData?.last_name &&
                  formData?.email &&
                  formData?.country_code &&
                  formData?.contact &&
                  formData?.password &&
                  formData?.confirmPassword &&
                  formData?.address &&
                  formData?.gender  
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

export default AddAgent;
