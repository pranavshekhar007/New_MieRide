import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import TableNav from "../../components/TableNav";
import { useGlobalState } from "../../GlobalProvider";
import { agentWithdrawPayServ, getAgentWithdrawListServ } from "../../services/fundsManagement.services";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import NoRecordFound from "../../components/NoRecordFound";
import moment from "moment";
import { updateNotificationStatusServ } from "../../services/notification.services";
function AgentWithdraw() {
  const { setGlobalState, globalState } = useGlobalState();
  const navItems = [
    {
      name: "User Deposit",
      path: "/user-interac-deposite",
      notificationLength:globalState?.notificationList
      ?.filter((v) => {
        return v.category == "interac" && v?.is_read ==0;
      })
      ?.length
    },
    {
      name: "Driver Withdraw",
      path: "/driver-weekly-withdraw",
      notificationLength:globalState?.notificationList
      ?.filter((v) => {
        return v.category == "quick_withdraw" && v?.is_read ==0;
      })
      ?.length
    },
    {
      name: "Agent Withdraw",
      path: "/agent-weekly-withdraw",
      notificationLength:globalState?.notificationList
      ?.filter((v) => {
        return v.category == "agent_withdraw" && v?.is_read ==0;
      })
      ?.length
    },
    {
      name: "Switch",
      path: "/funds-switch",
      notificationLength:globalState?.notificationList
      ?.filter((v) => {
        return v.category == "switch_account" && v?.is_read ==0;
      })
      ?.length
    },

    {
      name: "Cancel Response",
      path: "/funds-cancel-response",
    },
  ];
  const [list, setList] = useState([]);
  const [showSkelton, setShowSkelton] = useState(false);
  const handleGetListFunc = async () => {
    try {
      let response = await getAgentWithdrawListServ({});
      if (response?.data?.statusCode == "200") {
        setList(response?.data?.data);
      }
    } catch (error) {
      console.log("Internal Server Error");
    }
  };
  useEffect(() => {
    handleGetListFunc();
  }, []);
  const [loader, setLoader] = useState({
    type: "",
    id: "",
  });
  const handlePayFunc = async (payload) => {
    setLoader({
      type: payload.status,
      id: payload.id,
    });
    try {
      let response = await agentWithdrawPayServ(payload);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        handleGetListFunc();
      }
    } catch (error) {
      toast?.error("Internal Server Error");
    }
    setLoader({
      type: "",
      id: "",
    });
  };
const updateNotificationStatusFunc = async (id) => {
    try {
      let response = await updateNotificationStatusServ({ notification_id: id });
      if (response?.data?.statusCode == "200") {
      }
    } catch (error) {}
  };
  useEffect(() => {
    globalState?.notificationList
      ?.filter((v) => {
        return v?.category == "agent_withdraw" && v?.is_read == 0;
      })
      ?.map((v, i) => {
        updateNotificationStatusFunc(v?.id);
      });
  });
  return (
    <div className="main_layout  bgBlack d-flex">
      {/* sidebar started */}
      <Sidebar selectedItem="Funds Management" />
      {/* sidebar ended */}

      {/* sectionLayout started */}
      <section className="section_layout" style={{ marginLeft: globalState?.isFillSidebarWidth100 ? "260px" : "80px" }}>
        {/* top nav started  */}
        <TopNav
          navItems={navItems}
          navColor="#000"
          divideRowClass="col-xl-6 col-lg-6 col-md-12 col-12"
          selectedItem="Agent Withdraw"
          sectedNavBg="#fff"
          selectedNavColor="#030303"
          navBg="#F4D640"
        />
        {/* top nav ended  */}
        {/* table List started */}
        <div className="tableMain">
          {/* <TableNav tableNav={tableNav} selectedItem="Weekly Withdraw" sectedItemBg="#f2fbff" /> */}
          <div className="tableBody py-2 px-4 borderRadius50All" style={{ background: "#f2fbff" }}>
            <div style={{ margin: "20px 10px" }}>
              <table className="table">
                <thead>
                  <tr style={{ background: "#DCE4E7" }}>
                    <th scope="col" style={{ borderRadius: "8px 0px 0px 8px" }}>
                      Sr. No
                    </th>
                    <th scope="col">First Name</th>
                    <th scope="col">Last Name</th>
                    <th scope="col">Wallet</th>
                    <th scope="col">Transfer Amount</th>
                    <th scope="col">Date</th>
                    <th scope="col">Time</th>
                    <th scope="col" style={{ borderRadius: "0px 8px 8px 0px" }}>
                      Action
                    </th>
                  </tr>
                </thead>
                <div className="py-2"></div>
                <tbody>
                  {showSkelton
                    ? [1, 2, 3, 4, 5, 6, 7]?.map((v, i) => {
                        return (
                          <tr>
                            <td>
                              <Skeleton width={40} />
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
                            <td>
                              <Skeleton width={100} />
                            </td>
                          </tr>
                        );
                      })
                    : list?.map((v, i) => {
                        return (
                          <tr>
                            <td scope="row">{i + 1}</td>
                            <td>{v?.agent_details?.first_name}</td>
                            <td>{v?.agent_details?.last_name}</td>
                            <td>${v?.wallet}</td>
                            <td>${v?.transfer_amount}</td>
                            <td>{moment(v?.created_at).format("DD-MM-YY")}</td>
                            <td>{moment(v?.created_at, "HH:mm").format("hh:mm A")}</td>
                            <td
                              className="d-flex justify-content-center "
                              style={{ position: "relative", top: "-5px" }}
                            >
                              {loader?.id == v?.id && loader?.status==1 ? <button
                                className="btn btn-success btn-sm py-2 mx-2"
                                
                                style={{ width: "100px", border: "none", background: "#139F01", opacity: "0.6" }}
                              >
                                Updating ...
                              </button>:<button
                                className="btn btn-success btn-sm py-2 mx-2"
                                onClick={() => handlePayFunc({ id: v?.id, status: "1" })}
                                style={{ width: "100px", border: "none", background: "#139F01", opacity: "1" }}
                              >
                                Pay
                              </button>}
                              {
                                loader?.id == v?.id && loader?.status==1 ?
                                <button
                                className="btn btn-success btn-sm py-2 mx-2"
                                style={{ width: "100px", border: "none", background: "#FB0003", opacity: "0.6" }}
                              >
                                Updating ...
                              </button>:<button
                                className="btn btn-success btn-sm py-2 mx-2"
                                onClick={() => handlePayFunc({ id: v?.id, status: "-1" })}
                                style={{ width: "100px", border: "none", background: "#FB0003",  }}
                              >
                                Reject
                              </button>
                              } 
                            </td>
                          </tr>
                        );
                      })}
                </tbody>
              </table>
              {list.length == 0 && !showSkelton && <NoRecordFound />}
            </div>
          </div>
        </div>
        {/* table List ended */}
      </section>
      {/* sectionLayout ended */}
    </div>
  );
}

export default AgentWithdraw;
