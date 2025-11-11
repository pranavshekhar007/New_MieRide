import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import TableNav from "../../components/TableNav";
import {
  getPrivacyPolicyServ,
  addPrivacyPolicyServ,
  updatePrivacyPolicyServ,
  deletePrivacyPolicyServ,
} from "../../services/support.services";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import { useGlobalState } from "../../GlobalProvider";
function SupportPpDriver() {
  const { setGlobalState, globalState } = useGlobalState();
  const navItems = [
    {
      name: "Faq",
      path: "/support-faq-user",
    },
    {
      name: "Terms And Condition",
      path: "/support-tc-user",
    },
    {
      name: "Privacy Policy",
      path: "/support-pp-user",
    },
    {
      name: "Support",
      path: "/support-all",
    },
    {
      name: "Contact Queries",
      path: "/support-query-list",
    },
  ];
  const tableNav = [
    {
      name: "User",
      path: "/support-pp-user",
    },
    {
      name: "Driver",
      path: "/support-pp-driver",
    },
    {
      name: "Agent",
      path: "/support-pp-agent",
    },
  ];
  const [showSkelton, setShowSkelton] = useState(false);
  const [listPolicy, setListPolicy] = useState([]);
  const [submit, setSubmit] = useState("Submit");

  const handleListPrivacyPolicyFunc = async () => {
    if (listPolicy.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await getPrivacyPolicyServ({ type: "driver" });
      if (response?.data?.statusCode == "200") {
        const updatedFaqList = response?.data?.data.map((item) => ({
          ...item,
          showAnswer: false,
        }));
        setListPolicy(updatedFaqList);
      }
    } catch (error) { }
    setShowSkelton(false);
  };
  useEffect(() => {
    handleListPrivacyPolicyFunc();
  }, []);

  const handleDeleteFunc = async (id) => {
    const confirmed = window.confirm("Are you sure you want delete the Privacy Policy?");
    if (confirmed) {
      try {
        let response = await deletePrivacyPolicyServ({ id });
        if (response?.data?.statusCode == "200") {
          toast.success(response?.data?.message);
          handleListPrivacyPolicyFunc();
        }
      } catch (error) {
        toast.error("Internal Server Error");
      }
    }
  };
  const [formData, setFormData] = useState({
    privacy_policy: "",
    type: "driver",
  });
  const handleSubmitPrivacyPolicyFunc = async () => {
    setSubmit("Submit . . .");
    try {
      let response;
      if (formData?.id) {
        response = await updatePrivacyPolicyServ(formData);
      } else {
        response = await addPrivacyPolicyServ(formData);
      }

      if (response?.data?.statusCode == "200" || response?.data?.status == "200") {
        toast.success(response?.data?.message);
        handleListPrivacyPolicyFunc();
        setFormData({
          privacy_policy: "",
          type: "driver",
          id: ""
        });
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
    setSubmit("Submit");
  };
  return (
    <div className="main_layout  bgBlack d-flex">
      {/* sidebar started */}
      <Sidebar selectedItem="Support" />
      {/* sidebar ended */}

      {/* sectionLayout started */}
      <section className="section_layout" style={{ marginLeft: globalState?.isFillSidebarWidth100 ? "260px" : "80px" }}>
        {/* top nav started  */}
        <TopNav
          navItems={navItems}
          navColor="#fff"
          navBg="#CA0360"
          divideRowClass="col-xl-6 col-lg-6 col-md-12 col-12"
          selectedItem="Privacy Policy"
          sectedNavBg="#fff"
          selectedNavColor="#030303"
        />
        {/* top nav ended  */}
        {/* table List started */}
        <div className="tableMain">
          <TableNav tableNav={tableNav} selectedItem="Driver" sectedItemBg="#F7F6FF" />
          <div className="tableBody py-2 px-4 borderRadius50All" style={{ background: "#F7F6FF" }}>
            <div className="row marginY35">
              <div className="col-6">
                <div className="">
                  <h2 className="tcHeadind mb-4 ms-2">
                    <span style={{ color: "#ca0361" }}>Driver</span> Privacy Policy
                  </h2>
                  {showSkelton
                    ? [1, 2, 3, 4]?.map((v, i) => {
                      return (
                        <div className="p-3 accordenBox mb-3">
                          <div className="d-flex justify-content-end align-items-center mb-2">
                            <Skeleton width={200} />
                          </div>
                          <Skeleton width="100%" height={150} />

                        </div>
                      );
                    })
                    : listPolicy?.map((v, i) => {
                      return (
                        <div className="p-3 accordenBox mb-3">
                          <div className="d-flex justify-content-between  mb-2">
                            <p className="mb-0">{v?.privacy_policy}</p>
                            <div>
                              <select
                                onChange={(e) => {
                                  if (e.target.value === "Delete") {
                                    handleDeleteFunc(v?.id);
                                  } else if (e.target.value === "Edit") {
                                    setFormData({
                                      privacy_policy: v?.privacy_policy,
                                      type: "user",
                                      id: v?.id,
                                    });
                                  }
                                }}
                              >
                                <option>Action</option>
                                <option value="Edit">Edit</option>
                                <option value="Delete">Delete</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
              <div className="col-6 ">
                <div className="accordenBox px-3 py-4 h-100">
                  <h6>Driver Privacy Policy ? </h6>

                  <textarea
                    className="form-control mt-2 mb-4"
                    rows={12}
                    value={formData?.privacy_policy}
                    onChange={(e) => setFormData({ ...formData, privacy_policy: e.target.value })}
                  />
                  <div className="d-flex justify-content-center mt-3">
                    {formData?.privacy_policy ? (
                      <button onClick={handleSubmitPrivacyPolicyFunc} className="btn btn-success accordenBoxbutton">
                        {submit}
                      </button>
                    ) : (
                      <button style={{ opacity: "0.6" }} className="btn btn-success accordenBoxbutton">
                        Submit
                      </button>
                    )}
                  </div>
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

export default SupportPpDriver;
