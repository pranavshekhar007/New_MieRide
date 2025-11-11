import React from "react";

function NotificationItem({boxBg, color}) {
  return (
    <div
      className="d-flex justify-content-between notificationBox align-items-center"
      style={{ background: "#CA0360" }}
    >
      <div className="d-flex align-items-center">
        <img src="https://cdn-icons-png.flaticon.com/128/3687/3687416.png" />
        <div className="ms-3">
          <h6 className="mb-0">Harjeet Singh</h6>
          <p className="mb-0">asked a question.</p>
        </div>
      </div>
      <div>
        <span>2 mins ago</span>
      
      </div>
    </div>
  );
}

export default NotificationItem;
