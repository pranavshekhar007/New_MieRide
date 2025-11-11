import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import TableNav from "../../components/TableNav";
import {
  getDriverByIdServ,
  updateDriverServ,
} from "../../services/driver.services";
import { useParams } from "react-router-dom";
import { useGlobalState } from "../../GlobalProvider";
import { Image_Base_Url } from "../../utils/api_base_url_configration";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NoRecordFound from "../../components/NoRecordFound"
function DriverUpdatedFields() {
  const { setGlobalState, globalState } = useGlobalState();
  const params = useParams();
  const [btnLoader, setShowBtnLoader] = useState({
    approve: false,
    reject: false,
  });
  const tableNav = [
    { name: "Profile", path: `/driver-profile/${params?.id}` },
    { name: "Document", path: `/driver-document/${params?.id}` },
    { name: "Account", path: `/driver-account/${params?.id}` },
    { name: "Rating", path: `/driver-rating/${params?.id}` },
    {
      name: "Transaction History",
      path: `/driver-transeaction-history/${params?.id}`,
    },
    { name: "Updated Fields", path: `/driver-updated-fields/${params?.id}` },
  ];

  const [driverDetails, setDriverDetails] = useState(null);
  const [formData, setFormData] = useState({
    first_name_status: "1",
    last_name_status: "1",
    vehicle_name_status: "1",
    vehicle_brand_status: "1",
    vehicle_date_status: "1",
    vehicle_size_status: "1",
    vehicle_no_status: "1",
    image_status: "1",
    licence_status: "1",
    insurance_status: "1",
    ownership_status: "1",
  });
  const handleCheckboxChange = (key) => {
    setFormData((prev) => ({
      ...prev,
      [`${key}_status`]: prev[`${key}_status`] === "-1" ? "1" : "-1",
    }));
  };
  useEffect(() => {
    getUserDetailsFunc();
  }, []);
  const [showSkelton, setShowSkelton] = useState(false);
  const getUserDetailsFunc = async () => {
    setShowSkelton(true);
    try {
      let response = await getDriverByIdServ(params.id);
      console.log(response);
      if (response?.data?.statusCode == "200") {
        setDriverDetails(response.data?.data?.driverDetails);

        // Initialize formData based on updated fields
        let initialFormData = {};
        response.data?.data?.driverDetails?.updatedFieldsToBeVerified?.forEach(
          (field) => {
            initialFormData[`${field}_status`] = "";
          }
        );
        setFormData(initialFormData);
      }
    } catch (error) {
      console.error("Error fetching driver details:", error);
    }
    setShowSkelton(false);
  };

  
  const updateDriverFunc = async () => {
    try {
      const payload = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [key, value || "1"])
      );
      
      let response = await updateDriverServ(driverDetails?.id, payload);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        getUserDetailsFunc()
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
  };
  return (
    <div className="main_layout bgBlack d-flex">
      <Sidebar selectedItem="Driver" />

      <section
        className="section_layout"
        style={{
          marginLeft: globalState?.isFillSidebarWidth100 ? "260px" : "80px",
        }}
      >
        <TableNav
          tableNav={tableNav}
          selectedItem="Updated Fields"
          sectedItemBg="#FDEEE7"
        />
        <div
          className="tableBody py-2 px-4 borderRadius50All"
          style={{ background: "#FDEEE7" }}
        >
          <div
            className="px-2 py-4 my-4"
            style={{ borderRadius: "20px", background: "#fff" }}
          >
            <div style={{ margin: "0px 10px" }}>
              <div className="row">
                {showSkelton
                  ? [1, 2, 3, 4, 5, 6, 7]?.map((v, i) => {
                      return (
                        <div className="mb-4 d-flex">
                          <div>
                            <Skeleton height={40} width={40} />
                          </div>
                          <div className="ms-5">
                            <Skeleton height={40} width={700} />
                          </div>
                        </div>
                      );
                    })
                  : driverDetails?.updatedFieldsToBeVerified?.map((v, i) => (
                      <div
                        key={i}
                        className="row col-12 m-0 p-0 d-flex align-items-end"
                      >
                        {![
                          "image",
                          "licence",
                          "ownership",
                          "insurance",
                        ].includes(v) && (
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
                              onChange={() => handleCheckboxChange(v)}
                              checked={formData[`${v}_status`] === "-1"}
                            />
                          </div>
                        )}

                        <div className="col-11 row">
                          {![
                            "image",
                            "licence",
                            "ownership",
                            "insurance",
                          ].includes(v) && (
                            <label className="col-form-label">
                              {v.replace(/_/g, " ").toUpperCase()}
                            </label>
                          )}

                          <div className="col-8">
                            {![
                              "image",
                              "licence",
                              "ownership",
                              "insurance",
                            ].includes(v) && (
                              <input
                                type="text"
                                className="form-control"
                                value={driverDetails?.[v]}
                                readOnly
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
              </div>
              <div className="row my-4">
                {driverDetails?.updatedFieldsToBeVerified?.map((v, i) => {
                  if (
                    ["image", "licence", "ownership", "insurance"].includes(v)
                  ) {
                    return (
                      <div key={i} className="row col-3 m-0 p-0 mt-3">
                        <div className="col-11 row ">
                          <div className="col-8">
                            <Zoom>
                              <img
                                src={
                                  v === "image"
                                    ? Image_Base_Url + driverDetails?.["image"]
                                    : v === "licence"
                                    ? Image_Base_Url +
                                      driverDetails?.["licence_image"]
                                    : v === "ownership"
                                    ? Image_Base_Url +
                                      driverDetails?.["ownership_image"]
                                    : Image_Base_Url +
                                      driverDetails?.["insurance_image"]
                                }
                                alt={v}
                                style={{
                                  objectFit: "cover",
                                  height: "200px",
                                  width: "200px",
                                  borderRadius: "10px",
                                }}
                                className="img-fluid"
                              />
                            </Zoom>
                            <div className="d-flex my-2">
                              <input
                                type="checkbox"
                                style={{
                                  height: "40px",
                                  width: "33px",
                                  border: "none",
                                  borderRadius: "8px",
                                  filter:
                                    "drop-shadow(0 0 8px rgba(0,0,0,0.06))",
                                }}
                                onChange={() => handleCheckboxChange(v)}
                                checked={formData[`${v}_status`] === "-1"}
                              />
                              <label className="col-form-label ms-2">
                                {v.replace(/_/g, " ").toUpperCase()}
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
              {!driverDetails?.updatedFieldsToBeVerified?.length ==0 && <div className="d-flex justify-content-center align-items-center mt-5">
                <button
                  onClick={() => updateDriverFunc()}
                  className="btn btn-success w-50 shadow"
                  style={{
                    borderRadius: "20px",
                    border: "none",
                    background: "#139F01",
                  }}
                >
                  Submit
                </button>
              </div>}
              
            </div>
              {!showSkelton && driverDetails?.updatedFieldsToBeVerified?.length ==0 && <div style={{marginTop:"-65px"}}><NoRecordFound/></div>  }
          </div>
        </div>
      </section>
    </div>
  );
}

export default DriverUpdatedFields;
