import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import TableNav from "../../components/TableNav";
import moment from "moment";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useGlobalState } from "../../GlobalProvider";
import { useNavigate } from "react-router-dom";
import { getChatSupportListServ } from "../../services/support.services";
import NoRecordFound from "../../components/NoRecordFound";
import { updateNotificationStatusServ } from "../../services/notification.services";
import NewSidebar from "../../components/NewSidebar";
function UserChatSupport() {
  const navigate = useNavigate();
  const { setGlobalState, globalState } = useGlobalState();
  const navItems = [
    {
      name: "User Chat Support",
      path: "/user-chat-support",
      notificationLength: globalState?.notificationList?.filter((v) => {
        return (
          (v.category == "new_support_chat_user" ||
            v.category == "new_support_message_user") &&
          v?.is_read == 0
        );
      })?.length,
    },

    {
      name: "Driver Chat Support",
      path: "/driver-chat-support",
      notificationLength: globalState?.notificationList?.filter((v) => {
        return (
          (v.category == "new_support_chat_driver" ||
            v.category == "new_support_message_driver") &&
          v?.is_read == 0
        );
      })?.length,
    },

    {
      name: "Chat Support Category",
      path: "/chat-support-category",
      
    },
  ];
  const [showSkelton, setShowSkelton] = useState(false);
  const [list, setList] = useState([]);
  const getListFunc = async () => {
    if (list.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await getChatSupportListServ({ user_type: "user" });
      if (response?.data?.statusCode == "200") {
        setList(response?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
    setShowSkelton(false);
  };
  useEffect(() => {
    getListFunc();
  }, []);
  const renderStatusButton = (status) => {
    if (status == "opened") {
      return (
        <button
          className="btn btn-dark accordenBoxbutton py-2"
          style={{ background: "#1B1A15", fontWeight: "600", color: "#139F02" }}
        >
          Opened
        </button>
      );
    }
    if (status == "closed") {
      return (
        <button
          className="btn btn-dark accordenBoxbutton py-2"
          style={{ background: "red", fontWeight: "600", color: "#fff" }}
        >
          Closed
        </button>
      );
    }
    if (status == "reopened") {
      return (
        <button
          className="btn btn-dark accordenBoxbutton py-2"
          style={{ background: "yellow", fontWeight: "600", color: "#000" }}
        >
          Reopened
        </button>
      );
    }
    if (status == "pending") {
      return (
        <button
          className="btn btn-dark accordenBoxbutton py-2"
          style={{ background: "yellow", fontWeight: "600", color: "#000" }}
        >
          Pending
        </button>
      );
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
        return (
          (v.category == "new_support_chat_user" ||
            v.category == "new_support_message_user") &&
          v?.is_read == 0
        );
      })
      ?.map((v, i) => {
        updateNotificationStatusFunc(v?.id);
      });
  });
  return (
    <div className="mainBody">
      <NewSidebar selectedItem="Chat Support" />
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
  );
  return (
    <div className="main_layout  bgBlack d-flex">
      {/* sidebar started */}
      <Sidebar selectedItem="Chat Support" />
      {/* sidebar ended */}

      {/* sectionLayout started */}
      <section
        className="section_layout"
        style={{
          marginLeft: globalState?.isFillSidebarWidth100 ? "260px" : "80px",
          minWidth: "1350px",
        }}
      >
        {/* top nav started  */}
        <TopNav
          navItems={navItems}
          navColor="#fff"
          navBg="#000000"
          divideRowClass="col-xl-8 col-lg-8 col-md-12 col-12"
          selectedItem="User Chat Support"
          sectedNavBg="#D0FF13"
          selectedNavColor="#000"
        />
        {/* top nav ended  */}

        {/* table List started */}
        <div className="tableMain">
          <div
            className="tableBody py-2 px-4 borderRadius50All"
            style={{ background: "#363435" }}
          >
            <div style={{ margin: "20px 10px" }}>
              <table className="table bookingTable">
                <thead>
                  <tr style={{ background: "#D0FF13", color: "#000" }}>
                    <th
                      scope="col"
                      style={{ borderRadius: "24px 0px 0px 24px" }}
                    >
                      <div className="d-flex justify-content-center ms-2">
                        <span>Sr. No</span>
                      </div>
                    </th>
                    {/* <th scope="col">Booking ID</th> */}
                    <th scope="col">Case ID</th>
                    <th scope="col">Subject</th>
                    <th scope="col">Message</th>
                    <th scope="col">Chat</th>
                    <th scope="col">Date</th>
                    <th scope="col">Time</th>
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
                            {/* <td>
                              <Skeleton width={100} />
                            </td> */}
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
                            {v?.total_unread_message != 0 && (
                              <div
                                className="d-flex justify-content-center align-items-center bgSuccess"
                                style={{
                                  position: "relative",
                                  top: "30px",
                                  left: "10px",
                                  width: "18px",
                                  height: "18px",
                                  borderRadius: "50%",
                                  border: "1px solid black",
                                }}
                              >
                                <p
                                  className="mb-0  "
                                  style={{
                                    fontSize: "8px",
                                    color: "white",
                                  }}
                                >
                                  {v?.total_unread_message}
                                </p>
                              </div>
                            )}

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
                              {/* <td>
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
                                    {v?.booking_id}
                                  </div>
                                </div>{" "}
                              </td> */}
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
                                    {v?.id}
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
                                   {v?.category_name}
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
                                   {v?.message}
                                  </div>
                                </div>{" "}
                              </td>

                              <td>
                                <div className="d-flex justify-content-center align-items-center">
                                  <button
                                    onClick={() =>
                                      navigate("/user-chat-box/" + v?.id)
                                    }
                                    className="btn btn-dark accordenBoxbutton py-2"
                                    style={{ background: "#000000" }}
                                  >
                                    View
                                  </button>
                                </div>
                              </td>
                               <td
                                
                              >
                                <div
                                  className="d-flex justify-content-center align-items-center"
                                  style={{
                                    borderRadius: "12px",
                                    width: "100%",
                                    height: "100%",
                                  }}
                                >
                                  {moment(v?.created_at).format("hh:mm A")}
                                </div>
                              </td>
                              <td>
                                {" "}
                                <div className="d-flex justify-content-center align-items-center">
                                  <div>
                                    {moment(v?.created_at).format("DD/MM/YYYY")}
                                  </div>{" "}
                                </div>{" "}
                              </td>
                              <td style={{
                                  borderTopRightRadius: "24px",
                                  borderBottomRightRadius: "24px",
                                  overflow: "hidden",
                                }}>
                                <div className="d-flex justify-content-center align-items-center">
                                  {renderStatusButton(v?.status)}
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
    </div>
  );
}

export default UserChatSupport;
