import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import TableNav from "../../components/TableNav";
import { getRefferedDriverListServ } from "../../services/agent.service";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";
import { useGlobalState } from "../../GlobalProvider";
import { Image_Base_Url } from "../../utils/api_base_url_configration";
import NoRecordFound from "../../components/NoRecordFound";
function AgentRefferedDriverList() {
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
  const [list, setList]=useState([])
  const [showSkelton, setShowSkelton] = useState(false);
  const getUserListFunc = async()=>{
    if(list?.length==0){
      setShowSkelton(true)
    }
    try {
      let response = await getRefferedDriverListServ({agent_id:params?.id});
      if(response?.data?.statusCode=="200"){
        setList(response?.data?.data)
      }
    } catch (error) {
      console.log("Internal Server Error")
    }
    setShowSkelton(false)
  }
  useEffect(()=>{
    getUserListFunc()
  }, [])
  return (
    <div className="main_layout  bgBlack d-flex">
      {/* sidebar started */}
      <Sidebar selectedItem="Agent Hub" />
      {/* sidebar ended */}

      {/* sectionLayout started */}
      <section className="section_layout" style={{ marginLeft :globalState?.isFillSidebarWidth100 ? "260px": "80px" }}>
        {/* top nav started  */}

        {/* top nav ended  */}
        {/* table List started */}
        <div className="">
          <TableNav tableNav={tableNav} selectedItem="Driver App" sectedItemBg="#DFD7FF" />
          <div className="tableBody py-2 px-4 borderRadius50All" style={{ background: "#DFD7FF" }}>
            <div className=" px-2 py-4 my-4" style={{ borderRadius: "20px", background: "#fff" }}>
              <div style={{ margin: "0px 10px" }}>
                <table className="table">
                  <thead>
                    <tr style={{ background: "#F2F0FE", color: "#000" }}>
                      <th scope="col" style={{ borderRadius: "8px 0px 0px 8px" }}>
                        Sr. No
                      </th>
                      <th scope="col">Name</th>
                      <th scope="col">Mobile number</th>
                      <th scope="col">Email</th>
                      <th scope="col">Profile Status</th>
                      <th scope="col" style={{ borderRadius: "0px 8px 8px 0px" }}>
                        Device Type
                      </th>
                    </tr>
                  </thead>
                  <div className="py-2"></div>
                  <tbody className="driverDocument">
                    {showSkelton
                      ? Array.from({ length: 5 }).map((_, index) => (
                          <tr key={index}>
                            <td>
                              <Skeleton width={120} />
                            </td>
                           
                            <td>
                              <Skeleton width={80} />
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
                              <Skeleton circle height={50} width={50} />
                            </td>
                          </tr>
                        ))
                      : list?.map((v, i) => (
                          <>
                            <div className="mt-3"></div>
                            <tr key={i} style={{ background: "#F6F6F6" }}>
                            <td style={{ borderRadius: "12px 0px 0px 12px" }}>{i+1}</td>
                            <td>{v?.first_name + " "+ v?.last_name}</td>
                            <td>{v?.contact}</td>
                            <td>{v?.email}</td>
                            <td>{v?.status=="Approve" ? <span style={{color:"#14AF03"}}>Active</span> : <span style={{color:"#F30205"}}>  In-Active</span>}</td>
                            <td style={{ borderRadius: "0px 12px 12px 0px" }}>
                            <div style={{ position: "relative", top: "-10px", marginBottom: "-10px" }}>
                              {v?.driver_device_id && (
                                <img
                                  style={{ height: "40px" }}
                                  src="/icons/priceAndCityIcons/androidIcon.png"
                                />
                              )}
                              {v?.iosdriver_device_id && (
                                <img
                                  style={{ height: "40px" }}
                                  src="/icons/priceAndCityIcons/appleIcon.png"
                                />
                              )}
                            </div>
                          </td>
                              
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

export default AgentRefferedDriverList;
