import React, { useState, useEffect } from "react";
import { updateNotificationStatusServ } from "../services/notification.services";
import moment from "moment";
function NotificationBox({ v, bg, color }) {
  const updateNotificationStatusFunc = async (id) => {
    console.log("ashbjas")
    try {
      let response = await updateNotificationStatusServ({ notification_id: id });
      if (response?.data?.statusCode == "200") {
      }
    } catch (error) {}
  };
  // useEffect(() => {
  //   if(v?.is_read==0){
  //       updateNotificationStatusFunc(v?.id)
  //   }
  // });
  return (
    <div
      className="d-flex justify-content-between notificationBox align-items-center"
      style={{ background: bg, opacity: v?.is_read == 1 ? "0.7" : "1" }}
      onClick={()=>updateNotificationStatusFunc(v?.id)}
    >
      <div className="d-flex align-items-center" style={{ color: color }}>
        <img src="https://cdn-icons-png.flaticon.com/128/3687/3687416.png" />
        <div className="ms-3">
          <h6 className="mb-0" style={{ color: color }}>
            {v?.title}
          </h6>
          <p className="mb-0" style={{ color: color }}>
            {v?.message}
          </p>
        </div>
      </div>
      <div>
        {" "}
        <span style={{ color: color }}>{moment(v?.created_at).fromNow()}</span>
        {v?.is_read == 0 && (
          <div className="d-flex align-items-center bg-light rounded px-1 "  style={{ cursor: "pointer" }}>
            <span style={{ fontSize: "10px" }} className="text-dark">
              mark as read
            </span>
            <img
              src="https://cdn-icons-png.flaticon.com/128/13610/13610314.png"
              style={{ height: "10px", width: "10px" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationBox;
