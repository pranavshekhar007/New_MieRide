import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import TableNav from "../../components/TableNav";
import { getDriverByIdServ, updateDriverServ } from "../../services/driver.services";
import { getAgentByIdServ, updateAgentServ, deleteAgentServ} from "../../services/agent.service";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";
import { useGlobalState } from "../../GlobalProvider";
function AgentAcountInformation() {
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
  const [data, setData] = useState([]);
  const [showSkelton, setShowSkelton] = useState(false);
  const [driverDetails, setDriverDetails] = useState(null);
 const getUserDetailsFunc = async () => {
     try {
       let response = await getAgentByIdServ({agent_id:params.id});
       if (response?.data?.statusCode == "200") {
       
         setDriverDetails(response.data?.agent);
       }
     } catch (error) {}
   };
  useEffect(() => {
    getUserDetailsFunc();
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
          <TableNav tableNav={tableNav} selectedItem="Account Information" sectedItemBg="#DFD7FF" />
          <div
            className="tableBody py-2 px-4 borderRadius50All driverDetailsLabelInput"
            style={{ background: "#DFD7FF" }}
          >
            <div className=" p-5 my-4" style={{ borderRadius: "20px", background: "#fff" }}>
              <div className="row d-flex justify-content-between">
                <div className="col-8 ">
                  <div className="d-flex align-items-center mb-3">
                    
                    <label style={{ fontSize: "20px" }} className="">
                      Interac E-Transfer
                    </label>
                  </div>
                  <label className=" col-form-label">Email Address</label>
                  <input
                    type="text"
                    className="form-control"
                    value={driverDetails?.interac_id}
                    // onChange={(e) => {
                    //   setFormData({ ...formData, first_name: e.target.value });
                    // }}
                    // readOnly={!isEditable}
                    style={{ background: "#DFD7FF" }}
                  />
                </div>
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

export default AgentAcountInformation;
