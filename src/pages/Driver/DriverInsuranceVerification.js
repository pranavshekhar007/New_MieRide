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
import { Image_Base_Url } from "../../utils/api_base_url_configration";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
function DriverInsuranceDetailsVerification() {
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
  const [insurance_expiry, setInsurance_expiry] = useState("");
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
              insurance_status: "1",
              insurance_expiry,
            }
          : {
              insurance_status: "-1",
            }
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
            <DriverSideNav selectedNav="Insurance" />
          </div>
          <div className="col-9 m-0 p-0">
            <div className="driverPopVerificationRightMain borderRadius50All">
              <div className="d-flex justify-content-center">
                <h5>Insurance</h5>
              </div>
              <div className="d-flex justify-content-center">
                {driverDetails?.insurance_image ? (
                  <Zoom>
                    <img
                      src={Image_Base_Url + driverDetails?.insurance_image}
                      style={{ height: "300px", cursor: "zoom-in" }}
                      className="img-fluid my-5"
                    />
                  </Zoom>
                ) : (
                  <div className="cameraIcon d-flex justify-content-center align-items-center">
                    <img
                      src={
                        driverDetails?.insurance_image
                          ? Image_Base_Url + driverDetails?.insurance_image
                          : " https://cdn-icons-png.flaticon.com/128/711/711191.png"
                      }
                    />
                  </div>
                )}
              </div>
              <div className="row driverPopUpActionButton d-flex justify-content-around align-items-center">
                <div className="col-1">
                  <p className="mb-0" style={{ marginTop: "50px" }}>
                    Enter
                  </p>
                </div>
                <div className="col-11 row">
                  <div className="col-4">
                    <input
                      type="date"
                      style={{ marginTop: "50px" }}
                      className="form-control"
                      onChange={(e) => setInsurance_expiry(e.target.value)}
                    />
                  </div>
                  <div className="col-4">
                    {btnLoader?.reject ? (
                      <button style={{ background: "#CC0000", opacity: "0.5" }}>Updating ...</button>
                    ) : (
                      <button style={{ background: "#CC0000" }} onClick={() => updateDriverFunc()}>
                        Request Edit
                      </button>
                    )}
                  </div>
                  <div className="col-4">
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
                        onClick={() => updateDriverFunc(true)}
                        style={{
                          opacity: insurance_expiry ? 1 : 0.5,
                        }}
                        disabled={insurance_expiry ? false : true}
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

export default DriverInsuranceDetailsVerification;
