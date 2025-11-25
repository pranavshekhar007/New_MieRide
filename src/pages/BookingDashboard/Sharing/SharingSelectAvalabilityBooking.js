import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/Sidebar";
import TopNav from "../../../components/TopNav";
import TableNav from "../../../components/TableNav";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useGlobalState } from "../../../GlobalProvider";
import { useParams, useNavigate } from "react-router-dom";
import {
  getRouteByGroupIdServ,
  selectDriverManuallyServ,
} from "../../../services/bookingDashboard.services";
import { toast } from "react-toastify";
import { Tooltip } from "react-tooltip";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { Image_Base_Url } from "../../../utils/api_base_url_configration";
import NoRecordFound from "../../../components/NoRecordFound";
import CustomPagination from "../../../components/CustomPazination";

import moment from "moment";
import NewSidebar from "../../../components/NewSidebar";
import CustomTopNav from "../../../components/CustomTopNav";
import SecondaryTopNav from "../../../components/SecondaryTopNav";
import { scheduleSharingBookingForAssignServ } from "../../../services/scheduleAttempts";
function SharingSelectAvalabilityDriverBooking() {
  const [attemptCount, setAttemptCount] = useState(0);
  const [isSchedulePopupOpen, setIsSchedulePopupOpen] = useState(false);

  const [scheduleAttempts, setScheduleAttempts] = useState([]);
  const [isScheduleSaved, setIsScheduleSaved] = useState(false);

  const [isViewMode, setIsViewMode] = useState(false);
  const [isFinalScheduleDone, setIsFinalScheduleDone] = useState(false);

  const increaseAttempt = () => {
    if (!isScheduleEnabled) return;

    if (attemptCount >= 4) {
      toast.error("Maximum 4 attempts allowed.");
      return;
    }

    setAttemptCount(attemptCount + 1);
  };

  const decreaseAttempt = () => {
    if (!isScheduleEnabled || attemptCount === 0) return;
    setAttemptCount(attemptCount - 1);
  };

  const handleOpenSchedulePopup = () => {
    if (!isScheduleEnabled) {
      toast.error("Enable schedule first.");
      return;
    }

    if (attemptCount <= 0) {
      toast.error("Please select minimum 1 attempt.");
      return;
    }
    if (scheduleAttempts.length > 0) {
      setIsSchedulePopupOpen(true);
      return;
    }

    let temp = [];
    let now = moment();
    const limit = Math.min(attemptCount, 4);

    for (let i = 0; i < limit; i++) {
      temp.push({
        attempt: i + 1,
        date: now.format("DD MMM, YYYY"),
        time: now.format("hh:mm A"),
      });
      now = now.add(5, "minutes");
    }

    setScheduleAttempts(temp);
    setIsSchedulePopupOpen(true);
  };

  const [formData, setFormData] = useState({
    booking_route_id: "",
    driver_ids: [],
    tip_amount: "",
    increased_pickup_time: "",
  });

  const [payload, setPayload] = useState({
    page_no: 1,
    per_page: 10,
    search_key: "",
  });

  const onPageChange = (page) => {
    setPayload({
      ...payload,
      page_no: page,
    });
  };
  const onPerPageChange = (per_page) => {
    setPayload({
      ...payload,
      per_page: per_page,
      page_no: 1,
    });
  };

  const params = useParams();
  const navigate = useNavigate();
  const { setGlobalState, globalState } = useGlobalState();
  const [carSize, setCarSize] = useState(4);
  const navItems = [
    {
      name: "Route",
      path: "/sharing-select-route-driver/" + params?.id,
    },
    {
      name: "Availability",
      path: "/sharing-select-avilability-driver/" + params?.id,
    },
    {
      name: "Manually",
      path: "/sharing-select-manual-driver/" + params?.id,
    },
    {
      name: "All",
      path: "/sharing-select-driver/" + params?.id,
    },
  ];
  const [showSkeltonForDetails, setShowSkeltonForDetails] = useState(false);
  const [details, setDetails] = useState();
  const [allDriverIds, setAllDriverIds] = useState([]);
  const [showSkelton, setShowSkelton] = useState(false);


  const hydrateUI = (data) => {
    if (!data) return;
  
    // TIP amount restoring
    const tip = data?.routeDetails?.tip_amount ?? 0;
    if (tip > 0) {
      setIsExtraChargeEnabled(true);
      setCustomAmount(tip);
      setSelectedValue("XX");
    }
  
    // Schedule restoring
    const scheduled = data?.scheduledAssignments || [];
    if (scheduled.length > 0) {
      setIsScheduleEnabled(true);
      setIsFinalScheduleDone(true);
      setIsScheduleSaved(true);
      setIsViewMode(true);
  
      const formatted = scheduled.map((item, idx) => ({
        attempt: idx + 1,
        date: moment(item.run_at).format("DD MMM, YYYY"),
        time: moment(item.run_at).format("hh:mm A"),
      }));
  
      setAttemptCount(Math.min(scheduled.length, 4));
      setScheduleAttempts(formatted.slice(0, 4));
    }
  
    // Booking Route ID
    setFormData((prev) => ({
      ...prev,
      booking_route_id: data?.routeDetails?.id,
    }));
  };
  


  const getBookingDetailsFunc = async () => {
    setShowSkeltonForDetails(true);
    try {
      let response = await getRouteByGroupIdServ({ group_id: params.id });
      if (response?.data?.statusCode == "200") {
        const data = response.data.data;
        setDetails(data);
      
        setGlobalState((prev) => ({
          ...prev,
          sharingBookingDetails: data
        }));
      
        hydrateUI(data);
      }
      
    } catch (error) {}
    setShowSkeltonForDetails(false);
  };
 useEffect(() => {
     if (!globalState.sharingBookingDetails) {
         getBookingDetailsFunc();
     } else {
         setDetails(globalState.sharingBookingDetails);
         hydrateUI(globalState.sharingBookingDetails);
     }
   }, [globalState.sharingBookingDetails]);
  
  const [globalAreAllIdsSelected, setGlobalAreAllIdsSelected] = useState(false);

  const [pageData, setPageData] = useState({
    total_pages: "",
    current_page: "",
  });

  const addAllDriverIds = () => {
    // Fetch all driver IDs
    const allDriverIds =
      details?.driverAvailabilities?.map((v) => v?.driver_details?.id) || [];

    // Determine if all IDs are currently selected
    const areAllIdsSelected =
      formData?.driver_ids?.length === allDriverIds.length &&
      allDriverIds.every((id) => formData?.driver_ids?.includes(id));

    // Toggle the selection
    setGlobalAreAllIdsSelected(!areAllIdsSelected);
    setFormData({
      ...formData,
      driver_ids: areAllIdsSelected ? [] : allDriverIds, // Clear or set all IDs
    });
  };

  const addDriverId = (id) => {
    setFormData((prevFormData) => {
      const driver_ids = prevFormData?.driver_ids || [];

      let updatedDriverIds;
      // Check if the ID is already included
      if (driver_ids.includes(id)) {
        // Remove the ID
        updatedDriverIds = driver_ids.filter((driverId) => driverId !== id);
      } else {
        // Add the ID
        updatedDriverIds = [...driver_ids, id];
      }

      // Determine if all driver IDs are now selected
      const allDriverIds =
        details?.driverAvailabilities?.map((v) => v?.driver_details?.id) || [];
      const areAllIdsSelected =
        updatedDriverIds.length === allDriverIds.length &&
        allDriverIds.every((driverId) => updatedDriverIds.includes(driverId));

      // Update the global state for all IDs selected
      setGlobalAreAllIdsSelected(areAllIdsSelected);

      return {
        ...prevFormData,
        driver_ids: updatedDriverIds,
      };
    });
  };
  const handleSubmitDriverSelectFunc = async () => {
    const selectedFormData = new FormData();
    selectedFormData?.append("booking_route_id", formData?.booking_route_id);
    // ---------------------- EXTRA CHARGE CALCULATION ----------------------
    let finalTipAmount = 0;
    const totalTripAmount =
      parseFloat(details?.routeDetails?.total_trip_amount) || 0;

    if (isExtraChargeEnabled) {
      if (selectedValue.endsWith("%")) {
        // % calculation
        const percent = parseFloat(selectedValue.replace("%", ""));
        finalTipAmount = ((percent / 100) * totalTripAmount).toFixed(2);
      } else if (customAmount) {
        // manual amount
        finalTipAmount = parseFloat(customAmount).toFixed(2);
      }
    } else {
      // Extra charge disabled
      finalTipAmount = 0;
    }

    // ---------------------- PICKUP TIME CALCULATION ----------------------
    let finalPickupTime = "";
    if (isPickupTimeEnabled && pickupTime > 0) {
      finalPickupTime = pickupTime;
    }

    // Put BOTH values in formData BEFORE sending
    selectedFormData.append("tip_amount", finalTipAmount);
    selectedFormData.append("increased_pickup_time", finalPickupTime);
    formData?.driver_ids?.forEach((id) => {
      selectedFormData.append("driver_ids[]", id);
    });
    try {
      let response = await selectDriverManuallyServ(selectedFormData);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        navigate("/sharing-manual-booking");
      } else if (response?.data?.statusCode == "400") {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
  };
  const bgArrColorCode = [
    "#789dbc",
    "#17616e",
    "#b5c0d0",
    "#987d9a",
    "#789dbc",
    "#17616e",
    "#b5c0d0",
    "#987d9a",
  ];
  const [isTipInputEdit, setIsTipInputEdit] = useState(false);
  const [isTimeInputEdit, setIsTimeInputEdit] = useState(false);

  const [searchKey, setSearchKey] = useState("");
  const tableNav = [
    {
      name: "Route",
      path: "/sharing-select-route-driver/" + params?.id,
    },
    {
      name: "Availability",
      path: "/sharing-select-avilability-driver/" + params?.id,
    },
    {
      name: "Manually",
      path: "/sharing-select-manual-driver/" + params?.id,
    },
    {
      name: "All",
      path: "/sharing-select-driver/" + params?.id,
    },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("%");
  const [customAmount, setCustomAmount] = useState("");

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (value) => {
    setSelectedValue(value);
    setIsOpen(false);
  };

  const [isExtraChargeEnabled, setIsExtraChargeEnabled] = useState(false);
  const [isPickupTimeEnabled, setIsPickupTimeEnabled] = useState(false);
  const [pickupTime, setPickupTime] = useState("");
  const [isScheduleEnabled, setIsScheduleEnabled] = useState(false);

  // ---- New Route Popup States ----
  const [routePopupDetails, setRoutePopupDetails] = useState(null);
  const [routePopupLoader, setRoutePopupLoader] = useState(false);

  // Function to open Route Popup and fetch data dynamically
  const openRoutePopup = async () => {
    setRoutePopupLoader(true);
    try {
      const response = await getRouteByGroupIdServ({ group_id: params.id });
      if (response?.data?.statusCode === "200") {
        setRoutePopupDetails(response?.data?.data); // Store entire response
      } else {
        toast.error(response?.data?.message || "Failed to fetch route details");
      }
    } catch (error) {
      toast.error("Something went wrong while fetching route details");
    }
    setRoutePopupLoader(false);
  };
  const handleFinalScheduleSubmit = async () => {
    if (!isScheduleSaved) {
      toast.error("Please set schedule attempts first.");
      return;
    }

    const retryTimesForAPI = scheduleAttempts.map((a) =>
      moment(`${a.date} ${a.time}`, "DD MMM, YYYY hh:mm A").format(
        "YYYY-MM-DD HH:mm:ss"
      )
    );

    const selectedFormData = new FormData();
    selectedFormData.append("booking_route_id", formData.booking_route_id);
    selectedFormData.append("tip_amount", formData.tip_amount);
    selectedFormData.append(
      "increased_pickup_time",
      formData.increased_pickup_time
    );

    retryTimesForAPI.forEach((time, index) => {
      selectedFormData.append(`retry_times[${index}]`, time);
    });

    formData.driver_ids.forEach((id, index) => {
      selectedFormData.append(`driver_ids[${index}]`, id);
    });

    try {
      let response = await scheduleSharingBookingForAssignServ(
        selectedFormData
      );

      if (response?.data?.statusCode === "200") {
        toast.success("Attempts scheduled successfully!");
        setIsFinalScheduleDone(true);
        setIsScheduleSaved(true);
        setIsViewMode(true);
        navigate("/sharing-manual-booking");
      } else {
        toast.error(response?.data?.message || "Failed to schedule attempts");
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
  };
  return (
    <div className="mainBody">
      <NewSidebar selectedItem="Booking Dashboard" />
      <div className="contentLayout">
        <div className="bgWhite borderRadius30 p-4 minHeight100vh">
          <div className="sticky-top bgWhite">
            <div className="d-flex justify-content-between align-items-center assignDriverTopNav mx-2">
              <div
                className="assignDriverTabBackBtn d-flex justify-content-center align-items-center"
                onClick={() => navigate("/sharing-manual-booking")} // go back to manual booking
                style={{ cursor: "pointer" }}
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/128/2099/2099238.png"
                  alt="back"
                />
              </div>

              <div className="groupIdDiv">
                Group ID :- {details?.routeDetails?.group_id || "--"}
              </div>

              <div className="assignDriverPlaceDiv">
                <p>Source City</p>
                <h5>{details?.routeDetails?.pickup_city || "N/A"}</h5>
              </div>

              <div className="assignDriverPlaceDiv">
                <p>Destination City</p>
                <h5>{details?.routeDetails?.dropoff_city || "N/A"}</h5>
              </div>

              <div className="assignDriverPlaceDiv">
                <p>First Pickup Time</p>
                <h5>
                  {details?.routeDetails?.first_pickup_time
                    ? moment(
                        details?.routeDetails?.first_pickup_time,
                        "HH:mm"
                      ).format("hh:mm A")
                    : "--"}
                </h5>
              </div>

              <div className="assignDriverPlaceDiv">
                <p>Total Amount</p>
                <h5>
                  $
                  {details?.routeDetails?.total_trip_amount
                    ? parseFloat(
                        details?.routeDetails?.total_trip_amount
                      ).toFixed(2)
                    : "0.00"}
                </h5>
              </div>

              <button
                className="btn btn-outline-dark"
                onClick={openRoutePopup}
                disabled={routePopupLoader}
              >
                {routePopupLoader ? "Loading..." : "Route"}
              </button>

              {isFinalScheduleDone ? (
                // Scheduled already → show Submit
                <button
                  className="bgSuccess textDark"
                  style={{ width: "180px" }}
                  onClick={handleSubmitDriverSelectFunc}
                >
                  Submit
                </button>
              ) : isScheduleEnabled ? (
                // User manually enabling schedule now
                <button
                  className="bgSuccess textDark"
                  style={{ width: "180px" }}
                  onClick={handleFinalScheduleSubmit}
                >
                  Schedule
                </button>
              ) : (
                // Default — Submit
                <button
                  className="bgSuccess textDark"
                  style={{ width: "180px" }}
                  onClick={handleSubmitDriverSelectFunc}
                >
                  Submit
                </button>
              )}
            </div>
            <div className="row assignDriverActionDiv mt-5 mb-4 d-flex align-items-center">
              <div className="col-3">
                <select>
                  <option>Select Vechile</option>
                </select>
              </div>
              <div className="col-5">
                <div className="chargesContainer">
                  {/* Extra Charges */}
                  <div className="extraChargeDiv">
                    <label className="extraChargeLabel">
                      <input
                        type="checkbox"
                        className="extraChargeCheckbox"
                        checked={isExtraChargeEnabled}
                        onChange={(e) =>
                          setIsExtraChargeEnabled(e.target.checked)
                        }
                      />
                      <span>Extra Charges</span>
                    </label>

                    <div
                      className={`extraChargeDropdownWrapper ${
                        !isExtraChargeEnabled ? "disabled-section" : ""
                      }`}
                    >
                      <div
                        className="extraChargeDropdown"
                        onClick={() => isExtraChargeEnabled && toggleDropdown()}
                        style={{
                          cursor: isExtraChargeEnabled
                            ? "pointer"
                            : "not-allowed",
                          opacity: isExtraChargeEnabled ? 1 : 0.6,
                        }}
                      >
                        <span>{selectedValue}</span>
                        <i className={`arrow ${isOpen ? "up" : "down"}`}></i>
                      </div>

                      {isOpen && isExtraChargeEnabled && (
                        <div className="dropdownList">
                          {["25%", "50%", "75%", "100%"].map((value) => (
                            <div
                              key={value}
                              className="dropdownItem"
                              onClick={() => handleSelect(value)}
                            >
                              {value}
                            </div>
                          ))}
                          <input
                            type="number"
                            placeholder="Enter Amount"
                            className="dropdownInput"
                            value={customAmount}
                            onChange={(e) => setCustomAmount(e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Increase Pickup Time */}
                  <div className="pickupTimeDiv">
                    <label className="pickupTimeLabel">
                      <input
                        type="checkbox"
                        className="pickupTimeCheckbox"
                        checked={isPickupTimeEnabled}
                        onChange={(e) =>
                          setIsPickupTimeEnabled(e.target.checked)
                        }
                      />
                      <span>Increase Pickup Time</span>
                    </label>

                    <div
                      className="pickupTimeInputWrapper"
                      style={{
                        opacity: isPickupTimeEnabled ? 1 : 0.6,
                        pointerEvents: isPickupTimeEnabled ? "auto" : "none",
                      }}
                    >
                      <input
                        type="number"
                        className="pickupTimeInput"
                        placeholder="min."
                        min="1"
                        value={pickupTime || ""}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          // Allow only positive integers greater than 0
                          if (value > 0) {
                            setPickupTime(value);
                          } else if (e.target.value === "") {
                            // allow clearing the field
                            setPickupTime("");
                          }
                        }}
                        disabled={!isPickupTimeEnabled}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-4">
                <div className="assignDriverCounterDiv">
                  <label className="scheduleLabel">
                    <input
                      type="checkbox"
                      className="scheduleCheckbox"
                      checked={isScheduleEnabled}
                      disabled={isFinalScheduleDone}
                      onChange={(e) => setIsScheduleEnabled(e.target.checked)}
                    />
                    <span>Schedule</span>
                  </label>

                  <div className="counter">
                    <button
                      className="counterBtn"
                      onClick={decreaseAttempt}
                      disabled={isFinalScheduleDone}
                    >
                      −
                    </button>

                    <span className="counterValue">
                      {attemptCount < 10 ? `0${attemptCount}` : attemptCount}
                    </span>

                    <button
                      className="counterBtn"
                      onClick={increaseAttempt}
                      disabled={isFinalScheduleDone || attemptCount >= 4}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="selectTimeBtn"
                    disabled={!isScheduleEnabled}
                    onClick={() => {
                      if (isFinalScheduleDone) {
                        // After API success → View Schedule read-only
                        setIsViewMode(true);
                        setIsSchedulePopupOpen(true);
                      } else {
                        // Before API → Editable popup
                        setIsViewMode(false);
                        handleOpenSchedulePopup();
                      }
                    }}
                  >
                    {isFinalScheduleDone ? "View Schedule" : "Select Time"}
                  </button>
                </div>
              </div>
            </div>
            <SecondaryTopNav
              navItems={tableNav}
              selectedNav="Availability"
              navBg="#E5E5E5"
              navColor="#1C1C1C"
              selectedNavBg="#353535"
              selectedNavColor="#fff"
            />
            <div className="tableOuterContainer bgDark mt-4">
              <div>
                <table className="table mb-0">
                  <thead>
                    <tr className="bgSuccess">
                      <th
                        scope="col"
                        style={{ borderRadius: "25px 0px 0px 25px" }}
                      >
                        <div className="d-flex justify-content-center">
                          <span className="mx-1">Sr. No</span>
                        </div>
                      </th>

                      <th scope="col">Driver Details</th>

                      <th
                        scope="col"
                        style={{ borderRadius: "0px 25px 25px 0px" }}
                      >
                        <div className="d-flex align-items-center justify-content-center">
                          <div className="me-2">Select All</div>
                          <button
                            className="btn btn-warning shadow"
                            onClick={addAllDriverIds}
                            style={{
                              padding: "2.5px 4px",
                              background: "#fff",
                              border: "none",
                              width: "25px",
                              height: "25px",
                              color: "#139F02",
                              fontWeight: "600",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {globalAreAllIdsSelected ? "✔" : ""}
                          </button>
                        </div>
                      </th>
                    </tr>
                  </thead>

                  <div className="pt-3 pb-2"></div>

                  {showSkeltonForDetails
                    ? [1, 2, 3, 4, 5, 6, 7, 8, 9].map((v, i) => (
                        <React.Fragment key={i}>
                          <tr>
                            <td style={{ textAlign: "center" }}>
                              <Skeleton height={20} width={100} />
                            </td>
                            <td style={{ textAlign: "center" }}>
                              <Skeleton height={20} width={300} />
                            </td>
                            <td style={{ textAlign: "center" }}>
                              <Skeleton height={20} width={200} />
                            </td>
                          </tr>
                          <div className="pb-3"></div>
                        </React.Fragment>
                      ))
                    : details?.driverAvailabilities?.map((v, i) => {
                        const d = v.driver_details;

                        return (
                          <React.Fragment key={d?.id || i}>
                            <tr className="bgWhite">
                              {/* Sr No */}
                              <td
                                scope="row"
                                style={{
                                  borderTopLeftRadius: "24px",
                                  borderBottomLeftRadius: "24px",
                                  textAlign: "center",
                                }}
                              >
                                {i + 1}
                              </td>

                              {/* Driver Details */}
                              <td>
                                <div className="d-flex justify-content-center align-items-center">
                                  <div className="driver-card d-flex align-items-center">
                                    <img
                                      src={
                                        d?.image
                                          ? Image_Base_Url + d?.image
                                          : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                      }
                                      alt="driver"
                                      className="driver-img me-3"
                                    />

                                    <div className="driver-info">
                                      <span className="driver-id">
                                        Driver ID :- {d?.unique_id || d?.id}
                                      </span>
                                      <h5 className="driver-name mb-0">
                                        {d?.first_name} {d?.last_name}
                                      </h5>
                                    </div>

                                    <div className="vehicle-box ms-auto d-flex align-items-center justify-content-center">
                                      <img
                                        src="https://cdn-icons-png.flaticon.com/128/7571/7571054.png"
                                        alt="car"
                                        className="car-icon me-1"
                                      />
                                      <span>{d?.vehicle_no || "N/A"}</span>
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* Select Button */}
                              <td
                                style={{
                                  borderTopRightRadius: "24px",
                                  borderBottomRightRadius: "24px",
                                  overflow: "hidden",
                                }}
                              >
                                <div
                                  className="d-flex justify-content-center align-items-center"
                                  style={{
                                    borderRadius: "12px",
                                    width: "100%",
                                    height: "100%",
                                  }}
                                >
                                  <button
                                    className="btn btn-warning"
                                    onClick={() => addDriverId(d?.id)}
                                    style={{
                                      padding: "5px 8px",
                                      background: "#fff",
                                      width: "30px",
                                      height: "30px",
                                      color: "#139F02",
                                      fontWeight: "600",
                                      border: "2px solid black",
                                    }}
                                  >
                                    {formData?.driver_ids?.includes(d?.id)
                                      ? "✔"
                                      : ""}
                                  </button>
                                </div>
                              </td>
                            </tr>

                            <div className="pb-3"></div>
                          </React.Fragment>
                        );
                      })}
                </table>

                {details?.driverAvailabilities?.length === 0 &&
                  !showSkeltonForDetails && (
                    <NoRecordFound theme="light" marginTop="0px" />
                  )}
              </div>
            </div>
            <CustomPagination
              current_page={pageData?.current_page}
              onPerPageChange={onPerPageChange}
              last_page={pageData?.total_pages}
              per_page={payload?.per_page}
              onPageChange={onPageChange}
            />
          </div>
        </div>
      </div>

      {routePopupDetails && (
        <div
          className="modal fade show d-flex align-items-center justify-content-center"
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content managepopupgroup">
              <div className="modal-body p-0">
                <div className="row m-0 p-0 justify-content-center">
                  {/* ---------- Single Column (Full Width like Manual Left Side) ---------- */}
                  <div className="col-10 m-0 p-0">
                    <div className="managepopupgroupleft">
                      {routePopupDetails?.routeDetails?.pickup_points?.length >
                      0 ? (
                        routePopupDetails?.routeDetails?.pickup_points?.map(
                          (v, i) => (
                            <div
                              key={i}
                              className="d-flex justify-content-between align-items-center py-2 managePopUpTable"
                              style={{
                                background: "#F7F7F7",
                                borderRadius: "10px",
                                marginBottom: "10px",
                                padding: "10px 15px",
                                minHeight: "60px",
                              }}
                            >
                              {/* ---------- Booking ID ---------- */}
                              <div className="px-2">
                                <button
                                  style={{
                                    background: "#000",
                                    color: "#D0FF13",
                                    border: "none",
                                    width: "120px",
                                    height: "30px",
                                    borderRadius: "5px",
                                    fontFamily: "Poppins",
                                    fontSize: "12px",
                                    fontWeight: "500",
                                  }}
                                >
                                  Booking ID : {v?.booking_id || `#${i + 1}`}
                                </button>
                              </div>

                              {/* ---------- Pickup Point (Full Address) ---------- */}
                              <div
                                className="d-flex align-items-start px-2 flex-grow-1"
                                style={{
                                  flexDirection: "column",
                                  maxWidth: "35%",
                                }}
                              >
                                <div className="d-flex align-items-center mb-1">
                                  <img
                                    src="/imagefolder/locationGreenIcon.png"
                                    alt="pickup"
                                    style={{ width: "14px", height: "14px" }}
                                  />
                                  <p
                                    className="ms-2 mb-0"
                                    style={{
                                      color: "#1C1C1C",
                                      fontSize: "12px",
                                      fontFamily: "Nexa",
                                      fontWeight: "400",
                                      wordBreak: "break-word",
                                      whiteSpace: "normal",
                                    }}
                                  >
                                    {v?.place_name || "N/A"}
                                  </p>
                                </div>
                              </div>

                              {/* ---------- Dropoff Point (Full Address) ---------- */}
                              <div
                                className="d-flex align-items-start px-2 flex-grow-1"
                                style={{
                                  flexDirection: "column",
                                  maxWidth: "35%",
                                }}
                              >
                                <div className="d-flex align-items-center mb-1">
                                  <img
                                    src="/imagefolder/locationRedIcon.png"
                                    alt="drop"
                                    style={{ width: "14px", height: "14px" }}
                                  />
                                  <p
                                    className="ms-2 mb-0"
                                    style={{
                                      color: "#1C1C1C",
                                      fontSize: "12px",
                                      fontFamily: "Nexa",
                                      fontWeight: "400",
                                      wordBreak: "break-word",
                                      whiteSpace: "normal",
                                    }}
                                  >
                                    {routePopupDetails?.routeDetails
                                      ?.dropoff_points?.[i]?.place_name ||
                                      "N/A"}
                                  </p>
                                </div>
                              </div>

                              {/* ---------- Booking Time ---------- */}
                              <div className="text-end px-2">
                                <span
                                  style={{
                                    fontSize: "12px",
                                    color: "#6b6b6b",
                                    fontFamily: "Nexa",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {moment(v?.booking_time, "HH:mm").format(
                                    "hh:mm A"
                                  )}
                                </span>
                              </div>
                            </div>
                          )
                        )
                      ) : (
                        <p className="text-center text-muted py-3 mb-0">
                          No pickup points found
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* ---------- Close Button ---------- */}
                <div className="d-flex justify-content-center mt-5">
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/660/660252.png"
                    style={{ height: "50px", cursor: "pointer" }}
                    alt="close"
                    onClick={() => setRoutePopupDetails(null)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {routePopupDetails && <div className="modal-backdrop fade show"></div>}
      {isSchedulePopupOpen && (
        <>
          <div
            className="modal fade show d-flex align-items-center justify-content-center confirmPickupModal"
            tabIndex="-1"
          >
            <div className="modal-dialog">
              <div className="modal-content schedulePopupContent">
                {/* ------ HEADER ------ */}
                <div className="schedulePopupHeader">
                  <h5>
                    {isViewMode ? "Schedule Attempts" : "Schedule Attempts"}
                  </h5>
                </div>

                {/* ------ BODY ------ */}
                <div className="schedulePopupBody">
                  <div className="scheduleTableWrapper">
                    <table className="schedulePopupTable">
                      <thead>
                        <tr>
                          <th style={{ borderTopLeftRadius: "15px" }}>
                            Retry Attempt
                          </th>
                          <th>Date</th>
                          <th style={{ borderTopRightRadius: "15px" }}>Time</th>
                        </tr>
                      </thead>

                      <tbody>
                        {scheduleAttempts.map((row, index) => (
                          <tr key={index}>
                            <td>Attempt {row.attempt}</td>

                            {/* --- REAL DATE PICKER --- */}
                            <td>
                              <input
                                type="date"
                                className="scheduleInput"
                                readOnly={isViewMode}
                                value={moment(row.date, "DD MMM, YYYY").format(
                                  "YYYY-MM-DD"
                                )}
                                onChange={(e) => {
                                  if (isViewMode) return;
                                  const updated = [...scheduleAttempts];
                                  updated[index].date = moment(
                                    e.target.value
                                  ).format("DD MMM, YYYY");
                                  setScheduleAttempts(updated);
                                }}
                              />
                            </td>

                            {/* --- REAL TIME PICKER --- */}
                            <td>
                              <input
                                type="time"
                                className="scheduleInput"
                                readOnly={isViewMode}
                                value={moment(row.time, "hh:mm A").format(
                                  "HH:mm"
                                )}
                                onChange={(e) => {
                                  if (isViewMode) return;
                                  const updated = [...scheduleAttempts];
                                  updated[index].time = moment(
                                    e.target.value,
                                    "HH:mm"
                                  ).format("hh:mm A");
                                  setScheduleAttempts(updated);
                                }}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* ------ ACTION BUTTONS ------ */}
                  <div className="schedulePopupActions">
                    <button
                      className="cancelBtn"
                      onClick={() => setIsSchedulePopupOpen(false)}
                    >
                      {isViewMode ? "Cancel" : "Cancel"}
                    </button>

                    <button
                      className="confirmBtn"
                      onClick={() => {
                        setIsScheduleSaved(true);
                        setIsSchedulePopupOpen(false);
                      }}
                    >
                      Schedule
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
}

export default SharingSelectAvalabilityDriverBooking;
