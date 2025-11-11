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
function DriverReviewDetailsVerification() {
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
  const [btnloader, setBtnLoader]=useState(false)
  const updateDriverFunc = async () => {
    setBtnLoader(true)
    try {
      let response = await updateDriverServ(driverDetails?.id, { status: "Approve" });
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        navigate("/driver-profile/" + driverDetails?.id);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
    setBtnLoader(false)
  };
  const [documentDetails, setDocumentDetails] = useState({
    show: false,
    img: "",
    documentName: "",
  });
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
            <DriverSideNav selectedNav="Review & Approve" />
          </div>
          <div className="col-9 m-0 p-0">
            <div className="driverPopVerificationRightMain" style={{ borderRadius: "50px 50px 50px 50px" }}>
              <div className="d-flex justify-content-center">
                <h5>Review & Approve</h5>
              </div>
              <div className="row d-flex justify-content-between mt-4">
                <div className="col-5">
                  <h6>(Car Details)</h6>
                  <label className=" col-form-label">Choose Vehicle Brand</label>
                  <input type="text" className="form-control" value={driverDetails?.vehicle_brand} />
                  <label className=" col-form-label">Choose Vehicle Model</label>
                  <input type="text" className="form-control" value={driverDetails?.vehicle_name} />
                  <label className=" col-form-label">Choose Vehicle Colour</label>
                  <input type="text" className="form-control" value={driverDetails?.vehicle_colour} />
                  <label className=" col-form-label">Choose Year Of Manufacture</label>
                  <input type="text" className="form-control" value={driverDetails?.vehicle_date} />
                  <label className=" col-form-label">Pick Vehicle Size</label>
                  <input type="text" className="form-control" value={driverDetails?.vehicle_size} />
                  <label className=" col-form-label">Enter Vehicle Number</label>
                  <input type="text" className="form-control" value={driverDetails?.vehicle_no} />
                </div>
                <div className="col-5 mt-auto">
                  <h6>(Personal Details)</h6>
                  <label className=" col-form-label">First Name</label>
                  <input type="text" className="form-control" value={driverDetails?.first_name} />
                  <label className=" col-form-label">Last Name</label>
                  <input type="text" className="form-control" value={driverDetails?.last_name} />
                  <label className=" col-form-label">Email Address</label>
                  <input type="text" className="form-control" value={driverDetails?.email} />
                  <label className=" col-form-label">Phone Number</label>
                  <input type="text" className="form-control" value={driverDetails?.contact} />
                  <label className=" col-form-label">Password</label>
                  <input type="text" className="form-control" value={driverDetails?.password} />
                </div>
              </div>
              <div className="row driverPopUpActionButton driverApproveMainFooter mt-4">
                <div className="col-2 mt-auto">
                  <div className="d-flex justify-content-center align-items-end">
                    <img
                      src={
                        driverDetails?.image
                          ? `${Image_Base_Url + driverDetails?.image}`
                          : "https://cdn-icons-png.flaticon.com/128/711/711191.png"
                      }
                      style={{ height: "70px", width: "70px", borderRadius: "35px" }}
                      className="shadow"
                      onClick={() => {
                        setDocumentDetails({
                          show: true,
                          img: Image_Base_Url + driverDetails?.image,
                          documentName: "Profile Photo",
                        });
                      }}
                    />
                  </div>
                  <p className="text-center mb-0">(Profile Photo)</p>
                </div>
                <div className="col-2 mt-auto">
                  <div className="d-flex justify-content-center align-items-end">
                    <img
                      src={
                        driverDetails?.licence_image
                          ? `${Image_Base_Url + driverDetails?.licence_image}`
                          : "https://cdn-icons-png.flaticon.com/128/711/711191.png"
                      }
                      style={{ height: "70px", width: "70px", borderRadius: "35px" }}
                      className="shadow"
                      onClick={() => {
                        setDocumentDetails({
                          show: true,
                          img: Image_Base_Url + driverDetails?.licence_image,
                          documentName: "Driving License",
                        });
                      }}
                    />
                  </div>
                  <p className="text-center mb-0">(Driving License)</p>
                </div>
                <div className="col-2 mt-auto">
                  <div className="d-flex justify-content-center align-items-end">
                    <img
                      src={
                        driverDetails?.ownership_image
                          ? `${Image_Base_Url + driverDetails?.ownership_image}`
                          : "https://cdn-icons-png.flaticon.com/128/711/711191.png"
                      }
                      style={{ height: "70px", width: "70px", borderRadius: "35px" }}
                      className="shadow"
                      onClick={() => {
                        setDocumentDetails({
                          show: true,
                          img: Image_Base_Url + driverDetails?.ownership_image,
                          documentName: "Ownership",
                        });
                      }}
                    />
                  </div>
                  <p className="text-center mb-0">(Ownership)</p>
                </div>
                <div className="col-2 mt-auto">
                  <div className="d-flex justify-content-center align-items-end">
                    <img
                      src={
                        driverDetails?.insurance_image
                          ? `${Image_Base_Url + driverDetails?.insurance_image}`
                          : "https://cdn-icons-png.flaticon.com/128/711/711191.png"
                      }
                      style={{ height: "70px", width: "70px", borderRadius: "35px" }}
                      className="shadow"
                      onClick={() => {
                        setDocumentDetails({
                          show: true,
                          img: Image_Base_Url + driverDetails?.insurance_image,
                          documentName: "Insurance",
                        });
                      }}
                    />
                  </div>
                  <p className="text-center mb-0">(Insurance)</p>
                </div>
                <div className="col-4">
                  {btnloader ? <button style={{opacity:"0.5"}}>Updating ...</button> :<button onClick={updateDriverFunc}>Approve</button>}
                  
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* horizontal Nav end*/}
      </section>
      {/* sectionLayout ended */}
      {documentDetails.show && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{documentDetails?.documentName}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() =>
                    setDocumentDetails({
                      show: false,
                      img: "",
                    })
                  }
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <img src={documentDetails?.img} className="img-fluid" />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() =>
                    setDocumentDetails({
                      show: false,
                      img: "",
                    })
                  }
                >
                  Close
                </button>
                {/* <button type="button" className="btn btn-primary">
                  Save changes
                </button> */}
              </div>
            </div>
          </div>
        </div>
      )}
      {documentDetails.show && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}

export default DriverReviewDetailsVerification;
