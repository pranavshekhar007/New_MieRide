import React from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import TableNav from "../../components/TableNav";

function AdControlPanelCommingSoon() {
  
  
  return (
    <div className="main_layout  bgBlack d-flex">
      {/* sidebar started */}
      <Sidebar selectedItem="Ad Control Panel"/>
      {/* sidebar ended */}
      
      {/* sectionLayout started */}
      <section className="section_layout">
        
        
        <div className="vh80 d-flex justify-content-center align-items-center">
                <h1>Ad Control Comming Soon</h1>
            </div>
          
      </section>
      {/* sectionLayout ended */}
    </div>
  );
}

export default AdControlPanelCommingSoon;
