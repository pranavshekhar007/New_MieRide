import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import TableNav from "../../components/TableNav";
import { useGlobalState } from "../../GlobalProvider";
import {
  storeWalletRechargeServ,
  getWalletRechargeServ,
  handleDeleteRechargeCommissionServ,
  updateWalletRechargeCommissionServ
} from "../../services/financeHub.services";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import NoRecordFound from "../../components/NoRecordFound";
function BonusList() {
  const { setGlobalState, globalState } = useGlobalState();
  const navItems = [
    {
      name: "Finance",
      path: "/finance-details",
    },
    {
      name: "Bonus",
      path: "/bonus-list",
    },
  ];

  const [formData, setFormData] = useState({
    type: "agent",
    amount: "",
    commission: "",
  });
  const [submitLoader, setSubmitLoader] = useState(false);
  const handleSubmitFunc = async () => {
    setSubmitLoader(true);
    try {
      let response = await storeWalletRechargeServ(formData);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        setFormData({
          type: "agent",
          amount: "",
          commission: "",
        });
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
    setSubmitLoader(false);
  };
  const [list, setList] = useState([]);
  const [showSkelton, setShowSkelton] = useState(false);
  const handleGetListFunc = async () => {
    setShowSkelton(true);
    try {
      let response = await getWalletRechargeServ({ type: "agent" });
      setList(response?.data?.data);
    } catch (error) {
      console.log("Internal Server Error");
    }
    setShowSkelton(false);
  };
  useEffect(() => {
    handleGetListFunc();
  }, []);
  const [deleteId, setDeleteId] = useState(null);
  const handleDeleteFunc = async (id) => {
    setDeleteId(id);
    try {
      let response = await handleDeleteRechargeCommissionServ({ id });
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        handleGetListFunc()
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
    setDeleteId(null);
  };
  const [updateFormData, setUpdateFormData]=useState({
    id:"",
    type:"",
    amount:"",
    commission:""
  });
  const [updateLoader, setUpdateLoader]=useState(false)
  const updateRecordFunc = async ()=>{
    setUpdateLoader(true)
    try {
      let response = await updateWalletRechargeCommissionServ(updateFormData);
      if(response?.data?.statusCode=="200"){
        toast.success(response?.data?.message);
        setUpdateFormData(null);
        handleGetListFunc()
      }
    } catch (error) {
     toast.error("Internal Surver Error") 
    }
    setUpdateLoader(false)
  }
  return (
    <div className="main_layout  bgBlack d-flex">
      {/* sidebar started */}
      <Sidebar selectedItem="Finance Hub" />
      {/* sidebar ended */}

      {/* sectionLayout started */}
      <section className="section_layout" style={{ marginLeft: globalState?.isFillSidebarWidth100 ? "260px" : "80px" }}>
        {/* top nav started  */}
        <TopNav
          navItems={navItems}
          navColor="#000"
          divideRowClass="col-xl-8 col-lg-8 col-md-12 col-12"
          selectedItem="Bonus"
          sectedNavBg="#000"
          selectedNavColor="#fff"
          navBg="#B7B1F1"
        />
        {/* top nav ended  */}
        {/* table List started */}
        <div className="tableMain">
          {/* <TableNav tableNav={tableNav} selectedItem="Weekly Withdraw" sectedItemBg="#f2fbff" /> */}
          <div className="tableBody  p-5 px-3 borderRadius50All financeMain" style={{ background: "#F3F3F3" }}>
            <div className="row d-flex align-items-center mx-5 ">
              <div className="col-5">
                <h5 className="mb-0">Wallet Recharge</h5>
              </div>
              <div className="col-5">
                <h5 className="mb-0">Commission Intro</h5>
              </div>
            </div>
            <div className="row d-flex align-items-center mx-5 my-5">
              <div className="col-5 d-flex align-items-center">
                <h6 className="mb-0 me-5">Amount</h6>
                <div className="d-flex align-items-center">
                  <input
                    className="form-control shadow-sm"
                    style={{ border: "none" }}
                    value={formData?.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  />
                  <span style={{ position: "relative", left: "-20px" }}>$</span>
                </div>
              </div>
              <div className="col-5 d-flex align-items-center ">
                <h6 className="mb-0 me-5">Percentage</h6>
                <div className="d-flex align-items-center">
                  <input
                    className="form-control shadow-sm"
                    style={{ border: "none" }}
                    value={formData?.commission}
                    onChange={(e) => setFormData({ ...formData, commission: e.target.value })}
                  />
                  <span style={{ position: "relative", left: "-20px" }}>%</span>
                </div>
              </div>
              <div className="col-2">
                {formData?.amount && formData?.commission && formData?.type ? (
                  submitLoader ? (
                    <button
                      className=" btn btn-success w-100"
                      style={{ background: "#139F02", border: "none", borderRadius: "8px", opacity: "0.5" }}
                    >
                      Saving ...
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSubmitFunc()}
                      className=" btn btn-success w-100"
                      style={{ background: "#139F02", border: "none", borderRadius: "8px" }}
                    >
                      Submit
                    </button>
                  )
                ) : (
                  <button
                    className=" btn btn-success w-100"
                    style={{ background: "#139F02", border: "none", borderRadius: "8px", opacity: "0.5" }}
                  >
                    Submit
                  </button>
                )}
              </div>
            </div>
            <div style={{ margin: "0px 10px" }}>
              <table className="table">
                <thead>
                  <tr style={{ background: "#DDDDDB" }}>
                    <th scope="col" style={{ borderRadius: "8px 0px 0px 8px" }}>
                      Sr. No
                    </th>
                    <th scope="col">Amount</th>

                    <th scope="col">Percentage</th>
                    <th scope="col" style={{ borderRadius: "0px 8px 8px 0px" }}>
                      Action
                    </th>
                  </tr>
                </thead>
                <div className="py-2"></div>
                <tbody>
                  {showSkelton
                    ? [1, 2, 3, 4, 5]?.map((v, i) => {
                        return (
                          <tr key={i}>
                            <td>
                              <Skeleton width={50} />
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
                    : list.map((v, i) => (
                        <tr key={i} style={{ background: i % 2 !== 0 ? "#EBE6E2" : "#F3F3F3", cursor: "pointer" }}>
                          <td style={{ borderRadius: "16px 0px 0px 16px" }}>{i + 1}</td>
                          <td style={{ color: "blue" }}>{v?.amount}</td>
                          <td>{v?.commission}%</td>
                          <td className="d-flex justify-content-center" style={{ borderRadius: "0px 16px 16px 0px" }}>
                            <div style={{ width: "30%" }}>
                              <button className="btn btn-primary w-50 btn-sm mx-2" onClick={()=>setUpdateFormData(v)}>Edit</button>
                              {deleteId == v?.id ? (
                                <button className="btn btn-danger w-50 btn-sm mx-2" style={{ opacity: "0.5" }}>
                                  Deleting ...
                                </button>
                              ) : (
                                <button
                                  className="btn btn-danger w-50 btn-sm mx-2"
                                  onClick={() => handleDeleteFunc(v?.id)}
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
              {list?.length == 0 && !showSkelton && (
               <NoRecordFound/>
              )}
            </div>
          </div>
          {/* </div> */}
        </div>
        {/* table List ended */}
      </section>
      {/* sectionLayout ended */}
      {updateFormData?.id && (
        <div
          className="modal fade show d-flex align-items-center justify-content-center userHistoryPopUp"
          tabIndex="-1"
        >
          <div className="modal-dialog" style={{width:"500px"  }}>
            <div className="modal-content  w-100 switchPopUpDiv" style={{padding:"20px"}}>
              <div className="d-flex justify-content-end ">
                <i
                  className="fa fa-close text-secondary p-2"
                  onClick={()=>setUpdateFormData(null)}
                ></i>
              </div>
              <h6 className="mb-4">Update Commission</h6>
              <div className="modal-body p-0" >
               <label>Wallet</label>
               <input className="form-control w-100 mb-3" value={updateFormData?.amount} onChange={(e)=>setUpdateFormData({...updateFormData, amount:e.target.value})}/>
               <label>Commission</label>
               <input className="form-control w-100" value={updateFormData?.commission} onChange={(e)=>setUpdateFormData({...updateFormData, commission:e.target.value})}/>
               {updateFormData?.amount && updateFormData?.commission ? 
               updateLoader? <button  className="btn btn-success mt-3 w-100" style={{background:"#139F01", opacity:"0.5"}}>Updating ...</button>:
                <button onClick={updateRecordFunc} className="btn btn-success mt-3 w-100" style={{background:"#139F01"}}>Update</button> :
                <button className="btn btn-success mt-3 w-100" style={{background:"#139F01", opacity:"0.5"}}>Update</button> }
                
              </div>
            </div>
          </div>
        </div>
      )}
      {updateFormData?.id && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}

export default BonusList;
