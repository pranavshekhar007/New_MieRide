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
  getBlogListServ,
  deleteBlogServ,
  updateBlogCategoryServ,
  getBlogCategoryListServ,
} from "../../services/blog.services";
import {
  getCouponListServ,
  updateCouponServ,
  getCityListServ,
} from "../../services/coupon.service";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import NoRecordFound from "../../components/NoRecordFound";
import { Image_Base_Url } from "../../utils/api_base_url_configration";
function CityToCityCoupon() {
  const navigate = useNavigate();
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
    description: "",
  });
  const [showSkelton, setShowSkelton] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);
  const [submitLoader, setSubmitLoader] = useState(false);

  const [payload, setPayload] = useState({
    search_key: "",
    category_id: 3,
    search_key: "",
    status: "",
    userType: "",
    per_page: 20,
    page: 1,
  });
  const [pageData, setPageData] = useState({
    total_pages: "",
    current_page: "",
  });
  const [list, setList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const getCityListFunc = async () => {
    try {
      let response = await getCityListServ();
      if (response?.data?.statusCode == "200") {
        setCityList(response?.data?.data);
      }
    } catch (error) {}
  };
  const getListItemsFunction = async () => {
    setShowSkelton(true);
    try {
      let response = await getCouponListServ(payload);
      setList(response?.data?.data);
      setPageData({
        total_pages: response?.data?.total_pages,
        current_page: response?.data?.current_page,
      });
    } catch (error) {}
    setShowSkelton(false);
  };
  useEffect(() => {
    getListItemsFunction();
  }, [payload]);
  useEffect(() => {
    getCityListFunc();
  }, []);

  const renderPage = () => {
    const pages = [];
    // Generate page numbers
    for (let i = 1; i <= pageData?.total_pages; i++) {
      pages.push(
        <li
          key={i}
          className={`page-item`}
          onClick={() => setPayload({ ...payload, page: i })}
        >
          <a
            className="page-link"
            href="#"
            style={{
              background: pageData?.current_page === i ? "#024596" : "",
              color: pageData?.current_page === i ? "#fff" : "",
            }}
          >
            {i}
          </a>
        </li>
      );
    }

    return (
      <nav aria-label="Page navigation example">
        <ul className="pagination justify-content-center">
          {/* Previous button */}
          {pageData?.total_pages > 1 && pageData?.current_page != 1 && (
            <li
              className="page-item"
              onClick={() =>
                setPayload({ ...payload, page: pageData.current_page - 1 })
              }
            >
              <a className="page-link" href="#" aria-label="Previous">
                <span aria-hidden="true">«</span>
              </a>
            </li>
          )}

          {/* Page numbers */}
          {pages}

          {/* Next button */}
          {pageData?.total_pages > 1 &&
            pageData?.total_pages != pageData?.current_page && (
              <li
                className="page-item"
                onClick={() =>
                  setPayload({ ...payload, page: pageData?.current_page + 1 })
                }
              >
                <a className="page-link" href="#" aria-label="Next">
                  <span aria-hidden="true">»</span>
                </a>
              </li>
            )}
        </ul>
      </nav>
    );
  };
  const deleteRecordFunc = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete the record?"
    );
    if (confirmed) {
      try {
        let response = await deleteBlogServ({ blog_id: id });
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
    id: "",
    valid_till: "",
    status: "",
    start_city:"",
    end_city:""
  });
  const updateCouponFunction = async () => {
    setSubmitLoader(true);
    try {
      let response = await updateCouponServ(editFormData);
      if (response?.data?.statusCode == "200") {
        setEditFormData({
          id: "",
          valid_till: "",
          status: "",
          start_city:"",
          end_city:""
        });
        getListItemsFunction();
      }
    } catch (error) {}
    setSubmitLoader(false);
  };
  const renderStatusFunc = (status) => {
    if (status == "draft") {
      return <button className="btn btn-warning btn-sm">Draft</button>;
    }
    if (status == "published") {
      return <button className="btn btn-success btn-sm">Published</button>;
    }
    if (status == "archived") {
      return <button className="btn btn-secondary btn-sm">Archived</button>;
    }
  };
  const [categoryList, setCategoryList] = useState([]);
  const getCategoryListFunc = async () => {
    try {
      let response = await getBlogCategoryListServ({});
      setCategoryList(response?.data?.data);
    } catch (error) {}
  };
  useEffect(() => {
    getCategoryListFunc();
  }, []);
  const tableNav = [
    {
      name: "Gift Vouchers",
      path: "/coupon-git-vouchers-list",
    },
    {
      name: "First Ride",
      path: "/coupon-first-ride-list",
    },
    {
      name: "Welcome Vouchers",
      path: "/coupon-welcome-vouchers-list",
    },
    {
      name: "City To City Offers",
      path: "/coupon-city-to-city-list",
    },
    {
      name: "Ride Completion",
      path: "/coupon-ride-completion-list",
    },
  ];
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
          minWidth: "1800px",
        }}
      >
        {/* top nav started  */}
        <TopNav
          navItems={navItems}
          navColor="#fff"
          navBg="#000000"
          divideRowClass="col-xl-8 col-lg-8 col-md-12 col-12"
          selectedItem="Coupons"
          sectedNavBg="#FF4500"
          selectedNavColor="#fff"
        />
        {/* top nav ended  */}

        {/* table List started */}
        <div className="tableMain">
          <TableNav
            tableNav={tableNav}
            selectedItem="City To City Offers"
            sectedItemBg="#353535"
            selectedNavColor="#fff"
          />
          <div
            className="tableBody py-2 px-4 borderRadius50All"
            style={{ background: "#353535" }}
          >
            <div style={{ margin: "20px 10px" }}>
              <div className="row my-4">
                <div className="col-2">
                  <button
                    style={{
                      borderRadius: "20px",
                      border:
                        payload?.category_id == 3
                          ? "2px solid #FF4500"
                          : "none",
                    }}
                    className="btn-primary btn w-100"
                    onClick={() => setPayload({ ...payload, category_id: "3" })}
                  >
                    City Share 25
                  </button>
                </div>
                <div className="col-2">
                  <button
                    style={{
                      borderRadius: "20px",
                      border:
                        payload?.category_id == 4
                          ? "2px solid #FF4500"
                          : "none",
                    }}
                    className="btn-success btn w-100"
                    onClick={() => setPayload({ ...payload, category_id: "4" })}
                  >
                    City Share 50
                  </button>
                </div>
              </div>
              <div className="row my-4">
                <div className="col-3">
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
                    <option value="">Select Status</option>
                    <option value="active">Active</option>
                    <option value="deactive">Inactive</option>
                  </select>
                </div>
                <div className="col-3">
                  <select
                    className="form-control"
                    style={{ borderRadius: "20px" }}
                    onChange={(e) =>
                      setPayload({ ...payload, user_type: e?.target?.value })
                    }
                  >
                    <option value="">Select User Type</option>

                    <option value="user">User</option>
                    <option value="driver">Driver</option>
                  </select>
                </div>
                <div className="col-3">
                  <button
                    className="btn btn-success w-100"
                    style={{
                      background: "#139F01",
                      borderRadius: "20px",
                      opacity: "0.4",
                    }}
                  >
                    Add Coupon
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
                    <th scope="col">Category Name</th>
                    <th scope="col">User Type</th>
                    <th scope="col">Coupon Code</th>
                    <th scope="col">Coupon Amount</th>
                    <th scope="col">Start City</th>
                    <th scope="col">End City</th>
                    <th scope="col">Valid Till</th>
                    <th scope="col">Used</th>
                    <th scope="col">Used By</th>
                    <th scope="col">Used At</th>
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
                                {parseInt(pageData?.current_page - 1) * 20 +
                                  i +
                                  1}
                              </td>
                              <td>{v?.category_details?.name}</td>
                              <td>
                                {v?.user_type == "user" ? "User" : "Driver"}
                              </td>
                              <td>{v?.coupon_code}</td>
                              <td>
                                {v?.category_details?.applicable_benefits}
                              </td>
                              <td>{v?.start_city}</td>
                              <td>{v?.end_city}</td>
                              <td>{v?.valid_till}</td>
                              <td>{v?.is_used ? "Yes" : "No"}</td>
                              <td>{v?.used_by ? v?.used_by : "N/A"}</td>

                              <td>{v?.used_at ? v?.used_at : "N/A"}</td>
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
                                    style={{ width: "70px" }}
                                    onClick={() =>
                                      setEditFormData({
                                        id: v?.id,
                                        valid_till: v?.valid_till,
                                        status: v?.status,
                                      })
                                    }
                                  >
                                    Edit
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
              {renderPage()}
              {list?.length == 0 && !showSkelton && (
                <NoRecordFound theme="light" />
              )}
            </div>
          </div>
        </div>
        {/* table List ended */}
      </section>
      {/* sectionLayout ended */}
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
                      id: "",
                      valid_till: "",
                      status: "",
                      coupon_amount: "",
                    });
                  }}
                ></i>
              </div>
              <h6 className="mb-4">Edit Coupon</h6>
              <div className="modal-body p-0">
                <label>Valid Till</label>
                <input
                  className="form-control w-100 mb-2"
                  placeholder=""
                  type="date"
                  value={editFormData?.valid_till}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      valid_till: e?.target.value,
                    })
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
                  <option value="deactive">Inactive</option>
                </select>
                <label>Start City</label>
                <select
                  className="form-control"
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      start_city: e?.target?.value,
                    })
                  }
                  value={editFormData?.start_city}
                >
                  <option value="">Select</option>
                  {cityList?.map((v, i) => {
                    return <option value={v?.city}>{v?.city}</option>;
                  })}
                </select>
                <label>End City</label>
                <select
                  className="form-control"
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      end_city: e?.target?.value,
                    })
                  }
                  value={editFormData?.end_city}
                >
                  <option value="">Select</option>
                  {cityList?.map((v, i) => {
                    return <option value={v?.city}>{v?.city}</option>;
                  })}
                </select>

                {editFormData?.valid_till && editFormData?.status && editFormData?.start_city && editFormData?.end_city ? (
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
                      onClick={() => updateCouponFunction()}
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
      {editFormData?.id && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}

export default CityToCityCoupon;
