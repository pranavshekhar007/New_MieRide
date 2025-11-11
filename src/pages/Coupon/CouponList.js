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
import {getCouponListServ, getCouponCategoryListServ} from "../../services/coupon.service"
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import NoRecordFound from "../../components/NoRecordFound";
import { Image_Base_Url } from "../../utils/api_base_url_configration";
import Pagination from "../../components/Pagination";
import NewSidebar from "../../components/NewSidebar";
function CouponList() {
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
        per_page: 10,
        page_no: 1,
       search_key: "",
      });
      const [pageData, setPageData] = useState({
        total_pages: "",
        current_page: "",
      });
  const [list, setList] = useState([]);
  const getListItemsFunction = async () => {
    setShowSkelton(true);
    const { status, category_id, ...restPayload } = payload || {};
    const updatedPayload = {
      ...restPayload,
      ...(status && { status }),
      ...(category_id && { category_id }),
    };
    try {
      let response = await getCouponListServ(updatedPayload);
      console.log(response?.data?.data)
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

   
    const getCategoryList = async () => {
      
      try {
        let response = await getCouponCategoryListServ({});
        setCategoryList(response?.data?.data);
      } catch (error) {}
   
    };
    useEffect(() => {
      getCategoryList();
    }, []);
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
  // const getCategoryListFunc = async () => {
  //   try {
  //     let response = await getCouponListServ({});
  //     setCategoryList(response?.data?.data);
  //   } catch (error) {}
  // };
  // useEffect(() => {
  //   getCategoryListFunc();
  // }, []);
  const onPageChange = (page) => {
    setPayload({
      ...payload,
      page_no: page,
    });
  };
  const onPerPageChange = (per_page) => {
    setPayload({
      ...payload,
      per_page: per_page,
      page_no: 1, // optionally reset to first page on per page change
    });
  };
    return(
    <div className="mainBody">
      <NewSidebar selectedItem="Coupons" />
      <div className="contentLayout">
        <div className="bgWhite borderRadius30 p-4 minHeight100vh">
          <div className="sticky-top bgWhite">
            
          </div>
          <div className="vh-100 bgDark d-flex justify-content-center align-items-center borderRadius30 ">
            <p
              style={{
                color: "#FFF",
                textAlign: "center",
                fontFamily: "Poppins",
                fontSize: "50px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "normal",
              }}
            >
              Work In Progress
            </p>
          </div>
        </div>
      </div>
    </div>
  )
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
          <div
            className="tableBody py-2 px-4 borderRadius50All"
            style={{ background: "#363435" }}
          >
            <div style={{ margin: "20px 10px" }}>
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
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div className="col-3">
                  <select
                    className="form-control"
                    style={{ borderRadius: "20px" }}
                    onChange={(e) =>
                      setPayload({ ...payload, category_id: e?.target?.value })
                    }
                  >
                    <option value="">Select Category</option>
                    {categoryList?.map((v, i) => {
                      return <option value={v?.id}>{v?.name}</option>;
                    })}
                  </select>
                </div>
                <div className="col-3">
                  <button
                    className="btn btn-success w-100"
                    style={{ background: "#139F01", borderRadius: "20px" }}
                    onClick={() =>alert("Work in progress")}
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
                    <th scope="col">Coupon Code</th>
                    <th scope="col">Category</th>
                    <th scope="col">User Type</th>
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
                                {i + 1}.
                              </td>
                              <td>{v?.coupon_code}</td>
                              <td>{v?.category_details?.name}</td>
                              <td>{v?.user_type}</td>
                              <td>{v?.start_city}</td>
                              <td>{v?.end_city}</td>
                              <td>{v?.valid_till}</td>
                              <td>{v?.is_used ? "Yes":"No"}</td>
                              <td>{v?.used_by}</td>
                              <td>{v?.used_at}</td>
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
                                      navigate("/update-blog/" + v?.id)
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
              <Pagination
            current_page={pageData?.current_page}
            onPerPageChange={onPerPageChange}
            last_page={pageData?.total_pages}
            per_page={payload?.per_page}
            onPageChange={onPageChange}
          />
            </div>
          </div>
        </div>
        {/* table List ended */}
      </section>
      {/* sectionLayout ended */}
    </div>
  );
}

export default CouponList;
