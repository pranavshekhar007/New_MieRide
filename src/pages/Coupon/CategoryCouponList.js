import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import TableNav from "../../components/TableNav";
import moment from "moment";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useGlobalState } from "../../GlobalProvider";
import {
  addCouponCategoryServ,
  getCouponCategoryListServ,
  deleteCouponCategoryServ,
  updateCouponCategoryServ,
} from "../../services/coupon.service";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import NoRecordFound from "../../components/NoRecordFound";
import { Image_Base_Url } from "../../utils/api_base_url_configration";
function CategoryCoupanList() {
  const params = useParams();
  const { setGlobalState, globalState } = useGlobalState();

  const navItems = [
    {
      name: "Coupons",
      path: "/coupon-list",
    },
    {
      name: "Coupon Categories",
      path: "/coupon-categories",
    },
  ];
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    applicable_benefits: "",
    visible_benefits: "",
    user_type: "",
    status: "",
  });
  const [showSkelton, setShowSkelton] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);
  const [submitLoader, setSubmitLoader] = useState(false);
  const handleSubmitCategory = async () => {
    setSubmitLoader(true);
    try {
      let response = await addCouponCategoryServ(formData);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        setShowPopUp(false);
        setFormData({
          name: "",
          sharing_description: "",
          personal_description: "",
          sharing_applicable_benefits: "",
          personal_applicable_benefits: "",
          sharing_visible_benefits: "",
          personal_visible_benefits: "",
          status: "",
        });
        getListItemsFunction();
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
    setSubmitLoader(false);
  };
  const [payload, setPayload] = useState({
    search_key: "",
  });
  const [list, setList] = useState([]);
  const getListItemsFunction = async () => {
    setShowSkelton(true);
    const { status, ...restPayload } = payload || {};
    const updatedPayload = status
      ? { ...restPayload, status }
      : { ...restPayload };
    try {
      let response = await getCouponCategoryListServ(updatedPayload);
      setList(response?.data?.data);
    } catch (error) {}
    setShowSkelton(false);
  };
  useEffect(() => {
    getListItemsFunction();
  }, [payload]);
  const deleteRecordFunc = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete the record?"
    );
    if (confirmed) {
      try {
        let response = await deleteCouponCategoryServ({ id: id });
        if (response?.data?.statusCode == "200") {
          getListItemsFunction();
          toast.success(response?.data?.message);
        }
      } catch (error) {
        toast.error("Internal Server Error");
      }
    }
  };
  const [editFormData, setEditFormData] = useState({
    name: "",
    sharing_description: "",
    personal_description: "",
    sharing_applicable_benefits: "",
    personal_applicable_benefits: "",
    sharing_visible_benefits: "",
    personal_visible_benefits: "",
    status: "",
    id: "",
  });
  const updateCouponCategoryFunction = async () => {
    setSubmitLoader(true);
    try {
      let response = await updateCouponCategoryServ(editFormData);
      if (response?.data?.statusCode == "200") {
        setEditFormData({
          name: "",
          sharing_description: "",
          personal_description: "",
          sharing_applicable_benefits: "",
          personal_applicable_benefits: "",
          sharing_visible_benefits: "",
          personal_visible_benefits: "",
          status: "",
          id: "",
        });
        getListItemsFunction();
      }
    } catch (error) {}
    setSubmitLoader(false);
  };
  return (
    <div className="main_layout  bgBlack d-flex">
      {/* sidebar started */}
      <Sidebar selectedItem="Coupons" />
      {/* sidebar ended */}

      {/* sectionLayout started */}
      <section
        className="section_layout"
        style={{
          marginLeft: globalState?.isFillSidebarWidth100 ? "260px" : "80px",
          minWidth: "1600px",
        }}
      >
        {/* top nav started  */}
        <TopNav
          navItems={navItems}
          navColor="#fff"
          navBg="#000000"
          divideRowClass="col-xl-8 col-lg-8 col-md-12 col-12"
          selectedItem="Coupon Categories"
          sectedNavBg="#FF4500"
          selectedNavColor="#fff"
        />
        {/* top nav ended  */}

        {/* table List started */}
        <div className="tableMain">
          <div
            className="tableBody py-2 px-4 borderRadius50All"
            style={{ background: "#363435" }}
          >
            <div style={{ margin: "20px 10px" }}>
              <div className="row my-4">
                <div className="col-6">
                  <input
                    placeholder="Search "
                    className="form-control"
                    value={payload?.search_key}
                    style={{ borderRadius: "20px" }}
                    onChange={(e) =>
                      setPayload({ ...payload, search_key: e?.target?.value })
                    }
                  />
                </div>
                <div className="col-3">
                  <select
                    className="form-control"
                    style={{ borderRadius: "20px" }}
                    onChange={(e) =>
                      setPayload({ ...payload, status: e?.target?.value })
                    }
                  >
                    <option value="">Select</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="col-3">
                  <button
                    className="btn btn-success w-100"
                    style={{ background: "#139F01", borderRadius: "20px" }}
                    onClick={() => setShowPopUp(true)}
                  >
                    Add Category
                  </button>
                </div>
              </div>
              <table className="table bookingTable">
                <thead>
                  <tr style={{ background: "#FDEEE7", color: "#000" }}>
                    <th
                      scope="col"
                      style={{ borderRadius: "24px 0px 0px 24px" }}
                    >
                      <div className="d-flex justify-content-center ms-2">
                        <span>Sr. No</span>
                      </div>
                    </th>
                    <th scope="col">Name</th>
                    <th scope="col">Title</th>
                    <th scope="col">Visible Benefits</th>
                    <th scope="col">Applicable Benefits</th>
                    <th scope="col">User Type</th>
                    <th scope="col">Status</th>
                    <th
                      scope="col"
                      style={{ borderRadius: "0px 24px 24px 0px" }}
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <div className="py-2"></div>
                <tbody>
                  {showSkelton
                    ? [1, 2, 3, 4, 5, 6, 7, 8, 9]?.map((v, i) => {
                        return (
                          <tr key={i}>
                            <td>
                              <Skeleton width={50} />
                            </td>

                            <td>
                              <Skeleton width={100} />
                            </td>
                            <td>
                              <Skeleton width={100} />
                            </td>
                            <td>
                              <Skeleton width={100} />
                            </td>
                            <td>
                              <Skeleton width={100} />
                            </td>
                            <td>
                              <Skeleton width={100} />
                            </td>

                            <td>
                              <Skeleton width={100} />
                            </td>
                            <td>
                              <Skeleton width={100} />
                            </td>
                          </tr>
                        );
                      })
                    : list?.map((v, i) => {
                        return (
                          <>
                            <tr className="bg-light mb-2">
                              <td
                                scope="row"
                                style={{
                                  borderTopLeftRadius: "24px",
                                  borderBottomLeftRadius: "24px",
                                }}
                              >
                                {i + 1}
                              </td>
                              <td>{v?.name}</td>
                              <td>{v?.title}</td>
                              <td>{v?.visible_benefits}</td>
                              <td>{v?.applicable_benefits}</td>
                              <td>{v?.user_type?.toUpperCase()}</td>
                              <td>
                                {v?.status == "active" ? (
                                  <button className="btn btn-sm btn-success">
                                    Active
                                  </button>
                                ) : (
                                  <button className="btn btn-sm btn-danger">
                                    Deactive
                                  </button>
                                )}
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
                                  style={{
                                    borderRadius: "12px",
                                    width: "100%",
                                    height: "100%",
                                  }}
                                >
                                  <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() =>
                                      setEditFormData({
                                        name: v?.name,
                                        title: v?.title,
                                        applicable_benefits:
                                          v?.applicable_benefits,
                                        visible_benefits: v?.visible_benefits,
                                        user_type: v?.user_type,
                                        status: v?.status,
                                        id: v?.id,
                                      })
                                    }
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="btn btn-sm btn-danger ms-2"
                                    onClick={() => deleteRecordFunc(v?.id)}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                            <div className="py-2"></div>
                          </>
                        );
                      })}
                </tbody>
              </table>
              {list?.length == 0 && !showSkelton && (
                <NoRecordFound theme="light" />
              )}
            </div>
          </div>
        </div>
        {/* table List ended */}
      </section>
      {/* sectionLayout ended */}
      {showPopUp && (
        <div
          className="modal fade show d-flex align-items-center justify-content-center userHistoryPopUp"
          tabIndex="-1"
        >
          <div className="modal-dialog" style={{ width: "500px" }}>
            <div className="modal-content  w-100 " style={{ padding: "20px" }}>
              <div className="d-flex justify-content-end ">
                <i
                  className="fa fa-close text-secondary p-2"
                  onClick={() => {
                    setShowPopUp(null);
                    setFormData({
                      name: "",
                      title: "",
                      applicable_benefits: "",
                      visible_benefits: "",
                      user_type: "",
                      status: "",
                    });
                  }}
                ></i>
              </div>
              <h6 className="mb-4">Add Category</h6>
              <div className="modal-body p-0">
                <label>Name</label>
                <input
                  className="form-control w-100 mb-2"
                  placeholder=""
                  value={formData?.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e?.target.value })
                  }
                />
                <div className="row mt-2">
                  <div className="col-12">
                    <label>Title</label>
                    <textarea
                      className="form-control mb-2 w-100"
                      placeholder=""
                      value={formData?.title}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          title: e?.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <label>Visible Benefits</label>
                    <input
                      className="form-control mb-2 w-100"
                      placeholder=""
                      value={formData?.visible_benefits}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          visible_benefits: e?.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <label>Applicable Benefits</label>
                    <input
                      className="form-control mb-2 w-100"
                      placeholder=""
                      value={formData?.applicable_benefits}
                      type="number"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          applicable_benefits: e?.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-12 mb-2">
                    <label>User Type</label>
                    <select
                      className="form-control"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          user_type: e?.target?.value,
                        })
                      }
                    >
                      <option value="">Select</option>
                      <option value="user">User</option>
                      <option value="driver">Driver</option>
                    </select>
                  </div>
                </div>

                <label>Status</label>
                <select
                  className="form-control"
                  onChange={(e) =>
                    setFormData({ ...formData, status: e?.target?.value })
                  }
                >
                  <option value="">Select</option>
                  <option value="active">Active</option>
                  <option value="deactive">Deactive</option>
                </select>

                {formData?.name && formData?.status ? (
                  submitLoader ? (
                    <button
                      className="btn btn-success w-100 mt-3 shadow"
                      style={{
                        background: "#eab66d",
                        border: "none",
                        opacity: "0.5",
                      }}
                    >
                      Submiting ...
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSubmitCategory()}
                      className="btn btn-success w-100 mt-3 shadow"
                      style={{ background: "#eab66d", border: "none" }}
                    >
                      Submit
                    </button>
                  )
                ) : (
                  <button
                    className="btn btn-success w-100 mt-3 shadow"
                    style={{
                      background: "#eab66d",
                      border: "none",
                      opacity: "0.5",
                    }}
                  >
                    Submit
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {showPopUp && <div className="modal-backdrop fade show"></div>}
      {editFormData?.id && (
        <div
          className="modal fade show d-flex align-items-center justify-content-center userHistoryPopUp"
          tabIndex="-1"
        >
          <div className="modal-dialog" style={{ width: "500px" }}>
            <div className="modal-content  w-100 " style={{ padding: "20px" }}>
              <div className="d-flex justify-content-end ">
                <i
                  className="fa fa-close text-secondary p-2"
                  onClick={() => {
                    setEditFormData({
                      name: "",
                      title: "",
                      applicable_benefits: "",
                      visible_benefits: "",
                      user_type: "",
                      status: "",
                      id: "",
                    });
                  }}
                ></i>
              </div>
              <h6 className="mb-4">Edit Category</h6>
              <div className="modal-body p-0">
                <label>Name</label>
                <input
                  className="form-control w-100 mb-2"
                  placeholder=""
                  value={editFormData?.name}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, name: e?.target.value })
                  }
                />
                <div className="row mt-2">
                  <div className="col-12">
                    <label>Title</label>
                    <textarea
                      className="form-control mb-2 w-100"
                      placeholder=""
                      value={editFormData?.title}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          title: e?.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <label>Visible Benefits</label>
                    <input
                      className="form-control mb-2 w-100"
                      placeholder=""
                      value={editFormData?.visible_benefits}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          visible_benefits: e?.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <label>Applicable Benefits</label>
                    <input
                      className="form-control mb-2 w-100"
                      placeholder=""
                      value={editFormData?.applicable_benefits}
                      type="number"
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          applicable_benefits: e?.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-12 mb-2">
                    <label>User Type</label>
                    <select
                      className="form-control"
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          user_type: e?.target?.value,
                        })
                      }
                      value={editFormData?.user_type}
                    >
                      <option value="">Select</option>
                      <option value="user">User</option>
                      <option value="driver">Driver</option>
                    </select>
                  </div>
                </div>

                <label>Status</label>
                <select
                  className="form-control"
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      status: e?.target?.value,
                    })
                  }
                  value={editFormData?.status}
                >
                  <option value="">Select</option>
                  <option value="active">Active</option>
                  <option value="deactive">Deactive</option>
                </select>

                {editFormData?.name && editFormData?.status ? (
                  submitLoader ? (
                    <button
                      className="btn btn-success w-100 mt-3 shadow"
                      style={{
                        background: "#eab66d",
                        border: "none",
                        opacity: "0.5",
                      }}
                    >
                      Submiting ...
                    </button>
                  ) : (
                    <button
                      onClick={() => updateCouponCategoryFunction()}
                      className="btn btn-success w-100 mt-3 shadow"
                      style={{ background: "#eab66d", border: "none" }}
                    >
                      Submit
                    </button>
                  )
                ) : (
                  <button
                    className="btn btn-success w-100 mt-3 shadow"
                    style={{
                      background: "#eab66d",
                      border: "none",
                      opacity: "0.5",
                    }}
                  >
                    Submit
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {editFormData?.id && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}

export default CategoryCoupanList;
