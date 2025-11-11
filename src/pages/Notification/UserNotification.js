import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import TableNav from "../../components/TableNav";
import { getAcceptedBookingRecordServ } from "../../services/bookingDashboard.services";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useGlobalState } from "../../GlobalProvider";
import { Image_Base_Url } from "../../utils/api_base_url_configration";
import moment from "moment";
import NotificationBox from "../../components/NotificationBox";
import NoRecordFound from "../../components/NoRecordFound";
function UserNotification() {
  const { setGlobalState, globalState } = useGlobalState();

  const tableNav = [
    {
      name: "User",
      path: "/user-notification",
      notificationLength:globalState?.notificationList
      ?.filter((v) => {
        return v.notifiable_type == "User" && v?.is_read ==0;
      })
      ?.length
    },
    {
      name: "Driver",
      path: "/driver-notification",
      notificationLength:globalState?.notificationList
      ?.filter((v) => {
        return v.notifiable_type == "Driver" && v?.is_read ==0;
      })
      ?.length
    },
    {
      name: "Funds",
      path: "/fund-notification",
      notificationLength:globalState?.notificationList
      ?.filter((v) => {
        return v.notifiable_type == "Fund" && v?.is_read ==0;
      })
      ?.length
    },
    {
      name: "Booking",
      path: "/booking-notification",
      notificationLength:globalState?.notificationList
      ?.filter((v) => {
        return v.notifiable_type == "Booking" && v?.is_read ==0;
      })
      ?.length
    },

    // {
    //   name: "Support",
    //   path: "/support-notification",
    // },
  ];
  const [list, setList] = useState([]);
  const [showSkelton, setShowSkelton] = useState(false);
  const handleGetListFunc = async () => {
    if (list?.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await getAcceptedBookingRecordServ();
      if (response?.data?.statusCode == "200") {
        setList(response?.data?.data);
      }
    } catch (error) {}
    setShowSkelton(false);
  };
  useEffect(() => {
    handleGetListFunc();
  }, []);
  return (
    <div className="main_layout  bgBlack d-flex">
      {/* sidebar started */}
      <Sidebar selectedItem="Notification" />
      {/* sidebar ended */}

      {/* sectionLayout started */}
      <section
        className="section_layout"
        style={{ minWidth: "1300px", marginLeft: globalState?.isFillSidebarWidth100 ? "260px" : "80px" }}
      >
        {/* table List started */}
        <div className="">
          <TableNav tableNav={tableNav} selectedItem="User" sectedItemBg="#F3F3F3" selectedNavColor="#000" />
          <div className="tableBody py-2 px-4 borderRadius50exceptTopLeft" style={{ background: "#F3F3F3" }}>
            <div style={{ margin: "20px 10px" }}>
              {/* {list?.length == 0 && (
                <div
                  className="bg-light d-flex justify-content-center align-items-center w-100 "
                  style={{ borderRadius: "12px", height: "50vh" }}
                >
                  <div style={{ opacity: "0.8" , fontFamily:"monospace"}}>
                    <img src="https://cdn-icons-png.flaticon.com/256/6840/6840178.png" />
                    <h2 className="text-center">
                      <b>No Record Found</b>
                    </h2>
                  </div>
                </div>
              )} */}
              {globalState?.notificationList
                ?.filter((v) => {
                  return v.notifiable_type == "User";
                })
                ?.map((v, i) => {
                  return (
                    <NotificationBox v={v} bg="#7650e0" color="#ffffff"/>
                  );
                })}
                {globalState?.notificationList
                ?.filter((v) => {
                  return v.notifiable_type == "User";
                }).length==0 && <NoRecordFound theme="dark"/>}
            </div>
          </div>
        </div>
        {/* table List ended */}
      </section>
      {/* sectionLayout ended */}
    </div>
  );
}

export default UserNotification;
