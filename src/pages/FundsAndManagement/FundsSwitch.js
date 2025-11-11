import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import TableNav from "../../components/TableNav";
import { useGlobalState } from "../../GlobalProvider";
import {
  listSwitchAccountServ,
  updateSwitchAccountServ,
} from "../../services/fundsManagement.services";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import moment from "moment";
import NoRecordFound from "../../components/NoRecordFound";
import FundManagementNav from "../../components/FundManagementNav";
import Pagination from "../../components/Pagination";
import NewSidebar from "../../components/NewSidebar";
import CustomTopNav from "../../components/CustomTopNav";
import CustomPagination from "../../components/CustomPazination";
function FundsSwitch() {
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
  const [list, setList] = useState([]);
  const [showSkelton, setShowSkelton] = useState(false);
  const getSwitchFundList = async () => {
    if (list?.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await listSwitchAccountServ(payload);
      if (response?.data?.statusCode == "200") {
        setList(response?.data?.data);
        setPageData({
          total_pages: response?.data?.total_pages,
          current_page: response?.data?.current_page,
        });
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
    setShowSkelton(false);
  };
  useEffect(() => {
    getSwitchFundList();
  }, [payload]);

  const [popupData, setPopupData] = useState(null);
  
  const handleUpdateStatus = async (formData) => {
    try {
      let response = await updateSwitchAccountServ(formData);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        getSwitchFundList();
      } else {
        toast?.error(response?.data?.error);
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
  };
  return (
    <div className="mainBody">
      <NewSidebar selectedItem="Funds Management" />
      <div className="contentLayout">
        <div className="bgWhite borderRadius30 p-4 minHeight100vh">
          <CustomTopNav navItems={navItems} selectedNav="Switch" />
          <div className="row marginVertical15 d-flex align-items-center">
            
            <div className="col-12 row m-0 p-0">
              <div className="col-3">
                <div className="fundSearchBtn">
                  <img src="https://cdn-icons-png.flaticon.com/128/2811/2811790.png" />
                  <input
                    placeholder="Search"
                    onChange={(e) =>
                      setPayload({ ...payload, search_key: e?.target?.value })
                    }
                  />
                </div>
              </div>
              <div className="col-3">
                <div className="fundSearchBtn d-flex justify-content-center">
                  <select>
                    <option>Status</option>
                  </select>
                </div>
              </div>
               <div className="col-3">
                <div className="fundSearchBtn d-flex justify-content-center">
                  <select>
                    <option>Date</option>
                  </select>
                </div>
              </div>
               <div className="col-3">
                <div className="fundSearchBtn d-flex justify-content-center">
                  <select>
                    <option>Sort</option>
                  </select>
                </div>
              </div>
              
            </div>
          </div>
          <div className="tableOuterContainer bgDark">
            <div>
              <table className="table">
                <thead className="">
                  <tr>
                    <th
                      scope="col"
                      style={{ borderRadius: "24px 0px 0px 24px" }}
                    >
                      Sr. No
                    </th>
                    <th scope="col">User ID</th>
                    <th scope="col">Username</th>
                    <th scope="col">Switch From</th>
                    <th scope="col">Switch To</th>
                    <th scope="col">Date & Time</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Status</th>

                    <th
                      scope="col"
                      style={{ borderRadius: "0px 24px 24px 0px" }}
                    >
                      Action
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
                            
                            <td>
                              <Skeleton width={100} />
                            </td>
                          </tr>
                        );
                      })
                    : list?.map((v, i) => {
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
                              <td>{v?.driver_id} </td>

                              <td>
                                {v?.driver?.first_name +
                                  " " +
                                  v?.driver?.last_name}
                              </td>
                              <td>
                                <div className="d-flex justify-content-center">
                                  {v?.switch_from == "0" ? (
                                    <div
                                      className="py-2 mx-2 "
                                      style={{
                                        background: "#FFB500",
                                        color: "#fff",
                                        borderRadius: "5px",
                                        height: "30px",
                                        width: "120px",
                                      }}
                                    >
                                      Interac E-Transfer
                                    </div>
                                  ) : (
                                    <div
                                      className="py-2 mx-2 "
                                      style={{
                                        background: "#E5E5E5",
                                        color: "#000",
                                        borderRadius: "5px",
                                        height: "30px",
                                        width: "120px",
                                      }}
                                    >
                                      Direct Deposite
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td>
                                <div className="d-flex justify-content-center">
                                  {v?.switch_to == "0" ? (
                                    <div
                                      className="py-2 mx-2 "
                                      style={{
                                        background: "#FFB500",
                                        color: "#fff",
                                        borderRadius: "5px",
                                        height: "30px",
                                        width: "120px",
                                      }}
                                    >
                                      Interac E-Transfer
                                    </div>
                                  ) : (
                                    <div
                                      className="py-2 mx-2 "
                                      style={{
                                        background: "#E5E5E5",
                                        color: "#000",
                                        borderRadius: "5px",
                                        height: "30px",
                                        width: "120px",
                                      }}
                                    >
                                      Direct Deposite
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td>
                                {moment(v.created_date).format("DD MMM, YYYY")}{" "}
                                ({moment(v?.created_at).format("hh:mm A")})
                              </td>

                              <td>
                                <div className="d-flex justify-content-center ">
                                  <img
                                    src="https://cdn-icons-png.flaticon.com/128/159/159604.png"
                                    alt="proof"
                                    style={{
                                      height: "25px",
                                      margin: "0px 6px",
                                      opacity: "0.8",
                                    }}
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="d-flex justify-content-center">
                                 
                                    <div
                                      className="py-2 mx-2 "
                                      style={{
                                        background:  v?.status == "1"
                                        ? "#00A431"
                                        : v?.status == "0"
                                        ? "#FFB500"
                                        : "#DD4132",
                                        color: "#fff",
                                        borderRadius: "5px",
                                        height: "30px",
                                        width: "90px",
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
                                 
                                </div>
                              </td>
                              <td
                                style={{
                                  borderTopRightRadius: "30px",
                                  borderBottomRightRadius: "30px",
                                }}
                              >
                                <div className="d-flex justify-content-center align-items-center ">
                                  <select
                                    value={v?.status}
                                    onChange={(e) =>
                                      handleUpdateStatus({
                                        id: v?.id,
                                        status: e.target.value,
                                      })
                                    }
                                  >
                                    <option value="">Select Action</option>
                                    <option value="1">Accept</option>
                                    <option value="-1">Reject</option>
                                    <option value="0">Pending</option>
                                  </select>
                                </div>
                              </td>
                            </tr>
                            <div
                              className={i == list.length - 1 ? " " : " pb-3"}
                            ></div>
                          </>
                        );
                      })}
                </tbody>
              </table>

              {list.length == 0 && !showSkelton && (
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
        {/* sectionLayout started */}
        <div className="sticky-top bg-light" style={{ paddingTop: "45px" }}>
          <FundManagementNav
            navItems={navItems}
            navColor="#fff"
            divideRowClass="col-xl-6 col-lg-6 col-md-12 col-12"
            selectedItem="Switch"
            sectedNavBg="#D0FF13"
            selectedNavColor="#353535"
            navBg="#000"
          />
        </div>
        {/* top nav ended  */}
        {/* table List started */}
        {/* <div className="tableMain">
          
          <div className="tableBody py-2 px-4 borderRadius50All" style={{ background: "#f2fbff" }}>
            
            <div style={{ margin: "20px 10px"  }}>
              <table className="table">
                <thead >
                  <tr style={{ background: "#DCE4E7", }}>
                    <th scope="col" style={{ borderRadius: "8px 0px 0px 8px" }}>
                      Sr. No
                    </th>
                    <th scope="col">First Name</th>
                    <th scope="col">Last Name</th>
                    <th scope="col">Switch From</th>
                    <th scope="col">Switch To</th>
                    <th scope="col">Date</th>
                    <th scope="col">Profile</th>
                    <th scope="col">Status</th>
                    <th scope="col" style={{ borderRadius: "0px 8px 8px 0px" }}>
                      Action
                    </th>
                  </tr>
                </thead>
                <div className="py-2"></div>
                <tbody >
                  {showSkelton
                    ? [1, 2, 3, 4, 5, 6, 7]?.map((v, i) => {
                        return (
                          <tr>
                            <td>
                              <Skeleton width={40} />
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
                    :list?.map((v, i) => {
                    return (
                      <tr>
                        <td scope="row">{i+1}</td>
                        <td>{v?.driver?.first_name}</td>
                        <td>{v?.driver?.last_name}</td>
                        <td style={{color: v?.switch_from=="1"? "#9029f8": "#bf6d02"}}>{v?.switch_from=="0"? "Interac E-Transfer": "Direct Deposite"}</td>
                        <td style={{color: v?.switch_to=="1"? "#9029f8": "#bf6d02"}}>{v?.switch_to=="0"? "Interac E-Transfer": "Direct Deposite"}</td>
                       
                        <td>{moment(v.created_at).format("DD/MM/YYYY")}</td>
                        <td>
                        <div className="d-flex justify-content-center iconDiv" >
                          <img src="https://cdn-icons-png.flaticon.com/128/159/159604.png" onClick={()=>setPopupData(v)}/>
                          
                          </div>
                        </td>
                        <td>
                          {renderStatus(v?.status)}
 
                        </td>
                        <td className="d-flex justify-content-center align-items-center">
                          <select value={v?.status} className="shadow" onChange={(e)=>handleUpdateStatus({id:v?.id, status:e.target.value})}  style={{background:"#fff", color:v?.status==0 ?"#745A37":v?.status==1? "#139F01":"red"}}>
                            <option value="0">Pending</option>
                            <option value="1">Accept</option>
                            <option value="-1">Reject</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {list.length == 0 && !showSkelton && (
               <NoRecordFound/>
              )}
            </div>
          </div>
        </div> */}
        <div className="tableMain">
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
                    <option value="">Switch To</option>
                    <option value="">Direct Deposit</option>
                    <option value="">Interec E-Transfer</option>
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

                    <th scope="col">Switch From</th>
                    <th scope="col">Switch To</th>
                    <th scope="col">Date & Time</th>
                    <th scope="col">Profile</th>
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
                                  borderTopLeftRadius: "30px",
                                  borderBottomLeftRadius: "30px",
                                }}
                              >
                                {i + 1 + (pageData?.current_page - 1) * 10}
                              </td>
                              <td>{v?.driver_id} </td>

                              <td>
                                {v?.driver?.first_name +
                                  " " +
                                  v?.driver?.last_name}
                              </td>
                              <td>
                                {v?.switch_from == "0"
                                  ? "Interac E-Transfer"
                                  : "Direct Deposite"}
                              </td>
                              <td>
                                {v?.switch_to == "0"
                                  ? "Interac E-Transfer"
                                  : "Direct Deposite"}
                              </td>

                              <td>
                                {moment(v.updated_at).format("DD MMM, YYYY")} (
                                {moment(v?.updated_at).format("hh:mm A")})
                              </td>

                              <td>
                                <div className="d-flex justify-content-center iconDiv">
                                  <img
                                    onClick={() => setPopupData(v)}
                                    src="https://cdn-icons-png.flaticon.com/128/159/159604.png"
                                    alt="proof"
                                  />
                                </div>
                              </td>
                              <td>
                                <div
                                  className="py-2 mx-2"
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

                              <td
                                style={{
                                  borderTopRightRadius: "30px",
                                  borderBottomRightRadius: "30px",
                                }}
                              >
                                <div className="d-flex justify-content-center align-items-center ">
                                  <select
                                    value={v?.status}
                                    onChange={(e) =>
                                      handleUpdateStatus({
                                        id: v?.id,
                                        status: e.target.value,
                                      })
                                    }
                                  >
                                    <option value="">Select Action</option>
                                    <option value="1">Accept</option>
                                    <option value="-1">Reject</option>
                                    <option value="0">Pending</option>
                                  </select>
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
      {/* User Funds Start */}
      {/* Modal */}
      {popupData && (
        <div
          className="modal fade show d-flex align-items-center justify-content-center userHistoryPopUp"
          tabIndex="-1"
        >
          <div className="modal-dialog" style={{ width: "500px" }}>
            <div className="modal-content  w-100 switchPopUpDiv">
              <div className="d-flex justify-content-end ">
                <i
                  className="fa fa-close text-secondary p-2"
                  onClick={() => setPopupData(null)}
                ></i>
              </div>
              <h6 className="mb-4">Profile</h6>
              <div className="modal-body p-0">
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <p className="mb-0">Full Name</p>
                    <input
                      value={
                        popupData?.driver?.first_name +
                        " " +
                        popupData?.driver?.last_name
                      }
                    />
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <p className="mb-0">Email Address</p>
                    <input value={popupData?.driver?.email} />
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <p className="mb-0">Phone Number</p>
                    <input
                      value={
                        popupData?.driver?.country_code +
                        " " +
                        popupData?.driver?.contact
                      }
                    />
                  </div>
                </div>
                <h6 className="my-4">Interac E-Transfer Details</h6>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <p className="mb-0">Email Address</p>

                  <input
                    value={
                      popupData?.driver_account_details?.type == "0"
                        ? popupData?.driver_account_details?.email
                        : popupData?.email
                    }
                  />
                </div>
                <h6 className="my-4">Direct Deposite Details</h6>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <p className="mb-0">Customer Name</p>
                  <input
                    value={
                      popupData?.driver_account_details?.type == "0"
                        ? popupData?.bank_name
                        : popupData?.driver_account_details?.bank_name
                    }
                  />
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <p className="mb-0">Transit Number</p>
                  <input
                    value={
                      popupData?.driver_account_details?.type == "0"
                        ? popupData?.transit_no
                        : popupData?.driver_account_details?.transit_no
                    }
                  />
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <p className="mb-0">Institution Number</p>
                  <input
                    value={
                      popupData?.driver_account_details?.type == "0"
                        ? popupData?.institution_no
                        : popupData?.driver_account_details?.institution_no
                    }
                  />
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <p className="mb-0">Account Number</p>
                  <input
                    value={
                      popupData?.driver_account_details?.type == "0"
                        ? popupData?.account
                        : popupData?.driver_account_details?.account
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {popupData && <div className="modal-backdrop fade show"></div>}
      {/* User Funds end*/}
    </div>
  );
}

export default FundsSwitch;
