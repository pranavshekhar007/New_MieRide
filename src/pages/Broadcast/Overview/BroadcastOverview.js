import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import TopNav from "../../../components/TopNav";
import TableNav from "../../../components/TableNav";
import {
  getScheduledNotification,
  updateScheduleNotification,
} from "../../../services/broadcast.service";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import NoRecordFound from "../../../components/NoRecordFound";
import { useGlobalState } from "../../../GlobalProvider";
import { toast } from "react-toastify";
import moment from "moment";
import "react-toastify/dist/ReactToastify.css";
import { updateNotificationStatusServ } from "../../../services/notification.services";
import { getNavItems } from "../../../utils/TopNavItemData/bookingDashboard";
import BroadcastNotificationNav from "../../../components/BroadcastNotificationNav";
import Pagination from "../../../components/Pagination";
function BroadcastOverview() {
  const { setGlobalState, globalState } = useGlobalState();
  const [payload, setPayload] = useState({
    per_page: 10,
    page_no: 1,
    user_type: "user",
    type: "app_updates",
  });
  const [pageData, setPageData] = useState({
    total_pages: "",
    current_page: "",
  });
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
  const topNav = [
    {
      name: "Overview",
      path: "/broadcast-overview",
    },
    {
      name: "User Fixed",
      path: "/broadcast-user-fixed",
    },
    {
      name: "User Scheduled",
      path: "/broadcast-user-schedule-booking-sharing",
    },
    {
      name: "User Prompt",
      path: "/broadcast-user-prompt-booking-sharing",
    },
    {
      name: "Driver Fixed",
      path: "/broadcast-driver-fixed",
    },
    {
      name: "Driver Scheduled",
      path: "/broadcast-driver-schedule-booking-sharing",
    },
    {
      name: "Driver Prompt",
      path: "/broadcast-driver-prompt-booking-sharing",
    },
    {
      name: "Instant",
      path: "/broadcast-instant",
    },
  ];
  const tableNav = [
    {
      name: "Booking - Sharing",
      path: "/broadcast-user-schedule-booking-sharing",
    },
    {
      name: "Booking - Personal",
      path: "/broadcast-user-schedule-booking-personal",
    },
    {
      name: "Deals",
      path: "/broadcast-user-schedule-deals",
    },
    {
      name: "Holidays",
      path: "/broadcast-user-schedule-holidays",
    },
    {
      name: "App Update",
      path: "/broadcast-user-schedule-app-update",
    },

    {
      name: "Maintenance",
      path: "/broadcast-user-schedule-maintenance",
    },
  ];
  const [showSkelton, setShowSkelton] = useState(false);
  const [list, setList] = useState([]);
  const getScheduledNotificationFunc = async () => {
    if (list.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await getScheduledNotification(payload);
      if (response?.data?.statusCode == "200") {
        setList(response?.data?.data);
        setPageData({
          total_pages: response?.data?.last_page,
          current_page: response?.data?.current_page,
        });
      }
    } catch (error) {}
    setShowSkelton(false);
  };
  useEffect(() => {
    getScheduledNotificationFunc();
  }, []);

  const [editNotificationForm, setEditNotificationForm] = useState(null);
  const [editLoader, setEditLoader] = useState(false);
  const handleUpdateNotification = async () => {
    setEditLoader(true);
    try {
      let response = await updateScheduleNotification({
        ...editNotificationForm,
        scheduled_times: [JSON.parse(editNotificationForm?.scheduled_times)[0]],
      });

      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        setEditNotificationForm(null);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
    setEditLoader(false);
  };
  return (
    <div className="main_layout  bgBlack d-flex">
      {/* sidebar started */}
      <Sidebar selectedItem="Broadcast Manager" />
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
          <TopNav
            navItems={topNav}
            navColor="#fff"
            navBg="#363435"
            divideRowClass="col-xl-6 col-lg-6 col-md-12 col-12"
            selectedItem="Overview"
            sectedNavBg="#D0FF13"
            selectedNavColor="#000"
            broadcast={true}
          />
          
        </div>
        {/* top nav ended  */}
        {/* table List started */}
       <div className="tableMain">
          <div className="tableBody py-1 px-3 vh-100 d-flex justify-content-center align-items-center borderRadius30All" style={{ background: "#363435" }}>
            <div style={{ margin: "20px 10px", color:"white" }}>
             
              <h1>Coming Soon</h1>
            </div>
          </div>
        </div>
        {/* table List ended */}
      </section>
      {/* sectionLayout ended */}

      
    </div>
  );
}

export default BroadcastOverview;
