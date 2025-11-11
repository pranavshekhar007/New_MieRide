import React from "react";
import { useNavigate } from "react-router-dom";
function SecondaryTopNav({
  selectedNav,
  navItems,
  navBg,
  navColor,
  selectedNavBg,
  selectedNavColor,
}) {
  const navigate = useNavigate();

  return (
    <div className="topNavMain mt-4">
      
         <div
              className={" d-flex  borderRadius25 padding5  " }
              style={{  background:navBg }}
            >
              {navItems?.map((value, i) => {
                return (
                  <div
                    className="col m-0 p-0"
                    onClick={() => navigate(value.path)}
                  >
                    <div
                      className={
                        "borderRadius25 topNavItem " 
                        
                      }
                      style={{background : value?.name == selectedNav ? selectedNavBg: navBg}}
                    >
                      <p style={{color: value?.name == selectedNav ? selectedNavColor: navColor, fontSize : value?.name?.length >10 ? "12.5px": "14px"}}>
                        {value?.name}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
      
    </div>
  );
}

export default SecondaryTopNav;
