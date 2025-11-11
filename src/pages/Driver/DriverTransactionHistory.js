import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import TableNav from "../../components/TableNav";
import { getDriverTransectionListServ } from "../../services/driver.services";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import moment from "moment";
import { useParams } from "react-router-dom";
import { useGlobalState } from "../../GlobalProvider";
import NoRecordFound from "../../components/NoRecordFound";

function DriverTransactionHistory() {
  const { setGlobalState, globalState } = useGlobalState();

  const params = useParams();
  const tableNav = [
    {
      name: "Profile",
      path: `/driver-profile/${params?.id}`,
    },
    {
      name: "Document",
      path: `/driver-document/${params?.id}`,
    },
    {
      name: "Account",
      path: `/driver-account/${params?.id}`,
    },
    {
      name: "Rating",
      path: `/driver-rating/${params?.id}`,
    },
    {
      name: "Transaction History",
      path: `/driver-transeaction-history/${params?.id}`,
    },
    {
      name: "Updated Fields",
      path: `/driver-updated-fields/${params?.id}`,
    },
  ];
  const [list, setList] = useState([]);
  const [showSkelton, setShowSkelton] = useState(true);
  const getDriverTransectionListFunc = async () => {
    if (list.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await getDriverTransectionListServ({
        driver_id: params.id,
      });
      if (response?.data?.statusCode == "200") {
        setList(response?.data?.data);
      }
    } catch (error) {}
    setShowSkelton(false);
  };
  useEffect(() => {
    getDriverTransectionListFunc();
  }, []);

  return (
    <div className="main_layout  bgBlack d-flex">
      {/* sidebar started */}
      <Sidebar selectedItem="Driver" />
      {/* sidebar ended */}

      {/* sectionLayout started */}
      <section
        className="section_layout"
        style={{
          marginLeft: globalState?.isFillSidebarWidth100 ? "260px" : "80px",
        }}
      >
        {/* top nav started  */}

        {/* top nav ended  */}
        {/* table List started */}
        <div className="">
          <TableNav
            tableNav={tableNav}
            selectedItem="Transaction History"
            sectedItemBg="#FDEEE7"
          />
          <div
            className="tableBody py-2 px-4 borderRadius50All"
            style={{ background: "#FDEEE7" }}
          >
            <div
              className=" px-2 py-4 my-4"
              style={{ borderRadius: "20px", background: "#fff" }}
            >
              <div style={{ margin: "0px 10px" }}>
                <table className="table">
                  <thead>
                    <tr style={{ background: "#FDEEE7" }}>
                      <th
                        scope="col"
                        style={{ borderRadius: "8px 0px 0px 8px" }}
                      >
                        Sr.No
                      </th>
                      <th scope="col">Old Balance</th>
                      <th scope="col">Withdraw Amount</th>
                      <th scope="col">Transaction Fee</th>
                      <th scope="col">Transaction Amount</th>
                      <th scope="col">Transaction Details</th>
                      <th scope="col">Date</th>
                      <th scope="col">Time</th>
                      <th
                        scope="col"
                        style={{ borderRadius: "0px 8px 8px 0px" }}
                      >
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
                              <Skeleton width={50} />
                            </td>
                            <td>
                              <Skeleton width={80} />
                            </td>
                            <td>
                              <Skeleton width={150} />
                            </td>
                            <td>
                              <Skeleton width={150} />
                            </td>
                            <td>
                              <Skeleton width={150} />
                            </td>
                            <td>
                              <Skeleton width={100} />
                            </td>
                            <td>
                              <Skeleton width={80} />
                            </td>
                            <td>
                              <Skeleton width={80} />
                            </td>
                            <td>
                              <Skeleton width={120} />
                            </td>
                          </tr>
                        ))
                      : list?.map((v, i) => {
                          return (
                            <tr
                              key={i}
                              style={{
                                background: i % 2 === 0 ? "#F6F6F6" : "#fff",
                                cursor: "pointer",
                              }}
                            >
                              <td style={{ borderRadius: "12px 0px 0px 12px" }}>
                                {i + 1}
                              </td>
                              <td>{v?.wallet_amount}</td>
                              <td>{v?.withdraw_amount}</td>
                              <td>{v?.transaction_fee}</td>
                              <td
                                style={{
                                  color:
                                    v?.transfer_type == "debit"
                                      ? "#FD0100"
                                      : "#139F02",
                                }}
                              >
                                {v?.transfer_type == "debit" ? "-" : "+"} $
                                {v?.transaction_amount}
                              </td>
                              <td style={{ width: "200px" }}>
                                <div
                                  className="d-flex justify-content-center locationBoxButton"
                                  style={{
                                    background:
                                      v?.transfer_type == "debit"
                                        ? "#FD0100"
                                        : "#139F02",
                                    opacity: "0.7",
                                  }}
                                >
                                  <span className="ms-2">{v?.type}</span>
                                </div>{" "}
                              </td>
                              <td>{moment(v.created_at).format("DD/MM/YYYY")}</td>
                              <td>{moment(v?.created_at).format("hh:mm A")}</td>
                              <td style={{ borderRadius: "0px 12px 12px 0px" }}>
                                <button
                                  className="btn btn-success btn-sm "
                                  style={{
                                    width: "100px",
                                    border: "none",
                                    borderRadius: "8px",
                                    background: "#005792",
                                    padding: "8px 20px",
                                    position: "relative",
                                    top: "-4px",
                                  }}
                                >
                                  {v?.current_balance}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                  </tbody>
                </table>
                {list?.length == 0 && !showSkelton && <NoRecordFound />}
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

export default DriverTransactionHistory;
