import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { getDriverByIdServ, updateDriverServ, deleteDriverServ } from "../../services/driver.services";
import "react-loading-skeleton/dist/skeleton.css";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TableNav from "../../components/TableNav";
import { useGlobalState } from "../../GlobalProvider";
import {Image_Base_Url} from "../../utils/api_base_url_configration"
function DriverProfile() {
  const { setGlobalState, globalState } = useGlobalState();
  const navigate = useNavigate();
  const params = useParams();
  const [loader, setLoader]=useState(false)
  const tableNav = [
    {
      name: "Profile",
      path: `/driver-profile/${params?.id}`,
    },
    {
      name: "Document",
      path: `/driver-document/${params?.id}`,
    },
    {
      name: "Account",
      path: `/driver-account/${params?.id}`,
    },
    {
      name: "Rating",
      path: `/driver-rating/${params?.id}`,
    },
    {
      name: "Transaction History",
      path: `/driver-transaction-history/${params?.id}`,
    },
    {
      name: "Updated Fields",
      path: `/driver-updated-fields/${params?.id}`,
    },
  ];
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    contact: "",
    password: "",
    vehicle_brand: "",
    vehicle_date: "",
    vehicle_colour: "",
    vehicle_size: "",
  });
  const [driverDetails, setDriverDetails] = useState(null);
  const getUserDetailsFunc = async () => {
    try {
      let response = await getDriverByIdServ(params.id);
      if (response?.data?.statusCode == "200") {
        setFormData(response.data?.data?.driverDetails);
        setDriverDetails(response.data?.data?.driverDetails)
      }
    } catch (error) {}
  };
  useEffect(() => {
    getUserDetailsFunc();
  }, []);
  const [isEditable, setIsEditable] = useState(false);

  const updateDriverFunc = async () => {
    const updateFormData = new FormData();
    updateFormData.append("first_name", formData?.first_name)
    updateFormData.append("last_name", formData?.last_name)
    updateFormData.append("emaik", formData?.email)
    updateFormData.append("contact", formData?.contact)
    updateFormData.append("vehicle_brand", formData?.vehicle_brand)
    updateFormData.append("vehicle_colour", formData?.vehicle_colour)
    updateFormData.append("vehicle_date", formData?.vehicle_date)
    updateFormData.append("vehicle_size", formData?.vehicle_size)
    updateFormData.append("status", formData?.status)
    try {
      let response = await updateDriverServ(driverDetails?.id, updateFormData);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        navigate("/driver-profile/" + driverDetails?.id);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
  };
  const handleDeleteDriver = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this driver?");

    if (!confirmDelete) return; // Exit if the user clicks 'Cancel'

    try {
      const response = await deleteDriverServ(params?.id);
      if (response.data.statusCode === "200") {
        toast.success(response?.data?.message);
        navigate("/driver-list");
      }
    } catch (error) {
      console.error("Error deleting driver:", error);
      toast.error("Failed to delete the driver. Please try again.");
    }
  };
  return (
    <div className="main_layout  bgBlack d-flex">
      {/* sidebar started */}
      <Sidebar selectedItem="Driver" />
      {/* sidebar ended */}

      {/* sectionLayout started */}
      <section className="section_layout" style={{ marginLeft :globalState?.isFillSidebarWidth100 ? "260px": "80px" }}>
        {/* top nav started  */}

        {/* top nav ended  */}
        {/* table List started */}
        <div className="">
          <TableNav tableNav={tableNav} selectedItem="Profile" sectedItemBg="#FDEEE7" />
          
          <div
            className="tableBody py-2 px-4 driverDetailsLabelInput borderRadius50exceptTopLeft"
            style={{ background: "#FDEEE7" }}
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
                  <input type="text" className="form-control" value={formData?.last_name} readOnly={!isEditable} 
                  onChange={(e) => {
                    setFormData({ ...formData, last_name: e.target.value });
                  }}/>
                  <label className=" col-form-label">Email Address</label>
                  <input type="text" className="form-control" value={formData?.email} readOnly={!isEditable} 
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                  }}/>
                  <label className=" col-form-label">Phone Number</label>
                  <input type="text" className="form-control" value={formData?.contact} readOnly={!isEditable} onChange={(e) => {
                    setFormData({ ...formData, contact: e.target.value });
                  }}/>
                  <label className=" col-form-label">Password</label>
                  <input type="password" className="form-control" value={driverDetails?.password} readOnly={true}
                 />
                </div>
                <div className="col-3 ">
                  <div className="d-flex justify-content-center">
                    {driverDetails?.image ? (
                      <img
                        src={Image_Base_Url+driverDetails?.image}
                        style={{ height: "150px", width: "150px", borderRadius: "50%" }}
                      />
                    ) : (
                      <div
                        className="cameraIcon d-flex justify-content-center align-items-center"
                        style={{ height: "150px", width: "150px" }}
                      >
                        <img
                          src={"https://cdn-icons-png.flaticon.com/128/711/711191.png"}
                          style={{ height: "80px", width: "80px" }}
                        />
                      </div>
                    )}
                  </div>
                  <label>Status</label>
                  <div className="text-center">
                    <select value={formData?.status} className="form-control mt-1" onChange={(e) => {
                    setFormData({ ...formData, status: e.target.value });
                  }}>
                      <option value="Approve">Active</option>
                      <option value="Disapprove">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="row col-10">
                <div className="col-6">
                  <label className=" col-form-label">Choose Vehicle Brand</label>
                  <input type="text" className="form-control" value={formData?.vehicle_brand} readOnly={!isEditable} onChange={(e) => {
                    setFormData({ ...formData, vehicle_brand: e.target.value });
                  }}/>
                </div>
                <div className="col-6">
                  <label className=" col-form-label">Choose Year Of Manufacture</label>
                  <input type="text" className="form-control" value={formData?.vehicle_date} readOnly={!isEditable} onChange={(e) => {
                    setFormData({ ...formData, vehicle_date: e.target.value });
                  }}/>
                </div>
                <div className="col-6">
                  <label className=" col-form-label">Choose Vehicle Colour</label>
                  <input type="text" className="form-control" value={formData?.vehicle_colour} readOnly={!isEditable} onChange={(e) => {
                    setFormData({ ...formData, vehicle_colour: e.target.value });
                  }}/>
                </div>
                <div className="col-6">
                  <label className=" col-form-label">Pick Vehicle Size</label>
                  <input type="text" className="form-control" value={formData?.vehicle_size} readOnly={!isEditable} onChange={(e) => {
                    setFormData({ ...formData, vehicle_size: e.target.value });
                  }}/>
                </div>
              </div>
              <div className="row d-flex justify-content-around">
                {isEditable ? (
                  <div className="col-3">
                    <button className="btn btn-primary w-100" onClick={updateDriverFunc}>Save</button>
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

export default DriverProfile;
