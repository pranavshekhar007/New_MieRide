import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDriverByIdServ } from "../services/driver.services";
import { toast } from "react-toastify";
import Ably from 'ably';
function DriverSideNav({ selectedNav }) {
  const params = useParams();
  const navigate = useNavigate();
  const [statusDetails, setStatusDetails] = useState(null);
  const navItems = [
    {
      name: "Personal Details",
      path: "/driver-personal-details-verification",
      status: statusDetails?.profileStatus?.status,
    },
    {
      name: "Car Details",
      path: "/driver-car-details-verification",
      status: statusDetails?.vehicleStatus?.status,
    },
    {
      name: "Profile Photo",
      path: "/driver-profile-details-verification",
      status: statusDetails?.imageStatus?.status,
    },
    {
      name: "Driving License",
      path: "/driver-license-details-verification",
      status: statusDetails?.licenceStatus?.status,
    },
    {
      name: "Ownership",
      path: "/driver-ownership-details-verification",
      status: statusDetails?.ownershipStatus?.status,
    },
    {
      name: "Insurance",
      path: "/driver-insurance-details-verification",
      status: statusDetails?.insuranceStatus?.status,
    },
    // {
    //   name: "Review & Approve",
    //   path: "/driver-review-details-verification",
    //   status:statusDetails?.approvalStatus
    // },
  ];

  const getUserDetailsFunc = async () => {
    try {
      let response = await getDriverByIdServ(params.id);
      if (response?.data?.statusCode == "200") {
        setStatusDetails(response.data?.data);
        console.log(response.data?.data?.profileStatus?.status)
      }
    } catch (error) {}
  };
 
 useEffect(() => {
     // Initialize Ably client with the API key
     const ably = new Ably.Realtime('cgbtZA.AQetNw:hE5TCgJHH9F4gWbFqv6pD5ScBM-A_RnW0RQG7xwQg-Y');
     const channel = ably.channels.get('driver-updates');
   
     // Fetch user list initially
     getUserDetailsFunc();
   
     // Subscribe to the 'user-updates' channel for real-time updates
     channel.subscribe('profile-updated', (message) => {
       console.log("Received real-time update:", message.data);
       // Re-fetch user list when an update is received
       getUserDetailsFunc();
     });
   
     // Cleanup on component unmount
     return () => {
       channel.unsubscribe();
       ably.close();
     };
   }, []);
  return (
    <div className="driverHorizontalNav">
      {navItems?.map((v, i) => {
        return (
          <div className="driverPopUpBtn" style={{ background: selectedNav == v?.name ? "#FFF0E3" : "#fff" }}>
            <button
              className="d-flex justify-content-around"
              onClick={() => navigate(v?.path + "/" + params?.id)}
              style={{ background: v?.status== "-1"? "orangered"  : selectedNav == v?.name ?   "#000"   :"#139F01" }}
            >
              {v?.name}
              {v?.name != "Review & Approve"
                ? v?.status == "1" && (
                    <div
                      className="bg-light d-flex justify-content-center align-items-center"
                      style={{ height: "20px", width: "20px", borderRadius: "50%" }}
                    >
                      <i className="fa fa-check text-success"></i>
                    </div>
                  )
                : v?.status == "Approve" && (
                    <div
                      className="bg-light d-flex justify-content-center align-items-center"
                      style={{ height: "20px", width: "20px", borderRadius: "50%" }}
                    >
                      <i className="fa fa-check text-success"></i>
                    </div>
                  )}
                  {v?.status =="-1" && <img src="https://cdn-icons-png.flaticon.com/128/63/63436.png" style={{height:"20px", filter:" brightness(0) invert(1)"}}/>}
            </button>
          </div>
        );
      })}

      {statusDetails?.profileStatus?.status == "1" &&
      statusDetails?.vehicleStatus?.status == "1" &&
      statusDetails?.imageStatus?.status == "1" &&
      statusDetails?.licenceStatus?.status == "1" &&
      statusDetails?.ownershipStatus?.status == "1" &&
      statusDetails?.insuranceStatus?.status == "1" ? (
        <div className="driverPopUpBtn" style={{ background: selectedNav == "Review & Approve" ? "#FFF0E3" : "#fff" }}>
          <button
            className="d-flex justify-content-around"
            onClick={() => navigate("/driver-review-details-verification" + "/" + params?.id)}
            style={{ background: selectedNav == "Review & Approve" ? "#000" : "#139F01" }}
          >
            Review & Approve
          </button>
        </div>
      ) : (
        <div
          className="driverPopUpBtn"
          style={{ background: selectedNav == "Review & Approve" ? "#FFF0E3" : "#fff", opacity: "0.7" }}
        >
          <button
            className="d-flex justify-content-around"
            onClick={() => toast.error("Other status is not active")}
            style={{ background: selectedNav == "Review & Approve" ? "#000" : "#139F01" }}
          >
            Review & Approve
          </button>
        </div>
      )}
    </div>
  );
}

export default DriverSideNav;
