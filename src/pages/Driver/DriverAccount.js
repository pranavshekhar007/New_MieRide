import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import TableNav from "../../components/TableNav";
import {
  getDriverByIdServ,
  updateDriverServ,
} from "../../services/driver.services";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";
import { useGlobalState } from "../../GlobalProvider";
import { Image_Base_Url } from "../../utils/api_base_url_configration";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
function DriverAccount() {
  const { setGlobalState, globalState } = useGlobalState();
  const params = useParams();
  const [documentDetails, setDocumentDetails] = useState({
    show: false,
    img: "",
    documentName: "",
  });
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
  const [data, setData] = useState([]);
  const [showSkelton, setShowSkelton] = useState(false);
  const [driverDetails, setDriverDetails] = useState(null);
  const getUserDetailsFunc = async () => {
    setShowSkelton(true);
    try {
      let response = await getDriverByIdServ(params.id);
      if (response?.data?.statusCode == "200") {
        setDriverDetails(response.data?.data?.driverDetails);
      }
    } catch (error) {}
    setShowSkelton(false);
  };
  useEffect(() => {
    getUserDetailsFunc();
  }, []);
  return (
    <div className="main_layout  bgBlack d-flex">
      {/* sidebar started */}
      <Sidebar selectedItem="Driver" />
      {/* sidebar ended */}

      {/* sectionLayout started */}
      <section
        className="section_layout"
        style={{
          marginLeft: globalState?.isFillSidebarWidth100 ? "260px" : "80px",
        }}
      >
        {/* top nav started  */}

        {/* top nav ended  */}
        {/* table List started */}
        <div className="">
          <TableNav
            tableNav={tableNav}
            selectedItem="Account"
            sectedItemBg="#FDEEE7"
          />
          <div
            className="tableBody py-2 px-4 borderRadius50All driverDetailsLabelInput"
            style={{ background: "#FDEEE7" }}
          >
            <div
              className=" p-5 my-4"
              style={{ borderRadius: "20px", background: "#fff" }}
            >
              <div className="row d-flex justify-content-between">
                <div className="col-8 ">
                  <div className="d-flex align-items-center mb-3">
                    <input
                      type="checkbox"
                      style={{
                        height: "30px",
                        width: "30px",
                        border: "none",
                        borderRadius: "15px",
                        filter: "drop-shadow(0 0 8px rgba(0,0,0,0.06))",
                      }}
                      checked={
                        driverDetails?.driver_account_details?.type === "0"
                      }
                    />
                    <label style={{ fontSize: "20px" }} className="ms-3">
                      Interac E-Transfer
                    </label>
                  </div>
                  <label className=" col-form-label">Email Address</label>
                  <input
                    type="text"
                    className="form-control"
                    value={driverDetails?.driver_account_details?.email}
                    // onChange={(e) => {
                    //   setFormData({ ...formData, first_name: e.target.value });
                    // }}
                    // readOnly={!isEditable}
                    style={{ background: "#FDEEE7" }}
                  />
                  <div className="d-flex align-items-center my-5">
                    <input
                      type="checkbox"
                      style={{
                        height: "30px",
                        width: "30px",
                        border: "none",
                        borderRadius: "15px",
                        filter: "drop-shadow(0 0 8px rgba(0,0,0,0.06))",
                      }}
                      checked={
                        driverDetails?.driver_account_details?.type === "1"
                      }
                    />
                    <label style={{ fontSize: "20px" }} className="ms-3">
                      Direct Deposit Details
                    </label>
                  </div>
                  <label className=" col-form-label">Customer Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={driverDetails?.driver_account_details?.bank_name}
                    // onChange={(e) => {
                    //   setFormData({ ...formData, first_name: e.target.value });
                    // }}
                    // readOnly={!isEditable}
                    style={{ background: "#FDEEE7" }}
                  />
                  <label className=" col-form-label mt-1">Transit Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={driverDetails?.driver_account_details?.transit_no}
                    // onChange={(e) => {
                    //   setFormData({ ...formData, first_name: e.target.value });
                    // }}
                    // readOnly={!isEditable}
                    style={{ background: "#FDEEE7" }}
                  />
                  <label className=" col-form-label mt-1">
                    Institution Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={
                      driverDetails?.driver_account_details?.institution_no
                    }
                    // onChange={(e) => {
                    //   setFormData({ ...formData, first_name: e.target.value });
                    // }}
                    // readOnly={!isEditable}
                    style={{ background: "#FDEEE7" }}
                  />
                  <label className=" col-form-label mt-1">Account Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={driverDetails?.driver_account_details?.account}
                    // onChange={(e) => {
                    //   setFormData({ ...formData, first_name: e.target.value });
                    // }}
                    // readOnly={!isEditable}
                    style={{ background: "#FDEEE7" }}
                  />

                  <button
                    className="btn btn-success"
                    onClick={() => {
                      setDocumentDetails({
                        show: true,
                        img:
                          Image_Base_Url +
                          driverDetails?.driver_account_details?.file,
                      });
                    }}
                  >
                    View Form Deposite
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* table List ended */}
      </section>
      {/* sectionLayout ended */}

      {documentDetails.show && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Deposit Form</h5>
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
                {documentDetails?.img?.split(".")?.[
                  documentDetails?.img?.split(".").length - 1
                ] == "pdf" ? (
                  <div>
                    <div className="d-flex justify-content-center align-items-center" style={{ height: "500px", border: "1px solid #ccc"  }}>
                     <p>Please View The PDF in other tab</p> 
                      {window.open(documentDetails?.img, "_blank")}
                    </div>
                  </div>
                ) : (
                  <img src={documentDetails?.img} className="img-fluid" />
                )}
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
    </div>
  );
}

export default DriverAccount;
