import React, { useState } from "react";
import moment from "moment";

function LocationTicket({ i, v, value, userDetailsPopup, setUserDetailsPopup }) {
  return (
    <div
      className={
        "routeTicketCard " +
        (i % 2 == 0 ? " bgSuccess textDark" : " textWhite") +
        (i == 0 ? " " : " martopMinus20")
      }
    >
      <div className="row m-0 p-0 h-100">
        <div className="col-1 h-100 d-flex justify-content-center align-items-center ">
          <p>{i + 1}</p>
        </div>
        <div className="col-2 h-100 d-flex justify-content-center align-items-center">
          <p>{v?.booking_id}</p>
        </div>
        <div className="col-2 h-100 d-flex justify-content-center align-items-center">
          <div
            className="userNameDiv"
            onClick={() => setUserDetailsPopup(v)}
            style={{ width: "100px", marginTop: "-15px" }}
          >
            {/* add unique id  */}
            <p className="mb-0 bgWhite text-dark radius3 pt-1">
              ID:{v?.booking?.unique_id} 
            </p>
            <p className="mb-0 text-light mt-1">
              {v?.booking?.username}
            </p>
          </div>
        </div>
        <div className="col-3 h-100 d-flex justify-content-center align-items-center">
          <div className="d-flex align-items-center routeLocationDiv">
            <img
              src={
                i % 2 != 0
                  ? " /imagefolder/locationRedIcon.png"
                  : " /imagefolder/locationGreenIcon.png"
              }
            />
            <p>{v?.place_name}</p>
          </div>
        </div>
        <div className="col-2 h-100 d-flex justify-content-center align-items-center">
          <div className="d-flex align-items-center justify-content-center noPersonDiv">
            <img
              src="imagefolder/noPersonIcon.png"
              style={{
                height: "20px",
                width: "20px",
                marginRight: "8px",
              }}
            />
            <p className="mb-0 textDark">{v?.booking?.number_of_people || 1}</p>
          </div>
        </div>
        <div className="col-2 d-flex justify-content-end h-100  align-items-center">
          <p>
            {value?.time_choice == "pickupat"
              ? moment(v?.booking?.booking_time, "HH:mm").format("hh:mm A")
              : "--"}
          </p>
        </div>
      </div>
      {userDetailsPopup && (
        <div
          className="modal fade show d-flex align-items-center   justify-content-center "
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content tipPopUp" style={{ width: "320px" }}>
              <div className="d-flex justify-content-center tipPopUpHeading">
                <p className="mb-0">User Details</p>
              </div>

              <div
                className="modal-body tipPopUpBody"
                style={{ padding: "20px" }}
              >
                <div
                  style={{
                    wordWrap: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                  className="d-flex justify-content-center w-100 "
                >
                  <div className="w-100">
                    <div className=" d-flex align-items-center userPopUpUserDetails">
                      <div>
                        <img src="https://cdn-icons-png.flaticon.com/128/16872/16872811.png" />
                      </div>
                      <div className="ms-2 ">
                        <h5>User ID :- {userDetailsPopup?.user_details?.id}</h5>
                        <p>
                          {userDetailsPopup?.booking?.username}
                        </p>
                      </div>
                    </div>
                    <div className="userDetailsUl my-3">
                      <p>Email</p>
                      <h5>{userDetailsPopup?.user_details?.email}</h5>
                    </div>
                    <div className="userDetailsUl mb-3">
                      <p>Phone</p>
                      <div className="d-flex align-items-center">
                        <img src="https://cdn-icons-png.flaticon.com/128/14009/14009882.png" />

                        <h5 className="mb-0">
                          +{userDetailsPopup?.user_details?.country_code}{" "}
                          {userDetailsPopup?.user_details?.contact}
                        </h5>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between userPopupBtnGroup">
                      <button onClick={() => setUserDetailsPopup(null)}>
                        Close
                      </button>
                      <button
                        className="textWhite"
                        style={{ background: "#1C1C1E" }}
                        onClick={() => setUserDetailsPopup(null)}
                      >
                        Chat
                      </button>
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-center"></div>
              </div>
            </div>
          </div>
        </div>
      )}
      {userDetailsPopup && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}

export default LocationTicket;
