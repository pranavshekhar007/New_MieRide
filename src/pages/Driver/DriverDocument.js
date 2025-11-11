import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import TableNav from "../../components/TableNav";
import { getDriverByIdServ, updateDriverServ } from "../../services/driver.services";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";
import { useGlobalState } from "../../GlobalProvider";
import { Image_Base_Url } from "../../utils/api_base_url_configration";
function DriverDocument() {
  const { setGlobalState, globalState } = useGlobalState();
  const params = useParams();
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
  const [driverDetails, setDriverDetails] = useState(null);
  const [showSkelton, setShowSkelton] = useState(false);
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
  const driverDocument = [
    {
      title: "Driving Licence",
      image: driverDetails?.licence_image,
      exp: driverDetails?.licence_expiry,
      key: "licence_status",
      expKey: "licence_expiry",
    },
    {
      title: "Ownership",
      image: driverDetails?.ownership_image,
      key: "ownership_status",
      expKey: "ownership_expiry",
    },
    {
      title: "Insurance",
      image: driverDetails?.insurance_image,
      exp: driverDetails?.insurance_expiry,
      key: "insurance_status",
      expKey: "insurance_expiry",
    },
    // {
    //   title: "Direct Deposit Form",
    //   image: driverDetails?.licence_image,
    // },
  ];
  const [documentDetails, setDocumentDetails] = useState({
    show: false,
    img: "",
    documentName: "",
  });
  const downloadImage = async (url, filename) => {
    try {
      // Fetch the image as a Blob
      const response = await fetch(url);
      const blob = await response.blob();

      // Create a temporary link element
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;

      // Programmatically click the link to trigger the download
      link.click();

      // Clean up the Object URL
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Image download failed:", error);
    }
  };
  const handleSubmitDriverProfile = async (keyName, value) => {
    const formData = { [keyName]: value };
    try {
      let response = await updateDriverServ(params.id, formData);
      if (response?.data?.statusCode == "200") {
        toast.success("Driver updated successfully");
        getUserDetailsFunc();
      }
    } catch (error) {
      console.error("Error submitting driver profile:", error);
      toast.error("An error occurred while updating the profile.");
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
          <TableNav tableNav={tableNav} selectedItem="Document" sectedItemBg="#FDEEE7" />
          <div className="tableBody py-2 px-4 borderRadius50All" style={{ background: "#FDEEE7" }}>
            <div className=" px-2 py-4 my-4" style={{ borderRadius: "20px", background: "#fff" }}>
              <div style={{ margin: "0px 10px" }}>
                <table className="table">
                  <thead>
                    <tr style={{ background: "#035791", color: "white" }}>
                      <th scope="col" style={{ borderRadius: "8px 0px 0px 8px" }}>
                        Document Name
                      </th>
                      <th scope="col">Image</th>
                      <th scope="col">View</th>
                      <th scope="col">Document</th>
                      <th scope="col">Action</th>
                      <th scope="col" style={{ borderRadius: "0px 8px 8px 0px" }}>
                        Status
                      </th>
                    </tr>
                  </thead>
                  <div className="py-2"></div>
                  <tbody className="driverDocument">
                    {showSkelton
                      ? Array.from({ length: 5 }).map((_, index) => (
                          <tr key={index}>
                            <td>
                              <Skeleton width={120} />
                            </td>
                            <td>
                              <Skeleton circle height={50} width={50} />
                            </td>
                            <td>
                              <Skeleton width={80} />
                            </td>
                            <td>
                              <Skeleton width={100} />
                            </td>
                            <td>
                              <Skeleton width={80} />
                            </td>

                            <td>
                              <Skeleton width={80} />
                            </td>
                          </tr>
                        ))
                      : driverDocument?.map((v, i) => (
                          <>
                            <div className="mt-3"></div>
                            <tr key={i} style={{ background: "#F6F6F6" }}>
                              <td style={{ borderRadius: "12px 0px 0px 12px" }}>
                                <div style={{ marginTop: "-10px" }}>{v?.title}</div>
                                {v?.exp && <span style={{ color: "#139F01", fontSize: "12px" }}>{`(${v.exp})`}</span>}
                              </td>
                              <td>
                                <img
                                  src={Image_Base_Url + v?.image}
                                  style={{
                                    height: "50px",
                                    width: "50px",
                                    borderRadius: "50%",
                                    cursor: "pointer",
                                    marginTop: "-10px",
                                  }}
                                />
                              </td>
                              <td>
                                <div className="d-flex justify-content-center iconDiv">
                                  <img
                                    src="https://cdn-icons-png.flaticon.com/128/159/159604.png"
                                    alt="proof"
                                    onClick={() => {
                                      setDocumentDetails({
                                        show: true,
                                        img: Image_Base_Url + v?.image,
                                        documentName: v?.title,
                                      });
                                    }}
                                  />
                                </div>
                              </td>

                              <td className="d-flex justify-content-center align-items-center">
                                <button
                                  onClick={() => downloadImage(v?.image, `${v?.title}'.png`)}
                                  className="btn btn-primary"
                                  style={{ background: "#191919", border: "none" }}
                                >
                                  Download
                                </button>
                              </td>
                              <td>
                                <div className="d-flex justify-content-center align-items-center">
                                  <select
                                    className=""
                                    style={{ background: "#F6F6F6", color: "black" }}
                                    onChange={(e) => handleSubmitDriverProfile(v?.key, e.target.value)}
                                    value={
                                      v?.key == "licence_status"
                                        ? driverDetails?.licence_status
                                        : v?.key == "ownership_status"
                                        ? driverDetails?.ownership_status
                                        : driverDetails?.insurance_status
                                    }
                                  >
                                    <option value="0">Uploaded</option>
                                    <option value="-1">Re Issue</option>
                                    <option value="1">Approved</option>
                                  </select>
                                </div>
                              </td>
                              <td style={{ borderRadius: "0px 12px 12px 0px" }}>
                                <div className="d-flex justify-content-center align-items-center">
                                  {v?.key == "licence_status" && (
                                    <>
                                      {driverDetails?.licence_status == "1" ? (
                                        <button
                                          style={{ background: "#139F01", border: "none" }}
                                          className="btn btn-primary"
                                        >
                                          Verified
                                        </button>
                                      ) : driverDetails?.licence_status == "0" ? (
                                        <button
                                          style={{ background: "#FFC728", border: "none" }}
                                          className="btn btn-primary"
                                        >
                                          Pending
                                        </button>
                                      ) : (
                                        <button
                                          style={{ background: "#ED2236", border: "none" }}
                                          className="btn btn-primary"
                                        >
                                          Rejected
                                        </button>
                                      )}
                                    </>
                                  )}
                                  {v?.key == "ownership_status" && (
                                    <>
                                      {driverDetails?.ownership_status == "1" ? (
                                        <button
                                          style={{ background: "#139F01", border: "none" }}
                                          className="btn btn-primary"
                                        >
                                          Verified
                                        </button>
                                      ) : driverDetails?.ownership_status == "0" ? (
                                        <button
                                          style={{ background: "#FFC728", border: "none" }}
                                          className="btn btn-primary"
                                        >
                                          Pending
                                        </button>
                                      ) : (
                                        <button
                                          style={{ background: "#ED2236", border: "none" }}
                                          className="btn btn-primary"
                                        >
                                          Rejected
                                        </button>
                                      )}
                                    </>
                                  )}
                                  {v?.key == "insurance_status" && (
                                    <>
                                      {driverDetails?.insurance_status == "1" ? (
                                        <button
                                          style={{ background: "#139F01", border: "none" }}
                                          className="btn btn-primary"
                                        >
                                          Verified
                                        </button>
                                      ) : driverDetails?.insurance_status == "0" ? (
                                        <button
                                          style={{ background: "#FFC728", border: "none" }}
                                          className="btn btn-primary"
                                        >
                                          Pending
                                        </button>
                                      ) : (
                                        <button
                                          style={{ background: "#ED2236", border: "none" }}
                                          className="btn btn-primary"
                                        >
                                          Rejected
                                        </button>
                                      )}
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          </>
                        ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        {/* table List ended */}
      </section>
      {/* sectionLayout ended */}
      {/* view transaction socument popup start */}
      {/* Modal */}
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
      {/* view transaction socument popup end*/}
    </div>
  );
}

export default DriverDocument;
