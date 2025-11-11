import React from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import TableNav from "../../components/TableNav";
import { useGlobalState } from "../../GlobalProvider";
function WebsiteAds() {
  const { setGlobalState, globalState } = useGlobalState();
  const navItems = [
    {
      name: "Ads",
      path: "/ads-user-panel",
    },
    {
      name: "Notify",
      path: "/ads-user-panel",
    },
    {
      name: "Deals",
      path: "/notify-ads",
    },
    {
      name: "Website",
      path: "/website-ads",
    },
  ];
  
  return (
    <div className="main_layout  bgBlack d-flex">
      {/* sidebar started */}
      <Sidebar selectedItem="Ad Control Panel" />
      {/* sidebar ended */}

      {/* sectionLayout started */}
      <section className="section_layout" style={{ marginLeft :globalState?.isFillSidebarWidth100 ? "260px": "80px" }}>
        {/* top nav started  */}
        <TopNav
          navItems={navItems}
          navColor="#fff"
          navBg="#716879"
          divideRowClass="col-xl-8 col-lg-8 col-md-12 col-12"
          selectedItem="Website"
          sectedNavBg="#fff"
          selectedNavColor="#000"
        />
        {/* top nav ended  */}
        {/* table List started */}
        <div className="tableMain">
          
          <div className="tableBody py-2 px-4 borderRadius50All" style={{ background: "#F3F3F3" }}>
            <div style={{ margin: "20px 10px" }}>
              <table className="table bookingTable">
                <thead>
                  <tr style={{ background: "#DDDDDD", color: "#000" }}>
                    <th scope="col" style={{ borderRadius: "12px 0px 0px 12px" }}>
                      Sr. No
                    </th>
                    <th scope="col">Upload</th>

                    <th scope="col">Description</th>
                    <th scope="col">Action</th>
                    

                    <th scope="col" style={{ borderRadius: "0px 12px 12px 0px" }}>
                    Preview
                    </th>
                  </tr>
                </thead>
                <div className="py-2"></div>
                <tbody>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9]?.map((v, i) => {
                    return (
                      <>
                        <tr className=" ">
                          <td scope="row" style={{ borderTopLeftRadius: "24px", borderBottomLeftRadius: "24px" }}>
                            {i + 1}
                          </td>
                          <td>
                            <button
                              className="btn btn-primary"
                              style={{ padding: "5px 8px", background: "#363435", border: "none" }}
                            >
                              Choose File
                            </button>
                          </td>
                          <td style={{width:"300px"}}>
                            <div className="d-flex justify-content-center ">
                              <input
                                className="form-control shadow"
                                placeholder="Enter Description"
                                
                              />
                            </div>
                          </td>
                          <td>
                            <select style={{ padding: "9.5px", marginTop: "0px" }}>
                              <option>Submit</option>
                              <option>Accept</option>
                              <option>Reject</option>
                            </select>
                          </td>
                          

                          <td
                            style={{
                              borderTopRightRadius: "24px",
                              borderBottomRightRadius: "24px",
                              overflow: "hidden",
                            }}
                          >
                            <img
                                src="https://cdn-icons-png.flaticon.com/128/535/535193.png"
                                style={{ height: "22px", marginTop: "6px" }}
                              />
                          </td>
                        </tr>
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* table List ended */}
      </section>
      {/* sectionLayout ended */}
    </div>
  );
}

export default WebsiteAds;
