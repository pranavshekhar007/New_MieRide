import React, { useEffect, useState, useRef } from "react";
import { getChatSupportListServ } from "../../services/support.services";
import { updateNotificationStatusServ } from "../../services/notification.services";
import CustomTopNav from "../../components/CustomTopNav";
import NewSidebar from "../../components/NewSidebar";
import ChatSidebar from "../../components/ChatSidebar";
import moment from "moment";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useGlobalState } from "../../GlobalProvider";
import Ably from "ably";
import {
  getChatSupportByCaseId,
  supportSendMessageServ,
  supportChatAddParticipentServ,
  supportMessageMarkRead,
  supportUpdateServ,
  getParticipentListForChat,
  getMediaOfUserServ,
  markChatAsReadServ,
} from "../../services/support.services";
import EmojiPicker from "emoji-picker-react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Image_Base_Url } from "../../utils/api_base_url_configration";
import CustomPazination from "../../components/CustomPazination";

function ChatBox() {
  const { setGlobalState, globalState } = useGlobalState();
  const emojiPickerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const params = useParams();
  const [topNavCount, setTopNavCount] = useState({
    newChatUnreadCount: 0,
    activeChatUnreadCount: 0,
    closedChatUnreadCount: 0,
  });
  const navItems = [
    [
      {
        name: "New Request",
        path: "",
        status: "pending",
        notificationCount: topNavCount?.newChatUnreadCount,
      },
      {
        name: "Active Chat",
        path: "",
        status: "opened",
        notificationCount: topNavCount?.activeChatUnreadCount,
      },
      {
        name: "Close Chat",
        path: "",
        status: "closed",
        notificationCount: topNavCount?.closedChatUnreadCount,
      },
    ],
  ];
  const [list, setList] = useState([]);
  const [showSkelton, setShowSkelton] = useState(false);
  const [payload, setPayload] = useState({
    status: "pending",
    user_type: params?.user_type,
    category_id: params?.id,
    per_page: 10,
    page_no: 1,
  });
  const [pageData, setPageData] = useState({
    total_pages: "",
    current_page: "",
  });

  const getListFunc = async () => {
    if (list.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await getChatSupportListServ(payload);
      if (response?.data?.statusCode == "200") {
        setList(response?.data?.data);
        setShowUserDetails(false);
        setTopNavCount({
          newChatUnreadCount: response?.data?.newChatUnreadCount,
          activeChatUnreadCount: response?.data?.activeChatUnreadCount,
          closedChatUnreadCount: response?.data?.closedChatUnreadCount,
        });
        setPageData({
          total_pages: response?.data?.last_page,
          current_page: response?.data?.current_page,
        });
        getChatDetailsFunc(response?.data?.data[0]?.id);
        setDetails(null);
      }
    } catch (error) {
      console.log(error);
    }
    setShowSkelton(false);
  };
  useEffect(() => {
    setPayload({
      status: "pending",
      user_type: params?.user_type,
      category_id: params?.id,
    });
  }, [params]);
  useEffect(() => {
    getListFunc();
  }, [payload]);
  useEffect(() => {
      getListFunc();
      // Initialize Ably client with the API key
      const ably = new Ably.Realtime(
        "cgbtZA.AQetNw:hE5TCgJHH9F4gWbFqv6pD5ScBM-A_RnW0RQG7xwQg-Y"
      );
  
      // Helper to subscribe to a channel and its events
      const subscribeToChannel = (channelName, events) => {
        const channel = ably.channels.get(channelName);
        events.forEach((event) => {
          channel.subscribe(event, (message) => {
            console.log(
              `Received '${event}' real-time update on '${channelName}' channel:`,
              message.data
            );
            
            getListFunc();
          });
        });
        return channel;
      };
  
      // Channel-event mapping
      const channelEventMap = [
        {
          name: "admin-new-support-chat-case",
          events: ["new-support-case"],
        },
      ];
  
      // Subscribe to all channels and events
      const channels = channelEventMap.map(({ name, events }) =>
        subscribeToChannel(name, events)
      );
  
      return () => {
        ably.close();
      };
    }, [payload]);
  const [details, setDetails] = useState(null);
  const [showDetailLoader, setShowDetailLoader] = useState(false);
  const getChatDetailsFunc = async (id) => {
    if (details?.messages?.length == 0) {
      setShowDetailLoader(true);
    }
    try {
      let response = await getChatSupportByCaseId({ case_id: id });
      if (response?.data?.statusCode == "200") {
        setDetails({
          ...response?.data?.data,
          messages: response?.data?.data?.messages.reverse(),
        });
      }
      updateNotificationCountFunc(id);
    } catch (error) {
      console.log(error);
    }
    setShowDetailLoader(false);
  };

  const [formData, setFormData] = useState({
    case_id: details?.case_id,
    message: "",
    media_url: "",
    media_type: "",
    imgPrev: "",
  });
  useEffect(() => {
    if (details?.case_id) {
      setFormData({
        case_id: details?.case_id,
        message: "",
        media_url: "",
        media_type: "",
        imgPrev: "",
      });
    }
  }, [details]);
  const [loader, setLoader] = useState(false);
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
        getChatDetailsFunc(details?.case_id);
        setFormData({
          case_id: details?.case_id,
          message: "",

          media_url: "",
          media_type: "",
          imgPrev: "",
        });
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
    setLoader(false);
  };
  const [statusBtnLoader, setStatusButtonLoader] = useState(false);
  const updateTicketStatusFunc = async (status) => {
    setStatusButtonLoader(true);
    try {
      let response = await supportUpdateServ({
        case_id: details?.case_id,
        status: status,
      });
      if (response?.data?.statusCode == "200") {
        getListFunc();
        toast.success(response?.data?.message);
        setShowClosePopup(false);
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
    setStatusButtonLoader(false);
  };
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [mediaList, setMediaList] = useState([]);
  const [mediaLoader, setMediaLoader] = useState(false);
  const getMediaListFunc = async () => {
    setMediaLoader(true);
    try {
      let response = await getMediaOfUserServ({ case_id: details?.case_id });
      if (response?.data?.statusCode == "200") {
        setMediaList(response?.data?.data);
      }
    } catch (error) {}
    setMediaLoader(false);
  };
  const fileInputRef = useRef(null);
  const pdfInputRef = useRef(null);
  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  const handlePdfClick = () => {
    pdfInputRef.current.click();
  };
  // 👇 handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        media_type: "image",
        media_url: file,
        imgPrev: URL.createObjectURL(file),
      });
    }
  };
  const [selctedMedia, setSelectedMedia] = useState({
    media_url: "",
    media_type: "",
  });
  const [showClosePopup, setShowClosePopup] = useState(false);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [details?.messages]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const onEmojiClick = (emojiData) => {
    setFormData({
      ...formData,
      message: (formData?.message || "") + emojiData.emoji,
    });
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);
  const updateNotificationCountFunc = async (case_id) => {
    try {
      let response = await markChatAsReadServ({ case_id });
      if (response?.data?.statusCode == "200") {
      }
    } catch (error) {
      console.log(error);
    }
  };
   const onPerPageChange = (per_page) => {
    setPayload({
      ...payload,
      per_page: per_page,
      page_no: 1, // optionally reset to first page on per page change
    });
  };
  const onPageChange = (page) => {
    setPayload({
      ...payload,
      page_no: page,
    });
  };
  return (
    <div className="mainBody">
      <NewSidebar selectedItem="Chat Support" />
      <div className="contentLayout">
        <div className="bgWhite borderRadius30  minHeight100vh">
          <div className="d-flex">
            {/* chat sidebar */}
            <ChatSidebar selectedItem={payload?.category_id} />
            <div className="chatSupportMain w-100  p-4">
              <div className="ms-4">
                <div className="topNavMain">
                  <div className="d-flex justify-content-between ">
                    {navItems?.map((v, i) => {
                      return (
                        <div
                          className={
                            " d-flex bgDark borderRadius25 padding5  " +
                            (navItems?.length > 1 ? " mx-2" : " ")
                          }
                          style={{
                            width: (v?.length / navItems.length) * 100 + "%",
                          }}
                        >
                          {v?.map((value, i) => {
                            return (
                              <div
                                className="col m-0 p-0"
                                onClick={() =>
                                  setPayload({
                                    ...payload,
                                    status: value?.status,
                                  })
                                }
                              >
                                <div
                                  className={
                                    "borderRadius25 topNavItem " +
                                    (value?.status == payload?.status &&
                                      "bgSuccess")
                                  }
                                >
                                  <p
                                    className={
                                      value?.status == payload.status &&
                                      " textDark"
                                    }
                                  >
                                    {value?.name}
                                  </p>
                                  {value?.notificationCount != 0 && (
                                    <div
                                      className="chatCounter ms-2"
                                      style={{
                                        background: "#CC1200",
                                        marginTop: "-3px",
                                      }}
                                    >
                                      <p
                                        className="mb-0"
                                        style={{
                                          position: "relative",
                                          top: "2px",
                                          fontSize: "12px",
                                          fontWeight: "500",
                                        }}
                                      >
                                        {value?.notificationCount}{" "}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              {list?.length == 0 && !showSkelton ? (
                <div
                  className=" d-flex align-items-center w-100 text-center"
                  style={{ height: "80vh" }}
                >
                  <div className="w-100">
                    <div className="">
                      <img src="https://cdn-icons-png.flaticon.com/128/4460/4460756.png" />
                    </div>

                    <h5
                      className="text-center w-100"
                      style={{ fontFamily: "nexa" }}
                    >
                      No Support Ticket for this category
                    </h5>
                  </div>
                </div>
              ) : showSkelton ? (
                <div className="row">
                  <div className="col-lg-6">
                    <div className="mt-4">
                      {[1, 2, 3, 4, 5]?.map((v, i) => {
                        return (
                          <div className="chatUserCard ">
                            <div className="d-flex align-items-center">
                              <div>
                                <Skeleton
                                  height={70}
                                  width={70}
                                  borderRadius={35}
                                />
                              </div>
                              <div className="ms-3">
                                <Skeleton height={30} width={200} />
                                <Skeleton height={20} width={400} />
                                <Skeleton height={20} width={400} />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="mt-4">
                      <div className="d-flex justify-content-between align-items-center chatUserDetails mb-4">
                        <div className="d-flex align-items-center">
                          <Skeleton height={60} width={60} borderRadius={30} />
                          <h5>
                            <Skeleton height={20} width={200} />
                          </h5>
                        </div>
                        <div>
                          <Skeleton height={30} width={150} />
                        </div>
                      </div>
                      {[1, 2, 3, 4, 5, 6, 7].map((v, i) => {
                        return (
                          <div
                            className={
                              "d-flex mb-4" +
                              (i % 2 == 0
                                ? " justify-content-end"
                                : " justify-content-start")
                            }
                          >
                            <div
                              className={
                                "d-flex justify-content-between align-items-center chatItem " +
                                (i % 2 == 0 ? " row-reverse" : "")
                              }
                            >
                              <div
                                className={
                                  "d-flex align-items-center " +
                                  (i % 2 == 0 ? " ms-2" : " me-2")
                                }
                              >
                                <Skeleton
                                  height={35}
                                  width={35}
                                  borderRadius={17.5}
                                />
                              </div>
                              <Skeleton height={20} width={300} />
                            </div>
                          </div>
                        );
                      })}
                      <div className="chatAction d-flex align-items-center justify-content-between ">
                        <Skeleton height={30} width={300} />
                        <Skeleton height={30} width={30} borderRadius={15} />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="row">
                  <div className="col-lg-6">
                    <div
                      className=" mt-4"
                      style={{ height: "75vh", overflow: "auto" }}
                    >
                      {list?.map((v, i) => {
                        return (
                          <div
                            className="chatUserCard "
                            style={{
                              border:
                                details?.case_id == v?.id
                                  ? "2px solid black"
                                  : "2px solid white",
                              background:
                                v?.total_unread_message > 0
                                  ? "#F7F7F7"
                                  : "#fff",
                            }}
                            onClick={() => getChatDetailsFunc(v?.id)}
                          >
                            <div className="d-flex align-items-center justify-content-between">
                              <div className="d-flex align-items-center">
                                <div>
                                  <img
                                    src={
                                      v?.created_by_image
                                        ? Image_Base_Url + v?.created_by_image
                                        : "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
                                    }
                                  />
                                </div>
                                <div className="ms-3">
                                  <h6>{v?.created_by_name}</h6>
                                  <p>{v?.message}</p>
                                </div>
                              </div>

                              <div>
                                {v?.total_unread_message > 0 && (
                                  <div className="chatCounter">
                                    <p
                                      className="mb-0"
                                      style={{
                                        color: "white",
                                        fontSize: "11px",
                                        position: "relative",
                                        top: "2px",
                                      }}
                                    >
                                      {v?.total_unread_message}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <CustomPazination
                      current_page={pageData?.current_page}
                      onPerPageChange={onPerPageChange}
                      last_page={pageData?.total_pages}
                      per_page={payload?.per_page}
                      onPageChange={onPageChange}
                    />
                  </div>
                  {showDetailLoader ? (
                    <div className="col-lg-6">
                      <div className="mt-4">
                        <div className="d-flex justify-content-between align-items-center chatUserDetails mb-4">
                          <div className="d-flex align-items-center">
                            <Skeleton
                              height={60}
                              width={60}
                              borderRadius={30}
                            />
                            <h5>
                              <Skeleton height={20} width={200} />
                            </h5>
                          </div>
                          <div>
                            <Skeleton height={30} width={150} />
                          </div>
                        </div>
                        {[1, 2, 3, 4, 5, 6, 7].map((v, i) => {
                          return (
                            <div
                              className={
                                "d-flex mb-4" +
                                (i % 2 == 0
                                  ? " justify-content-end"
                                  : " justify-content-start")
                              }
                            >
                              <div
                                className={
                                  "d-flex justify-content-between align-items-center chatItem " +
                                  (i % 2 == 0 ? " row-reverse" : "")
                                }
                              >
                                <div
                                  className={
                                    "d-flex align-items-center " +
                                    (i % 2 == 0 ? " ms-2" : " me-2")
                                  }
                                >
                                  <Skeleton
                                    height={35}
                                    width={35}
                                    borderRadius={17.5}
                                  />
                                </div>
                                <Skeleton height={20} width={300} />
                              </div>
                            </div>
                          );
                        })}
                        <div className="chatAction d-flex align-items-center justify-content-between ">
                          <Skeleton height={30} width={300} />
                          <Skeleton height={30} width={30} borderRadius={15} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="col-lg-6">
                      {details && !showDetailLoader ? (
                        <div className="mt-4 chatBoxMainRight">
                          <div
                            className="d-flex justify-content-between align-items-center chatUserDetails mb-4 "
                            onClick={() => {
                              setShowUserDetails(!showUserDetails);
                              !showUserDetails && getMediaListFunc();
                            }}
                          >
                            <div className="d-flex align-items-center">
                              <img
                                src={
                                  list.filter(
                                    (v) => v?.id === details?.case_id
                                  )[0]?.created_by_image
                                    ? Image_Base_Url +
                                      list.filter(
                                        (v) => v?.id === details?.case_id
                                      )[0]?.created_by_image
                                    : "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
                                }
                              />
                              <h5>
                                {details?.first_name + " " + details?.last_name}
                              </h5>
                            </div>
                            {!showUserDetails ? (
                              <div>
                                <button>{details?.subject}</button>
                              </div>
                            ) : (
                              <div>
                                <img
                                  src="/imagefolder/closeBtn.png"
                                  style={{
                                    borderRadius: "0px",
                                    boxShadow: "none",
                                  }}
                                />
                              </div>
                            )}
                          </div>
                          {showUserDetails ? (
                            <div>
                              <div className="d-flex align-items-center justify-content-evenly  userDetailsExpendedBox">
                                <img
                                  src={
                                    list.filter(
                                      (v) => v?.id === details?.case_id
                                    )[0]?.created_by_image
                                      ? Image_Base_Url +
                                        list.filter(
                                          (v) => v?.id === details?.case_id
                                        )[0]?.created_by_image
                                      : "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
                                  }
                                />
                                <div className="">
                                  <div className="expendedBtnDiv">
                                    <p>
                                      User ID{" "}
                                      {
                                        list.filter(
                                          (v) => v?.id === details?.case_id
                                        )[0]?.created_by_unique_id
                                      }
                                    </p>
                                    <div className="caseDiv">
                                      Case ID :{" "}
                                      {
                                        list.filter(
                                          (v) => v?.id === details?.case_id
                                        )[0]?.id
                                      }
                                    </div>
                                  </div>
                                  <button className="expendedActiveBtn mt-2">
                                    Active
                                  </button>
                                </div>
                              </div>

                              <p className="mediaBtn mt-4 mb-3">Media</p>
                              <div className="row mx-4 p-0 mediaDiv">
                                {mediaLoader
                                  ? [1, 2, 3, 4, 5, 6, 7, 8]?.map((v, i) => {
                                      return (
                                        <div className="col-3 m-0 p-0  d-flex justify-content-center mb-2">
                                          <Skeleton
                                            height={80}
                                            width={80}
                                            borderRadius={10}
                                          />
                                        </div>
                                      );
                                    })
                                  : mediaList?.map((v, i) => {
                                      return (
                                        <div className="col-3 m-0 p-0  d-flex justify-content-center">
                                          <img
                                            src={Image_Base_Url + v?.media_url}
                                          />
                                        </div>
                                      );
                                    })}
                              </div>
                              {mediaList?.length == 0 && !mediaLoader && (
                                <p
                                  className="text-center my-5 py-3"
                                  style={{ fontFamily: "nexa" }}
                                >
                                  No Media Found
                                </p>
                              )}
                              <div className="ps-4 mt-4">
                                {payload?.status == "closed" ? (
                                  <button className="resolvedBtn">
                                    <i
                                      className="fa fa-close me-2"
                                      style={{
                                        fontSize: "22px",
                                        fontWeight: "300",
                                        position: "relative",
                                        top: "2px",
                                      }}
                                    />{" "}
                                    Closed
                                  </button>
                                ) : statusBtnLoader ? (
                                  <button className="resolvedBtn">
                                    <i
                                      className="fa fa-close me-2"
                                      style={{
                                        fontSize: "22px",
                                        fontWeight: "300",
                                        position: "relative",
                                        top: "2px",
                                        opacity: "0.5",
                                      }}
                                    />{" "}
                                    Updating ...
                                  </button>
                                ) : (
                                  <button
                                    className="resolvedBtn"
                                    onClick={() => setShowClosePopup(true)}
                                  >
                                    <i
                                      className="fa fa-close me-2"
                                      style={{
                                        fontSize: "22px",
                                        fontWeight: "300",
                                        position: "relative",
                                        top: "2px",
                                      }}
                                    />{" "}
                                    Resole & Close
                                  </button>
                                )}
                              </div>
                            </div>
                          ) : (
                            <>
                              <div
                                className="hideScrollbar mx-4"
                                style={{ height: "60vh", overflow: "auto" }}
                              >
                                {details?.messages?.map((v, i) => {
                                  return (
                                    <div
                                      className={
                                        "d-flex mb-4 " +
                                        (v?.sender_type == "admin"
                                          ? " justify-content-end"
                                          : " justify-content-start")
                                      }
                                    >
                                      <div
                                        className={
                                          "d-flex justify-content-between align-items-center chatItem " +
                                          (v?.sender_type == "admin"
                                            ? " row-reverse"
                                            : "")
                                        }
                                      >
                                        <div
                                          className={
                                            "d-flex align-items-center " +
                                            (v?.sender_type == "admin"
                                              ? " ms-2"
                                              : " me-2")
                                          }
                                        >
                                          <img
                                            style={{
                                              borderRadius:
                                                v?.sender_type == "admin"
                                                  ? "0px"
                                                  : "50%",
                                              width:
                                                v?.sender_type == "admin"
                                                  ? "20px"
                                                  : "35px",
                                            }}
                                            src={
                                              v?.sender_type == "admin"
                                                ? "/imagefolder/chatBrand.png"
                                                : list.filter(
                                                    (v) =>
                                                      v?.id === details?.case_id
                                                  )[0]?.created_by_image
                                                ? Image_Base_Url +
                                                  list.filter(
                                                    (v) =>
                                                      v?.id === details?.case_id
                                                  )[0]?.created_by_image
                                                : "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
                                            }
                                          />
                                        </div>
                                        {v?.media_type == "image" ? (
                                          <img
                                            onClick={() =>
                                              setSelectedMedia({
                                                media_type: v?.media_type,
                                                media_url:
                                                  Image_Base_Url + v?.media_url,
                                              })
                                            }
                                            style={{
                                              height: "80px",
                                              width: "80px",
                                              borderRadius: "5px",
                                              objectFit: "cover",
                                            }}
                                            src={Image_Base_Url + v?.media_url}
                                          />
                                        ) : (
                                          <p style={{ whiteSpace: "pre-wrap", marginTop: "10px" }}>{v?.message}</p>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                                <div ref={messagesEndRef} />
                              </div>
                              {payload?.status == "pending" && (
                                <div className=" d-flex align-items-center justify-content-between trnsferChatBtnGroup mx-4">
                                  <button
                                    onClick={() => toast.info("Coming Soon")}
                                  >
                                    Transfer
                                  </button>
                                  {statusBtnLoader ? (
                                    <button
                                      className="bgDark textWhite"
                                      style={{ opacity: "0.5" }}
                                    >
                                      Updating ...
                                    </button>
                                  ) : (
                                    <button
                                      className="bgDark textWhite"
                                      onClick={() => {
                                        updateTicketStatusFunc("opened");
                                      }}
                                    >
                                      Start Chat
                                    </button>
                                  )}
                                </div>
                              )}
                              {payload?.status == "opened" && (
                                <div className="chatAction d-flex align-items-center justify-content-between mx-4">
                                  <div>
                                    <img
                                      src="https://cdn-icons-png.flaticon.com/128/709/709950.png"
                                      className="voiceIcon"
                                      onClick={() => toast.info("Coming Soon")}
                                    />
                                    <textarea
                                      placeholder="Write something"
                                      className="mx-2"
                                      rows={1}
                                      value={formData?.message}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          message: e?.target?.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="d-flex">
                                    <div className="d-flex otherActionImg align-items-center justify-content-end">
                                      <img
                                        src="https://cdn-icons-png.flaticon.com/128/54/54719.png"
                                        style={{
                                          height: "15px",
                                          width: "17px",
                                        }}
                                        onClick={() =>
                                          toast.info("Coming Soon")
                                        }
                                      />
                                      <input
                                        type="file"
                                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.rtf,.odt"
                                        ref={pdfInputRef}
                                        style={{ display: "none" }}
                                        onChange={handleFileChange}
                                      />
                                      <img
                                        src="https://cdn-icons-png.flaticon.com/128/2951/2951086.png"
                                        onClick={handleImageClick}
                                      />
                                      <input
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        style={{ display: "none" }}
                                        onChange={handleFileChange}
                                      />

                                      <img
                                        src="https://cdn-icons-png.flaticon.com/128/3404/3404134.png"
                                        style={{ cursor: "pointer" }}
                                        onClick={() =>
                                          setShowEmojiPicker(!showEmojiPicker)
                                        }
                                      />
                                    </div>
                                    {loader ? (
                                      <div
                                        style={{ opacity: "0.5" }}
                                        className="sendBtn d-flex justify-content-center align-items-center"
                                      >
                                        <img src="https://cdn-icons-png.flaticon.com/128/10426/10426419.png" />
                                      </div>
                                    ) : formData?.message ||
                                      formData?.media_url ? (
                                      <div
                                        className="sendBtn d-flex justify-content-center align-items-center"
                                        onClick={() => handleSubmitChatFunc()}
                                      >
                                        <img src="https://cdn-icons-png.flaticon.com/128/10426/10426419.png" />
                                      </div>
                                    ) : (
                                      <div
                                        style={{ opacity: "0.5" }}
                                        className="sendBtn d-flex justify-content-center align-items-center"
                                      >
                                        <img src="https://cdn-icons-png.flaticon.com/128/10426/10426419.png" />
                                      </div>
                                    )}
                                  </div>
                                  {showEmojiPicker && (
                                    <div
                                      ref={emojiPickerRef}
                                      style={{
                                        position: "absolute",
                                        bottom: "110px",
                                        right: "100",
                                        zIndex: 9999,
                                      }}
                                    >
                                      <EmojiPicker
                                        onEmojiClick={onEmojiClick}
                                        theme="light"
                                      />
                                    </div>
                                  )}
                                </div>
                              )}
                              {payload?.status == "closed" && (
                                <div className="ps-4">
                                  <button className="resolvedBtn">
                                    Resolved
                                  </button>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      ) : (
                        <div
                          className=" d-flex align-items-center w-100 text-center mx-4"
                          style={{ height: "80vh" }}
                        >
                          <div className="w-100">
                            <div className="">
                              <img src="https://cdn-icons-png.flaticon.com/128/3601/3601877.png" />
                            </div>

                            <h5
                              className="text-center w-100 mt-4"
                              style={{ fontFamily: "nexa" }}
                            >
                              Please select case ID to view message
                            </h5>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {formData?.imgPrev && (
        <div
          className="modal fade show d-flex align-items-center   justify-content-center "
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content tipPopUp" style={{ width: "320px" }}>
              <div className="d-flex justify-content-center tipPopUpHeading">
                <p className="mb-0">Selected Media</p>
              </div>

              <div
                className="modal-body tipPopUpBody"
                style={{ padding: "20px" }}
              >
                <div
                  style={{
                    wordWrap: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                  className="d-flex justify-content-center w-100 "
                >
                  <div className="w-100">
                    <div className=" d-flex align-items-center justify-content-center">
                      <img
                        style={{
                          width: "100%",
                          borderRadius: "10px",
                          objectFit: "cover",
                        }}
                        src={formData?.imgPrev}
                      />
                    </div>

                    <div className="d-flex justify-content-between userPopupBtnGroup mt-4">
                      <button
                        onClick={() =>
                          setFormData({
                            ...formData,
                            media_type: "",
                            imgPrev: "",
                            media_url: "",
                          })
                        }
                      >
                        Cancel
                      </button>
                      {loader ? (
                        <button
                          className="textWhite"
                          style={{ background: "#1C1C1E", opacity: "0.5" }}
                        >
                          Sending ...
                        </button>
                      ) : (
                        <button
                          className="textWhite"
                          style={{ background: "#1C1C1E" }}
                          onClick={() => handleSubmitChatFunc()}
                        >
                          Send
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-center"></div>
              </div>
            </div>
          </div>
        </div>
      )}
      {formData?.imgPrev && <div className="modal-backdrop fade show"></div>}
      {selctedMedia?.media_url && (
        <div
          className="modal fade show d-flex align-items-center   justify-content-center "
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div
              className="modal-content routePopup"
              style={{ padding: "20px" }}
            >
              <div className="modal-body ">
                <div
                  style={{
                    wordWrap: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                  className="d-flex justify-content-center w-100 "
                >
                  <div className="w-100">
                    <div className="d-flex justify-content-center">
                      <img
                        src={selctedMedia?.media_url}
                        style={{ width: "100%" }}
                      />
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-center mt-4">
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/660/660252.png"
                    style={{ height: "50px" }}
                    onClick={() => {
                      setSelectedMedia({
                        media_type: "",
                        media_url: "",
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {selctedMedia?.media_url && (
        <div className="modal-backdrop fade show"></div>
      )}
      {showClosePopup && (
        <div
          className="modal fade show d-flex align-items-center   justify-content-center "
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content tipPopUp" style={{ width: "516px" }}>
              <div className="d-flex justify-content-center tipPopUpHeading">
                <p className="mb-0"> Close Chat Confirmation</p>
              </div>

              <div
                className="modal-body tipPopUpBody"
                style={{ padding: "20px" }}
              >
                <div
                  style={{
                    wordWrap: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                  className="d-flex justify-content-center w-100 "
                >
                  <div className="w-100 px-5">
                    <div className=" d-flex align-items-center justify-content-center">
                      <img className="mb-2" src="/imagefolder/exMark.png" />
                    </div>
                    <p>Are you sure you want to Resolve & Close this Chat ?</p>
                    <div className="d-flex justify-content-end userPopupBtnGroup mt-4">
                      <button
                        onClick={() => setShowClosePopup(false)}
                        className="mx-2"
                      >
                        Cancel
                      </button>
                      {statusBtnLoader ? (
                        <button
                          className="textWhite mx-2"
                          style={{ background: "#1C1C1E", opacity: "0.5" }}
                        >
                          Sending ...
                        </button>
                      ) : (
                        <button
                          className="textWhite mx-2"
                          style={{ background: "#1C1C1E" }}
                          onClick={() => updateTicketStatusFunc("closed")}
                        >
                          Yes, Close
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-center"></div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showClosePopup && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}

export default ChatBox;
