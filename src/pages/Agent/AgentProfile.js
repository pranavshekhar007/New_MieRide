import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { getAgentByIdServ, updateAgentServ, deleteAgentServ} from "../../services/agent.service";
import "react-loading-skeleton/dist/skeleton.css";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TableNav from "../../components/TableNav";
import { useGlobalState } from "../../GlobalProvider";
import { Image_Base_Url } from "../../utils/api_base_url_configration";
function AgentProfile() {
  const { setGlobalState, globalState } = useGlobalState();
  const navigate = useNavigate();
  const params = useParams();
  const [loader, setLoader] = useState(false);
  const tableNav = [
    {
      name: "Profile",
      path: `/agent-profile/${params?.id}`,
    },
    {
      name: "Account Information",
      path: `/agent-account-information/${params?.id}`,
    },
    {
      name: "Transaction History",
      path: `/agent-transaction-history/${params?.id}`,
    },
    {
      name: "User App",
      path: `/agent-user-app/${params?.id}`,
    },
    {
      name: "Driver App",
      path: `/agent-driver-app/${params?.id}`,
    },
  ];
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    contact: "",
   
  });
  const [driverDetails, setDriverDetails] = useState(null);
  const getUserDetailsFunc = async () => {
    try {
      let response = await getAgentByIdServ({agent_id:params.id});
      if (response?.data?.statusCode == "200") {
        setFormData(response.data?.agent);
        setDriverDetails(response.data?.agent);
      }
    } catch (error) {}
  };
  useEffect(() => {
    getUserDetailsFunc();
  }, []);
  const [isEditable, setIsEditable] = useState(false);
  const updateDriverFunc = async () => {
    const updateFormData = new FormData();
    updateFormData.append("id", params?.id);
    updateFormData.append("first_name", formData?.first_name);
    updateFormData.append("last_name", formData?.last_name);
    updateFormData.append("email", formData?.email);
    updateFormData.append("contact", formData?.contact);
    updateFormData.append("gender", formData?.gender);
    updateFormData.append("address", formData?.address);
    try {
      let response = await updateAgentServ(updateFormData);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
  };
  const handleDeleteDriver = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this agent?");

    if (!confirmDelete) return; // Exit if the user clicks 'Cancel'

    try {
      const response = await deleteAgentServ(params?.id);
      if (response.data.statusCode === "200") {
        toast.success(response?.data?.message);
        navigate("/agent-list");
      }
    } catch (error) {
      console.error("Error deleting driver:", error);
      toast.error("Failed to delete the driver. Please try again.");
    }
  };
  return (
    <div className="main_layout  bgBlack d-flex">
      {/* sidebar started */}
      <Sidebar selectedItem="Agent Hub" />
      {/* sidebar ended */}

      {/* sectionLayout started */}
      <section className="section_layout" style={{ marginLeft: globalState?.isFillSidebarWidth100 ? "260px" : "80px" }}>
        {/* top nav started  */}

        {/* top nav ended  */}
        {/* table List started */}
        <div className="">
          <TableNav tableNav={tableNav} selectedItem="Profile" sectedItemBg="#DDD5FE" />

          <div
            className="tableBody py-2 px-4 driverDetailsLabelInput borderRadius50exceptTopLeft"
            style={{ background: "#DDD5FE" }}
          >
            <div className=" p-5  my-4" style={{ borderRadius: "20px", background: "#fff" }}>
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
                    readOnly={!isEditable}
                  />
                  <label className=" col-form-label">Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData?.last_name}
                    readOnly={!isEditable}
                    onChange={(e) => {
                      setFormData({ ...formData, last_name: e.target.value });
                    }}
                  />
                  <label className=" col-form-label">Email Address</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData?.email}
                    readOnly={!isEditable}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                    }}
                  />
                  <label className=" col-form-label">Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData?.contact}
                    readOnly={!isEditable}
                    onChange={(e) => {
                      setFormData({ ...formData, contact: e.target.value });
                    }}
                  />
                  <label className=" col-form-label">Gender</label>
                  <select className="form-control" value={formData?.gender} readOnly={!isEditable} onChange={(e) => {
                      setFormData({ ...formData, gender: e.target.value });
                    }}>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <label className=" col-form-label">Address</label>
                  <input type="text" className="form-control" value={driverDetails?.address}  readOnly={!isEditable}/>
                  <label className=" col-form-label">Referal Code</label>
                  <input type="text" className="form-control" value={driverDetails?.referral_code} readOnly={true} />
                  
                </div>
              </div>

              <div className="row d-flex justify-content-around">
                {isEditable ? (
                  <div className="col-3">
                    <button className="btn btn-primary w-100" onClick={updateDriverFunc}>
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="col-3">
                    <button
                      className="btn btn-primary w-100"
                      style={{ background: "#FF793B" }}
                      onClick={() => {
                        setIsEditable(true);
                        toast.success("Start editing the fields");
                      }}
                    >
                      Edit
                    </button>
                  </div>
                )}

                <div className="col-3">
                  <button
                    className="btn btn-primary w-100"
                    style={{ background: "#C30505" }}
                    onClick={handleDeleteDriver}
                  >
                    Delete
                  </button>
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

export default AgentProfile;
