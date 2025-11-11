import React from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import TableNav from "../../components/TableNav";

function CommissionCommingSoon() {
  
  
  return (
    <div className="main_layout  bgBlack d-flex">
      {/* sidebar started */}
      <Sidebar selectedItem="Commission"/>
      {/* sidebar ended */}
      
      {/* sectionLayout started */}
      <section className="section_layout">
        
        
        <div className="vh80 d-flex justify-content-center align-items-center">
                <h1>Commission Comming Soon</h1>
            </div>
          
      </section>
      {/* sectionLayout ended */}
    </div>
  );
}

export default CommissionCommingSoon;
