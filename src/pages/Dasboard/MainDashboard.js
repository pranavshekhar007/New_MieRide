import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useGlobalState } from "../../GlobalProvider";
import { getDashboardAnalytics } from "../../services/authentication.services";
import { useNavigate } from "react-router-dom";
import NewSidebar from "../../components/NewSidebar";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
function MainDashboard() {
  const { setGlobalState, globalState } = useGlobalState();
  const navigate = useNavigate();
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
      toast.success("Logged out successfully!");
    }
  };
  const [data, setDatat] = useState(null);
  const staticsData = [
    {
      heading: "User",
      mainImg: "https://cdn-icons-png.flaticon.com/128/1077/1077114.png",
      count: data?.total_users ? data?.total_users : 0,
      countColor: "#e52a2f",
      bottomImg: "",
      bottomText: "+15% from last month",
      bottomTextColor: "#139F01",
      navigate: "/user-list",
    },
    {
      heading: "Driver",
      mainImg: "https://cdn-icons-png.flaticon.com/128/90/90471.png",
      count: data?.total_drivers ? data?.total_drivers : 0,
      countColor: "#154993",
      bottomImg: "",
      bottomText: "+15% from last month",
      bottomTextColor: "#139F01",
      navigate: "/driver-list",
    },
    {
      heading: "Total  Monthly  Earning",
      mainImg: "https://cdn-icons-png.flaticon.com/128/2933/2933181.png",
      count: data?.total_montly_earning
        ? "$" + data?.total_montly_earning.toFixed(2)
        : "$" + 0,
      countColor: "#ec5e24",
      bottomImg: "",
      bottomText: "+15% from last month",
      bottomTextColor: "#139F01",
    },
    {
      heading: "My Monthly Earning",
      mainImg: "https://cdn-icons-png.flaticon.com/128/2976/2976460.png",
      count: data?.my_montly_earning
        ? "$" + data?.my_montly_earning.toFixed(2)
        : "$" + 0,
      countColor: "#154993",
      bottomImg: "",
      bottomText: "+15% from last month",
      bottomTextColor: "#139F01",
    },

    {
      heading: "Today's Interac E-Transfer",
      mainImg: "https://cdn-icons-png.flaticon.com/128/10042/10042544.png",
      count: data?.today_interac
        ? "$" + data?.today_interac.toFixed(2)
        : "$" + 0,
      countColor: "#ffc728",
      bottomImg: "",
      bottomText: "+15% from last month",
      bottomTextColor: "#139F01",
      navigate: "/user-interac-deposite",
    },
    {
      heading: "Today's Quick Deposit",
      mainImg: "https://cdn-icons-png.flaticon.com/128/1584/1584892.png",
      count: data?.total_quick_deposite
        ? "$" + data?.total_quick_deposite.toFixed(2)
        : "$" + 0,
      countColor: "#4991e1",
      bottomImg: "",
      bottomText: "+15% from last month",
      bottomTextColor: "#139F01",
      navigate: "/user-quick-deposite",
    },
  ];
  const getDashboardAnalyticsFunc = async () => {
    try {
      let response = await getDashboardAnalytics({});
      if (response?.data?.statusCode == "200") {
        setDatat(response?.data?.data);
        console.log(response?.data?.data);
      }
    } catch (error) {}
  };
  useEffect(() => {
    getDashboardAnalyticsFunc();
  }, []);

  const COLORS = [
    "#FFE4E4",
    "#FCDEFF",
    "#DCFFEA",
    "#FFEDCC",
    "#FFF3EC",
    "#E1F7FF",
  ];
  const staticData = [
    { status: "Booking 12 AM - 4 AM", value: 12 },
    { status: "Booking 4 AM - 8 AM", value: 12 },
    { status: "Booking 8 AM - 12 PM", value: 12 },
    { status: "Booking 12 PM - 4 PM", value: 12 },
    { status: "Booking 4 PM - 8 PM", value: 12 },
    { status: "Booking 8 PM - 12 PM", value: 12 },
  ];
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    value,
    status,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 20; // label ko thoda bahar push karne ke liye
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#333"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontFamily="Nexa"
      >
        <tspan x={x} dy="0">
          {status.split(" ")[0]}
        </tspan>
        <tspan x={x} dy="1.2em">
          {status?.substring(8, 25)}
        </tspan>
      </text>
    );
  };

  const fundsDataArr =[
    {
      img:"/imagefolder/interacIcon.png",
      name:"Interac Transfer (Monthly)",
      count:`$ ${data?.interac_monthly_amount}`, 
      staticsLine :<div>
        <span style={{fontWeight:"700", color:data?.interac_monthly_trend == "up" ? "#00A431" : data?.interac_monthly_trend =="down" ? "#DD4132" : "#1C1C1C"}}>{data?.interac_monthly_trend =="up"? "+" : data?.interac_monthly_trend =="down" && "-"}{data?.interac_monthly_percentage}%</span>
        <span className="ms-1">From the last month</span>
      </div> 
    },
    {
      img:"/imagefolder/interacIcon.png",
      name:"Interac Transfer (Today)",
      count:`$ ${data?.interac_today_amount}`, 
      staticsLine :<div>
        <span style={{fontWeight:"700", color:data?.interac_today_trend == "up" ? "#00A431" : data?.interac_today_trend =="down" ? "#DD4132" : "#1C1C1C"}}>{data?.interac_today_trend =="up"? "+" : data?.interac_today_trend =="down" && "-"}{data?.interac_today_percentage}%</span>
        <span className="ms-1">From yesterday</span>
      </div> 
    },
    {
      img:"/imagefolder/quickCashIcon.png",
      name:"Quick Deposit (Monthly)",
      count:`$ ${data?.quick_monthly_amount}`, 
      staticsLine :<div>
        <span style={{fontWeight:"700", color:data?.quick_monthly_trend == "up" ? "#00A431" : data?.quick_monthly_trend =="down" ? "#DD4132" : "#1C1C1C"}}>{data?.quick_monthly_trend =="up"? "+" : data?.quick_monthly_trend =="down" && "-"}{data?.quick_monthly_percentage}%</span>
        <span className="ms-1">From the last month</span>
      </div> 
    },
    {
      img:"/imagefolder/quickCashIcon.png",
      name:"Quick Deposit (Today)",
      count:`$ ${data?.quick_today_amount}`, 
      staticsLine :<div>
        <span style={{fontWeight:"700", color:data?.quick_today_trend == "up" ? "#00A431" : data?.quick_today_trend =="down" ? "#DD4132" : "#1C1C1C"}}>{data?.quick_today_trend =="up"? "+" : data?.quick_today_trend =="down" && "-"}{data?.quick_today_percentage}%</span>
        <span className="ms-1">From yesterday</span>
      </div> 
    },
    {
       img:"/imagefolder/fundIcon.png",
      name:"Amount Collected",
      count:`$ ${data?.my_monthly_earning}`, 
      staticsLine :<div>
        <span style={{fontWeight:"700", color:data?.my_monthly_earning_trend == "up" ? "#00A431" : data?.my_monthly_earning_trend =="down" ? "#DD4132" : "#1C1C1C"}}>{data?.my_monthly_earning_trend =="up"? "+" : data?.my_monthly_earning_trend =="down" && "-"}{data?.my_monthly_earning_percentage}%</span>
        <span className="ms-1">From the last month</span>
      </div> 
    },
    {
       img:"/imagefolder/dollerIcon.png",
      name:"Driver Payouts",
      count:`$ ${data?.driver_monthly_payout}`, 
      staticsLine :<div>
        <span style={{fontWeight:"700", color:data?.driver_monthly_payout_trend == "up" ? "#00A431" : data?.driver_monthly_payout_trend =="down" ? "#DD4132" : "#1C1C1C"}}>{data?.driver_monthly_payout_trend =="up"? "+" : data?.driver_monthly_payout_trend =="down" && "-"}{data?.driver_monthly_payout_percentage}%</span>
        <span className="ms-1">From the last month</span>
      </div> 
    }

  ]
  const bookingDataArr =[
    {
      img:"/imagefolder/oldCarIcon.png",
      name:"Sharing Booking (monthly)",
      count:data?.sharing_monthly,
       staticsLine :<div>
        <span style={{fontWeight:"700", color:data?.sharing_month_trend == "up" ? "#00A431" : data?.sharing_month_trend =="down" ? "#DD4132" : "#1C1C1C"}}>{data?.sharing_month_trend =="up"? "+" : data?.sharing_month_trend =="down" && "-"}{data?.sharing_month_percentage}%</span>
        <span className="ms-1">From the last month</span>
      </div> 
    },
    {
      img:"/imagefolder/oldCarIcon.png",
      name:"Sharing Booking (weekly)",
       count:data?.sharing_weekly,
       staticsLine :<div>
        <span style={{fontWeight:"700", color:data?.sharing_week_trend == "up" ? "#00A431" : data?.sharing_week_trend =="down" ? "#DD4132" : "#1C1C1C"}}>{data?.sharing_week_trend =="up"? "+" : data?.sharing_week_trend =="down" && "-"}{data?.sharing_week_percentage}%</span>
        <span className="ms-1">From the last week</span>
      </div> 
    },
    {
      img:"/imagefolder/carWithManIcon.png",
      name:"Personal Booking (monthly)",
       count:data?.personal_monthly,
       staticsLine :<div>
        <span style={{fontWeight:"700", color:data?.personal_month_trend == "up" ? "#00A431" : data?.personal_month_trend =="down" ? "#DD4132" : "#1C1C1C"}}>{data?.personal_month_trend =="up"? "+" : data?.personal_month_trend =="down" && "-"}{data?.personal_month_percentage}%</span>
        <span className="ms-1">From the last month</span>
      </div> 
    },
    {
      img:"/imagefolder/carWithManIcon.png",
      name:"Personal Booking (weekly)",
      count:data?.personal_weekly,
       staticsLine :<div>
        <span style={{fontWeight:"700", color:data?.personal_week_trend == "up" ? "#00A431" : data?.personal_week_trend =="down" ? "#DD4132" : "#1C1C1C"}}>{data?.personal_week_trend =="up"? "+" : data?.personal_week_trend =="down" && "-"}{data?.personal_week_percentage}%</span>
        <span className="ms-1">From the last week</span>
      </div> 
    },
    {
       img:"/imagefolder/newCarIcon.png",
      name:"Family Booking (monthly)",
       count:0,
       staticsLine :<div>
        <span style={{fontWeight:"700", color: "#1C1C1C"}}>0%</span>
        <span className="ms-1">From the last month</span>
      </div> 
    },
    {
       img:"/imagefolder/newCarIcon.png",
      name:"Family Booking (weekly)",
       count:0,
       staticsLine :<div>
        <span style={{fontWeight:"700", color: "#1C1C1C"}}>0%</span>
        <span className="ms-1">From the last week</span>
      </div> 
    }

  ]
  return (
    <div className="mainBody">
      <NewSidebar selectedItem="Dashboard" />
      <div className="contentLayout">
        <div className="bgWhite borderRadius30 p-4 py-5 minHeight100vh">
          <div className="dashboardTopNav d-flex justify-content-between align-items-center">
            <p>Welcome {globalState?.user?.first_name +
                " " +
                globalState?.user?.last_name +
                " "} !!</p>
            <div>
              <select>
                <option>Ontario</option>
              </select>
              <img
                src="https://cdn-icons-png.flaticon.com/128/4140/4140037.png"
                className="mx-3"
              />
              <img
                src="https://cdn-icons-png.flaticon.com/128/11019/11019316.png"
                className="p-1"
                onClick={()=>handleLogoutFunc()}
              />
            </div>
          </div>
          <div className="row mx-0">
            <div className="col-7">
              <div className="row dashboardCardGroupDiv me-2">
                <div className="col-6">
                  <div className="dashboardCard d-flex  align-items-center">
                    {/* <div className="outerCircle bgSuccess d-flex justify-content-end align-items-center"> */}
                      <div className="innerCircle bgDark d-flex justify-content-center align-items-center">
                        <p>{data?.total_users}</p>
                      </div>
                    {/* </div> */}
                    <div className="ms-3">
                      <h5>Total User</h5>
                      <p>
                        <span style={{fontWeight:"700", color:data?.users_trend == "up" ? "#00A431" : data?.users_trend =="down" ? "#00A431" : "#1C1C1C"}}>{data?.users_trend == "up" ? "+" : data?.users_trend =="down" && "-"}{data?.users_percentage}%</span> From the last month
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="dashboardCard d-flex  align-items-center">
                    {/* <div className="outerCircle bgDark d-flex justify-content-end align-items-center"> */}
                      <div className="innerCircle bgDark d-flex justify-content-center align-items-center">
                        <p>{data?.total_drivers}</p>
                      </div>
                    {/* </div> */}
                    <div className="ms-3">
                      <h5>Total Driver</h5>
                      <p>
                        <span style={{fontWeight:"700", color:data?.drivers_trend == "up" ? "#00A431" : data?.drivers_trend =="down" ? "#00A431" : "#1C1C1C"}}>{data?.drivers_trend == "up" ? "+" : data?.drivers_trend =="down" && "-"}{data?.drivers_percentage}%</span> From the last month
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-5 ">
              <div className="row dashboardCardGroupDiv ms-2">
                <div className="col-6 ">
                  <div className="dashboardCard  ">
                    <div className="d-flex align-items-center mb-3">
                      <div className="blackBgImgBox">
                        <img src="https://cdn-icons-png.flaticon.com/128/724/724761.png" />
                      </div>
                      <h4>{data?.unread_support_chats}</h4>
                    </div>
                    <div>
                      <h5 className="width150">Unread Support Chats</h5>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="dashboardCard  ">
                    <div className="d-flex align-items-center mb-3">
                      <div className="blackBgImgBox">
                        <img src="https://cdn-icons-png.flaticon.com/128/90/90471.png" />
                      </div>
                      <h4>{data?.pending_driver_approvals}</h4>
                    </div>
                    <div>
                      <h5 className="width150">Pending Driver Approvals</h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-between">
            <div className="staticsListMain" style={{ width: "29%" }}>
              {fundsDataArr?.map((v, i) => {
                return (
                  <div className="row mx-0  staticsListItem ">
                    <div className="col-2">
                      <div>
                        <img src={v?.img} />
                      </div>
                    </div>
                    <div className="col-6">
                      <p style={{ position: "relative", top: "4px" }}>
                        {v?.name}
                      </p>
                      {v?.staticsLine}
                    </div>
                    <div className="col-4">
                      <div className="dashboardCountBg d-flex align-items-center justify-content-center">
                        <p>{v?.count}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div
              className="staticsListMain"
              style={{ width: "37%", background: "#fff" }}
            >
              <div className="d-flex justify-content-between my-4 mx-1 bookingGraphTopNav">
                <p>Booking Status</p>
                <select>
                  <option>Month</option>
                </select>
              </div>
              <div className="w-100">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={staticData}
                      dataKey="value"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      label={renderCustomizedLabel}
                      labelLine={false}
                    >
                      {staticData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    {/* <Legend /> */}
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div
              className="staticsListMain"
              style={{ background: "#F7F7F7", width: "29%" }}
            >
              {bookingDataArr?.map((v, i) => {
                return (
                  <div className="row mx-0  staticsListItem ">
                    <div className="col-2">
                      <div>
                        <img src={v?.img} />
                      </div>
                    </div>
                    <div className="col-6">
                      <p style={{ position: "relative", top: "4px" }}>
                        {v?.name}
                      </p>
                    {v?.staticsLine}
                    </div>
                    <div className="col-4">
                      <div className="dashboardCountBg d-flex align-items-center justify-content-center">
                        <p>{v?.count}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <div className="main_layout  bgBlack d-flex">
      {/* sidebar started */}
      <Sidebar selectedItem="Dashboard" />
      {/* sidebar ended */}

      {/* sectionLayout started */}
      <section
        className="section_layout"
        style={{
          minWidth: "1400px",
          marginLeft: globalState?.isFillSidebarWidth100 ? "260px" : "80px",
        }}
      >
        <div className="d-flex justify-content-between align-items-center dashboardTopMain">
          <div className="d-flex align-items-end">
            <p className="mb-0 me-2">Welcome</p>
            <h6 className="mb-0">
              {globalState?.user?.first_name +
                " " +
                globalState?.user?.last_name +
                " "}
              !
            </h6>
          </div>
          <div className="d-flex align-items-center">
            <select>
              <option>Ontario</option>
            </select>
            <img
              src="/icons/dashboardIcons/userDummyIcon.png"
              style={{ height: "45px" }}
              className="mx-4"
            />
            <img
              src="/icons/dashboardIcons/logout.png"
              onClick={handleLogoutFunc}
              style={{ height: "27px" }}
            />
          </div>
        </div>
        <div className="row mx-0 my-4 p-0">
          {staticsData?.map((v, i) => {
            return (
              <div className="col-2 m-0 py-0 px-1">
                <div
                  className="border p-3 p-mx-2 border staticCard"
                  onClick={() => navigate(v?.navigate)}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <p className="mb-0">{v?.heading}</p>
                    <img src={v?.mainImg} style={{ height: "18px" }} />
                  </div>
                  <h5 className="my-3" style={{ color: v?.countColor }}>
                    {v?.count}
                  </h5>
                  <div className="d-flex  align-items-center">
                    <img
                      src="/icons/dashboardIcons/greenProgress.png"
                      style={{ height: "12px" }}
                    />
                    <span
                      className="mb-0 ms-1"
                      style={{ color: v?.bottomTextColor }}
                    >
                      15% from last month
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="row m-0 p-0 mt-4">
          <div className="col-lg-5 p-0 m-0">
            <div className=" bookingGraph p-4 shadow">
              <div className="d-flex justify-content-between">
                <h6 className="mb-0">Booking Overview</h6>
                <div>
                  <select className="">
                    <option>Total</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
                  </select>
                  <select className="">
                    <option>This Month</option>
                    <option>Todays</option>
                    <option>This year</option>
                    <option>Lifetime</option>
                  </select>
                </div>
              </div>
              <div className="row m-0 mt-4 p-0">
                <div className="col-1 m-0 p-0">
                  {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1]?.map((v, i) => {
                    return (
                      <p
                        className="mb-0 text-end "
                        style={{
                          height: "33px",
                          position: "relative",
                          bottom: "5px",
                          fontSize: "12px",
                          fontWeight: "500",
                        }}
                      >
                        {v * 100}
                      </p>
                    );
                  })}
                  <p
                    className="mb-0 text-end "
                    style={{
                      height: "33px",
                      position: "relative",
                      bottom: "12px",
                      fontSize: "12px",
                      fontWeight: "500",
                    }}
                  >
                    0
                  </p>
                </div>
                <div className="col-11 row m-0 p-0">
                  {[1, 2, 4, 3, 5, 8, 9, 10, 11, 7, 8, 12]?.map((v, i) => {
                    return (
                      <div className="col-1 ">
                        <div
                          style={{
                            height: "330px",
                            width: "22px",
                            borderRadius: "8px",
                            background: "#F5F5F5",
                          }}
                          className="d-flex align-items-end"
                        >
                          <div
                            className=""
                            style={{
                              height: v * 10 + "px",
                              width: "22px",
                              borderRadius: "8px",
                              background: "#139F01",
                            }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                  {[
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                  ]?.map((v, i) => {
                    return (
                      <div className="col-1 ">
                        <div
                          style={{ width: "22px" }}
                          className="d-flex align-items-end justify-content-center"
                        >
                          <p style={{ fontSize: "10px" }}>{v}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="row col-lg-7 p-0 m-0 ">
            <div className="col-lg-6 m-0 p-0 px-4">
              <div className="shadow-sm pieGraph  p-4">
                <div className="d-flex justify-content-between">
                  <h6 className="mb-0">Category Breakdown</h6>
                  <div>
                    <select className="shadow-sm me-2">
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Cancelled</option>
                    </select>
                  </div>
                </div>
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ height: "100%" }}
                >
                  <img
                    className="img-fluid"
                    src="/images/vector_smart_object.png"
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-6 m-0 p-0">
              <div className="shadow-sm tasksRemainer  p-4">
                <div className="d-flex  btnGroup p-1">
                  <div className="toggleBtn activeToggle p-2">Task</div>
                  <div className="toggleBtn p-2">Reminder</div>
                  <div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* sectionLayout ended */}
    </div>
  );
}

export default MainDashboard;
