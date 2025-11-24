import React from "react";
import moment from "moment";

function LocationTicket({ i, v, value, type, userDetailsPopup, setUserDetailsPopup }) {
  // -------------- ICON BASED ON TYPE ----------------
  const locationIcon =
    type === "pickup"
      ? "/imagefolder/locationGreenIcon.png"
      : "/imagefolder/locationRedIcon.png";

  // -------------- TIME LOGIC ------------------------
  let showTime = "--";

  if (value?.time_choice === "pickupat" && type === "pickup") {
    showTime = moment(v?.booking?.booking_time, "HH:mm").format("hh:mm A");
  }

  if (value?.time_choice === "dropoffby" && type === "dropoff") {
    showTime = moment(v?.booking?.booking_time, "HH:mm").format("hh:mm A");
  }

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
          <p>{i + 1}</p>
        </div>

        {/* Booking ID */}
        <div className="col-2 h-100 d-flex justify-content-center align-items-center">
          <p>{v?.booking_id}</p>
        </div>

        {/* User block */}
        <div className="col-2 h-100 d-flex justify-content-center align-items-center">
          <div
            className="userNameDiv"
            // onClick={() => setUserDetailsPopup(v)}
            style={{ width: "100px", marginTop: "-15px" }}
          >
            <p className="mb-0 bgWhite text-dark radius3 pt-1">
              {v?.booking?.unique_id}
            </p>
            <p className="mb-0 text-light mt-1">{v?.booking?.username}</p>
          </div>
        </div>

        {/* Location */}
        <div className="col-3 h-100 d-flex justify-content-start align-items-center">
          <div className="d-flex align-items-center routeLocationDiv">
            <img src={locationIcon} />
            <p>{v?.place_name}</p>
          </div>
        </div>

        {/* People count */}
        <div className="col-2 h-100 d-flex justify-content-center align-items-center">
          <div className="d-flex align-items-center justify-content-center noPersonDiv">
            <img
              src="imagefolder/noPersonIcon.png"
              style={{ height: "20px", width: "20px", marginRight: "8px" }}
            />
            <p className="mb-0 textDark">{v?.booking?.number_of_people || 1}</p>
          </div>
        </div>

        {/* TIME */}
        <div className="col-2 d-flex justify-content-end align-items-center">
          <p>{showTime}</p>
        </div>

      </div>

      {/* Popup remains unchanged */}
      {/* {userDetailsPopup && (
        <div
          className="modal fade show d-flex align-items-center justify-content-center"
          tabIndex="-1"
        >
        </div>
      )}
      {userDetailsPopup && <div className="modal-backdrop fade show"></div>} */}
    </div>
  );
}

export default LocationTicket;
