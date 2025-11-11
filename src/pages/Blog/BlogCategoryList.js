import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import TableNav from "../../components/TableNav";
import moment from "moment";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useGlobalState } from "../../GlobalProvider";
import {
  addBlogCategoryServ,
  getBlogCategoryListServ,
  deleteBlogCategoryServ,
  updateBlogCategoryServ,
} from "../../services/blog.services";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import NoRecordFound from "../../components/NoRecordFound";
import { Image_Base_Url } from "../../utils/api_base_url_configration";
function BlogCategoryList() {
  const params = useParams();
  const { setGlobalState, globalState } = useGlobalState();

  const navItems = [
    {
      name: "Blogs",
      path: "/blog-list",
    },
    {
      name: "Blog Categories",
      path: "/blog-categories",
    },
  ];
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [showSkelton, setShowSkelton] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);
  const [submitLoader, setSubmitLoader] = useState(false);
  const handleSubmitCategory = async () => {
    setSubmitLoader(true);
    try {
      let response = await addBlogCategoryServ(formData);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        setShowPopUp(false);
        setFormData({
          name: "",
          description: "",
        });
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
    const { status, ...restPayload } = payload || {}; 
const updatedPayload = status ? { ...restPayload, status } : { ...restPayload };
    try {
      let response = await getBlogCategoryListServ(updatedPayload);
      setList(response?.data?.data);
    } catch (error) {}
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
        let response = await deleteBlogCategoryServ({ category_id: id });
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
    category_id: "",
    name: "",
    description: "",
    status: "",
    slug: "",
  });
  const updateBlogCategoryFunction = async () => {
    setSubmitLoader(true);
    try {
      let response = await updateBlogCategoryServ(editFormData);
      if (response?.data?.statusCode == "200") {
        setEditFormData({
          category_id: "",
          name: "",
          description: "",
          status: "",
          slug: "",
        });
        getListItemsFunction();
      }
    } catch (error) {}
    setSubmitLoader(false);
  };
  return (
    <div className="main_layout  bgBlack d-flex">
      {/* sidebar started */}
      <Sidebar selectedItem="Blogs" />
      {/* sidebar ended */}

      {/* sectionLayout started */}
      <section
        className="section_layout"
        style={{
          marginLeft: globalState?.isFillSidebarWidth100 ? "260px" : "80px",
        }}
      >
        {/* top nav started  */}
        <TopNav
          navItems={navItems}
          navColor="#fff"
          navBg="#000000"
          divideRowClass="col-xl-8 col-lg-8 col-md-12 col-12"
          selectedItem="Blog Categories"
          sectedNavBg="#024494"
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
                  <tr style={{ background: "#ACDAFC", color: "#000" }}>
                    <th
                      scope="col"
                      style={{ borderRadius: "24px 0px 0px 24px" }}
                    >
                      <div className="d-flex justify-content-center ms-2">
                        <span>Sr. No</span>
                      </div>
                    </th>
                    <th scope="col">Name</th>
                    <th scope="col">Slug</th>
                    <th scope="col">Status</th>
                    <th scope="col">Discription</th>
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
                              <td>
                                <div className="d-flex justify-content-center">
                                  <div
                                    style={{
                                      padding: "3px 6px",
                                      borderRadius: "8px",
                                      width: "100px",
                                      wordWrap: "break-word",
                                      whiteSpace: "normal",
                                    }}
                                  >
                                    {v?.name}
                                  </div>
                                </div>{" "}
                              </td>
                              <td>
                                <div className="d-flex justify-content-center">
                                  <div
                                    style={{
                                      padding: "3px 6px",
                                      borderRadius: "8px",
                                      width: "100px",
                                      wordWrap: "break-word",
                                      whiteSpace: "normal",
                                    }}
                                  >
                                    {v?.slug}
                                  </div>
                                </div>{" "}
                              </td>
                              <td>
                                <div className="d-flex justify-content-center">
                                  <div
                                    style={{
                                      padding: "3px 6px",
                                      borderRadius: "8px",
                                      width: "100px",
                                      wordWrap: "break-word",
                                      whiteSpace: "normal",
                                    }}
                                  >
                                    {v?.status == "active" ? (
                                      <button className="btn btn-success btn-sm">
                                        Active
                                      </button>
                                    ) : (
                                      <button className="btn btn-warning btn-sm">
                                        Inactive
                                      </button>
                                    )}
                                  </div>
                                </div>{" "}
                              </td>
                              <td>
                                <div className="d-flex justify-content-center">
                                  <div
                                    style={{
                                      padding: "3px 6px",
                                      borderRadius: "8px",
                                      width: "100px",
                                      wordWrap: "break-word",
                                      whiteSpace: "normal",
                                    }}
                                  >
                                    {v?.description}
                                  </div>
                                </div>{" "}
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
                                        category_id: v?.id,
                                        name: v?.name,
                                        description: v?.description,
                                        status: v?.status,
                                        slug: v?.slug,
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
                      description: "",
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
                <label>Description</label>
                <textarea
                  className="form-control w-100"
                  placeholder=""
                  value={formData?.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e?.target.value })
                  }
                />
                {formData?.name && formData?.description ? (
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
      {editFormData?.category_id && (
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
                      category_id: "",
                      name: "",
                      description: "",
                      status: "",
                      slug: "",
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
                <label>Slug</label>
                <input
                  className="form-control w-100 mb-2"
                  placeholder=""
                  value={editFormData?.slug}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, slud: e?.target.value })
                  }
                />
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
                  <option value="inactive">Inactive</option>
                </select>
                <label>Description</label>
                <textarea
                  className="form-control w-100"
                  placeholder=""
                  value={editFormData?.description}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      description: e?.target.value,
                    })
                  }
                />
                {editFormData?.name && editFormData?.description ? (
                  submitLoader ? (
                    <button
                      className="btn btn-success w-100 mt-3 shadow"
                      style={{
                        background: "#eab66d",
                        border: "none",
                        opacity: "0.5",
                      }}
                    >
                      Updating ...
                    </button>
                  ) : (
                    <button
                      onClick={() => updateBlogCategoryFunction()}
                      className="btn btn-success w-100 mt-3 shadow"
                      style={{ background: "#eab66d", border: "none" }}
                    >
                      Update
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
                    Update
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {editFormData?.category_id && (
        <div className="modal-backdrop fade show"></div>
      )}
    </div>
  );
}

export default BlogCategoryList;
