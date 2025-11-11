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
function DriverCarDetailsVerification() {
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
    vehicle_brand_status: "1",
    vehicle_name_status: "1",
    vehicle_colour_status: "1",
    vehicle_date_status: "1",
    vehicle_size_status: "1",
    vehicle_no_status: "1",
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
              vehicle_brand_status: "1",
              vehicle_name_status: "1",
              vehicle_colour_status: "1",
              vehicle_date_status: "1",
              vehicle_size_status: "1",
              vehicle_no_status: "1",
            }
          : formData
      );
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        navigateDriverApprovalPage();
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
            <DriverSideNav selectedNav="Car Details" />
          </div>
          <div className="col-9 m-0 p-0">
            <div className="driverPopVerificationRightMain borderRadius50All">
              <div className="d-flex justify-content-center">
                <h5>Car Details</h5>
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
                        vehicle_brand_status: e.target.checked ? "-1" : "1",
                      })
                    }
                  />
                </div>
                <div className="col-11 row">
                  <label className=" col-form-label">Choose Vehicle Brand</label>
                  <div className="col-8">
                    <input type="text" className="form-control" value={driverDetails?.vehicle_brand} />
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
                        vehicle_name_status: e.target.checked ? "-1" : "1",
                      })
                    }
                  />
                </div>
                <div className="col-11 row">
                  <label className=" col-form-label">Choose Vehicle Model</label>
                  <div className="col-8">
                    <input type="text" className="form-control" value={driverDetails?.vehicle_name} />
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
                        vehicle_colour_status: e.target.checked ? "-1" : "1",
                      })
                    }
                  />
                </div>
                <div className="col-11 row">
                  <label className=" col-form-label">Choose Vehicle Colour</label>
                  <div className="col-8">
                    <input type="text" className="form-control" value={driverDetails?.vehicle_colour} />
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
                        vehicle_date_status: e.target.checked ? "-1" : "1",
                      })
                    }
                  />
                </div>
                <div className="col-11 row">
                  <label className=" col-form-label">Choose Year Of Manufacture</label>
                  <div className="col-8">
                    <input type="text" className="form-control" value={driverDetails?.vehicle_date} />
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
                        vehicle_size_status: e.target.checked ? "-1" : "1",
                      })
                    }
                  />
                </div>
                <div className="col-11 row">
                  <label className=" col-form-label">Pick Vehicle Size</label>
                  <div className="col-8">
                    <input type="text" className="form-control" value={driverDetails?.vehicle_size} />
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
                        vehicle_no_status: e.target.checked ? "-1" : "1",
                      })
                    }
                  />
                </div>
                <div className="col-11 row">
                  <label className=" col-form-label">Enter Vehicle Number</label>
                  <div className="col-8">
                    <input type="text" className="form-control" value={driverDetails?.vehicle_no} />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-1"></div>
                <div className="col-11 row d-flex justify-content-around driverPopUpActionButton">
                  <div className="col-5">
                    {btnLoader?.reject ? <button
                      
                      style={{
                        background: "#CC0000",
                        opacity:0.5     
                      }}
                      
                    >
                      Updating ...
                    </button>:<button
                      onClick={() => updateDriverFunc()}
                      style={{
                        background: "#CC0000",
                        opacity:
                          formData?.vehicle_brand_status == "1" &&
                          formData?.vehicle_colour_status == "1" &&
                          formData?.vehicle_date_status == "1" &&
                          formData?.vehicle_name_status == "1" &&
                          formData?.vehicle_size_status == "1" &&
                          formData?.vehicle_no_status == "1"
                            ? 0.5
                            : 1,
                      }}
                      disabled={
                        formData?.vehicle_brand_status == "1" &&
                        formData?.vehicle_colour_status == "1" &&
                        formData?.vehicle_date_status == "1" &&
                        formData?.vehicle_name_status == "1" &&
                        formData?.vehicle_size_status == "1" &&
                        formData?.vehicle_no_status == "1"
                          ? true
                          : false
                      }
                    >
                      Request Edit
                    </button>}
                    
                  </div>
                  <div className="col-5">
                    {btnLoader?.approve ?  <button
                      
                      style={{
                        opacity: 0.5,
                      }}
                    >
                      Updating ...
                    </button>: <button
                      onClick={() => updateDriverFunc(true)}
                      disabled={
                        formData?.vehicle_brand_status == "1" &&
                        formData?.vehicle_colour_status == "1" &&
                        formData?.vehicle_date_status == "1" &&
                        formData?.vehicle_name_status == "1" &&
                        formData?.vehicle_size_status == "1" &&
                        formData?.vehicle_no_status == "1"
                          ? false
                          : true
                      }
                      style={{
                        opacity:
                          formData?.vehicle_brand_status == "1" &&
                          formData?.vehicle_colour_status == "1" &&
                          formData?.vehicle_date_status == "1" &&
                          formData?.vehicle_name_status == "1" &&
                          formData?.vehicle_size_status == "1" &&
                          formData?.vehicle_no_status == "1"
                            ? 1
                            : 0.5,
                      }}
                    >
                      Approve
                    </button>}
                   
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

export default DriverCarDetailsVerification;
