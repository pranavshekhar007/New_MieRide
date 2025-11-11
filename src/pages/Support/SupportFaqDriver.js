import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import TableNav from "../../components/TableNav";
import { listFaqServ, deleteFaqServ, addFaqServ, updateFaqServ } from "../../services/support.services";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import { useGlobalState } from "../../GlobalProvider";
function SupportFaqDriver() {
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
      path: "/support-faq-user",
    },
    {
      name: "Driver",
      path: "/support-faq-driver",
    },
    {
      name: "Agent",
      path: "/support-faq-agent",
    },
  ];
  const [showSkelton, setShowSkelton] = useState(false);
  const [listFaq, setListFaq] = useState([]);
  const [submit, setSubmit] = useState("Submit");

  const handleListFaqFunc = async () => {
    if (listFaq.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await listFaqServ({ type: "driver" });
      if (response?.data?.statusCode == "200") {
        const updatedFaqList = response?.data?.data.map((item) => ({
          ...item,
          showAnswer: false,
        }));
        setListFaq(updatedFaqList);
      }
    } catch (error) {}
    setShowSkelton(false);
  };
  useEffect(() => {
    handleListFaqFunc();
  }, []);

  const handleDeleteFunc = async (id) => {
    const confirmed = window.confirm("Are you sure you want delete the faq?");
    if (confirmed) {
      try {
        let response = await deleteFaqServ({ id });
        if (response?.data?.statusCode == "200") {
          toast.success(response?.data?.message);
          handleListFaqFunc();
        }
      } catch (error) {
        toast.error("Internal Server Error");
      }
    }
  };
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    type: "driver",
  });
  const handleSubmitFaqFunc = async () => {
    setSubmit("Submit . . .");
    try {
      let response;
      if (formData?.id) {
        response = await updateFaqServ(formData);
      } else {
        response = await addFaqServ(formData);
      }

      if (response?.data?.statusCode == "200" || response?.data?.status == "200") {
        toast.success(response?.data?.message);
        handleListFaqFunc();
        setFormData({
          question: "",
          answer: "",
          type: "user",
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
      <section className="section_layout" style={{marginLeft :globalState?.isFillSidebarWidth100 ? "260px": "80px" }}>
        {/* top nav started  */}
        <TopNav
          navItems={navItems}
          navColor="#fff"
          navBg="#8F28F8"
          divideRowClass="col-xl-6 col-lg-6 col-md-12 col-12"
          selectedItem="Faq"
          sectedNavBg="#fff"
          selectedNavColor="#030303"
        />
        {/* top nav ended  */}
        {/* table List started */}
        <div className="tableMain">
          <TableNav tableNav={tableNav} selectedItem="Driver" sectedItemBg="#FFF2E1" />
          <div className="tableBody py-2 px-4 borderRadius50All" style={{ background: "#FFF2E1" }}>
            <div className="row marginY35">
              <div className="col-6">
                <div className="">
                  {showSkelton
                    ? [1, 2, 3, 4]?.map((v, i) => {
                        return (
                          <div className="p-3 accordenBox mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <Skeleton width={200} />
                              <div>
                                <Skeleton width={70} />
                              </div>
                            </div>
                            <Skeleton width="100%" height={100} />
                            <div className="d-flex justify-content-end mt-1">
                              <Skeleton width={20} />
                            </div>
                          </div>
                        );
                      })
                    : listFaq?.map((v, i) => {
                        if (v?.showAnswer) {
                          return (
                            <div key={i} className="p-3 accordenBox mb-3">
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <h5>{v?.question}</h5>
                                <div>
                                  <select
                                    onChange={(e) => {
                                      if (e.target.value === "Delete") {
                                        handleDeleteFunc(v?.id);
                                      } else if (e.target.value === "Edit") {
                                        setFormData({
                                          question: v?.question,
                                          answer: v?.answer,
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
                              <p className="mb-0">{v?.answer}</p>
                              <div className="d-flex justify-content-end mt-1">
                                <i
                                  className="fa fa-chevron-up"
                                  onClick={() => {
                                    const updatedFaq = listFaq.map((item, index) =>
                                      index === i ? { ...item, showAnswer: false } : item
                                    );
                                    setListFaq(updatedFaq);
                                  }}
                                  style={{ color: "#8F28F8" }}
                                ></i>
                              </div>
                            </div>
                          );
                        } else {
                          return (
                            <div key={i} className="p-3 accordenBox mb-3">
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <h5 className="mb-0">{v?.question}</h5>
                                <div>
                                  <i
                                    className="fa fa-chevron-down"
                                    onClick={() => {
                                      const updatedFaq = listFaq.map((item, index) =>
                                        index === i ? { ...item, showAnswer: true } : item
                                      );
                                      setListFaq(updatedFaq);
                                    }}
                                    style={{ color: "#8F28F8" }}
                                  ></i>
                                </div>
                              </div>
                            </div>
                          );
                        }
                      })}

                  {/* <div className="p-3 accordenBox mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="mb-0">What is Mieride?</h5>
                      <div>
                        <i className="fa fa-chevron-down" style={{ color: "#8F28F8" }}></i>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 accordenBox mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="mb-0">What is Mieride?</h5>
                      <div>
                        <i className="fa fa-chevron-down" style={{ color: "#8F28F8" }}></i>
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
              <div className="col-6 ">
                <div className="accordenBox px-3 py-4 h-100">
                  <h6>Write your Question ? </h6>
                  <textarea
                    className="form-control mt-1 mb-4"
                    rows={4}
                    value={formData?.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  />
                  <h6>Write your Answer ? </h6>
                  <textarea
                    className="form-control mt-1 mb-4"
                    rows={4}
                    value={formData?.answer}
                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  />
                  <div className="d-flex justify-content-center mt-3">
                    {formData?.question && formData?.answer ? (
                      <button onClick={handleSubmitFaqFunc} className="btn btn-success accordenBoxbutton">
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

export default SupportFaqDriver;
