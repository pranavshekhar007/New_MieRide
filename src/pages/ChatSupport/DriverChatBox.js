import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import TableNav from "../../components/TableNav";
import moment from "moment";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useGlobalState } from "../../GlobalProvider";
import {
  getChatSupportByCaseId,
  supportSendMessageServ,
  supportChatAddParticipentServ,
  supportMessageMarkRead,
  supportUpdateServ,
  getParticipentListForChat,
} from "../../services/support.services";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Image_Base_Url } from "../../utils/api_base_url_configration";
import { MultiSelect } from "react-multi-select-component";
function DriverChatBox() {
  const { setGlobalState, globalState } = useGlobalState();
  const params = useParams();
  const navigate = useNavigate();
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
  const [details, setDetails] = useState(null);
  const getChatDetailsFunc = async () => {
    try {
      let response = await getChatSupportByCaseId({ case_id: params?.id });
      if (response?.data?.statusCode == "200") {
        setDetails({...response?.data?.data, messages : response?.data?.data?.messages.reverse()});
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getChatDetailsFunc();
  }, []);
  const [formData, setFormData] = useState({
    case_id: params?.id,
    message: "",
    media_url: "",
    media_type: "",
    imgPrev: "",
  });
  const [loader, setLoader] = useState(false);
  const [optionSelected, setOptionSelected] = useState([]);
  const handleSubmitChatFunc = async () => {
    setLoader(true);
    try {
      let updatedFormData;
      if (formData?.media_type == "image") {
        console.log(formData?.media_url);
        updatedFormData = { ...formData, image: formData?.media_url };
      } else {
        updatedFormData = formData;
      }
      let response = await supportSendMessageServ(updatedFormData);
      if (response?.data?.statusCode == "200") {
        getChatDetailsFunc();
        setFormData({
          case_id: params?.id,
          message: "",
         
          media_url: "",
          media_type: "",
          imgPrev: "",
        });
        setOptionSelected("");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
    setLoader(false);
  };
  const [navExpended, setNavExpended] = useState(false);
  const [participentAddForm, setParticipentAddForm] = useState({
    support_case_id: params?.id,
    participant_id: "",
    participant_type: "",
  });
  const [showPopUp, setShowPopUp] = useState(false);
  const handleAddParticipentFunc = async () => {
    try {
      console.log(participentAddForm);
      let response = await supportChatAddParticipentServ(participentAddForm);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        setShowPopUp(false);
        setParticipentAddForm({
          support_case_id: params?.id,
          participant_id: "",
          participant_type: "",
        });
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
  };
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        media_url: file,
        media_type: "image",
        imgPrev: URL.createObjectURL(file),
      });
    }
  };
  const markMessageAsReadFunc = async (messageId) => {
    try {
      const response = await supportMessageMarkRead({ message_id: messageId });
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  useEffect(() => {
    if (!details?.messages) return;

    const unreadMessages = details.messages.filter((v) => !v?.is_read && v?.sender_type != "admin");

    if (unreadMessages.length === 0) return;

    // Using a loop instead of map for async calls
    const markMessages = async () => {
      for (const msg of unreadMessages) {
        await markMessageAsReadFunc(msg?.id);
      }
    };

    markMessages();
  }, [details]);

  const updateTicketStatusFunc = async (status) => {
    try {
      let response = await supportUpdateServ({
        case_id: params?.id,
        status: status,
      });
      if (response?.data?.statusCode == "200") {
        getChatDetailsFunc()
        toast.success(response?.data?.message);
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
  };
  const [participantList, setParticipantList] = useState([]);
  let [participantOptions, setParticipantOption] = useState([]);
  const getParticipantListToSendMessageFunc = async () => {
    try {
      let response = await getParticipentListForChat({
        support_case_id: params?.id,
      });
      if (response?.data?.statusCode == "200") {
        setParticipantList(response?.data?.data);
        const options =
          response?.data?.data?.map((v) => ({
            label: `${v?.details?.first_name} ${v?.details?.last_name} (${v?.participant_type})`,
            value: `${v?.id}|${v?.participant_type}`,
          })) || [];

        setParticipantOption(options);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleMultiSelectChange = (selectedOptions) => {
    setOptionSelected(selectedOptions);

    // Map selected options to receivers
    const updatedReceivers = selectedOptions.map((option) => {
      const [receiver_id, receiver_type] = option.value.split("|");
      return { receiver_id, receiver_type };
    });

    setFormData((prev) => ({
      ...prev,
      receivers: updatedReceivers,
    }));
  };
  useEffect(() => {
    getParticipantListToSendMessageFunc();
  }, []);
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
           selectedItem="Driver Chat Support"
          sectedNavBg="#D0FF13"
          selectedNavColor="#000"
        />
        {/* top nav ended  */}

        {/* table List started */}
        <div className="tableMain">
          <div
            className="tableBody py-2 px-4 borderRadius50All"
            style={{ background: "#EBEBEB" }}
          >
            <div style={{ margin: "20px 10px" }}>
              <div className="chatBoxTopNav" style={{background:"#363535"}}>
                <div className="row">
                  <div className="col-lg-4 col-md-6">
                    <div className="d-flex justify-content-between align-items-center labelBox">
                      <p className="mb-0">First Name</p>
                      <h6 className="mb-0">
                        {details?.first_name}
                      </h6>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="d-flex justify-content-between align-items-center labelBox">
                      <p className="mb-0">Last Name</p>
                      <h6 className="mb-0">
                        {details?.last_name}
                      </h6>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="d-flex justify-content-between align-items-center labelBox">
                      <p className="mb-0">Case Id</p>
                      <h6 className="mb-0">{details?.case_id}</h6>
                    </div>
                  </div>
                 
                  <div className="col-lg-9 col-md-12">
                    <div className="d-flex mt-4 align-items-center labelBox">
                      <p className="mb-0 me-5">Subject</p>
                      <h6 className="mb-0">{details?.category_name}</h6>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-12">
                    <div
                      className="d-flex mt-4 align-items-center labelBox"
                      style={{ height: "48px" }}
                    >
                      <p className="mb-0 me-5">Status</p>
                      <select
                      value={details?.case_status}
                        className="form-control"
                        onChange={(e) =>
                          e?.target?.value  && updateTicketStatusFunc(e?.target?.value)
                        }
                        style={{border:"none", outline:"none"}}
                      >
                        <option value="">Select</option>
                        <option value="opened">Open</option>
                        <option value="closed">Close</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="chatBoxDiv">
                
                <div style={{ height: "50vh", overflow: "auto" }}>
                  {details?.messages?.map((v, i) => {
                    return (
                      <div
                        className={
                          v?.sender_type == "admin" &&
                          " d-flex justify-content-end "
                        }
                      >
                        <div className={"chatContainer my-4 w-50"}>
                          <label>{v?.sender_details?.first_name}</label>

                          {v?.media_type == "image" ? (
                            <div className=" d-flex">
                              <div
                                style={{
                                  background:
                                    v?.sender_type == "admin"
                                      ? "#000"
                                      : v?.sender_type == "driver"
                                      ? " #b8336a"
                                      : " #024596",
                                  borderRadius: "12px",
                                }}
                                className="p-2 shadow "
                              >
                                <img
                                  src={Image_Base_Url + v?.media_url}
                                  style={{ height: "250px" }}
                                />
                                <p className="text-light" style={{wordBreak:"break-word", whiteSpace:"normal"}}>{v?.message}</p>
                                <div className="d-flex justify-content-between mt-3">
                                  <h6 className="mb-0 text-light">
                                    {moment(v?.created_at).format("hh:mm A")}
                                  </h6>
                                  <a
                                    className="text-light"
                                    target="blank"
                                    href={Image_Base_Url + v?.media_url}
                                  >
                                    <i className="fa fa-eye"></i>
                                  </a>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div
                              className="d-flex justify-content-between align-items-center chatDiv w-100"
                              style={{
                                background:
                                  v?.sender_type == "admin"
                                    ? "#000"
                                    : v?.sender_type == "driver"
                                    ? " #b8336a"
                                    : " #024596",
                              }}
                            >
                              <p className="mb-0" style={{wordBreak:"break-word", whiteSpace:"normal"}}>{v?.message}</p>
                              <h6 className="mb-0">
                                {moment(v?.created_at).format("hh:mm A")}
                              </h6>
                            </div>
                          )}
                          {(v?.sender_type == "admin" && v?.is_read == 1 )&& (
                            <div className=" p-1 d-flex justify-content-end">
                              <img
                                src="https://cdn-icons-png.flaticon.com/128/18605/18605135.png"
                                style={{ height: "22px" }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {details?.case_status !="closed" && <div className="">
                <div className="addMessageBox d-flex justify-content-between align-items-center">
                  <input
                    placeholder="Add Message"
                    value={formData?.message}
                    className="py-2"
                    onChange={(e) =>
                      setFormData({ ...formData, message: e?.target?.value })
                    }
                  />

                  <label htmlFor="imageUpload" style={{ cursor: "pointer" }}>
                    <img
                      src={
                        formData?.imgPrev
                          ? formData?.imgPrev
                          : "https://cdn-icons-png.flaticon.com/128/6489/6489396.png"
                      }
                      alt="Upload"
                      className="border rounded shadow"
                      style={{ height: "25px" }}
                    />
                  </label>
                  <input
                    type="file"
                    id="imageUpload"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleImageUpload(e)}
                  />

                  {/* <MultiSelect
                    options={participantOptions}
                    value={optionSelected}
                    onChange={handleMultiSelectChange}
                    labelledBy="Select User"
                    hasSelectAll={true}
                    overrideStrings={{
                      selectSomeItems: "Select User",
                      allItemsAreSelected: "All Users Selected",
                      selectAll: "Select All",
                      search: "Search User...",
                    }}
                  /> */}

                  {loader ? (
                    <button style={{ opacity: "0.5" }}>Sending</button>
                  ) : 
                    (formData?.message || formData?.media_url) ? (
                    <button onClick={() => handleSubmitChatFunc()}>Send</button>
                  ) : (
                    <button style={{ opacity: "0.5" }}>Send</button>
                  )}
                </div>
              </div>}
              
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
            <div
              className="modal-content  w-100 switchPopUpDiv"
              style={{ padding: "20px" }}
            >
              <div className="d-flex justify-content-end ">
                <i
                  className="fa fa-close text-secondary p-2"
                  onClick={() => setShowPopUp(null)}
                ></i>
              </div>
              <h6 className="mb-4">Add Participent</h6>
              <div className="modal-body p-0">
                <label>Add Participent</label>
                <select
                  className="form-control"
                  onChange={(e) => {
                    const [participant_id, participant_type] =
                      e.target.value.split("|");
                    setParticipentAddForm({
                      ...participentAddForm,
                      participant_id,
                      participant_type,
                    });
                  }}
                >
                  <option value="">Select</option>

                  {details?.participantToBeAdded?.users && (
                    <option
                      value={`${details.participantToBeAdded.users.id}|user`}
                    >
                      {details.participantToBeAdded.users.first_name}{" "}
                      {details.participantToBeAdded.users.last_name} (USER)
                    </option>
                  )}
                  {details?.participantToBeAdded?.drivers && (
                    <option
                      value={`${details.participantToBeAdded.drivers.id}|driver`}
                    >
                      {details.participantToBeAdded.drivers.first_name}{" "}
                      {details.participantToBeAdded.drivers.last_name} (DRIVER)
                    </option>
                  )}
                </select>

                <button
                  onClick={() => handleAddParticipentFunc()}
                  className="btn btn-success w-100 mt-3 shadow"
                  style={{ background: "#eab66d", border: "none" }}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showPopUp && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}

export default DriverChatBox;
