import React from "react";
import { useNavigate } from "react-router-dom";
function CustomTopNav({
  selectedNav,

  navItems,
}) {
  const navigate = useNavigate();

  return (
    <div className="topNavMain">
      <div className="d-flex justify-content-between ">
        {navItems?.map((v, i) => {
          return (
            <div
              className={" d-flex bgDark borderRadius25 padding5  " + (navItems?.length >1 ? " mx-2":" ")}
              style={{ width: (v?.length/navItems.length)*100 + "%" }}
            >
              {v?.map((value, i) => {
                return (
                  <div className="col m-0 p-0" onClick={()=>navigate(value.path)}>
                    <div
                      className={
                        "borderRadius25 topNavItem " +
                        (value?.name == selectedNav && "bgSuccess")
                      }
                    >
                      <p className={value?.name == selectedNav && " textDark"}>
                        {value?.name}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CustomTopNav;
