import React from "react";
import { useNavigate } from "react-router-dom";
function FundManagementNav({
  navBg,
  isItemMoreThen8,
  navItems,
  divideRowClass,
  sectedNavBg,
  selectedItem,
  selectedNavColor,
  navColor,
  bookingTop,
  broadcast,
}) {
  const navigate = useNavigate();
  
    return (
      <nav className="topNavMain" style={{ filter: "none" }}>
        <div className="row mx-2 p-0 d-flex justify-content-between">
          <div
            className="col-6 row px-1"
            style={{ background: navBg, filter: "none", borderRadius: "24px" }}
          >
            {navItems?.slice(0, 3)?.map((v, i) => (
              <div className="col m-0 px-0 py-1" key={i}>
                <div
                  onClick={() => navigate(v?.path)}
                  className="navItem"
                  style={{
                    background: v?.name === selectedItem ? sectedNavBg : "",
                  }}
                >
                  <p
                    className="mb-0"
                    style={{
                      color:
                        v?.name === selectedItem ? selectedNavColor : navColor,
                    }}
                  >
                    {v?.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div
            className="col-6 row  px-1"
            style={{ background: navBg, filter: "none", borderRadius: "24px" }}
          >
            {navItems?.slice(3, 6)?.map((v, i) => (
              <div className="col m-0 px-0 py-1" key={i}>
                <div
                  onClick={() => navigate(v?.path)}
                  className="navItem"
                  style={{
                    background: v?.name === selectedItem ? sectedNavBg : "",
                  }}
                >
                  <p
                    className="mb-0"
                    style={{
                      color:
                        v?.name === selectedItem ? selectedNavColor : navColor,
                    }}
                  >
                    {v?.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </nav>
    );
 
}

export default FundManagementNav;
