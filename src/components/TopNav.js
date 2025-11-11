import React from "react";
import { useNavigate } from "react-router-dom";
function TopNav({
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
  if (bookingTop) {
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
            className="col-4 row  px-1"
            style={{ background: navBg, filter: "none", borderRadius: "24px" }}
          >
            {navItems?.slice(3, 5)?.map((v, i) => (
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
            className="col-2 row px-1"
            style={{ background: navBg, filter: "none", borderRadius: "24px" }}
          >
            {navItems?.slice(5, 6)?.map((v, i) => (
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
  if (broadcast) {
    return (
      <nav className="topNavMain" style={{ filter: "none" }}>
        <div className="row mx-2 p-0 d-flex justify-content-between">
          <div
            className="col-2 row px-1"
            style={{ background: navBg, filter: "none", borderRadius: "24px" }}
          >
            {navItems?.slice(0, 1)?.map((v, i) => (
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
            className="col-4 row px-1"
            style={{ background: navBg, filter: "none", borderRadius: "24px" }}
          >
            {navItems?.slice(1, 4)?.map((v, i) => (
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
            className="col-4 row px-1"
            style={{ background: navBg, filter: "none", borderRadius: "24px" }}
          >
            {navItems?.slice(4, 7)?.map((v, i) => (
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
            className="col-2 row px-1"
            style={{ background: navBg, filter: "none", borderRadius: "24px" }}
          >
            {navItems?.slice(7, 8)?.map((v, i) => (
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
  if (isItemMoreThen8) {
    return (
      <nav className="topNavMain" style={{ background: navBg, filter: "none" }}>
        <div className="row m-0 p-1">
          {navItems.map((v, i) => (
            <div className="col m-0 p-0" key={i}>
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
      </nav>
    );
  } else {
    return (
      <nav className="topNavMain " style={{ background: navBg }}>
        <div className="row m-0 p-1 ">
          <div className={divideRowClass + " row m-0 p-0"}>
            {navItems?.slice(0, 4)?.map((v, i) => {
              return (
                <div className="col-lg-3  m-0 p-0">
                  <div
                    onClick={() => navigate(v?.path)}
                    className=" navItem d-flex justify-content-center align-items-center"
                    style={{
                      background: v?.name == selectedItem ? sectedNavBg : "",
                    }}
                  >
                    <p
                      className="mb-0 "
                      style={{
                        color:
                          v?.name == selectedItem ? selectedNavColor : navColor,
                      }}
                    >
                      {v?.name}
                    </p>
                    {v?.notificationLength > 0 && (
                      <div
                        className=" d-flex justify-content-center align-items-center"
                        style={{
                          fontSize: "10px",
                          height: "16px",
                          width: "16px",
                          borderRadius: "50%",
                          background: "#FB000C",
                          position: "relative",
                          top: "10px",
                          left: "0px",
                        }}
                      >
                        <span className="text-light">
                          {v?.notificationLength}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className={divideRowClass + " row m-0 p-0"}>
            {navItems?.slice(4, 8)?.map((v, i) => {
              return (
                <div className="col-lg-3  m-0 p-0">
                  <div
                    onClick={() => navigate(v?.path)}
                    className=" navItem d-flex justify-content-center align-items-center"
                    style={{
                      background: v?.name == selectedItem ? sectedNavBg : "",
                    }}
                  >
                    <p
                      className="mb-0 "
                      style={{
                        color:
                          v?.name == selectedItem ? selectedNavColor : navColor,
                      }}
                    >
                      {v?.name}
                    </p>
                    {v?.notificationLength > 0 && (
                      <div
                        className=" d-flex justify-content-center align-items-center"
                        style={{
                          fontSize: "10px",
                          height: "16px",
                          width: "16px",
                          borderRadius: "50%",
                          background: "#FB000C",
                          position: "relative",
                          top: "10px",
                          left: "0px",
                        }}
                      >
                        <span className="text-light">
                          {v?.notificationLength}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </nav>
    );
  }
}

export default TopNav;
