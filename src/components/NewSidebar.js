import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalState } from "../GlobalProvider";
import { Tooltip } from "react-tooltip";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { getNotificationListServ } from "../services/notification.services";
import moment from "moment-timezone";

function NewSidebar({ selectedItem }) {
  const { globalState, setGlobalState } = useGlobalState();
  const navigate = useNavigate();

  // ---------- NAV ITEMS ----------
  const superAdminNavItems = [
    { title: "Dashboard", img: "https://cdn-icons-png.flaticon.com/128/1828/1828791.png", path: "/" },
    { title: "Command Center", img: "https://cdn-icons-png.flaticon.com/128/17849/17849118.png", path: "/create-role" },

    {
      title: "Booking Dashboard",
      img: "https://cdn-icons-png.flaticon.com/128/7322/7322293.png",
      path: "/sharing-group-booking",
      notificationLength: globalState?.notificationList?.filter(v => v?.notifiable_type === "Booking" && v?.is_read === 0).length,
    },
    {
      title: "Chat Support",
      img: "https://cdn-icons-png.flaticon.com/128/2840/2840215.png",
      path: "/chat-support",
      notificationLength: globalState?.notificationList?.filter(v => v?.notifiable_type === "Support" && v?.is_read === 0).length,
    },
    {
      title: "Funds Management",
      img: "https://cdn-icons-png.flaticon.com/128/2933/2933181.png",
      path: "/user-interac-deposite",
      notificationLength: globalState?.notificationList?.filter(v => v?.notifiable_type === "Fund" && v?.is_read === 0).length,
    },

    {
      title: "Users",
      img: "/icons/sidebarIcons/user.png",
      path: "/user-list",
      notificationLength: globalState?.notificationList?.filter(v => v?.notifiable_type === "User" && v?.is_read === 0).length,
    },
    {
      title: "Drivers",
      img: "/icons/sidebarIcons/driver.png",
      path: "/driver-list",
      notificationLength: globalState?.notificationList?.filter(v => v?.notifiable_type === "Driver" && v?.is_read === 0).length,
    },

    { title: "Broadcast Manager", img: "https://cdn-icons-png.flaticon.com/128/115/115893.png", path: "/broadcast-user-schedule-booking-sharing" },
    { title: "Ad Control Panel", img: "https://cdn-icons-png.flaticon.com/128/4832/4832950.png", path: "/ads-user-panel" },
    { title: "Rewards", img: "https://cdn-icons-png.flaticon.com/128/10419/10419600.png", path: "/rewards-details" },
    { title: "Reports", img: "https://cdn-icons-png.flaticon.com/128/1508/1508305.png", path: "/report" },
    { title: "Coupons", img: "https://cdn-icons-png.flaticon.com/128/9221/9221356.png", path: "/coupon-list" },
    { title: "Settings", img: "https://cdn-icons-png.flaticon.com/128/807/807313.png", path: "/pricing-categories" },
    { title: "Blogs", img: "https://cdn-icons-png.flaticon.com/128/6463/6463648.png", path: "/blog-list" },
    { title: "Support", img: "https://cdn-icons-png.flaticon.com/128/4526/4526832.png", path: "/support-faq-user" },
  ];

  const blogAdminNavItems = [
    { title: "Blogs", img: "https://cdn-icons-png.flaticon.com/128/6463/6463648.png", path: "/" },
  ];

  const broadcastAdminNavItems = [
    { title: "Broadcast Manager", img: "https://cdn-icons-png.flaticon.com/128/115/115893.png", path: "/" },
  ];

  const PartialAdminNavItems = [
    {
      title: "Booking Dashboard",
      img: "https://cdn-icons-png.flaticon.com/128/7322/7322293.png",
      path: "/",
      notificationLength: globalState?.notificationList?.filter(v => v?.notifiable_type === "Booking" && v?.is_read === 0).length,
    },
    {
      title: "Chat Support",
      img: "https://cdn-icons-png.flaticon.com/128/2840/2840215.png",
      path: "/chat-support",
      notificationLength: globalState?.notificationList?.filter(v => v?.notifiable_type === "Support" && v?.is_read === 0).length,
    },
    {
      title: "Funds Management",
      img: "https://cdn-icons-png.flaticon.com/128/2933/2933181.png",
      path: "/user-interac-deposite",
      notificationLength: globalState?.notificationList?.filter(v => v?.notifiable_type === "Fund" && v?.is_read === 0).length,
    },
  ];

  // ---------- FETCH NOTIFICATIONS ----------
  const handleGetNotificationFunc = async () => {
    try {
      let response = await getNotificationListServ({ notifiable_type: "" });
      if (response?.data?.statusCode === "200") {
        setGlobalState({
          ...globalState,
          notificationList: response?.data?.data,
        });
      } else {
        setGlobalState({ ...globalState, notificationList: [] });
      }
    } catch {
      setGlobalState({ ...globalState, notificationList: [] });
    }
  };

  useEffect(() => {
    handleGetNotificationFunc();
  }, []);

  // ---------- TIME ----------
  const [time, setTime] = useState();
  useEffect(() => {
    setTime(moment().tz("America/Toronto").format("ddd D MMM hh:mm A"));
    const interval = setInterval(() => {
      setTime(moment().tz("America/Toronto").format("ddd D MMM hh:mm A"));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // ---------- LOGOUT ----------
  const handleLogoutFunc = () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (!confirmed) return;

    localStorage.removeItem("access_token");
    localStorage.removeItem("mie_ride_user");
    localStorage.removeItem("mie_ride_user_permissions");

    setGlobalState({
      access_token: null,
      user: null,
      permissions: null,
    });

    navigate("/");
  };

  // ---------- ROLE → NAV MAPPING ----------
  const navMap = {
    superAdmin: superAdminNavItems,
    blogAdmin: blogAdminNavItems,
    broadcastAdmin: broadcastAdminNavItems,
    partialAdmin: PartialAdminNavItems,
  };

  // Determine user role
  let currentNavItems = [];

  if (globalState?.user?.is_superadmin) {
    currentNavItems = navMap.superAdmin;
  } else if (globalState?.user?.is_mierideuser) {
    currentNavItems = navMap.blogAdmin;
  } else if (globalState?.user?.is_broadcastuser && globalState?.user?.email === "zoya@gmail.com") {
    currentNavItems = navMap.partialAdmin;
  } else if (globalState?.user?.is_broadcastuser) {
    currentNavItems = navMap.broadcastAdmin;
  }

  // Add Logout to ALL roles except superadmin
  if (!globalState?.user?.is_superadmin) {
    currentNavItems.push({
      title: "Logout",
      img: "https://cdn-icons-png.flaticon.com/128/2529/2529508.png",
      path: "logout",
    });
  }

  // ---------- REUSABLE NAV RENDER FUNCTION ----------
  const renderNavItem = (v) => {
    const isSelected = v.title === selectedItem;

    return (
      <div
        key={v.title}
        onClick={() => (v.path === "logout" ? handleLogoutFunc() : navigate(v.path))}
        className={
          "d-flex align-items-center navItem" +
          (isSelected ? " bgSuccess" : "") +
          (globalState.isFillSidebarWidth100 ? " justify-content-center" : " justify-content-between")
        }
      >
        <div className="d-flex align-items-center">
          <img src={v.img} className={isSelected ? "imgBlackFilter" : ""} />

          {!globalState.isFillSidebarWidth100 && (
            <p className={isSelected ? "textDark" : ""}>{v.title}</p>
          )}

          {globalState.isFillSidebarWidth100 && v.notificationLength > 0 && (
            <div className="minisidebarNotificationCount">
              <span>{v.notificationLength}</span>
            </div>
          )}
        </div>

        {!globalState.isFillSidebarWidth100 && v.notificationLength > 0 && (
          <div>
            <span>{v.notificationLength}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className="sidebarMain"
      style={{
        width: globalState?.isFillSidebarWidth100 ? "100px" : "250px",
        minWidth: globalState?.isFillSidebarWidth100 ? "100px" : "250px",
      }}
    >
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center">
        {!globalState?.isFillSidebarWidth100 && <p className="timeP">{time}</p>}

        <div className="sidebarActionImgBox d-flex justify-content-center align-items-center">
          <img src="https://cdn-icons-png.flaticon.com/128/1827/1827425.png" alt="notificationIcon" />
        </div>

        <div
          className="sidebarActionImgBox d-flex justify-content-center align-items-center"
          onClick={() =>
            setGlobalState({
              ...globalState,
              isFillSidebarWidth100: !globalState.isFillSidebarWidth100,
            })
          }
        >
          <img src="https://cdn-icons-png.flaticon.com/128/1828/1828859.png" alt="barIcon" />
        </div>
      </div>

      {/* LOGO */}
      <div className="d-flex justify-content-center my-2">
        <img src="/imagefolder/brandLogo.png" alt="brandlogo" className="brandLogo" />
        {!globalState.isFillSidebarWidth100 && (
          <img src="/imagefolder/brandName.png" alt="brandName" className="brandName" />
        )}
      </div>

      {/* NAV ITEMS */}
      <div className="mt-4">
        {currentNavItems.map(renderNavItem)}
      </div>
    </div>
  );


  return (
    <div
      className={
        globalState?.isFillSidebarWidth100 ? " sidebarMain" : " miniSideBar"
      }
    >
      <div
        className="position-sticky top-0 pt-4 "
        style={{ zIndex: "100", background: "#363535" }}
      >
        <div
          className={
            " d-flex  mb-2  w-100 " +
            (globalState?.isFillSidebarWidth100
              ? " justify-content-end"
              : " justify-content-center")
          }
        >
          <p
            className={
              " shadow p-1 px-2 rounded me-3" +
              (globalState?.isFillSidebarWidth100 ? " d-block" : " d-none")
            }
            style={{
              background: "#fff",
              color: "#000",
            }}
          >
            {time}
          </p>
          <div className="me-1">
            <div
              style={{
                height: "40px",
                width: "40px",
                background:
                  selectedItem == "Notification" ? "#139F01" : "#363535",
                borderRadius: "50%",
                top: "-5px",
                position: "relative",
              }}
            ></div>
            {globalState?.user?.is_superadmin ? (
              <div
                onClick={() =>
                  globalState?.notificationList?.length &&
                  navigate(
                    selectedItem == "Notification" ? "/" : "/user-notification"
                  )
                }
                style={{
                  zIndex: "1000",
                  position: "relative",
                  left: "8px",
                  top: "-40px",
                  marginBottom: "-40px",
                }}
              >
                <img
                  className="me-3"
                  style={{
                    height: "22px",
                    width: "22px",
                    filter: "brightness(0) invert(1)",
                  }}
                  src="https://cdn-icons-png.flaticon.com/128/2645/2645890.png"
                />
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{
                    background: "#FB0003",
                    borderRadius: "50%",
                    height: "14px",
                    width: "14px",
                    fontSize: "10px",
                    color: "white",
                    position: "relative",
                    top: "-8px",
                    left: "10px",
                  }}
                >
                  <p className="mb-0">
                    {
                      globalState?.notificationList?.filter((v, i) => {
                        return v?.is_read == 0;
                      }).length
                    }
                  </p>
                </div>
              </div>
            ) : (
              <div
                style={{
                  zIndex: "80",
                  position: "relative",
                  left: "8px",
                  top: "-40px",
                  marginBottom: "-40px",
                }}
              >
                <img
                  className="me-3"
                  style={{
                    height: "22px",
                    width: "22px",
                    filter: "brightness(0) invert(1)",
                  }}
                  src="https://cdn-icons-png.flaticon.com/128/4139/4139573.png"
                  onClick={() => handleLogoutFunc()}
                />
              </div>
            )}
          </div>

          <i
            className="fa fa-bars text-light"
            style={{ fontSize: "22px" }}
            onClick={() =>
              setGlobalState({
                ...globalState,
                isFillSidebarWidth100: !globalState.isFillSidebarWidth100,
              })
            }
          ></i>
        </div>
      </div>

      <div className="d-flex justify-content-center align-items-center  logoGroup">
        <div>
          <img
            src="/icons/sidebarIcons/brandLogo.png"
            className="mx-2"
            style={{
              height: globalState?.isFillSidebarWidth100 ? " 100px" : " 60px",
              marginBottom: globalState?.isFillSidebarWidth100
                ? " 0px"
                : " -35px",
            }}
          />
        </div>

        {globalState?.isFillSidebarWidth100 && (
          <img src="/icons/greenLogo.png" className="mx-2" />
        )}
      </div>
      <div className="navItemsContainer">
        {globalState?.user?.is_superadmin
          ? superAdminNavItems?.map((v, i) => (
              <div
                key={i}
                onClick={() => navigate(v?.path)}
                className="d-flex align-items-center sideNavItem"
                style={{
                  background: selectedItem === v?.title ? "#D0FF13" : "",
                }}
              >
                {globalState?.isFillSidebarWidth100 ? (
                  <img
                    src={v?.img}
                    alt="icon"
                    style={{
                      filter:
                        v?.title == selectedItem
                          ? "brightness(1) invert(0)"
                          : "brightness(0) invert(1)",
                    }}
                  />
                ) : (
                  <Tippy
                    content={
                      <span
                        style={{
                          color: "#139F01",
                          fontFamily: "Poppins",
                          borderRadius: "6px",
                          padding: "2px 4px",
                        }}
                      >
                        {v?.title}
                      </span>
                    }
                    placement="top"
                    theme="custom-tooltip"
                  >
                    <img
                      src={v?.img}
                      alt="Icon"
                      style={{
                        filter:
                          v?.title == selectedItem
                            ? "brightness(1) invert(0)"
                            : "brightness(0) invert(1)",
                      }}
                    />
                  </Tippy>
                )}

                {globalState?.isFillSidebarWidth100 && (
                  <p
                    className="mb-0"
                    style={{
                      color: selectedItem === v?.title ? "#000" : "",
                    }}
                  >
                    {v?.title}
                  </p>
                )}

                {v?.notificationLength ? (
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{
                      background: "#FB0003",
                      borderRadius: "50%",
                      height: "14px",
                      width: "14px",
                      fontSize: "10px",
                      color: "white",
                      position: "relative",
                      top: "-8px",
                      left: "10px",
                    }}
                  >
                    <p
                      className="mb-0"
                      style={{ fontSize: "8px", marginLeft: "0px" }}
                    >
                      {v?.notificationLength}
                    </p>
                  </div>
                ) : null}
              </div>
            ))
          : globalState?.user?.is_mierideuser
          ? blogAdminNavItems?.map((v, i) => (
              <div
                key={i}
                onClick={() => navigate(v?.path)}
                className="d-flex align-items-center sideNavItem"
                style={{
                  background: selectedItem === v?.title ? "#139F01" : "",
                }}
              >
                {globalState?.isFillSidebarWidth100 ? (
                  <img src={v?.img} alt="icon" />
                ) : (
                  <Tippy
                    content={
                      <span
                        style={{
                          color: "#139F01",
                          fontFamily: "Poppins",
                          borderRadius: "6px",
                          padding: "2px 4px",
                        }}
                      >
                        {v?.title}
                      </span>
                    }
                    placement="top"
                    theme="custom-tooltip"
                  >
                    <img src={v?.img} alt="Icon" />
                  </Tippy>
                )}

                {globalState?.isFillSidebarWidth100 && (
                  <p className="mb-0">{v?.title}</p>
                )}

                {v?.notificationLength ? (
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{
                      background: "#FB0003",
                      borderRadius: "50%",
                      height: "14px",
                      width: "14px",
                      fontSize: "10px",
                      color: "white",
                      position: "relative",
                      top: "-8px",
                      left: "10px",
                    }}
                  >
                    <p
                      className="mb-0"
                      style={{ fontSize: "8px", marginLeft: "0px" }}
                    >
                      {v?.notificationLength}
                    </p>
                  </div>
                ) : null}
              </div>
            ))
          : broadcastAdminNavItems?.map((v, i) => (
              <div
                key={i}
                onClick={() => navigate(v?.path)}
                className="d-flex align-items-center sideNavItem"
                style={{
                  background: selectedItem === v?.title ? "#139F01" : "",
                }}
              >
                {globalState?.isFillSidebarWidth100 ? (
                  <img src={v?.img} alt="icon" />
                ) : (
                  <Tippy
                    content={
                      <span
                        style={{
                          color: "#139F01",
                          fontFamily: "Poppins",
                          borderRadius: "6px",
                          padding: "2px 4px",
                        }}
                      >
                        {v?.title}
                      </span>
                    }
                    placement="top"
                    theme="custom-tooltip"
                  >
                    <img src={v?.img} alt="Icon" />
                  </Tippy>
                )}

                {globalState?.isFillSidebarWidth100 && (
                  <p className="mb-0">{v?.title}</p>
                )}

                {v?.notificationLength ? (
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{
                      background: "#FB0003",
                      borderRadius: "50%",
                      height: "14px",
                      width: "14px",
                      fontSize: "10px",
                      color: "white",
                      position: "relative",
                      top: "-8px",
                      left: "10px",
                    }}
                  >
                    <p
                      className="mb-0"
                      style={{ fontSize: "8px", marginLeft: "0px" }}
                    >
                      {v?.notificationLength}
                    </p>
                  </div>
                ) : null}
              </div>
            ))}
      </div>
      <Tooltip id="my-tooltip" className="custom-tooltip" />
    </div>
  );
}

export default NewSidebar;
