import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalState } from "../GlobalProvider";
import { Tooltip } from "react-tooltip";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { getNotificationListServ } from "../services/notification.services";
import moment from "moment-timezone";
function Sidebar({ selectedItem }) {
  const { globalState, setGlobalState } = useGlobalState();
  const navigate = useNavigate();

  const superAdminNavItems = [
    {
      title: "Dashboard",
      img: "https://cdn-icons-png.flaticon.com/128/1828/1828791.png",
      path: "/",
    },

    {
      title: "Command Center",
      img: "https://cdn-icons-png.flaticon.com/128/17849/17849118.png",
      path: "/create-role",
    },

    {
      title: "Booking Dashboard",
      img: "https://cdn-icons-png.flaticon.com/128/7322/7322293.png",
      path: "/sharing-group-booking",
      notificationLength: globalState?.notificationList?.filter((v, i) => {
        return v?.notifiable_type == "Booking" && v?.is_read == 0;
      }).length,
    },
    {
      title: "Chat Support",
      img: "https://cdn-icons-png.flaticon.com/128/2840/2840215.png",
      path: "/user-chat-support",
      notificationLength: globalState?.notificationList?.filter((v, i) => {
        return v?.notifiable_type == "Support" && v?.is_read == 0;
      }).length,
    },
    {
      title: "Funds Management",
      img: "https://cdn-icons-png.flaticon.com/128/2933/2933181.png",
      path: "/user-interac-deposite",
      notificationLength: globalState?.notificationList?.filter((v, i) => {
        return v?.notifiable_type == "Fund" && v?.is_read == 0;
      }).length,
    },
    
    

    {
      title: "User",
      img: "/icons/sidebarIcons/user.png",
      path: "/user-list",
      notificationLength: globalState?.notificationList?.filter((v, i) => {
        return v?.notifiable_type == "User" && v?.is_read == 0;
      }).length,
    },
    {
      title: "Driver",
      img: "/icons/sidebarIcons/driver.png",
      path: "/driver-list",
      notificationLength: globalState?.notificationList?.filter((v, i) => {
        return v?.notifiable_type == "Driver" && v?.is_read == 0;
      }).length,
    },
    
     {
      title: "Broadcast Manager",
      img: "https://cdn-icons-png.flaticon.com/128/115/115893.png",
      path: "/broadcast-user-schedule-booking-sharing",
    },
    {
      title: "Ad Control Panel",
      img: "https://cdn-icons-png.flaticon.com/128/4832/4832950.png",
      path: "/ads-user-panel",
    },
    {
      title: "Finance Hub",
      img: "https://cdn-icons-png.flaticon.com/128/2769/2769524.png",
      path: "/finance-details",
      notificationLength: globalState?.notificationList?.filter((v, i) => {
        return v?.notifiable_type == "Finance" && v?.is_read == 0;
      }).length,
    },
    {
      title: "Reports",
      img: "https://cdn-icons-png.flaticon.com/128/1508/1508305.png",
      path: "/report",
    },
    // {
    //   title: "Commission",
    //   img: "/icons/sidebarIcons/commission.png",
    //   path: "/commission",
    // },
    {
      // title: "Pricing & Cities",
      title: "Coupons",
      img: "https://cdn-icons-png.flaticon.com/128/9221/9221356.png",
      path: "/coupon-list",
    },
    {
      // title: "Pricing & Cities",
      title: "Settings",
      img: "https://cdn-icons-png.flaticon.com/128/807/807313.png",
      path: "/pricing-categories",
    },
    {
      title: "Blogs",
      img: "https://cdn-icons-png.flaticon.com/128/6463/6463648.png",
      path: "/blog-list",
    },
    {
      title: "Support",
      img: "https://cdn-icons-png.flaticon.com/128/4526/4526832.png",
      path: "/support-faq-user",
    },
  ];
  const blogAdminNavItems = [
    {
      title: "Blogs",
      img: "https://cdn-icons-png.flaticon.com/128/6463/6463648.png",
      path: "/",
    },
  ];
  const broadcastAdminNavItems = [
     {
      title: "Broadcast Manager",
      img: "https://cdn-icons-png.flaticon.com/128/115/115893.png",
      path: "/",
    },
  ];
  const handleGetNotificationFunc = async () => {
    try {
      let response = await getNotificationListServ({ notifiable_type: "" });
      if (response?.data?.statusCode == "200") {
        setGlobalState({
          ...globalState,
          notificationList: response?.data?.data,
        });
      } else {
        setGlobalState({ ...globalState, notificationList: 0 });
      }
    } catch (error) {
      setGlobalState({ ...globalState, notificationList: 0 });
    }
  };
  useEffect(() => {
    handleGetNotificationFunc();
    console.log(globalState);
  }, []);
  const [time, setTime] = useState();
  useEffect(() => {
    setTime(moment().tz("America/Toronto").format("ddd D MMM hh:mm A"));
    setInterval(() => {
      setTime(moment().tz("America/Toronto").format("ddd D MMM hh:mm A"));
    }, 30000);
  });
  console.log(
    globalState?.notificationList?.filter((v, i) => {
      return v?.notifiable_type == "Booking" && v?.is_read == 0;
    })
  );
  const handleLogoutFunc = () => {
    const confirmed = window.confirm("Are you sure you want to log out?");

    if (confirmed) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("mie_ride_user");
      localStorage.removeItem("mie_ride_user_permissions");
      setGlobalState({
        access_token: null,
        user: null,
        permissions: null,
      });
      navigate("/");
      // toast.success("Logged out successfully!");
    }
  };
  return (
    <div
      className={
        globalState?.isFillSidebarWidth100 ? " sidebarMain" : " miniSideBar"
      }
    >
      <div className="position-sticky top-0 pt-4 " style={{zIndex:"100", background:"#363535"}} >
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
            background:"#fff", color:"#000"
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
                  <img src={v?.img} alt="icon" style={{filter: v?.title ==selectedItem ? "brightness(1) invert(0)" : "brightness(0) invert(1)"}}/>
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
                    <img src={v?.img} alt="Icon" style={{filter: v?.title ==selectedItem ? "brightness(1) invert(0)" : "brightness(0) invert(1)"}}/>
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
          : globalState?.user?.is_mierideuser ? 
          blogAdminNavItems?.map((v, i) => (
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
            )) : broadcastAdminNavItems?.map((v, i) => (
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

export default Sidebar;
