import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import {
  getSupportRecordServ,
  deleteSupportRecordServ,
  addSupportRecordServ,
  updateSupportRecordServ,
} from "../../services/support.services";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useGlobalState } from "../../GlobalProvider";
function SupportAll() {
  const { setGlobalState, globalState } = useGlobalState();
  const navItems = [
    {
      name: "Faq",
      path: "/support-faq-user",
    },
    {
      name: "Terms And Condition",
      path: "/support-tc-user",
    },
    {
      name: "Privacy Policy",
      path: "/support-pp-user",
    },
    {
      name: "Support",
      path: "/support-all",
    },
    {
      name: "Contact Queries",
      path: "/support-query-list",
    },
  ];
  const [supportDetails, setSupportDetails] = useState();
  const getSupportRecordFunc = async () => {
    try {
      let response = await getSupportRecordServ();
      if (response?.data?.statusCode == "200") {
        setSupportDetails(response?.data?.data[0]);
      }
    } catch (error) {}
  };
  useEffect(() => {
    getSupportRecordFunc();
  }, []);
  const handleDeleteFunc = async (id) => {
    try {
      let response = await deleteSupportRecordServ({ id });
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        getSupportRecordFunc();
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
  };
  const [formData, setFormData] = useState({
    email: "",
    country_code: "",
    contact: "",
    flag: "",
  });
  const [isEditable, setIsEditable] = useState(false);
  const handleSubmit = async () => {
    try {
      let response;
      if (formData?.id) {
        response = await updateSupportRecordServ(formData);
      } else {
        response = await addSupportRecordServ(formData);
      }

      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        getSupportRecordFunc();
        setIsEditable(false);
      }
      if (response?.data?.statusCode == "400") {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
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
      <Sidebar selectedItem="Support" />
      {/* sidebar ended */}

      {/* sectionLayout started */}
      <section className="section_layout" style={{marginLeft :globalState?.isFillSidebarWidth100 ? "260px": "80px" }}>
        {/* top nav started  */}
        <TopNav
          navItems={navItems}
          navColor="#fff"
          navBg="#A90909"
          divideRowClass="col-xl-6 col-lg-6 col-md-12 col-12"
          selectedItem="Support"
          sectedNavBg="#fff"
          selectedNavColor="#030303"
        />
        {/* top nav ended  */}
        {/* table List started */}
        <div className="tableMain supportForm my-5 mx-3">
          {isEditable ? (
            <div>
              <label>Email Address</label>
              <div
                className="d-flex align-items-center mb-5 p-3"
                style={{ background: "#eef2fe", borderRadius: "9px" }}
              >
                <img
                  className="me-2"
                  src="https://cdn-icons-png.flaticon.com/128/732/732200.png"
                  style={{ height: "20px", width: "20px" }}
                />

                <input
                  placeholder=""
                  className="form-control"
                  value={formData?.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ marginBottom: "0px", padding: "0px", lineHeight: "0px", outline: "none" }}
                />
              </div>
              <label>Contact Number</label>
              <div
                className="d-flex align-items-center mb-5 "
                style={{ background: "#eef2fe", borderRadius: "9px", padding: "6px 12px" }}
              >
                <PhoneInput
                  country={supportDetails?.country_code =="91" ? "in" : supportDetails?.country_code =="1"? "ca" :""} // Default country
                  onChange={handlePhoneChange}
                  inputStyle={{
                    width: "100px",
                    height: "40px",
                    fontSize: "16px",
                    background: "#eef2fe",
                    border: "none",
                  }}
                  buttonStyle={{
                    backgroundColor: "#f0f0f0",
                    border: "none",
                    padding: "0px",
                    background: "#eef2fe",
                  }}
                />
                <input
                  placeholder=""
                  className="form-control"
                  value={formData?.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  style={{ marginBottom: "0px", padding: "0px", lineHeight: "0px", outline: "none" }}
                />
              </div>
              <div className="d-flex justify-content-center mt-3">
                <button
                  className="accordenBoxbutton btn btn-primary mx-3"
                  style={{ background: "#040707" }}
                  onClick={() => {
                    setIsEditable(true);
                    setFormData(supportDetails);
                    toast.success("Start editing the form");
                  }}
                >
                  Edit
                </button>
                {formData?.country_code && formData?.email && formData?.contact  ? (
                  <button className="btn btn-success accordenBoxbutton mx-3" onClick={handleSubmit}>
                    Submit
                  </button>
                ) : (
                  <button className="btn btn-success accordenBoxbutton mx-3" style={{ opacity: "0.5" }}>
                    Submit
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div>
              <label>Email Address</label>
              <div
                className="d-flex align-items-center mb-5 p-3"
                style={{ background: "#e9ecef", borderRadius: "9px" }}
              >
                <img
                  className="me-2"
                  src="https://cdn-icons-png.flaticon.com/128/732/732200.png"
                  style={{ height: "20px", width: "20px" }}
                />

                <input
                  placeholder=""
                  className="form-control"
                  value={supportDetails?.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    marginBottom: "0px",
                    padding: "0px",
                    lineHeight: "0px",
                    outline: "none",
                    background: "#e9ecef",
                  }}
                />
              </div>
              <label>Contact Number</label>
              <div
                className="d-flex align-items-center mb-5 p-3"
                style={{ background: "#e9ecef", borderRadius: "9px" }}
              >
                {supportDetails?.flag && <img src={supportDetails?.flag} style={{ height: "18px"}} />}
                <p className="mb-0 mx-2">{supportDetails?.country_code}</p>
                <input
                  placeholder=""
                  className="form-control"
                  value={supportDetails?.contact}
                  readOnly
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  style={{
                    marginBottom: "0px",
                    padding: "0px",
                    lineHeight: "0px",
                    outline: "none",
                    background: "#e9ecef",
                  }}
                />
              </div>
              <div className="d-flex justify-content-center mt-3">
                <button
                  className="accordenBoxbutton btn btn-primary mx-3"
                  style={{ background: "#040707" }}
                  onClick={() => {
                    setIsEditable(true);
                    toast.success("Start editing the form");
                    setFormData(supportDetails);
                  }}
                >
                  Edit
                </button>
                {isEditable ? (
                  <button className="btn btn-success accordenBoxbutton mx-3" onClick={handleSubmit}>
                    Submit
                  </button>
                ) : (
                  <button className="btn btn-success accordenBoxbutton mx-3" style={{ opacity: "0.5" }}>
                    Submit
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
        {/* table List ended */}
      </section>
      {/* sectionLayout ended */}
    </div>
  );
}

export default SupportAll;
