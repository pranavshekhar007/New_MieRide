import React from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import TableNav from "../../components/TableNav";
import { useGlobalState } from "../../GlobalProvider";
function FundsCancelResponse() {
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
 
  return (
    <div className="main_layout  bgBlack d-flex">
      {/* sidebar started */}
      <Sidebar selectedItem="Funds Management"/>
      {/* sidebar ended */}
      
      {/* sectionLayout started */}
      <section className="section_layout" style={{ marginLeft :globalState?.isFillSidebarWidth100 ? "260px": "80px" }}>
        {/* top nav started  */}
        <TopNav
          navItems={navItems}
          navColor="#030303"
         divideRowClass="col-xl-6 col-lg-6 col-md-12 col-12"
          selectedItem="Cancel Response"
          sectedNavBg="#043B64"
          selectedNavColor="#fff"
          navBg="#EAB56F"
        />
        {/* top nav ended  */}
        {/* table List started */}
        <div className="tableMain">
          
          <div className="tableBody  py-2 px-4 borderRadius50All" style={{ background: "#f2fbff" }}>
            
            {/* <div style={{ margin: "0px 10px"  }}>
              <table className="table">
                <thead >
                  <tr style={{ background: "#DCE4E7", }}>
                    <th scope="col" style={{ borderRadius: "8px 0px 0px 8px" }}>
                      Sr. No
                    </th>
                    <th scope="col">First Name</th>
                    <th scope="col">Last Name</th>
                    <th scope="col">Switch From</th>
                    <th scope="col">Switch To</th>
                    <th scope="col">Date</th>
                    <th scope="col">Profile</th>
                    <th scope="col">Status</th>
                    <th scope="col" style={{ borderRadius: "0px 8px 8px 0px" }}>
                      Action
                    </th>
                  </tr>
                </thead>
                <div className="py-2"></div>
                <tbody >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9]?.map((v, i) => {
                    return (
                      <tr>
                        <td scope="row">{i+1}</td>
                        <td>Madhu</td>
                        <td>Kashyap</td>
                        <td>Direct Deposit</td>
                        <td>Interac E-Transfer</td>
                        <td>08/102024</td>
                        <td>
                        <div className="d-flex justify-content-center iconDiv" >
                          <img src="https://cdn-icons-png.flaticon.com/128/159/159604.png"/>
                          
                          </div>
                        </td>
                        <td >
                          Approved
                          
                        </td>
                        <td className="d-flex justify-content-center align-items-center">
                          <select className="shadow-sm"  style={{background:"white", color:"#139F01"}}>
                            <option>Accept</option>
                            <option>Pending</option>
                            <option>Reject</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div> */}
            <div className="vh80 d-flex justify-content-center align-items-center">
                <h1>Comming Soon</h1>
            </div>
          </div>
        </div>
        {/* table List ended */}
      </section>
      {/* sectionLayout ended */}
    </div>
  );
}

export default FundsCancelResponse;
