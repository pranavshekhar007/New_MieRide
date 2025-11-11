import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import { useGlobalState } from "../../GlobalProvider";
import { getAllDriverListServ } from "../../services/driver.services";
import { getAllUserListServ } from "../../services/user.services";
import { getAllAgentListServ } from "../../services/agent.service";
import Select from "react-select";
import { createNotifyServ } from "../../services/ads.services";
import { toast } from "react-toastify";
import { MultiSelect } from "react-multi-select-component";
function NotifyAds() {
  const { setGlobalState, globalState } = useGlobalState();
  const navItems = [
    {
      name: "Ads",
      path: "/ads-user-panel",
    },
    {
      name: "Notify",
      path: "/notify-ads",
    },
    {
      name: "Deals",
      path: "/ads-user-panel",
    },
    {
      name: "Website",
      path: "/website-ads",
    },
  ];
  const [userList, setUserList] = useState([]);
  const [driverList, setDriverList] = useState([]);
  const [agentList, setAgentList] = useState([]);
  const [selectedDrivers, setSelectedDrivers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedAgents, setSelectedAgents] = useState([]);
  const handleGetDriverListFunc = async () => {
    try {
      let response = await getAllDriverListServ({ payload: "notify" });
      if (response?.data?.statusCode == "200") {
        const driverOptions = response?.data?.data?.map((v) => ({
          value: v?.id,
          label: `${v?.first_name} ${v?.last_name}`,
        }));
        setDriverList(driverOptions);
      }
    } catch (error) {}
  };
  const handleGetUserListFunc = async () => {
    try {
      let response = await getAllUserListServ({ payload: "notify" });
      if (response?.data?.statusCode == "200") {
        const userOptions = response?.data?.data?.map((v) => ({
          value: v?.id,
          label: `${v?.first_name} ${v?.last_name}`,
        }));

        setUserList(userOptions);
      }
    } catch (error) {}
  };
  const handleGetAgentListFunc = async () => {
    try {
      let response = await getAllAgentListServ({ payload: "notify" });
      if (response?.data?.statusCode == "200") {
        const userOptions = response?.data?.data?.map((v) => ({
          value: v?.id,
          label: `${v?.first_name} ${v?.last_name}`,
        }));
        setAgentList(userOptions);
      }
    } catch (error) {}
  };
  useEffect(() => {
    handleGetDriverListFunc();
    handleGetUserListFunc();
    handleGetAgentListFunc()
  }, []);

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    image: "",
    imgPrev: "",
    user_ids: "",
    driver_ids: "",
    agent_ids:""
  });
  const [loader, setLoader] = useState(false);
  const handleSubmit = async () => {
    setLoader(true);
    const selectedUserIds = selectedUsers?.map((v) => v?.value) || [];
    const selectedDriverIds = selectedDrivers?.map((v) => v?.value) || [];
    const selectedAgentsIds = selectedAgents?.map((v) => v?.value) || [];
    const notifyFormData = new FormData();
    notifyFormData.append("title", formData.title);
    notifyFormData.append("message", formData.message);
    notifyFormData.append("image", formData.image);
    selectedUserIds.forEach((id) => notifyFormData.append("user_ids[]", id)); // userIds is an array
    selectedDriverIds.forEach((id) => notifyFormData.append("driver_ids[]", id)); // driverIds is an array
    selectedAgentsIds.forEach((id) => notifyFormData.append("agent_ids[]", id)); // agentIds is an array
    try {
      let response = await createNotifyServ(notifyFormData);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        setFormData({
          title: "",
          message: "",
          image: "",
          user_ids: "",
          driver_ids: "",
          agent_ids:""
        });
        selectedDrivers([]);
        selectedUsers([]);
        selectedAgents([])
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      // toast.error("Internal Server Error");
    }
    setLoader(false);
  };
  return (
    <div className="main_layout  bgBlack d-flex">
      {/* sidebar started */}
      <Sidebar selectedItem="Ad Control Panel" />
      {/* sidebar ended */}

      {/* sectionLayout started */}
      <section className="section_layout" style={{ marginLeft: globalState?.isFillSidebarWidth100 ? "260px" : "80px" }}>
        {/* top nav started  */}
        <TopNav
          navItems={navItems}
          navColor="#000"
          navBg="#FEB238"
          divideRowClass="col-xl-8 col-lg-8 col-md-12 col-12"
          selectedItem="Notify"
          sectedNavBg="#fff"
          selectedNavColor="#000"
        />
        {/* top nav ended  */}
        {/* table List started */}
        <div className="tableMain">
          <div className="tableBody p-5 borderRadius50All" style={{ background: "#F2F2F2" }}>
            <div className="row">
              <div className="col-7 m-0 p-0">
                <div className="notifyForm">
                  <div className="row">
                    <div className="col-4 mb-4">
                      <MultiSelect
                        options={driverList}
                        value={selectedDrivers}
                        onChange={setSelectedDrivers}
                        labelledBy="Select Driver"
                        hasSelectAll={true} 
                        overrideStrings={{
                          selectSomeItems: "Select Driver", // Placeholder text
                          allItemsAreSelected: "All Drivers Selected",
                          selectAll: "Select All",
                          search: "Search Drivers...",
                        }}
                      />
                    </div>
                    <div className="col-4 mb-4">
                      <MultiSelect
                        options={userList}
                        value={selectedUsers}
                        onChange={setSelectedUsers}
                        labelledBy="Select User"
                        hasSelectAll={true} 
                        overrideStrings={{
                          selectSomeItems: "Select User", // Placeholder text
                          allItemsAreSelected: "All User Selected",
                          selectAll: "Select All",
                          search: "Search User...",
                        }}
                      />
                    </div>
                    <div className="col-4 mb-4">
                      <MultiSelect
                        options={agentList}
                        value={selectedAgents}
                        onChange={setSelectedAgents}
                        labelledBy="Select Agent"
                        hasSelectAll={true} 
                        overrideStrings={{
                          selectSomeItems: "Select Agent", // Placeholder text
                          allItemsAreSelected: "All Agent Selected",
                          selectAll: "Select All",
                          search: "Search Agent...",
                        }}
                      />
                    </div>
                    <div className="col-8 mb-4">
                      <input
                        className="form-control"
                        placeholder="Enter Title"
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        value={formData?.title}
                      />
                    </div>
                    <div className="col-4 mb-4">
                      <div className="">
                        <input
                          type="file"
                          id={`file-upload`} // Unique id for each input
                          style={{ display: "none", width: "100%" }} // Hide the actual input
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              image: e.target.files[0],
                              imgPrev: URL.createObjectURL(e.target.files[0]),
                            })
                          }
                        />
                        <button
                          className="btn btn-primary w-100"
                          style={{ padding: "7px 8px", background: "#363535", border: "none", color: "#fff" }}
                          onClick={() => document.getElementById(`file-upload`).click()} // Trigger input click
                        >
                          {formData?.image ? "Selected" : "Choose File"}
                        </button>
                      </div>
                    </div>
                    <div className="col-12 mb-4">
                      <textarea
                        placeholder="Write message"
                        className="form-control"
                        rows={13}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        value={formData?.message}
                      />
                    </div>
                  </div>
                  <div className="d-flex justify-content-center ">
                    {formData?.title &&
                    formData?.message &&
                    (selectedDrivers?.length > 0 || selectedUsers?.length > 0 || selectedAgents?.length > 0) ? (
                      <button className="sendBtn" onClick={handleSubmit}>
                        {loader ? "Sending..." : "Send"}
                      </button>
                    ) : (
                      <button className="sendBtn" style={{ opacity: "0.6" }}>
                        Send
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-5 p-2 d-flex justify-content-center">
                <div
                  style={{
                    backgroundSize: "100%",
                    backgroundImage: "url(/icons/priceAndCityIcons/notificationPhone.png)",
                    height: "575px",
                    width: "300px",
                    wordWrap: "break-word",
                    whiteSpace: "pre-wrap",
                    marginTop: "-10px",
                  }}
                  className="d-flex justify-content-center align-items-center"
                >
                  <div
                    className="shadow d-flex align-items-center"
                    style={{ height: "300px", width: "75%", marginLeft: "-5px", borderRadius: "12px" }}
                  >
                    <div className="p-3 w-100">
                      <h5 className="text-center" style={{ color: "#587A86" }}>
                        {formData?.title}
                      </h5>

                      <p className="text-secondary text-center">{formData?.message}</p>
                      {formData?.imgPrev && (
                        <img style={{ height: "120px", width: "100%", borderRadius: "12px" }} src={formData?.imgPrev} />
                      )}
                    </div>
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

export default NotifyAds;
