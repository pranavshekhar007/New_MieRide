import React, { useState , useEffect} from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import { getGtChargeList, addGtChargeServ} from "../../services/priceAndCity.services";
import { toast } from "react-toastify";
import { useGlobalState } from "../../GlobalProvider";
import TableNav from "../../components/TableNav";
function DriverTransactionCharge() {
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
  const tableNav = [
    {
      name: "Weekly Withdraw",
      path: "/driver-weekly-withdraw",
      
    },
    {
      name: "Quick Withdraw",
      path: "/driver-quick-withdraw",
      notificationLength:globalState?.notificationList
      ?.filter((v) => {
        return v.category == "quick_withdraw" && v?.is_read ==0;
      })
      ?.length
    },
    {
      name: "Transaction Charge",
      path: "/driver-transaction-charge",
     
    },
  ];
  const [gtFormData, setGtFormData]=useState({
    gt_charge:"",
    category_id:"1",
    is_editable:false
  });
  
  const handleGetCommissionListFunc = async ()=>{
    try {
      let response = await getGtChargeList({category_id:1});
      if (response?.data?.statusCode == "200") {
        setGtFormData(response?.data?.data[0]) 
        console.log(response?.data?.data[0])
      }
    } catch (error) {
      
    }
  }
  useEffect(()=>{
    handleGetCommissionListFunc()
  }, []);

  const handleGtChargeAddFunc =async ()=>{
    try {
     let response = await addGtChargeServ(gtFormData) 
     if (response?.data?.statusCode == "200") {
      toast.success(response?.data?.message)
    }
    } catch (error) {
      toast.error("Internal Server Error")
    }
  }
  return (
    <div className="main_layout  bgBlack d-flex">
      {/* sidebar started */}
      <Sidebar selectedItem="Funds Management" />
      {/* sidebar ended */}

      {/* sectionLayout started */}
      <section className="section_layout" style={{ marginLeft :globalState?.isFillSidebarWidth100 ? "260px": "80px" }}>
        {/* top nav started  */}
        <TopNav
          navItems={navItems}
          navColor="#fff"
          divideRowClass="col-xl-6 col-lg-6 col-md-12 col-12"
          selectedItem="Driver Withdraw"
          sectedNavBg="#fff"
          selectedNavColor="#030303"
          navBg="#043B64"
        />
        {/* top nav ended  */}
        <div className="tableMain"></div>
        <TableNav tableNav={tableNav} selectedItem="Transaction Charge" sectedItemBg="#F2FBFF" selectedNavColor="#000" />
        <div
          className="vh80 d-flex  justify-content-center align-items-center "
          style={{ background: "#F2FBFF", borderRadius: "14px",  }}
        >
          <div style={{width:"700px"}}>
            <h1 className="text-center">Transaction Charges</h1>
            <div className="d-flex justify-content-between align-items-center" style={{margin:"100px 0px"}}>
              <p>Transaction Charges</p>
              <div className="d-flex justify-content-between align-items-center commissionInput" style={{width:"60%"}}>
                <input className="" placeholder="Enter Here" value={gtFormData?.gt_charge} onChange={(e)=>setGtFormData({...gtFormData, gt_charge:e.target.value})}/>
                <p className="mb-0">%</p>
              </div>
            </div>
            <div className="commissionBtnGroup d-flex justify-content-between">
              <button className="" style={{ width: "45%" }} onClick={()=>{setGtFormData({...gtFormData, is_editable:true}); toast.success("Start Editing the form")}}>
                Edit
              </button>

              <button className="" style={{ background: "#139F01", width: "45%", opacity:gtFormData.is_editable ? "1": "0.5" }} onClick={gtFormData.is_editable && handleGtChargeAddFunc }>
                Save
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* sectionLayout ended */}
    </div>
  );
}

export default DriverTransactionCharge;
