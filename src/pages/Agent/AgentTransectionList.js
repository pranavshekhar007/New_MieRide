import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import TableNav from "../../components/TableNav";
import { getTransectionHistoryServ } from "../../services/agent.service";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";
import { useGlobalState } from "../../GlobalProvider";
import { Image_Base_Url } from "../../utils/api_base_url_configration";
import NoRecordFound from "../../components/NoRecordFound";
function AgentTransectionList() {
  const { setGlobalState, globalState } = useGlobalState();
  const params = useParams();
  const tableNav = [
    {
      name: "Profile",
      path: `/agent-profile/${params?.id}`,
    },
    {
      name: "Account Information",
      path: `/agent-account-information/${params?.id}`,
    },
    {
      name: "Transaction History",
      path: `/agent-transaction-history/${params?.id}`,
    },
    {
      name: "User App",
      path: `/agent-user-app/${params?.id}`,
    },
    {
      name: "Driver App",
      path: `/agent-driver-app/${params?.id}`,
    },
  ];
  const [list, setList] = useState([]);
  const [showSkelton, setShowSkelton] = useState(false);
  const getUserListFunc = async () => {
    if (list?.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await getTransectionHistoryServ({ agent_id: params?.id });
      if (response?.data?.statusCode == "200") {
        setList(response?.data?.data);
      }
    } catch (error) {
      console.log("Internal Server Error");
    }
    setShowSkelton(false);
  };
  useEffect(() => {
    getUserListFunc();
  }, []);
  return (
    <div className="main_layout  bgBlack d-flex">
      {/* sidebar started */}
      <Sidebar selectedItem="Agent Hub" />
      {/* sidebar ended */}

      {/* sectionLayout started */}
      <section className="section_layout" style={{ marginLeft: globalState?.isFillSidebarWidth100 ? "260px" : "80px" }}>
        {/* top nav started  */}

        {/* top nav ended  */}
        {/* table List started */}
        <div className="">
          <TableNav tableNav={tableNav} selectedItem="Transaction History" sectedItemBg="#DFD7FF" />
          <div className="tableBody py-2 px-4 borderRadius50All" style={{ background: "#DFD7FF" }}>
            <div className=" px-2 py-4 my-4" style={{ borderRadius: "20px", background: "#fff" }}>
              <div style={{ margin: "0px 10px" }}>
                <table className="table">
                  <thead>
                    <tr style={{ background: "#F2F0FE", color: "#000" }}>
                      <th scope="col" style={{ borderRadius: "8px 0px 0px 8px" }}>
                        Sr. No
                      </th>

                      <th scope="col">Transaction Details</th>
                      <th scope="col">Date</th>
                      <th scope="col">Time</th>
                      <th scope="col">Old Balance</th>
                      <th scope="col">Amount</th>
                      <th scope="col" style={{ borderRadius: "0px 8px 8px 0px" }}>
                        New Balance
                      </th>
                    </tr>
                  </thead>
                  <div className="py-2"></div>
                  <tbody className="driverDocument">
                    {showSkelton
                      ? Array.from({ length: 5 }).map((_, index) => (
                          <tr key={index}>
                            <td>
                              <Skeleton width={80} />
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
                        ))
                      : list?.map((v, i) => (
                          <>
                            <div className="mt-3"></div>
                            <tr key={i} style={{ background: "#F6F6F6" }}>
                              <td style={{ borderRadius: "12px 0px 0px 12px" }}>{i + 1}</td>

                              <td>{v?.type}</td>
                              <td>{moment(v?.created_at, "HH:mm").format("DD-MM-YY")}</td>
                              <td>{moment(v?.created_at, "HH:mm").format("hh:mm A")}</td>
                              <td>{v?.wallet_amount}</td>
                              <td>
                                <span style={{ color: v?.transfer_type == "credit" ? " #139F01" : " #FB0003" }}>
                                  {v?.transaction_amount}
                                </span>{" "}
                              </td>
                              <td style={{ borderRadius: "0px 12px 12px 0px" }}>{v?.current_balance}</td>
                            </tr>
                          </>
                        ))}
                  </tbody>
                </table>
                {list.length == 0 && !showSkelton && <NoRecordFound />}
              </div>
            </div>
          </div>
        </div>
        {/* table List ended */}
      </section>
      {/* sectionLayout ended */}
    </div>
  );
}

export default AgentTransectionList;
