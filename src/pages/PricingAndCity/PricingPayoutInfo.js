import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import JoditEditor from "jodit-react";
import {
  getPayoutServ,
  handleSubmitPayoutInfoServ,
} from "../../services/priceAndCity.services";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useGlobalState } from "../../GlobalProvider";
import NewSidebar from "../../components/NewSidebar";
import CustomTopNav from "../../components/CustomTopNav";
function PricingPayoutInfo() {
  const { setGlobalState, globalState } = useGlobalState();
  const [isEditable, setIsEditable] = useState(false);

  const navItems = [
    [
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
        name: "Commission",
        path: "/pricing-commission",
      },
      {
        name: "Payment & Payout ",
        path: "/pricing-payout-info",
      },{
        name: "Geo Deals ",
        path: "/geo-deals",
      },
    ],
  ];

  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [formData, setFormData] = useState({
    description: "",
    id: "",
  });
  const handleGetPayoutInfoFunc = async () => {
    try {
      let response = await getPayoutServ();
      if (response?.data?.statusCode == "200") {
        setContent(response?.data?.data[0]?.description);
        setFormData({
          description: response?.data?.data[0]?.description,
          id: response?.data?.data[0]?.id,
        });
      }
    } catch (error) {}
  };
  const handleSubmitFunc = async () => {
    try {
      let response = await handleSubmitPayoutInfoServ(formData);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        handleGetPayoutInfoFunc();
      }
    } catch (error) {}
  };
  useEffect(() => {
    handleGetPayoutInfoFunc();
  }, []);
  const config = {
    readonly: !isEditable, // Make editor read-only based on isEditable
    placeholder: "Start typing...", // Placeholder text
  };
  const handleEditorChange = (newContent) => {
    // Update the formData state only with the description field
    setFormData((prevState) => ({
      ...prevState,
      description: newContent,
    }));
  };
  return (
    <div className="mainBody">
      <NewSidebar selectedItem="Settings" />
      <div className="contentLayout">
        <div className="bgWhite borderRadius30 p-4 minHeight100vh">
          <div className="sticky-top bgWhite">
            <CustomTopNav navItems={navItems} selectedNav="Payment & Payout" />
          </div>
          <div
            className="tableOuterContainer bgDark mt-4"
            style={{ padding: " 30px" }}
          >
            <div className="payoutMainDiv">
              <div className="row m-0 p-0">
                <div className="col-6">
                  <label>Scheduled Payouts</label>
                  <input value="Automatically processed every" />
                  <select>Monday</select>
                </div>
                <div className="col-6">
                  <label>HST (in %)</label>
                  <div className="inputDivCommission">
                    <input value="15" />
                    <img src="https://cdn-icons-png.flaticon.com/128/468/468194.png" />
                  </div>
                </div>
                <div className="col-6">
                  <label>Update Payout Method</label>
                  <div className="inputDivCommission">
                    <input value=" Submit a request to change from Interac to Direct Deposit." />
                    {/* <img src="https://cdn-icons-png.flaticon.com/128/468/468194.png" /> */}
                  </div>
                </div>
                <div className="col-6">
                  <label>Interac E-Transfer ID</label>
                  <div className="inputDivCommission">
                    <input value="abcx1234@gmail.com" />
                    {/* <img src="https://cdn-icons-png.flaticon.com/128/468/468194.png" /> */}
                  </div>
                </div>
                <div className="col-6">
                  <label>Interac Transfer Fee</label>
                  <div className="inputDivCommission">
                    <input value="15" />
                    {/* <img src="https://cdn-icons-png.flaticon.com/128/468/468194.png" /> */}
                  </div>
                </div>
                
                <div className="col-6">
                  <label>User Credit Card Fee</label>
                  <div className="inputDivCommission">
                    <input value="15" />
                    <img src="https://cdn-icons-png.flaticon.com/128/468/468194.png" />
                  </div>
                </div>
                <div className="col-6">
                  <label>Direct Deposit Charge</label>
                  <div className="inputDivCommission">
                    <input value="15" />
                    <img src="https://cdn-icons-png.flaticon.com/128/468/468194.png" />
                  </div>
                </div>
                <div className="col-6">
                  <label>Driver Withdrawal Fee</label>
                  <div className="inputDivCommission">
                    <input value="15" />
                    <img src="https://cdn-icons-png.flaticon.com/128/468/468194.png" />
                  </div>
                </div>

              </div>
              <div>
                <button>Edit</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <div className="main_layout bgBlack d-flex">
      {/* Sidebar started */}
      <Sidebar selectedItem="Settings" />
      {/* Sidebar ended */}

      {/* Section layout started */}
      <section
        className="section_layout"
        style={{
          marginLeft: globalState?.isFillSidebarWidth100 ? "260px" : "80px",
        }}
      >
        {/* Top nav started */}
        <TopNav
          navItems={navItems}
          navColor="#fff"
          navBg="#787DA7"
          divideRowClass="col-xl-6 col-lg-6 col-md-6 col-6"
          selectedItem="Payout Info"
          sectedNavBg="#fff"
          selectedNavColor="#030303"
          isItemMoreThen8={true}
        />
        {/* Top nav ended */}

        <div className="payoutMainDiv">
          <div className="row m-0 p-0 ">
            <div className="col-7 ">
              <div className="payoutEditorMain">
                <p>Payout Info</p>

                {/* TinyMCE Text Editor */}
                <JoditEditor
                  ref={editor}
                  value={formData?.description}
                  tabIndex={1} // tabIndex of textarea
                  config={config}
                  onChange={(newContent) => {
                    // Update formData description with new content from editor
                    setFormData((prevState) => ({
                      ...prevState,
                      description: newContent,
                    }));
                  }}
                />
                <div className="d-flex justify-content-center mt-2">
                  <div
                    className="commissionBtnGroup d-flex justify-content-between w-50"
                    style={{ marginBottom: "0px" }}
                  >
                    <button
                      className=""
                      style={{ width: "45%" }}
                      onClick={() => {
                        setIsEditable(true);
                        toast.success("Start editing the form");
                      }}
                    >
                      Edit
                    </button>
                    {isEditable ? (
                      <button
                        className=""
                        style={{ background: "#139F01", width: "45%" }}
                        onClick={handleSubmitFunc}
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        className=""
                        style={{
                          background: "#139F01",
                          width: "45%",
                          opacity: "0.5",
                        }}
                      >
                        Save
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-5 d-flex justify-content-end ">
              <div
                style={{
                  backgroundSize: "100%",
                  backgroundImage: "url(/icons/priceAndCityIcons/phone.png)",
                  height: "550px",
                  width: "300px",
                  wordWrap: "break-word",
                  whiteSpace: "pre-wrap",
                }}
                className="d-flex justify-content-center align-items-center"
              >
                <div
                  className="p-2 border rounded"
                  style={{ width: "80%" }}
                  dangerouslySetInnerHTML={{ __html: content }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Section layout ended */}
    </div>
  );
}

export default PricingPayoutInfo;
