import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import TableNav from "../../components/TableNav";
import { getUserQuickServ } from "../../services/fundsManagement.services";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import moment from "moment";
import { useGlobalState } from "../../GlobalProvider";
import NoRecordFound from "../../components/NoRecordFound";
import { getGtChargeList, addGtChargeServ } from "../../services/priceAndCity.services";
import { toast } from "react-toastify";
import FundManagementNav from "../../components/FundManagementNav";
import Pagination from "../../components/Pagination";
import NewSidebar from "../../components/NewSidebar";
import CustomTopNav from "../../components/CustomTopNav";
import CustomPagination from "../../components/CustomPazination";
function UserQuickDeposite() {
  const { setGlobalState, globalState } = useGlobalState();
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
  const [payload, setPayload] = useState({
      page_no: 1,
      order: "",
      search_key: "",
      status: "",
      date: "",
      per_page:10
    });
  const [pageData, setPageData] = useState({
      total_pages: "",
      current_page: "",
    });
  const navItems = [
    [
      {
        name: "Interac E-Transfer",
        path: "/user-interac-deposite",
        notificationLength: globalState?.notificationList?.filter((v) => {
          return v.category == "interac" && v?.is_read == 0;
        })?.length,
      },
      {
        name: "Quick Deposit",
        path: "/user-quick-deposite",
      },
      {
        name: "Email",
        path: "/integrated-email",
      },
    ],

    [
      {
        name: "Weekly Withdrawal",
        path: "/driver-weekly-withdraw",
      },

      {
        name: "Quick Withdrawal",
        path: "/driver-quick-withdraw",
        notificationLength: globalState?.notificationList?.filter((v) => {
          return v.category == "quick_withdraw" && v?.is_read == 0;
        })?.length,
      },
      {
        name: "Switch",
        path: "/funds-switch",
        notificationLength: globalState?.notificationList?.filter((v) => {
          return v.category == "switch_account" && v?.is_read == 0;
        })?.length,
      },
    ],
  ];
  
  const [data, setData] = useState([]);
  const [showSkelton, setShowSkelton] = useState(false);
  const [staticsData, setStaticsData] = useState({
    total: "",
    monthly: "",
    today: "",
  });
  const getUserInteractETransferFund = async () => {
    setShowSkelton(true);
    try {
      let response = await getUserQuickServ(payload);
      if (response?.data?.statusCode == "200") {
        setStaticsData({
          total: parseInt(response?.data?.total),
          monthly: response?.data?.monthly_total,
          today: response?.data?.today_total,
        });
         setPageData({
          total_pages: response?.data?.total_pages,
          current_page: response?.data?.current_page,
        });
        setData(response?.data);
      }
    } catch (error) {}
    setShowSkelton(false);
  };
  useEffect(() => {
    getUserInteractETransferFund();
  }, [payload]);
  const [showGtPopup, setShowGtPopup] = useState(false);
  const [gtFormData, setGtFormData] = useState({
    gt_charge: "",
    category_id: "1",
    is_editable: false,
  });

  const handleGetCommissionListFunc = async () => {
    try {
      let response = await getGtChargeList({ category_id: 1 });
      if (response?.data?.statusCode == "200") {
        setGtFormData(response?.data?.data[0]);
        console.log(response?.data?.data[0]);
      }
    } catch (error) {}
  };
  useEffect(() => {
    handleGetCommissionListFunc();
  }, []);

  const handleGtChargeAddFunc = async () => {
    console.log(gtFormData)
    try {
      let response = await addGtChargeServ({...gtFormData, category_id:"1"});
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        setShowGtPopup(false)
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
  };
  const [popupdetails, setShowPopupdetails] = useState({
      show: false,
      showDateInput: true,
    });
     useEffect(() => {
      if(!popupdetails?.show){
        getUserInteractETransferFund();
      }
    }, [payload, popupdetails]);
   return (
    <div className="mainBody">
      <NewSidebar selectedItem="Funds Management" />
      <div className="contentLayout">
        <div className="bgWhite borderRadius30 p-4 minHeight100vh">
          <CustomTopNav navItems={navItems} selectedNav="Quick Deposit" />
          <div className="row marginVertical15 d-flex align-items-center">
            <div className="col-7 row m-0 p-0">
              <div className="col-4">
                <div className="fundStaticsBtnDiv">
                  <p>Total :- </p>
                  <h5>${staticsData?.total}</h5>
                </div>
              </div>
              <div className="col-4">
                <div className="fundStaticsBtnDiv">
                  <p>Monthly :- </p>
                  <h5>${staticsData?.monthly}</h5>
                </div>
              </div>
              <div className="col-4">
                <div className="fundStaticsBtnDiv">
                  <p>Today :- </p>
                  <h5>${staticsData?.today}</h5>
                </div>
              </div>
            </div>
            <div className="col-5 row m-0 p-0">
              <div className="col-9">
                <div className="fundSearchBtn">
                  <img src="https://cdn-icons-png.flaticon.com/128/2811/2811790.png" />
                  <input onChange={(e)=>setPayload({...payload, search_key:e?.target?.value})}/>
                </div>
              </div>
              <div className="col-3">
                <div className="fundSearchBtn d-flex justify-content-center" onClick={() =>
                    setShowPopupdetails({ ...popupdetails, show: true })
                  }>
                  <img src="https://cdn-icons-png.flaticon.com/128/7693/7693332.png" />
                  <span>Filter</span>
                </div>
              </div>
            </div>
          </div>
          <div
            className="tableOuterContainer bgDark"
          >
            <div >
              <table className="table">
                <thead className="">
                  <tr >
                    <th
                      scope="col"
                      style={{ borderRadius: "24px 0px 0px 24px" }}
                    >
                      Sr. No
                    </th>
                    <th scope="col">User ID</th>
                    <th scope="col">Username</th>
                    <th scope="col">Date & Time</th>

                    <th scope="col">Amount</th>
                    <th scope="col">Payment Method</th>
                    <th scope="col">Transaction</th>
                    <th
                      scope="col"
                      style={{ borderRadius: "0px 24px 24px 0px" }}
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <div className="pt-4"></div>
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
                    : data?.data?.map((v, i) => {
                      return (
                        <>
                          <tr className="bgWhite ">
                            <td
                              scope="row"
                              style={{
                                borderTopLeftRadius: "30px",
                                borderBottomLeftRadius: "30px",
                              }}
                            >
                              {i + 1 + (pageData?.current_page - 1) * 10}
                            </td>
                            <td>{v?.user_id} </td>
                            <td>
                              {v?.user?.first_name + " " + v?.user?.last_name}
                            </td>
                            <td>
                              {moment(v.created_date).format("DD MMM, YYYY")}{" "}
                              ({v?.created_time})
                            </td>

                            <td>
                              <div
                                className="py-2 mx-2 "
                                style={{
                                  background: "#D0FF13",
                                  color: "#1C1C1E",
                                  borderRadius: "5px",
                                  height:"30px"
                                }}
                              >
                                $ {v?.amount}
                              </div>
                            </td>
                            <td>
                              <div className="d-flex justify-content-center">
                                <div
                                  className="py-2 mx-2"
                                  style={{
                                    background:
                                     "#353535",
                                    color: "#fff",
                                    borderRadius: "5px",
                                    height:"30px",
                                    width:"100px"
                                  }}
                                >
                                  {v?.source}
                                </div>
                              </div>
                              
                            </td>
                            <td>
                               {v?.transaction_id}
                            </td>
                            <td
                              style={{
                                borderTopRightRadius: "30px",
                                borderBottomRightRadius: "30px",
                              }}
                            >
                              <div
                                  className="py-2 mx-2 me-4"
                                  style={{
                                    background:
                                      v?.status == "1"
                                        ? "#00A431"
                                        : v?.status == "0"
                                        ? "#FFB500"
                                        : "#DD4132",
                                    color: "#fff",
                                    borderRadius: "5px",
                                    height:"30px"                               }}
                                >
                                  {v?.status === "1" ? (
                                    <span>Accepted</span>
                                  ) : v?.status === "0" ? (
                                    <span>Pending</span>
                                  ) : (
                                    <span>Rejected</span>
                                  )}
                                </div>
                            </td>
                          </tr>
                          <div className={i==data?.data?.length-1 ? " " : " pb-3"}></div>
                        </>
                      );
                    })}
                </tbody>
              </table>
              {data.data?.length == 0 && !showSkelton && (
                <NoRecordFound theme="light" marginTop="-20px" />
              )}
            </div>
           
          </div>
           <CustomPagination
            current_page={pageData?.current_page}
            onPerPageChange={onPerPageChange}
            last_page={pageData?.total_pages}
            per_page={payload?.per_page}
            onPageChange={onPageChange}
          />
        </div>
      </div>
      {popupdetails?.show && (
        <div
          className="modal fade show d-flex align-items-center justify-content-center "
          tabIndex="-1"
        >
          <div className="modal-dialog " style={{ width: "390px" }}>
            <div
              className="modal-content "
              style={{ background: "transparent", border: "none" }}
            >
              <div className="d-flex justify-content-between align-items-center fundPopupHeading p-4 pb-5" >
                <h5 className="mb-0">Filter</h5>
                <img src="https://cdn-icons-png.flaticon.com/128/5254/5254940.png" onClick={() => {
                      setShowPopupdetails({ ...popupdetails, show: false });
                      setPayload({
                        page_no: 1,
                        search_key: "",
                        status: "",
                        fromDate: "",
                        toDate: "",
                      });
                    }}/>
              </div>

              <div className="modal-body fundPopupBody">
                <div className="row" style={{ height: "230px" }}>
                  <div className="col-5 m-0 ">
                    <div>
                      <p
                        onClick={() =>
                          setShowPopupdetails({
                            ...popupdetails,
                            showDateInput: true,
                          })
                        }
                        className="mb-0"
                        style={{
                          cursor: "pointer",
                          background: popupdetails?.showDateInput
                            ? "#E5E5E5"
                            : "#fff",
                        }}
                      >
                        Date
                      </p>
                    </div>
                    <div>
                      <p
                        onClick={() =>
                          setShowPopupdetails({
                            ...popupdetails,
                            showDateInput: false,
                          })
                        }
                        className="mb-0"
                        style={{
                          cursor: "pointer",
                          background: !popupdetails?.showDateInput
                            ? "#E5E5E5"
                            : "#fff",
                        }}
                      >
                        Status
                      </p>
                    </div>
                  </div>
                  <div className="col-7 p-0 m-0">
                    {popupdetails?.showDateInput ? (
                      <div className="px-4 ">
                        <div>
                          <input
                            type="date"
                            onChange={(e) =>
                              setPayload({
                                ...payload,
                                fromDate: e?.target.value,
                              })
                            }
                          />
                        </div>
                        <p
                          className="mb-0 text-center"
                          style={{ fontSize: "16px", fontWeight: "500" }}
                        >
                          To
                        </p>
                        <div>
                          <input
                            type="date"
                            onChange={(e) =>
                              setPayload({
                                ...payload,
                                toDate: e?.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="px-4 ">
                        <div>
                          <h5>Select Status</h5>
                        </div>
                        <div className="d-flex align-items-center mt-2">
                          <label>
                            <input
                              type="radio"
                              value={1}
                              checked={payload.status == 1}
                              onChange={(e) =>
                                setPayload({ ...payload, status: 1 })
                              }
                            />
                          </label>
                          <h6 className="mb-1 ms-2">Accepted</h6>
                        </div>
                        <div className="d-flex align-items-center">
                          <label>
                            <input
                              type="radio"
                              value={0}
                              checked={payload.status == 0}
                              onChange={(e) =>
                                setPayload({ ...payload, status: 0 })
                              }
                            />
                          </label>
                          <h6 className="mb-1 ms-2">New Request</h6>
                        </div>
                        <div className="d-flex align-items-center">
                          <label>
                            <input
                              type="radio"
                              value={-1}
                              checked={payload.status == -1}
                              onChange={(e) =>
                                setPayload({ ...payload, status: -1 })
                              }
                            />
                          </label>
                          <h6 className="mb-1 ms-2">Rejected</h6>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="d-flex justify-content-between fundManagementActionGroup">
                  <button
                    onClick={() => {
                      setShowPopupdetails({ ...popupdetails, show: false });
                      setPayload({
                        page_no: 1,
                        search_key: "",
                        status: "",
                        fromDate: "",
                        toDate: "",
                      });
                    }}
                  >
                    Clear
                  </button>
                  <button
                    className="bgDark textWhite"
                    onClick={() =>
                      setShowPopupdetails({ ...popupdetails, show: false })
                    }
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {popupdetails?.show && <div className="modal-backdrop fade show"></div>}
    </div>
  );
  return (
    <div className="main_layout  bgBlack d-flex">
      {/* sidebar started */}
      <Sidebar selectedItem="Funds Management" />
      {/* sidebar ended */}

      {/* sectionLayout started */}
      <section
        className="section_layout"
        style={{
          marginLeft: globalState?.isFillSidebarWidth100 ? "260px" : "80px",
          padding: "0px 30px 45px 30px",
        }}
      >
        {/* top nav started  */}
         <div className="sticky-top bg-light" style={{ paddingTop: "45px" }}>
          <FundManagementNav
            navItems={navItems}
            navColor="#fff"
            divideRowClass="col-xl-6 col-lg-6 col-md-12 col-12"
            selectedItem="Quick Deposit"
            sectedNavBg="#D0FF13"
            selectedNavColor="#353535"
            navBg="#000"
          />
        </div>
        {/* top nav ended  */}
        {/* table List started */}
         <div className="tableMain">
          {/* <TableNav tableNav={tableNav} selectedItem="Interac E-Transfer" sectedItemBg="#f2fbff" /> */}
          <div className="row mx-0 p-0 justify-content-between marginY35 fundfManagementStaticsDiv">
            <div className="col-10 row m-0 p-0">
              <div className="col-lg-4  m-0 ">
              <div className="d-flex justify-content-center align-items-center whiteBtn">
                <p className="mb-0 ">Total Quick Deposit :-</p>
                <p className="mb-0 fundCount">${staticsData?.total}</p>
              </div>
            </div>
            <div className="col-lg-4 m-0">
              <div className="d-flex justify-content-center align-items-center whiteBtn">
                <p className="mb-0">Monthly Quick Deposit :-</p>
                <p className="mb-0 fundCount">${staticsData?.monthly}</p>
              </div>
            </div>
            <div className="col-lg-4 m-0 ">
              <div className="d-flex justify-content-center align-items-center whiteBtn">
                <p className="mb-0">Today's Quick Deposit :-</p>
                <p className="mb-0 fundCount">${staticsData?.today}</p>
              </div>
            </div>
            </div>
            <div className="col-lg-2 m-0  ">
              <div className="d-flex justify-content-center align-items-center whiteBtn h-100" onClick={() => setShowGtPopup(true)} style={{background:"#353535", cursor:"pointer"}}>
                <p className="mb-0 " style={{color:"#fff"}}>G.T Charges</p>
                
              </div>
            </div>
          </div>
          <div className="row mx-0 p-0 justify-content-around marginY35 ">
            <div className="col-lg-3 m-0   ">
              <div className="d-flex align-items-center fundInputBox">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/2801/2801881.png"
                  className="ms-2"
                  style={{ height: "18px" }}
                />
                <input
                  className="form-control"
                  placeholder="Search"
                  onChange={(e) =>
                    setPayload({ ...payload, search_key: e?.target.value })
                  }
                />
              </div>
            </div>
            <div className="row col-lg-9 m-0 p-0">
              <div className="col-lg-3   ">
              <div className="fundInputBox">
                <select
                  className="form-control"
                  onChange={(e) =>
                    setPayload({ ...payload, status: e?.target.value })
                  }
                >
                  <option value="">Status</option>
                  <option value="1">Accepted</option>
                  <option value="-1">Rejected</option>
                  <option value="0">Pending</option>
                </select>
              </div>
            </div>
             <div className="col-lg-3   ">
              <div className="fundInputBox">
                <select
                  className="form-control"
                  onChange={(e) =>
                    setPayload({ ...payload, status: e?.target.value })
                  }
                >
                  <option value="">Payment Method</option>
                  <option value="">Card</option>
                  <option value="">Google Pay</option>
                  
                </select>
              </div>
            </div>
            <div className="col-lg-3  ">
              <div className="fundInputBox">
                <select
                  className="form-control"
                  onChange={(e) =>
                    setPayload({ ...payload, order: e?.target.value })
                  }
                >
                  <option value="">Sort</option>
                  <option value="desc">Newest To Oldest</option>
                  <option value="asc">Oldest To Newest</option>
                </select>
              </div>
            </div>
            <div className="col-lg-3 ">
              <div className="fundInputBox d-flex align-items-center">
                <span className="ms-2"> Date</span>
                <input
                  className="form-control ms-2"
                  type="date"
                  placeholder="Search"
                  style={{ border: "none" }}
                  onChange={(e) =>
                    setPayload({
                      ...payload,
                      date: moment(e.target.value).format("YYYY-MM-DD"),
                    })
                  }
                />
              </div>
            </div>
            </div>
          </div>
          
          <div
            className="tableBody py-1 px-3 borderRadius30All"
            style={{ background: "#363435" }}
          >
            <div style={{ margin: "20px 10px" }}>
              <table className="table bookingTable outOfArea">
                <thead>
                  <tr style={{ background: "#D0FF13", color: "#000" }}>
                    <th
                      scope="col"
                      style={{ borderRadius: "24px 0px 0px 24px" }}
                    >
                      Sr. No
                    </th>
                    <th scope="col">User ID</th>
                    <th scope="col">Username</th>
                    <th scope="col">Date & Time</th>

                    <th scope="col">Amount</th>
                    <th scope="col">Payment Method</th>
                    <th scope="col">Transaction ID</th>
                    <th
                      scope="col"
                      style={{ borderRadius: "0px 24px 24px 0px" }}
                    >
                      Status
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
                    : data?.data?.map((v, i) => {
                        return (
                          <>
                            <tr className="bg-light mb-2">
                              <td
                                scope="row"
                                style={{
                                  borderTopLeftRadius: "30px",
                                  borderBottomLeftRadius: "30px",
                                }}
                              >
                                 {i + 1 + (pageData?.current_page - 1) * 10}
                              </td>
                              <td>{v?.user_id} </td>
                              <td>
                                {v?.user?.first_name + " " + v?.user?.last_name}
                              </td>
                              <td>
                                {moment(v.created_date).format("DD MMM, YYYY")}{" "}
                                ({v?.created_time})
                              </td>

                              <td>
                                <div
                                  className="py-2 mx-2"
                                  style={{
                                    background: "#D0FF13",
                                    color: "#1C1C1E",
                                    borderRadius: "5px",
                                  }}
                                >
                                  $ {v?.amount}
                                </div>
                              </td>
                              <td>
                                <div
                                  className="py-2 mx-2"
                                  style={{
                                    background:
                                     "#353535",
                                    color: "#fff",
                                    borderRadius: "5px",
                                  }}
                                >
                                  {v?.source}
                                </div>
                              </td>
                              <td>
                                {v?.transaction_id}
                              </td>
                              <td  style={{
                                  borderTopRightRadius: "30px",
                                  borderBottomRightRadius: "30px",
                                }}>
                                <div
                                  className="py-2 mx-2 me-4"
                                  style={{
                                    background:
                                      v?.status == "1"
                                        ? "#00A431"
                                        : v?.status == "0"
                                        ? "#FFB500"
                                        : "#DD4132",
                                    color: "#fff",
                                    borderRadius: "5px",
                                  }}
                                >
                                  {v?.status === "1" ? (
                                    <span>Accepted</span>
                                  ) : v?.status === "0" ? (
                                    <span>Pending</span>
                                  ) : (
                                    <span>Rejected</span>
                                  )}
                                </div>
                              </td>
                            </tr>
                            <div className="py-2"></div>
                          </>
                        );
                      })}
                </tbody>
              </table>
              {data.data?.length == 0 && !showSkelton && (
                <NoRecordFound theme="light" />
              )}
              
            </div>
            
          </div>
          <Pagination
            current_page={pageData?.current_page}
            onPerPageChange={onPerPageChange}
            last_page={pageData?.total_pages}
            per_page={payload?.per_page}
            onPageChange={onPageChange}
          />
        </div>
        {/* table List ended */}
      </section>
      {/* sectionLayout ended */}
      {showGtPopup && (
        <div className="modal fade show d-flex align-items-center justify-content-center " tabIndex="-1">
          <div className="modal-dialog shadow" style={{ width: "400px" }}>
            <div className="modal-content  p-4">
              <div className="d-flex justify-content-between align-items-center pb-3">
                <h5 className="mb-0">Gateway Terminal Charges</h5>
                <i
                  className="fa fa-close text-secondary"
                  onClick={() => {
                    setShowGtPopup(false);
                  }}
                ></i>
              </div>

              <div className="modal-body p-0">
                <div className="">
                  <div className="d-flex justify-content-between align-items-center my-4">
                    <p>Parcentage</p>
                    <div
                      className="d-flex justify-content-between align-items-center commissionInput bg-light border"
                      style={{ width: "60%",  }}
                    >
                      <input
                        className="bg-light"
                        placeholder="Enter Here"
                        
                        value={gtFormData?.gt_charge}
                        onChange={(e) => setGtFormData({ ...gtFormData, gt_charge: e.target.value })}
                      />
                      <p className="mb-0">%</p>
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-center ">
                  <button className="btn btn-primary  w-100" style={{ background: "#139F01", border: "none", opacity:gtFormData?.gt_charge ? "1": "0.5" }} onClick={gtFormData?.gt_charge && handleGtChargeAddFunc }>
                    Save
                  </button>
                </div>
                <div></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showGtPopup && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}

export default UserQuickDeposite;
