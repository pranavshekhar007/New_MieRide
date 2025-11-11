import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import TableNav from "../../components/TableNav";
import JoditEditor from "jodit-react";
import {
  getTermsAndConditionServ,
  addTermsAndConditionServ,
  updateTermsAndConditionServ,
  deleteTermsAndConditionServ,
} from "../../services/support.services";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useGlobalState } from "../../GlobalProvider";
function SupportTcAgent() {
  const { setGlobalState, globalState } = useGlobalState();
  const [isEditable, setIsEditable] = useState(false);
  const [content, setContent] = useState(""); // Content from JoditEditor
  const editor = useRef(null);
  const navItems = [
    { name: "Faq", path: "/support-faq-user" },
    { name: "Terms And Condition", path: "/support-tc-user" },
    { name: "Privacy Policy", path: "/support-pp-user" },
    { name: "Support", path: "/support-all" },
    {
      name: "Contact Queries",
      path: "/support-query-list",
    },
  ];
  const tableNav = [
    { name: "User", path: "/support-tc-user" },
    { name: "Driver", path: "/support-tc-driver" },
    { name: "Agent", path: "/support-tc-agent" },
  ];
  const config = {
    readonly: !isEditable, // Make editor read-only based on isEditable
    placeholder: "Start typing...", // Placeholder text
    height: "400px",
  };
  const [editId, setEditId]=useState()
  const handleSubmit = async () => {
    try {

     let response;
      if (isEditable && editId) {
        // If it's editable and we have an editId, update the terms
        response = await updateTermsAndConditionServ({
          type: "agent",
          terms_condition: editor.current.value,
          id: editId,
        });
      } else {
        // Otherwise, create new terms and conditions
        response = await addTermsAndConditionServ({
          type: "agent",
          terms_condition: editor.current.value,
        });
      }
      if (response.data.statusCode == "200") {
        toast.success(response?.data?.message);
        handleGetTcFunc()
      }
    } catch (error) {}
    console.log(editor.current.value);
  };

  const handleGetTcFunc = async () => {
    try {
      let response = await getTermsAndConditionServ({ type: "agent" });
      if (response?.data?.statusCode == "200") {
        setContent(response?.data?.data[0].terms_condition);
        setEditId(response?.data?.data[0].id)
      }
    } catch (error) {}
  };
  useEffect(() => {
    handleGetTcFunc();
  }, []);
  
  // const handleDeleteTermsAndCondition =async ()=>{
  //   const confirmed = window.confirm("Are you sure you want delete the faq?");
  //   if (confirmed) {
  //     try {
  //     let response = await deleteTermsAndConditionServ({id:editId})
  //     if(response?.data?.statucCode=="200"){
  //       toast.success(response?.data?.message);
  //       handleGetTcFunc()
  //     }
  //     } catch (error) {
        
  //     }
  //   }
    
  // }
  return (
    <div className="main_layout bgBlack d-flex">
      {/* Sidebar */}
      <Sidebar selectedItem="Support" />

      {/* Section Layout */}
      <section className="section_layout" style={{marginLeft :globalState?.isFillSidebarWidth100 ? "260px": "80px" }}>
        {/* Top Navigation */}
        <TopNav
          navItems={navItems}
          navColor="#fff"
          navBg="#05E2B5"
          divideRowClass="col-xl-6 col-lg-6 col-md-12 col-12"
          selectedItem="Terms And Condition"
          sectedNavBg="#fff"
          selectedNavColor="#030303"
        />

        {/* Table List */}
        <div className="tableMain">
          <TableNav tableNav={tableNav} selectedItem="Agent" sectedItemBg="#F1F1F1" />
          <div className="tableBody py-2 px-4 borderRadius50All" style={{ background: "#F1F1F1" }}>
            <div className="marginY35">
              {/* Terms and Conditions Editor */}
              <div className="accordenBox p-4 mb-3">
                <h6>Terms And Condition </h6>
                <JoditEditor
                  ref={editor}
                  value={content}
                  tabIndex={1}
                  config={config}
                  onChange={(newContent) => {
                    editor.current.value = newContent;
                  }}
                />

                <div className="d-flex justify-content-center mt-3">
                  <button
                    className="accordenBoxbutton btn btn-primary mx-3"
                    style={{ background: "#040707" }}
                    onClick={() => {
                      setIsEditable(true);
                      toast.success("Start editing the form");
                    }}
                  >
                    Edit
                  </button>
                  {
                      isEditable ? <button className="btn btn-success accordenBoxbutton mx-3"  onClick={handleSubmit}>
                      Submit
                    </button>: <button className="btn btn-success accordenBoxbutton mx-3" style={{  opacity:"0.5" }} >
                      Submit
                    </button>
                    }
                  
                </div>
              </div>

              <div
                className="p-4 accordenBox mb-3"
                style={{ width: "100%", wordWrap: "break-word", whiteSpace: "pre-wrap" }}
              >
                <div className="d-flex justify-content-end">
                  {/* <button
                    className="accordenBoxbutton btn btn-danger mb-3"
                    style={{ background: "#E8210A", width: "100px" }}
                    // onClick={handleDeleteTermsAndCondition}
                  >
                    Delete
                  </button> */}
                </div>
                <div dangerouslySetInnerHTML={{ __html: content }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SupportTcAgent;
