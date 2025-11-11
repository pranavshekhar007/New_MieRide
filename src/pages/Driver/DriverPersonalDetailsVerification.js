import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { getDriverByIdServ, updateDriverServ } from "../../services/driver.services";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useNavigate, useParams } from "react-router-dom";
import DriverSideNav from "../../components/DriverSideNav";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useGlobalState } from "../../GlobalProvider";

function DriverPersonalDetailsVerification() {
  const { setGlobalState, globalState } = useGlobalState();
  const navigate = useNavigate();
  const params = useParams();
  const [driverDetails, setDriverDetails] = useState(null);
  const getUserDetailsFunc = async () => {
    try {
      let response = await getDriverByIdServ(params.id);
      if (response?.data?.statusCode == "200") {
        setDriverDetails(response.data?.data?.driverDetails);
      }
    } catch (error) {}
  };
  useEffect(() => {
    getUserDetailsFunc();
  }, []);
  const [formData, setFormData] = useState({
    first_name_status: "1",
    last_name_status: "1",
  });
  const navigateDriverApprovalPage = async () => {
    try {
      let response = await getDriverByIdServ(params.id);
      let statusDetails;
      if (response?.data?.statusCode == "200") {
        statusDetails = response.data?.data;
        if (statusDetails?.profileStatus?.status != "1") {
          navigate(`/driver-personal-details-verification/${params?.id}`);
          return;
        } else if (statusDetails?.vehicleStatus?.status != "1") {
          navigate(`/driver-car-details-verification/${params?.id}`);
          return;
        } else if (statusDetails?.imageStatus?.status != "1") {
          navigate(`/driver-profile-details-verification/${params?.id}`);
          return;
        } else if (statusDetails?.licenceStatus?.status != "1") {
          navigate(`/driver-license-details-verification/${params?.id}`);
          return;
        } else if (statusDetails?.ownershipStatus?.status != "1") {
          navigate(`/driver-ownership-details-verification/${params?.id}`);
          return;
        } else if (statusDetails?.insuranceStatus?.status != "1") {
          navigate(`/driver-insurance-details-verification/${params?.id}`);
          return;
        } else {
          navigate(`/driver-review-details-verification/${params?.id}`);
        }
      }
    } catch (error) {}
  };
  const [btnLoader, setShowBtnLoader] = useState({
    approve: false,
    reject: false,
  });
  const updateDriverFunc = async (approved) => {
    if (approved) {
      setShowBtnLoader({
        approve: true,
        reject: false,
      });
    } else {
      setShowBtnLoader({
        approve: false,
        reject: true,
      });
    }
    
    try {
      let response = await updateDriverServ(
        driverDetails?.id,
        approved
          ? {
              first_name_status: "1",
              last_name_status: "1",
            }
          : formData
      );
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        navigateDriverApprovalPage(response?.data?.data);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
    setShowBtnLoader({
      approve: false,
      reject: false,
    });
  };

  return (
    <div className="main_layout  bgBlack d-flex">
      {/* sidebar started */}
      <Sidebar selectedItem="Driver" />
      {/* sidebar ended */}

      {/* sectionLayout started */}
      <section className="section_layout" style={{ marginLeft: globalState?.isFillSidebarWidth100 ? "260px" : "80px" }}>
        <div className="d-flex justify-content-end align-items-center ">
          <h5>
            <i className="fa fa-close text-secondary" onClick={() => navigate("/driver-list")}></i>
          </h5>
        </div>
        {/* horizontal Nav start */}
        <div className="row m-0 p-0">
          <div className="col-3 m-0 p-0">
            <DriverSideNav selectedNav="Personal Details" />
          </div>
          <div className="col-9 m-0 p-0">
            <div className="driverPopVerificationRightMain borderRadius50exceptTopLeft">
              <div className="d-flex justify-content-center">
                <h5>Personal Details</h5>
              </div>
              <div className="row m-0 p-0 d-flex align-items-end">
                <div className="col-1 d-flex align-items-center">
                  <input
                    type="checkbox"
                    style={{
                      height: "33px",
                      width: "33px",
                      border: "none",
                      borderRadius: "8px",
                      filter: "drop-shadow(0 0 8px rgba(0,0,0,0.06))",
                    }}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        first_name_status: e.target.checked ? "-1" : "1",
                      })
                    }
                  />
                </div>
                <div className="col-11 row">
                  <label className=" col-form-label">First Name</label>
                  <div className="col-8">
                    <input type="text" className="form-control" value={driverDetails?.first_name} />
                  </div>
                </div>
              </div>
              <div className="row m-0 p-0 d-flex align-items-end">
                <div className="col-1 d-flex align-items-center">
                  <input
                    type="checkbox"
                    style={{
                      height: "33px",
                      width: "33px",
                      border: "none",
                      borderRadius: "8px",
                      filter: "drop-shadow(0 0 8px rgba(0,0,0,0.06))",
                    }}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        last_name_status: e.target.checked ? "-1" : "1",
                      })
                    }
                  />
                </div>
                <div className="col-11 row">
                  <label className=" col-form-label">Last Name</label>
                  <div className="col-8">
                    <input type="text" className="form-control" value={driverDetails?.last_name} />
                  </div>
                </div>
              </div>
              <div className="row m-0 p-0 d-flex align-items-end">
                <div className="col-1 d-flex align-items-center"></div>
                <div className="col-11 row">
                  <label className=" col-form-label">Email Address</label>
                  <div className="col-12">
                    <input type="text" className="form-control" value={driverDetails?.email} />
                  </div>
                </div>
              </div>
              <div className="row m-0 p-0 d-flex align-items-end">
                <div className="col-1 d-flex align-items-center"></div>
                <div className="col-11 row">
                  <label className=" col-form-label">Phone Number</label>
                  <div className="col-12">
                    <input type="text" className="form-control" value={driverDetails?.contact} />
                  </div>
                </div>
              </div>
              <div className="row m-0 p-0 d-flex align-items-end">
                <div className="col-1 d-flex align-items-center"></div>
                <div className="col-11 row">
                  <label className=" col-form-label">Password</label>
                  <div className="col-12">
                    <input type="text" className="form-control" value={driverDetails?.password} />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-1"></div>
                <div className="col-11 row d-flex justify-content-around driverPopUpActionButton">
                  <div className="col-5">
                    {btnLoader?.reject ? (
                      <button
                        style={{
                          background: "#CC0000",
                          opacity: 0.5,
                        }}
                        type="button"
                      >
                        Updating ...
                      </button>
                    ) : (
                      <button
                        style={{
                          background: "#CC0000",
                          opacity: formData?.first_name_status == "1" && formData?.last_name_status == "1" ? 0.5 : 1,
                        }}
                        type="button"
                        disabled={
                          formData?.first_name_status == "1" && formData?.first_name_status == "1" ? true : false
                        }
                        onClick={() => updateDriverFunc()}
                      >
                        Request Edit
                      </button>
                    )}
                  </div>
                  <div className="col-5">
                    {btnLoader?.approve ? (
                      <button
                        style={{
                          opacity: 0.5,
                        }}
                      >
                        Updating ...
                      </button>
                    ) : (
                      <button
                        style={{
                          opacity: formData?.first_name_status == "1" && formData?.last_name_status == "1" ? 1 : 0.5,
                        }}
                        onClick={() => updateDriverFunc(true)}
                        type="button"
                        disabled={
                          formData?.first_name_status == "1" && formData?.first_name_status == "1" ? false : true
                        }
                      >
                        Approve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* horizontal Nav end*/}
      </section>
      {/* sectionLayout ended */}
    </div>
  );
}

export default DriverPersonalDetailsVerification;
