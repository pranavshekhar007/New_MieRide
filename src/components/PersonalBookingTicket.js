import React from "react";
import { Image_Base_Url } from "../utils/api_base_url_configration";

function PersonalBookingTicket({ i, driver }) {
  return (
    <div
      className={
        "routeTicketCard " +
        (i % 2 === 0 ? " bgSuccess textDark" : " textWhite") +
        (i === 0 ? "" : " martopMinus20")
      }
    >
      <div className="row m-0 p-0 h-100">
        {/* Index */}
        <div className="col-1 h-100 d-flex justify-content-center align-items-center">
          <p>{i + 1}.</p>
        </div>

        {/* Driver Image */}
        <div className="col-1 h-100 d-flex justify-content-center align-items-center">
          <img
            src={
              driver?.image
                ? Image_Base_Url + driver?.image
                : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="driver"
            style={{
              height: "45px",
              width: "45px",
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: "10px",
            }}
          />
        </div>

        {/* Driver ID + Name */}
        <div
          className="col-3 h-100 d-flex flex-column justify-content-center align-items-start"
          style={{
            paddingBottom: "15px",
          }}
        >
          <p
            style={{
              margin: "0",
              fontSize: "13px",
              fontWeight: "700",
              textAlign: "left",
            }}
          >
            Driver ID :- {driver?.id}
          </p>

          <p
            style={{
              margin: "2px 0 0 0",
              fontSize: "18px",
              fontWeight: "700",
              textAlign: "left",
            }}
          >
            {driver?.first_name}
          </p>
        </div>

        {/* Car + Vehicle No */}
        <div
          className="col-3 h-100 d-flex justify-content-center align-items-center"
          style={{
            paddingBottom: "15px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "104px",
              height: "25px",
              alignItems: "center",
              background: i % 2 === 0 ? "#333" : "#fff",
              color: i % 2 === 0 ? "#fff" : "#000",
              borderRadius: "5px",
              fontWeight: "600",
              fontSize: "12px",
            }}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/128/7571/7571054.png"
              style={{
                height: "16px",
                marginRight: "7px",
                filter: i % 2 === 0 ? "invert(1)" : "invert(0)",
              }}
            />
            {driver?.vehicle_no}
          </div>
        </div>

        {/* Seat Count */}
        <div
          className="col-2 h-100 d-flex justify-content-center align-items-center"
          style={{
            paddingBottom: "15px",
          }}
        >
          <div
            style={{
              fontWeight: "700",
              fontSize: "15px",
            }}
          >
            {driver?.vehicle_size}
          </div>
        </div>

        {/* Status Badge */}
        <div
          className="col-2 h-100 d-flex justify-content-end align-items-center"
          style={{
            paddingBottom: "15px",
          }}
        >
          <div
            style={{
              background:
                driver?.status === "assigned"
                  ? "#28A745"
                  : driver?.status === "failed"
                  ? "#D9534F"
                  : driver?.status === "rejected"
                  ? "#F0AD4E"
                  : "#28A745",
              padding: "10px 20px 8px 20px",
              fontSize: "12px",
              borderRadius: "5px",
              fontWeight: "700",
              color: "#fff",
              marginRight: "10px",
            }}
          >
            {driver?.status === "assigned"
              ? "Sent"
              : driver?.status
              ? driver?.status.charAt(0).toUpperCase() + driver?.status.slice(1)
              : "Sent"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonalBookingTicket;
