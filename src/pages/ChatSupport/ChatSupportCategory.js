import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import TableNav from "../../components/TableNav";
import moment from "moment";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useGlobalState } from "../../GlobalProvider";
import { useNavigate } from "react-router-dom";
import {
  getChatSupportCategoryListServ,
  addCategoryServ,
} from "../../services/support.services";
import NoRecordFound from "../../components/NoRecordFound";
import { toast } from "react-toastify";
import { updateNotificationStatusServ } from "../../services/notification.services";
function ChatSupportCategory() {
  const navigate = useNavigate();
  const { setGlobalState, globalState } = useGlobalState();
  const [addFormData, setAddFormData] = useState({
    show: false,
    name: "",
    user_type:""

  });
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
      let response = await getChatSupportCategoryListServ();
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
  const [submitLoader, setSubmitLoader] = useState(false);
  const addFormFunc = async () => {
    setSubmitLoader(true);
    try {
      let response = await addCategoryServ(addFormData);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        setAddFormData({
          show: false,
          name: "",
          user_type:""
        });
    getListFunc()
      }
    } catch (error) {}
    setSubmitLoader(false);
  };

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
        }}
      >
        {/* top nav started  */}
        <TopNav
          navItems={navItems}
          navColor="#fff"
          navBg="#000000"
          divideRowClass="col-xl-8 col-lg-8 col-md-12 col-12"
          selectedItem="Chat Support Category"
          sectedNavBg="#D0FF13"
          selectedNavColor="#000"
        />
        {/* top nav ended  */}

        {/* table List started */}
        <div className="tableMain">
          <div
            className="tableBody py-2 px-4 borderRadius30All"
            style={{ background: "#363435" }}
          >
            <div style={{ margin: "20px 10px" }}>
              <div className="row mb-4">
                <div className="col-6">
                  <input
                    style={{ borderRadius: "16px" }}
                    className="form-control"
                    placeholder="Search"
                  />
                </div>
                <div className="col-3">
                  <button
                    className="btn btn-secondary w-100"
                    onClick={() =>
                      setAddFormData({
                        show: true,
                      })
                    }
                    style={{
                      borderRadius: "16px",
                      background: "#DDDDDD",
                      fontFamily: "poppins",
                      color: "#000",
                    }}
                  >
                    Add New
                  </button>
                </div>
              </div>
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
                    <th scope="col">Booking ID</th>
                    <th scope="col">User Type</th>

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

                                      wordWrap: "break-word",
                                      whiteSpace: "normal",
                                    }}
                                  >
                                    {v?.name}
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="d-flex justify-content-center">
                                  <div
                                    style={{
                                      padding: "3px 6px",
                                      borderRadius: "8px",

                                      wordWrap: "break-word",
                                      whiteSpace: "normal",
                                    }}
                                  >
                                    {v?.user_type?.toUpperCase() || "UNKNOWN"}
                                  </div>
                                </div>
                              </td>

                              <td
                                style={{
                                  borderTopRightRadius: "24px",
                                  borderBottomRightRadius: "24px",
                                  overflow: "hidden",
                                  width: "250px",
                                }}
                              >
                                <div className="d-flex justify-content-center">
                                  <div
                                    className="d-flex justify-content-center align-items-center"
                                    style={{
                                      borderRadius: "12px",
                                      width: "100%",
                                      height: "100%",
                                    }}
                                  >
                                    <div
                                      onClick={() => alert("Work In Progress")}
                                      style={{
                                        background: "#353535",
                                        border: "none",
                                        width: "90px",
                                      }}
                                      className="btn btn-primary shadow btnHeight25 d-flex justify-content-center align-items-center"
                                    >
                                      <span
                                        style={{
                                          // marginLeft: "6px",
                                          color: "#D0FF13",
                                          fontSize: "14px",
                                        }}
                                      >
                                        Edit
                                      </span>
                                    </div>
                                  </div>
                                  <div
                                    className="d-flex justify-content-center align-items-center"
                                    style={{
                                      borderRadius: "12px",
                                      width: "100%",
                                      height: "100%",
                                    }}
                                  >
                                    <div
                                      onClick={() => alert("Work In Progress")}
                                      style={{
                                        background: "#353535",
                                        border: "none",
                                        width: "90px",
                                      }}
                                      className="btn btn-primary shadow btnHeight25 d-flex justify-content-center align-items-center"
                                    >
                                      <span
                                        style={{
                                          marginLeft: "6px",
                                          color: "#D0FF13",
                                          fontSize: "14px",
                                        }}
                                      >
                                        Delete
                                      </span>
                                    </div>
                                  </div>
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
      {addFormData?.show && (
        <div
          className="modal fade show d-flex align-items-center manualSetPopup  justify-content-center "
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div
              className="modal-content"
              style={{
                borderRadius: "16px",
                background: "#f7f7f5",
                width: "364px",
              }}
            >
              <div className="d-flex justify-content-between pt-4 pb-0 px-4">
                <p>
                  <u>Add Category</u>
                </p>
                <i
                  className="fa fa-close text-secondary"
                  onClick={() => {
                    setAddFormData(null);
                  }}
                ></i>
              </div>
              <hr className="mt-0" />
              <div className="modal-body" style={{ fontFamily: "poppins" }}>
                <div
                  style={{
                    wordWrap: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                  className="d-flex justify-content-center w-100"
                >
                  <div className="w-100 px-2">
                    <label>User Type</label>
                    <select style={{filter:"none"}} onChange={(e)=>setAddFormData({...addFormData, user_type:e?.target?.value})} className="form-control mb-3 bg-light text-dark">
                      <option value="">Select</option>
                      <option value="user">User</option>
                      <option value="driver">Driver</option>
                      <option value="website">Website</option>
                    </select>
                    <label>Category Name</label>
                    <input
                      onChange={(e) => setAddFormData({...addFormData, name:e?.target?.value})}
                      className="form-control"
                      placeholder="Category name"
                    />
                    {submitLoader ? (
                      <button className="mt-4" style={{opacity:"0.5"}} >
                        Saving ... 
                      </button>
                    ) : (
                        addFormData?.name &&  addFormData?.user_type ?
                      <button className="mt-4" onClick={addFormFunc}>
                        Submit
                      </button> :<button className="mt-4" style={{opacity:"0.5"}}>
                        Submit
                      </button>
                    )}
                  </div>
                </div>
                <div className="d-flex justify-content-center"></div>
              </div>
            </div>
          </div>
        </div>
      )}
      {addFormData?.show && <div className="modal-backdrop fade show"></div>}
      {/* sectionLayout ended */}
    </div>
  );
}

export default ChatSupportCategory;
