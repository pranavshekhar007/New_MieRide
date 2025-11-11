import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/Sidebar";
import TopNav from "../../../components/TopNav";
import TableNav from "../../../components/TableNav";
import { useGlobalState } from "../../../GlobalProvider";
import { getAdsListServ, storeAdsServ, deleteAdsServ, updateAdsServ } from "../../../services/ads.services";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import { Image_Base_Url } from "../../../utils/api_base_url_configration";
import NoRecordFound from "../../../components/NoRecordFound"
function OnRouteAds() {
  const { setGlobalState, globalState } = useGlobalState();
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [actionValue, setActionValue] = useState("");
  const [formData, setFormData] = useState({
    image: "",
    description: "",
    category: "on_route",
    img_prev: "",
  });
  const navItems = [
    {
      name: "Ads",
      path: "/ads-user-panel",
    },
    {
      name: "Notify",
      path: "/notify-ads",
    },
    {
      name: "Deals",
      path: "/ads-user-panel",
    },
    {
      name: "Website",
      path: "/website-ads",
    },
  ];
  const tableNav = [
    {
      name: "User",
      path: "/ads-user-panel",
    },
    {
      name: "On Route",
      path: "/ads-on-route-panel",
    },
    {
      name: "End Receipt",
      path: "/ads-end-receipt-panel",
    },
    {
      name: "Driver",
      path: "/ads-driver-panel",
    },
  ];
  const [preview, setPreview]=useState({
    show:false,
    image:""
  })
  const [list, setList] = useState([]);
  const [showSkelton, setShowSkelton] = useState(false);
  const handleGetListFunc = async () => {
    if (list?.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await getAdsListServ({ category: "on_route" });
      if (response?.data?.statusCode == "200") {
        setList(response?.data?.data);
      }
    } catch (error) {}
    setShowSkelton(false);
  };
  const handleSubmitAddFunc = async () => {
    const payloadFormData = new FormData();
    payloadFormData.append("image", formData?.image);
    payloadFormData.append("description", formData?.description);
    payloadFormData.append("category", formData?.category);
    try {
      let response = await storeAdsServ(payloadFormData);
      if (response?.data?.statusCode == "200") {
        handleGetListFunc();
        toast.success(response?.data?.message);
        setFormData({
          image: "",
          description: "",
          category: "on_route",
          img_prev: "",
        });
        setShowAddPopup(false);
      } else if (response?.data?.statusCode == "400") {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
  };
  const handleDeleteAds = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete the record?");
    if (confirmed) {
      try {
        let response = await deleteAdsServ({ category: "on_route", id: id });
        if (response?.data?.statusCode == "200") {
          toast.success(response?.data?.message);
          handleGetListFunc();
        } else {
          toast.error(response?.data?.message);
        }
      } catch (error) {
        toast.error("Internal Server Erorrer");
      }
    }
  };
  const [editformData, setEditFormData] = useState({
    image: "",
    description: "",
    category: "on_route",
    img_prev: "",
    id:""
  });
  const handleSubmitEditFunc = async () => {
    const payloadFormData = new FormData();
    payloadFormData.append("image", editformData?.image);
    payloadFormData.append("description", editformData?.description);
    payloadFormData.append("category", editformData?.category);
    payloadFormData.append("id", editformData?.id);
    try {
      let response = await updateAdsServ(payloadFormData);
      if (response?.data?.statusCode == "200") {
        handleGetListFunc();
        toast.success(response?.data?.message);
        setEditFormData({
          image: "",
          description: "",
          category: "on_route",
          img_prev: "",
          id:""
        });
       
      } else if (response?.data?.statusCode == "400") {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
  };
  useEffect(() => {
    handleGetListFunc();
  }, []);
  return (
    <div className="main_layout  bgBlack d-flex">
      {/* sidebar started */}
      <Sidebar selectedItem="Ad Control Panel" />
      {/* sidebar ended */}

      {/* sectionLayout started */}
      <section className="section_layout" style={{ marginLeft: globalState?.isFillSidebarWidth100 ? "260px" : "80px" }}>
        {/* top nav started  */}
        <TopNav
          navItems={navItems}
          navColor="#000"
          navBg="#FECEAA"
          divideRowClass="col-xl-8 col-lg-8 col-md-12 col-12"
          selectedItem="Ads"
          sectedNavBg="#fff"
          selectedNavColor="#000"
        />
        {/* top nav ended  */}
        {/* table List started */}
        <div className="tableMain">
          <TableNav tableNav={tableNav} selectedItem="On Route" sectedItemBg="#F3F3F3" selectedNavColor="#000" />
          <div className="tableBody py-2 px-4 borderRadius50All" style={{ background: "#F3F3F3" }}>
            <div style={{ margin: "20px 10px" }}>
              <div className="my-3 mb-4">
                <div className="d-flex justify-content-end">
                  <button
                    className="btn btn-success px-3 "
                    onClick={() => setShowAddPopup(true)}
                    style={{ background: "#139F01", border: "none", borderRadius: "20px", width: "200px" }}
                  >
                    Create Add
                  </button>
                </div>
              </div>
              <table className="table bookingTable">
                <thead>
                  <tr style={{ background: "#DDDDDD", color: "#000" }}>
                    <th scope="col" style={{ borderRadius: "12px 0px 0px 12px" }}>
                      Sr. No
                    </th>
                    <th scope="col">Banner</th>

                    <th scope="col">Description</th>
                    <th scope="col">Action</th>
                    <th scope="col">Preview</th>

                    <th scope="col" style={{ borderRadius: "0px 12px 12px 0px" }}>
                      Monthly Views
                    </th>
                  </tr>
                </thead>
                <div className="py-2"></div>
                <tbody>
                  {showSkelton
                    ? [1, 2, 3, 4, 5]?.map((v, i) => {
                        return (
                          <tr className=" ">
                            <td>
                              <Skeleton width={40} height={20} />
                            </td>
                            <td>
                              <Skeleton width={100} height={20} />
                            </td>
                            <td>
                              <Skeleton width={100} height={20} />
                            </td>
                            <td>
                              <Skeleton width={100} height={20} />
                            </td>
                            <td>
                              <Skeleton width={100} height={20} />
                            </td>
                            <td>
                              <Skeleton width={100} height={20} />
                            </td>
                          </tr>
                        );
                      })
                    : list?.map((v, i) => {
                        return (
                          <>
                            <tr className=" ">
                              <td scope="row" style={{ borderTopLeftRadius: "24px", borderBottomLeftRadius: "24px" }}>
                                {i + 1}
                              </td>
                              <td>
                                <div>
                                  <img
                                    src={Image_Base_Url + v?.image}
                                    style={{ height: "40px", width: "70px", borderRadius:"4px" }}
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="d-flex justify-content-center">
                                  <div
                                    className="d-flex justify-content-between locationBoxButton"
                                    style={{ background: "#00437C", width: "200px" }}
                                  >
                                    <span className="ms-2">{v?.description}</span>
                                  </div>{" "}
                                </div>
                              </td>
                              <td>
                                <select
                                  style={{ padding: "9.5px", marginTop: "0px" }}
                                  value={actionValue}
                                  onChange={(e) => {
                                    if (e.target.value == "delete") {
                                      handleDeleteAds(v?.id);
                                      setActionValue("");
                                    }
                                    if (e.target.value == "edit") {
                                      setEditFormData({
                                        image: "",
                                        description: v?.description,
                                        category: "on_route",
                                        img_prev: "",
                                        id:v?.id
                                      })
                                      setActionValue("");
                                    }
                                  }}
                                >
                                  <option value="">Action</option>
                                  <option value="edit">Edit</option>
                                  <option value="delete">Delete</option>
                                </select>
                              </td>
                              <td>
                                <div
                                  className="d-flex justify-content-center align-items-center"
                                  style={{ borderRadius: "12px", width: "100%", height: "100%" }}
                                >
                                  <img
                                    src="https://cdn-icons-png.flaticon.com/128/535/535193.png"
                                    style={{ height: "22px", marginTop: "6px" }}
                                    onClick={()=>setPreview({
                                      image:Image_Base_Url + v?.image,
                                      show:true
                                    })}
                                  />
                                </div>
                              </td>

                              <td
                                style={{
                                  borderTopRightRadius: "24px",
                                  borderBottomRightRadius: "24px",
                                  overflow: "hidden",
                                }}
                              >
                                <div
                                  className="d-flex justify-content-center align-items-center"
                                  style={{ borderRadius: "12px", width: "100%", height: "100%" }}
                                >
                                  <button
                                    className="btn btn-warning"
                                    style={{
                                      padding: "5px 8px",
                                      background: "#D4C2EC",
                                      border: "none",
                                      width: "120px",
                                    }}
                                  >
                                    {v?.total_count}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          </>
                        );
                      })}
                </tbody>
              </table>
              {list?.length == 0 && !showSkelton && (
               <NoRecordFound/>
              )}
            </div>
          </div>
        </div>
        {/* table List ended */}
      </section>
      {/* sectionLayout ended */}

      {showAddPopup && (
        <div className="modal fade show d-flex  justify-content-center userHistoryPopUp" tabIndex="-1">
          <div className="modal-dialog" style={{ width: "400px" }}>
            <div className="modal-content">
              <div className="d-flex justify-content-end p-2">
                <i className="fa fa-close text-secondary" onClick={() => setShowAddPopup(false)}></i>
              </div>
              <h3 className="mb-4 text-center">Create Ads</h3>
              <div className="modal-body p-3">
                <div className="d-flex align-items-center">
                  <img
                    src={
                      formData?.img_prev
                        ? formData?.img_prev
                        : "https://cdn-icons-png.flaticon.com/128/10446/10446694.png"
                    }
                    style={{ height: "40px", width: "40px", borderRadius: "10px" }}
                  />
                  <div className="w-100 ms-2">
                    <input
                      type="file"
                      id={`file-upload`} // Unique id for each input
                      style={{ display: "none", width: "100%" }} // Hide the actual input
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          img_prev: URL.createObjectURL(e.target.files[0]),
                          image: e.target.files[0],
                        })
                      } // Handle the file change
                    />
                    <button
                      className="btn btn-primary w-100"
                      style={{ padding: "7px 8px", background: "#DDDDDD", border: "none", color: "#000" }}
                      onClick={() => document.getElementById(`file-upload`).click()} // Trigger input click
                    >
                      Choose File
                    </button>
                  </div>
                </div>
                <div>
                  <textarea
                    placeholder="Enter Description"
                    className="form-control mt-4 shadow-sm"
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                {formData?.image && formData?.description ? (
                  <button
                    className="btn btn-success w-100 mt-3"
                    style={{ background: "#139F01", border: "none", borderRadius: "20px" }}
                    onClick={handleSubmitAddFunc}
                  >
                    Submit
                  </button>
                ) : (
                  <button
                    className="btn btn-success w-100 mt-3"
                    style={{ background: "#139F01", border: "none", borderRadius: "20px", opacity: "0.5" }}
                  >
                    Submit
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {showAddPopup && <div className="modal-backdrop fade show"></div>}

      {editformData?.id && (
        <div className="modal fade show d-flex  justify-content-center userHistoryPopUp" tabIndex="-1">
          <div className="modal-dialog" style={{ width: "400px" }}>
            <div className="modal-content">
              <div className="d-flex justify-content-end p-2">
                <i className="fa fa-close text-secondary" onClick={() => setEditFormData({
                   image: "",
                   description: "",
                   category: "user",
                   img_prev: "",
                   id:""
                })}></i>
              </div>
              <h3 className="mb-4 text-center">Update Record</h3>
              <div className="modal-body p-3">
                <div className="d-flex align-items-center">
                  <img
                    src={
                      editformData?.img_prev
                        ? editformData?.img_prev
                        : "https://cdn-icons-png.flaticon.com/128/10446/10446694.png"
                    }
                    style={{ height: "40px", width: "40px", borderRadius: "10px" }}
                  />
                  <div className="w-100 ms-2">
                    <input
                      type="file"
                      id={`file-upload`} // Unique id for each input
                      style={{ display: "none", width: "100%" }} // Hide the actual input
                      onChange={(e) =>
                        setEditFormData({
                          ...editformData,
                          img_prev: URL.createObjectURL(e.target.files[0]),
                          image: e.target.files[0],
                        })
                      } // Handle the file change
                    />
                    <button
                      className="btn btn-primary w-100"
                      style={{ padding: "7px 8px", background: "#DDDDDD", border: "none", color: "#000" }}
                      onClick={() => document.getElementById(`file-upload`).click()} // Trigger input click
                    >
                      Choose File
                    </button>
                  </div>
                </div>
                <div>
                  <textarea
                    placeholder="Enter Description"
                    className="form-control mt-4 shadow-sm"
                    value={editformData.description}
                    onChange={(e) => setEditFormData({ ...editformData, description: e.target.value })}
                  />
                </div>
                {editformData?.image && editformData?.description ? (
                  <button
                    className="btn btn-success w-100 mt-3"
                    style={{ background: "#139F01", border: "none", borderRadius: "20px" }}
                    onClick={handleSubmitEditFunc}
                  >
                    Submit
                  </button>
                ) : (
                  <button
                    className="btn btn-success w-100 mt-3"
                    style={{ background: "#139F01", border: "none", borderRadius: "20px", opacity: "0.5" }}
                  >
                    Submit
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {editformData?.id && <div className="modal-backdrop fade show"></div>}

      {preview.show && (
        <div className="modal fade show d-flex  justify-content-center userHistoryPopUp" tabIndex="-1">
          <div className="modal-dialog" >
            <div className="modal-content" style={{borderRadius:"30px"}}>
              {/* <div className="d-flex justify-content-end p-2">
                <i className="fa fa-close text-secondary" onClick={() => setPreview({
                   image: "",
                   show:false
                })}></i>
              </div> */}
              
              <div className="modal-body p-3">
                <div
                  style={{
                    backgroundSize: "100%",
                    backgroundImage: "url(/icons/priceAndCityIcons/enroute.png)",
                    height: "585px",
                    width: "295px",
                    wordWrap: "break-word",
                    whiteSpace: "pre-wrap",
                    marginTop: "-10px",
                  }}
                  className="d-flex justify-content-center"
                >
                  <img
                    src={preview?.image}
                    style={{ height: "180px", position: "relative", top: "143px", width: "80%", borderRadius: "12px" }}
                  />
                </div>
                <div className="d-flex justify-content-center">
                  <button
                    className="btn btn-danger addColseBtn"
                    onClick={() =>
                      setPreview({
                        show: false,
                        image: "",
                      })
                    }
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {preview.show && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}

export default OnRouteAds;
