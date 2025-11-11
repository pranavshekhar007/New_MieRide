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
import { addUserByAdminServ } from "../../services/user.services";

function AddUser() {
  const { setGlobalState, globalState } = useGlobalState();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    contact: "",
    country_code: "1",
    password: "",
    image: "",
    gender: "",
    img_prev: "",
    status: "",
    user_wallet: "",
  });
  const handleSubmitFunc = async () => {
    setLoader(true);
    const userFormData = new FormData();
    userFormData.append("first_name", formData?.first_name);
    userFormData.append("last_name", formData?.last_name);
    userFormData.append("email", formData?.email);
    userFormData.append("contact", formData?.contact);
    userFormData.append("country_code", formData?.country_code);
    userFormData.append("password", formData?.password);
    userFormData.append("image", formData?.image);
    userFormData.append("gender", formData?.gender);
    userFormData.append("img_prev", formData?.img_prev);
    userFormData.append("user_wallet", formData?.user_wallet);
    try {
      let response = await addUserByAdminServ(userFormData);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          contact: "",
          country_code: "1",
          password: "",
          image: "",
          gender: "",
          img_prev: "",
          status: "",
          user_wallet: "",
        });
        navigate("/user-list");
      } else {
        toast.error(response?.data?.message);
      }
      console.log(formData);
    } catch (error) {
      toast.error(error?.response?.data?.data?.contact[0]);
      toast.error("Internal Server Error");
    }
    setLoader(false);
  };
  const handlePhoneChange = (value, data) => {
    console.log(value);
    setFormData({
      ...formData,
      country_code: value,
      flag: `https://flagcdn.com/w320/${data.countryCode}.png`, // Flag URL
    });
  };
  return (
    <div className="main_layout  bgBlack d-flex">
      {/* sidebar started */}
      <Sidebar selectedItem="User" />
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
                  onClick={() => navigate("/user-list")}
                  className="addUserBtn d-flex justify-content-between align-items-center "
                  style={{ background: "#7650E0", cursor: "pointer" }}
                >
                  <p className="mb-0 me-2">User List</p>
                  <img src="https://cdn-icons-png.flaticon.com/128/1077/1077114.png" />
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
                  <div className="d-flex align-items-center  " style={{ borderRadius: "9px" }}>
                    <PhoneInput
                      country={"ca"} // Default country
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
                      onChange={(e) => {
                        setFormData({ ...formData, contact: e.target.value });
                      }}
                      style={{ marginBottom: "0px", padding: "6px", lineHeight: "0px", outline: "none" }}
                    />
                  </div>

                  <label className=" col-form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={formData?.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <label className=" col-form-label">Gender</label>
                  <select
                    className="form-control"
                    value={formData?.gender}
                    onChange={(e) => {
                      setFormData({ ...formData, gender: e.target.value });
                    }}
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>

                  <label className=" col-form-label">Wallet Amount</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData?.wallet}
                    onChange={(e) => {
                      setFormData({ ...formData, user_wallet: e.target.value });
                    }}
                  />
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
                    <label>Profile Image</label>
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
                  formData?.user_wallet ? (
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

export default AddUser;
