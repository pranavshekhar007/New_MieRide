import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import TableNav from "../../components/TableNav";
import { getAcceptedBookingRecordServ } from "../../services/bookingDashboard.services";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import moment from "moment";
import { useGlobalState } from "../../GlobalProvider";
import { Image_Base_Url } from "../../utils/api_base_url_configration";
import NotificationItem from "../../components/NotificationItem";
function SupportNotification() {
  const { setGlobalState, globalState } = useGlobalState();

  const tableNav = [
    {
      name: "User",
      path: "/user-notification",
    },
    {
      name: "Driver",
      path: "/driver-notification",
    },
    {
      name: "Funds",
      path: "/fund-notification",
    },
    {
      name: "Booking",
      path: "/booking-notification",
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
          <TableNav tableNav={tableNav} selectedItem="Support" sectedItemBg="#FDEEE7" selectedNavColor="#000" />
          <div className="tableBody py-2 px-4 borderRadius50All" style={{ background: "#FDEEE7" }}>
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
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]?.map((v, i) => {
                return (
                  <NotificationItem/>
                );
              })}
            </div>
          </div>
        </div>
        {/* table List ended */}
      </section>
      {/* sectionLayout ended */}
    </div>
  );
}

export default SupportNotification;
