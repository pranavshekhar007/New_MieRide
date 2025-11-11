import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import TableNav from "../../components/TableNav";
import { useGlobalState } from "../../GlobalProvider";
import {
  getDriverQuickWithdrawListServ,
  updateQuickWithdrawServ,
} from "../../services/fundsManagement.services";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import moment from "moment";
import NoRecordFound from "../../components/NoRecordFound";
import { updateNotificationStatusServ } from "../../services/notification.services";
import FundManagementNav from "../../components/FundManagementNav";
import Pagination from "../../components/Pagination";
import NewSidebar from "../../components/NewSidebar";
import CustomTopNav from "../../components/CustomTopNav";
import CustomPagination from "../../components/CustomPazination";
function DriverQuickWithdraw() {
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
  const [payoutAmount, setPayoutAmount] = useState(0);
  const getDriverQuickWithdrawList = async () => {
    if (list?.length == 0) {
      setShowSkelton(true);
    }
    try {
      let cleanedPayload = { ...payload };

      if (cleanedPayload.status === "") {
        delete cleanedPayload.status;
      }
      let response = await getDriverQuickWithdrawListServ(cleanedPayload);
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
    getDriverQuickWithdrawList();
  }, [payload]);
  const handleUpdateStatus = async (formData) => {
    try {
      let response = await updateQuickWithdrawServ(formData);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        getDriverQuickWithdrawList();
      } else {
        toast?.error(response?.data?.error);
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
  };
  const updateNotificationStatusFunc = async (id) => {
    try {
      let response = await updateNotificationStatusServ({
        notification_id: id,
      });
      if (response?.data?.statusCode == "200") {
      }
    } catch (error) {}
  };
  useEffect(() => {
    globalState?.notificationList
      ?.filter((v) => {
        return v?.category == "quick_withdraw" && v?.is_read == 0;
      })
      ?.map((v, i) => {
        updateNotificationStatusFunc(v?.id);
      });
  });
  return (
    <div className="mainBody">
      <NewSidebar selectedItem="Funds Management" />
      <div className="contentLayout">
        <div className="bgWhite borderRadius30 p-4 minHeight100vh">
          <CustomTopNav navItems={navItems} selectedNav="Quick Withdrawal" />
          <div className="row marginVertical15 d-flex align-items-center">
            <div className="col-6 row m-0 p-0">
              <div className="col-4 ">
                <div className="payoutBtn  d-flex justify-content-center align-items-center">
                  <p className="mb-0">Payout :- </p>
                  <h5 className="mb-0">$ {payoutAmount}</h5>
                </div>
              </div>
            </div>
            <div className="col-6 row m-0 p-0">
              <div className="col-4">
                <div className="fundSearchBtn d-flex justify-content-center">
                  <select>
                    <option>Sort</option>
                  </select>
                </div>
              </div>
              <div className="col-8">
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
                    <th scope="col">Driver ID</th>
                    <th scope="col">Driver Name</th>
                    <th scope="col">Requested Date & Time</th>
                    <th scope="col">Wallet</th>
                    <th scope="col">Requested Amt.</th>
                    <th scope="col">Transaction Fee</th>

                    <th scope="col">Total Amt.</th>
                    <th scope="col">Account Info.</th>

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
                              <td>{v?.driver_account_details?.id} </td>
                              <td>
                                {v?.driver_details?.first_name +
                                  " " +
                                  v?.driver_details?.last_name}
                              </td>
                              <td>
                                {moment(v.created_date).format("DD MMM, YYYY")}{" "}
                                ({moment(v?.created_at).format("hh:mm A")})
                              </td>
                              <td>
                                <div className="d-flex justify-content-center">
                                  <div
                                    className="py-2 mx-2 "
                                    style={{
                                      background: "#D0FF13",
                                      color: "#000",
                                      borderRadius: "5px",
                                      height: "30px",
                                      width: "60px",
                                    }}
                                  >
                                    $ {v?.wallet}
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="d-flex justify-content-center">
                                  <div
                                    className="py-2 mx-2 "
                                    style={{
                                      background: "#1C1C1E",
                                      color: "#fff",
                                      borderRadius: "5px",
                                      height: "30px",
                                      width: "80px",
                                    }}
                                  >
                                    $ {v?.transfer_amount}
                                  </div>
                                </div>
                              </td>

                              <td>
                                <div
                                  className="py-2 mx-2 "
                                  style={{
                                    background: "#1C1C1E",
                                    color: "#fff",
                                    borderRadius: "5px",
                                    height: "30px",
                                  }}
                                >
                                  $ {v?.transfer_fee}
                                </div>
                              </td>

                              <td>
                                <div className="d-flex justify-content-center">
                                  <div
                                    className="py-2 mx-2 "
                                    style={{
                                      background: "#E5E5E5",
                                      color: "#00A431",
                                      borderRadius: "5px",
                                      height: "30px",
                                      width: "100px",
                                    }}
                                  >
                                  ${((parseFloat(v?.transfer_amount) || 0) + (parseFloat(v?.transfer_fee) || 0)).toFixed(2)}
                                  </div>
                                </div>
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
                              <td
                                style={{
                                  borderTopRightRadius: "30px",
                                  borderBottomRightRadius: "30px",
                                }}
                              >
                                <div className="d-flex justify-content-center">
                                  <div
                                    className="py-2 mx-2 me-4"
                                    style={{
                                      background: "#00A431",

                                      color: "#fff",
                                      borderRadius: "5px",
                                      height: "30px",
                                      width: "100px",
                                    }}
                                  >
                                    Pay
                                  </div>
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
            selectedItem="Quick Withdrawal"
            sectedNavBg="#D0FF13"
            selectedNavColor="#353535"
            navBg="#000"
          />
        </div>
        {/* top nav ended  */}
        {/* table List started */}
        <div className="tableMain">
          <div className="row mx-0 p-0  marginY35 ">
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
                    <th scope="col">Driver ID</th>
                    <th scope="col">Driver Name</th>
                    <th scope="col">Date & Time</th>

                    <th scope="col">Wallet</th>
                    <th scope="col">Requested Amt.</th>
                    <th scope="col">Transaction Fee</th>

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
                    : list
                        ?.filter((v, i) => {
                          return parseInt(v?.wallet) > 0;
                        })
                        .map((v, i) => {
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
                                  {v?.driver_details?.first_name +
                                    " " +
                                    v?.driver_details?.last_name}
                                </td>
                                <td>
                                  {moment(v.created_date).format(
                                    "DD MMM, YYYY"
                                  )}{" "}
                                  ({moment(v?.created_at).format("hh:mm A")})
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
                                    $ {v?.wallet}
                                  </div>
                                </td>
                                <td>
                                  <div
                                    className="py-2 mx-2"
                                    style={{
                                      background: "#353535",
                                      color: "#fff",
                                      borderRadius: "5px",
                                    }}
                                  >
                                    $ {v?.transfer_amount}
                                  </div>
                                </td>
                                <td>$ {v?.transfer_fee}</td>

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
                                      <option value="0">Select Action</option>
                                      <option value="1">Accept</option>
                                      <option value="-1">Reject</option>
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
              {list?.filter((v, i) => {
                return parseInt(v?.wallet) > 0;
              }).length == 0 &&
                !showSkelton && <NoRecordFound theme="light" />}
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
    </div>
  );
}

export default DriverQuickWithdraw;
