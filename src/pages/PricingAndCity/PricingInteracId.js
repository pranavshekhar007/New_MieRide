import React, { useState , useEffect} from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import { getInteracIdChargeList,updateInteracIdChargeServ, addInteracIdChargeServ} from "../../services/priceAndCity.services";
import { toast } from "react-toastify";
import { useGlobalState } from "../../GlobalProvider";
function PricingInteracId() {
  const { setGlobalState, globalState } = useGlobalState();
  const navItems = [
    {
      name: "Categories",
      path: "/pricing-categories",
    },
    {
      name: "Province",
      path: "/pricing-province",
    },
    {
      name: "Location",
      path: "/pricing-sharing-location",
    },
    {
      name: "Surges",
      path: "/pricing-sharing-surges",
    },
    {
      name: "Commission",
      path: "/pricing-commission",
    },
   
    {
      name: "Interac Id",
      path: "/pricing-iterac-id",
    },
    {
      name: "Payout Info",
      path: "/pricing-payout-info",
    },
    {
      name: "Cancel",
      path: "/pricing-cancel",
    },
    {
      name: "Price Calculator",
      path: "/pricing-calculator",
    },
  ];
  const [interacFormData, setInteracFormData]=useState({
    email:"",
    is_editable:false
  });
  
  const handleGetInteracIdListFunc = async ()=>{
    try {
      
      let response = await getInteracIdChargeList({category_id:1});
      if (response?.data?.statusCode == "200") {
        if(response?.data?.data?.length>0){
          setInteracFormData(response?.data?.data[0]) 
        }else{
          
        }
        console.log(response?.data?.data[0])
      }
    } catch (error) {
      
    }
  }
  useEffect(()=>{
    handleGetInteracIdListFunc()
  }, []);

  const handleInteracIdFunc =async ()=>{
    try {
      let response ;
      if(interacFormData.id){
        response = await updateInteracIdChargeServ(interacFormData) 
      }else{
        response = await addInteracIdChargeServ(interacFormData) 
      }
    
     if (response?.data?.statusCode == "200") {
      toast.success(response?.data?.message)
    }
    } catch (error) {
      toast.success("Internal Server Error")
    }
  }
  return (
    <div className="main_layout  bgBlack d-flex">
      {/* sidebar started */}
      <Sidebar selectedItem="Pricing & Cities"/>
      {/* sidebar ended */}
      
      {/* sectionLayout started */}
      <section className="section_layout" style={{ marginLeft :globalState?.isFillSidebarWidth100 ? "260px": "80px" }}>
        {/* top nav started  */}
        <TopNav
          navItems={navItems}
          navColor="#fff"
          navBg="#B1CF5F"
          divideRowClass="col-xl-6 col-lg-6 col-md-6 col-6"
          selectedItem="Interac Id"
          sectedNavBg="#fff"
          selectedNavColor="#030303"
          isItemMoreThen8={true}
        />
        {/* top nav ended  */}
        
        <div
          className="vh80 d-flex  justify-content-center align-items-center gtMainDiv"
          style={{ background: "#f8f4f9", borderRadius: "14px",  }}
        >
          <div style={{width:"550px"}}>
            <h1 className="text-center">Interac ID</h1>
            <div className="d-flex justify-content-center align-items-center" style={{margin:"100px 0px"}}>
              
              <div className="d-flex align-items-center commissionInput" style={{width:"100%"}}>
              <img
                  className="me-2"
                  src="https://cdn-icons-png.flaticon.com/128/732/732200.png"
                  style={{ height: "20px", width: "20px" }}
                />
                <input readOnly={!interacFormData?.is_editable} placeholder="Enter Here" value={interacFormData?.email} onChange={(e)=>setInteracFormData({...interacFormData, email:e.target.value})}/>
                
              </div>
            </div>
            <div className="commissionBtnGroup d-flex justify-content-between">
              <button className="" style={{ width: "45%" }} onClick={()=>{setInteracFormData({...interacFormData, is_editable:true}); toast.success("Start Editing the form")}}>
                Edit
              </button>

              <button className="" style={{ background: "#139F01", width: "45%", opacity:interacFormData.is_editable ? "1": "0.5" }} onClick={interacFormData.is_editable && handleInteracIdFunc }>
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

export default PricingInteracId;
