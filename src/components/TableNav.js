import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
function TableNav({ tableNav, sectedItemBg, selectedItem, selectedNavColor, notificationBg }) {
  
  const navigate = useNavigate();
  const tableNavRef = useRef(null);

  useEffect(() => {
    // Scroll to the right if the selected item is "Intercity"
    if (selectedItem === "Intercity" && tableNavRef.current) {
      tableNavRef.current.scrollTo({
        left: tableNavRef.current.scrollWidth,
        behavior: "smooth",
      });
    }
  }, [selectedItem]);
  return (
    <div className="tableNav" ref={tableNavRef}>
      {tableNav?.map((v, i) => {
        return (
          <div
            onClick={() => navigate(v?.path)}
            className="tableNavItem"
            style={{ background: selectedItem == v?.name ? sectedItemBg : "" }}
          >
            <p
              style={{
                color: selectedItem == v?.name ? (selectedNavColor ? selectedNavColor : "#000") : "#000",
                borderColor: selectedItem == v?.name ? (selectedNavColor ? selectedNavColor : "#000") : "#000",
              }}
              className={"mb-0 pb-2 px-1 " + (selectedItem == v?.name ? " selectedP" : " ")}
            >
              {v?.name}
            </p>
            {v?.notificationLength >0 ? (
              <div
                className=" d-flex justify-content-center align-items-center"
                style={{
                  fontSize: "10px",
                  height: "16px",
                  width: "16px",
                  borderRadius: "50%",
                  background:notificationBg? notificationBg: "#FB000C",
                  position: "relative",
                  top: "-10px",
                  left: "0px",
                }}
              >
                <span className="text-light">{v?.notificationLength}</span>
              </div>
            ):<></>}
          </div>
        );
      })}
    </div>
  );
  return (
    <div className="tableNav" ref={tableNavRef}>
      {tableNav?.map((v, i) => {
        return (
          <div
            onClick={() => navigate(v?.path)}
            className="tableNavItem"
            style={{ background: selectedItem == v?.name ? sectedItemBg : "" }}
          >
            <p
              style={{
                color: selectedItem == v?.name ? (selectedNavColor ? selectedNavColor : "#000") : "#000",
                borderColor: selectedItem == v?.name ? (selectedNavColor ? selectedNavColor : "#000") : "#000",
              }}
              className={"mb-0 pb-2 px-1 " + (selectedItem == v?.name ? " selectedP" : " ")}
            >
              {v?.name}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default TableNav;
