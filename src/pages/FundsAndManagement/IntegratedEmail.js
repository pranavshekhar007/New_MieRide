import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import TableNav from "../../components/TableNav";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import moment from "moment";
import { useGlobalState } from "../../GlobalProvider";
import axios from "axios";
import NoRecordFound from "../../components/NoRecordFound";
import FundManagementNav from "../../components/FundManagementNav";
import NewSidebar from "../../components/NewSidebar";
import CustomTopNav from "../../components/CustomTopNav";
import CustomPagination from "../../components/CustomPazination";
function IntegratedEmail() {
  const { setGlobalState, globalState } = useGlobalState();
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
  const [emailList, setEmailList] = useState([]);
  const [showSkelton, setShowSkelton] = useState(false);
  const [payload, setPayload] = useState({
    page: 1,
    limit: 10,
    searchKey: "",
    sinceDate: "",
  });
  const [pageData, setPageData] = useState({
    total_pages: "",
    current_page: "",
  });
  const getEmailList = async () => {
    if (emailList?.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await axios.post(
        "https://midridechat.vercel.app/api/email/list",
        payload
      );
      // let response = await axios.post("http://localhost:7000/api/email/list", payload);
      setEmailList(response?.data?.data);
      setPageData({
        total_pages: response?.data?.totalPages,
        current_page: response?.data?.currentPage,
      });
    } catch (error) {}
    setShowSkelton(false);
  };
  const markEmailAsRead = async (emailUID) => {
    try {
      let response = await axios.post(
        "https://midridechat.vercel.app/api/email/mark-as-read",
        { emailUID }
      );
      // let response = await axios.post("http://localhost:7000/api/email/mark-as-read", {emailUID});
      getEmailList();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getEmailList();
  }, [payload]);

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
  const [popupData, setPopupData] = useState(null);
  if (popupData?.showHtml)
    return (
      <div>
        <div className="d-flex justify-content-center mt-4">
          <div
            className="btn btn-warning"
            onClick={() => setPopupData(null)}
            style={{ minWidth: "600px" }}
          >
            {" "}
            <b>View Mail Box</b>
          </div>
        </div>
        <div className="d-flex justify-content-center mt-4">
          <div
            className=""
            onClick={() => setPopupData(null)}
            style={{ minWidth: "600px" }}
          >
            <div
              className="html-content"
              dangerouslySetInnerHTML={{ __html: popupData?.html }}
            />
          </div>
        </div>
      </div>
    );
  return (
    <div className="mainBody">
      <NewSidebar selectedItem="Funds Management" />
      <div className="contentLayout">
        <div className="bgWhite borderRadius30 p-4 minHeight100vh">
          <CustomTopNav navItems={navItems} selectedNav="Email" />

          <div className="tableOuterContainer bgDark mx-2 mt-4 ">
            {showSkelton ? [1, 2, 3, 4, 5, 6, 7, 8, 9]?.map((v, i)=>{
             return (
                <div
                  className="emailItemBox d-flex "
                  onClick={() => {
                    markEmailAsRead(v?.uid);
                    setPopupData(v);
                  }}
                >
                  <div className="d-flex align-items-center me-4">
                    <div className="me-3">
                      <Skeleton  width={60} height={60}/>
                    </div>
                    <div>
                      <h5 className="mb-2"><Skeleton  width={150}/></h5>
                      <span><Skeleton  width={200} height={15}/></span>
                    </div>
                  </div>
                  <div className="w-100">
                    <h6 className="mb-2"><Skeleton  width="80%"/></h6>
                    <p className="mb-1"><Skeleton  width="100%" height={15}/></p>
                    <p><Skeleton  width="100%" height={15}/></p>
                  </div>
                </div>
              );
            }) : emailList?.map((v, i) => {
              return (
                <div
                  className="emailItemBox d-flex "
                  onClick={() => {
                    markEmailAsRead(v?.uid);
                    setPopupData(v);
                  }}
                >
                  <div className="d-flex align-items-center me-4">
                    <div className="me-3">
                      <img src="https://cdn-icons-png.flaticon.com/128/149/149071.png" />
                    </div>
                    <div>
                      <h5>{v?.fullName}</h5>
                      <span>{v?.email}</span>
                    </div>
                  </div>
                  <div>
                    <h6>{v?.subject}</h6>
                    <p>{v?.text}</p>
                  </div>
                </div>
              );
            })}
            {emailList.length == 0 && !showSkelton && <NoRecordFound theme="light"/>}
          </div>
          
          {popupData && (
            <div
              className="modal fade show d-flex align-items-center justify-content-center userHistoryPopUp"
              tabIndex="-1"
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)", // Adds a semi-transparent background
                zIndex: 1050,
              }}
            >
              <div
                className="modal-dialog"
                style={{
                  width: "70%", // Takes 90% of the screen width
                  maxWidth: "100%", // Ensures it doesn't exceed the screen width
                  margin: "0 auto",
                  maxHeight: "calc(100% - 100px)", // Leaves 50px gap at top and bottom
                  margin: "50px auto", // 50px gap from top and bottom
                  overflowY: "auto", // Scrollable content when it overflows
                }}
              >
                <div
                  className="modal-content"
                  style={{
                    border: "1px solid #7650E0",
                    borderRadius: "9px",
                    background: "#f9fafc",
                    width: "100%", // Ensures it stretches across the modal dialog
                    padding: "20px",
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <h4 className="mb-4 ">{popupData?.subject}</h4>

                    <p className="mb-1">
                      Date :{" "}
                      <span>
                        {" "}
                        {moment(popupData.date).format("hh:mm A - DD/MM/YYYY ")}
                      </span>
                    </p>
                  </div>
                  <div className="d-flex ms-2 justify-content-between text-secondary align-items-center">
                    <div className="d-flex">
                      <div>
                        <i
                          className="fa fa-user"
                          style={{ fontSize: "20px" }}
                        ></i>
                      </div>

                      <p className="mb-0 mx-2 " style={{ fontSize: "20px" }}>
                        From :{" "}
                        <span className="text-dark">{popupData?.fullName}</span>
                      </p>
                    </div>

                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() =>
                        setPopupData({ ...popupData, showHtml: true })
                      }
                    >
                      View HTML
                    </button>
                  </div>
                  <div className="p-2">
                    {popupData?.text.split("\n").map((line, index) => (
                      <p key={index} className="line-break mb-0">
                        {line}
                      </p>
                    ))}
                    <div className="d-flex w-100 justify-content-center">
                      <button
                        style={{ width: "150px" }}
                        className="btn btn-danger mt-3 btn-sm"
                        onClick={() => {
                          setPopupData(null);
                        }}
                      >
                        Close
                      </button>
                    </div>

                    {/* <div className="html-content" dangerouslySetInnerHTML={{ __html: popupData?.html }} /> */}
                  </div>
                </div>
              </div>
            </div>
          )}

          {popupData && <div className="modal-backdrop fade show"></div>}
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
        {/* top nav started  */}
        <div className="sticky-top bg-light" style={{ paddingTop: "45px" }}>
          <FundManagementNav
            navItems={navItems}
            navColor="#fff"
            divideRowClass="col-xl-6 col-lg-6 col-md-12 col-12"
            selectedItem="Email"
            sectedNavBg="#D0FF13"
            selectedNavColor="#353535"
            navBg="#000"
          />
        </div>
        {/* top nav ended  */}
        {/* table List started */}
        <div className="tableMain">
          <div
            className="tableBody py-2 px-4 borderRadius30All "
            style={{ background: "#363435" }}
          >
            <div className="row my-3">
              <div className="col-12 mb-3">
                <div className="row d-flex justify-content-end mb-3">
                  <div className=" col-4 ">
                    <div
                      className="bg-light shadow-sm d-flex align-items-center "
                      style={{ borderRadius: "24px", padding: "12px 16px" }}
                    >
                      <i className="fa fa-search text-secondary me-2"></i>
                      <input
                        placeholder="Search Email"
                        style={{
                          border: "none",
                          outline: "none",
                          width: "80%",
                        }}
                        onChange={(e) =>
                          setPayload({
                            ...payload,
                            searchKey: e?.target?.value,
                          })
                        }
                        className="bg-light"
                      />
                    </div>
                  </div>
                  <div className=" col-4 ">
                    <div
                      className="bg-light shadow-sm d-flex align-items-center justify-content-between "
                      style={{ borderRadius: "24px", padding: "12px 16px" }}
                    >
                      <span>Email Since</span>
                      <input
                        type="date"
                        style={{
                          border: "none",
                          outline: "none",
                          width: "70%",
                        }}
                        onChange={(e) =>
                          setPayload({
                            ...payload,
                            sinceDate: e?.target?.value,
                          })
                        }
                        className="bg-light"
                      />
                    </div>
                  </div>
                  <div className="col-4">
                    <select
                      className="form-control shadow-sm"
                      style={{
                        borderRadius: "24px",
                        padding: "10px 16px",
                        border: "none",
                      }}
                      onChange={(e) =>
                        setPayload({ ...payload, limit: e?.target.value })
                      }
                    >
                      <option value={10}>Show Entities</option>
                      <option>10</option>
                      <option>20</option>
                      <option>50</option>
                      <option>100</option>
                    </select>
                  </div>
                </div>
                <div className="mt-3">
                  {showSkelton ? (
                    <div>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9]?.map((v, i) => {
                        return (
                          <div className="mb-3">
                            <Skeleton height={120} />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    emailList?.map((v, i) => {
                      return (
                        <div
                          className=" p-3 my-3 shadow-sm"
                          style={{
                            borderRadius: "12px",
                            background: "#EBFFF3",
                            borderTop: "4px solid #78AE8A",
                          }}
                          onClick={() => {
                            markEmailAsRead(v?.uid);
                            setPopupData(v);
                          }}
                        >
                          <div className="row ">
                            <div className="d-flex  col-3">
                              <div
                                className="d-flex justify-content-center align-items-center"
                                style={{
                                  height: "65px",
                                  width: "65px",
                                  background: "#363535",
                                  borderRadius: "50%",
                                }}
                              >
                                <h3 className="mb-0 text-light">
                                  {v?.fullName[0]}
                                </h3>
                              </div>
                              <div>
                                <h5 className="mb-1 ms-2">{v?.fullName}</h5>
                                <p
                                  className="mb-0 ms-2 text-secondary "
                                  style={{ fontSize: "14px" }}
                                >
                                  {" "}
                                  <i>{v?.email}</i>
                                </p>
                              </div>
                            </div>
                            <div className="col-6 my-auto">
                              <h5 className="mb-1">{v?.subject}</h5>
                              <p
                                className="mb-0"
                                style={{
                                  fontSize: "17px",
                                  wordWrap: "break-word",
                                  overflowWrap: "break-word",
                                  whiteSpace: "normal",
                                }}
                              >
                                {v?.text}
                              </p>
                            </div>
                            <p
                              className="col-3 mt-auto text-end"
                              style={{ fontSize: "15px" }}
                            >
                              {" "}
                              {moment(v.date).format("hh:mm A - DD/MM/YYYY ")}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  {renderPage()}
                  {emailList.length == 0 && !showSkelton && <NoRecordFound />}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* table List ended */}

        {popupData && (
          <div
            className="modal fade show d-flex align-items-center justify-content-center userHistoryPopUp"
            tabIndex="-1"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)", // Adds a semi-transparent background
              zIndex: 1050,
            }}
          >
            <div
              className="modal-dialog"
              style={{
                width: "70%", // Takes 90% of the screen width
                maxWidth: "100%", // Ensures it doesn't exceed the screen width
                margin: "0 auto",
                maxHeight: "calc(100% - 100px)", // Leaves 50px gap at top and bottom
                margin: "50px auto", // 50px gap from top and bottom
                overflowY: "auto", // Scrollable content when it overflows
              }}
            >
              <div
                className="modal-content"
                style={{
                  border: "1px solid #7650E0",
                  borderRadius: "9px",
                  background: "#f9fafc",
                  width: "100%", // Ensures it stretches across the modal dialog
                  padding: "20px",
                }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <h4 className="mb-4 ">{popupData?.subject}</h4>

                  <p className="mb-1">
                    Date :{" "}
                    <span>
                      {" "}
                      {moment(popupData.date).format("hh:mm A - DD/MM/YYYY ")}
                    </span>
                  </p>
                </div>
                <div className="d-flex ms-2 justify-content-between text-secondary align-items-center">
                  <div className="d-flex">
                    <div>
                      <i
                        className="fa fa-user"
                        style={{ fontSize: "20px" }}
                      ></i>
                    </div>

                    <p className="mb-0 mx-2 " style={{ fontSize: "20px" }}>
                      From :{" "}
                      <span className="text-dark">{popupData?.fullName}</span>
                    </p>
                  </div>

                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() =>
                      setPopupData({ ...popupData, showHtml: true })
                    }
                  >
                    View HTML
                  </button>
                </div>
                <div className="p-2">
                  {popupData?.text.split("\n").map((line, index) => (
                    <p key={index} className="line-break mb-0">
                      {line}
                    </p>
                  ))}
                  <div className="d-flex w-100 justify-content-center">
                    <button
                      style={{ width: "150px" }}
                      className="btn btn-danger mt-3 btn-sm"
                      onClick={() => {
                        setPopupData(null);
                      }}
                    >
                      Close
                    </button>
                  </div>

                  {/* <div className="html-content" dangerouslySetInnerHTML={{ __html: popupData?.html }} /> */}
                </div>
              </div>
            </div>
          </div>
        )}

        {popupData && <div className="modal-backdrop fade show"></div>}
      </section>
      {/* sectionLayout ended */}
    </div>
  );
}

export default IntegratedEmail;
