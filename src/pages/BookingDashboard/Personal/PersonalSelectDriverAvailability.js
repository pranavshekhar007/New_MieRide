import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/Sidebar";
import TopNav from "../../../components/TopNav";
import TableNav from "../../../components/TableNav";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useGlobalState } from "../../../GlobalProvider";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import {
  getAvailableDriverByBookingServ,
  selectDriverManuallyForPersonalServ,
  schedulePersonalBookingServ,
} from "../../../services/personalBookingServices";
import { toast } from "react-toastify";
import { Tooltip } from "react-tooltip";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import NoRecordFound from "../../../components/NoRecordFound";
import { Image_Base_Url } from "../../../utils/api_base_url_configration";
import NewSidebar from "../../../components/NewSidebar";
import CustomTopNav from "../../../components/CustomTopNav";
import SecondaryTopNav from "../../../components/SecondaryTopNav";
import CustomPagination from "../../../components/CustomPazination";
function PersonalSelectDriverAvailability() {
  // SCHEDULE STATES
  const [attemptCount, setAttemptCount] = useState(0);
  const [isSchedulePopupOpen, setIsSchedulePopupOpen] = useState(false);
  const [scheduleAttempts, setScheduleAttempts] = useState([]);
  const [isScheduleSaved, setIsScheduleSaved] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [isFinalScheduleDone, setIsFinalScheduleDone] = useState(false);

  const params = useParams();
  const [formData, setFormData] = useState({
    booking_id: params?.id,
    driver_ids: [],
  });
  const navigate = useNavigate();
  const { setGlobalState, globalState } = useGlobalState();
  const [carSize, setCarSize] = useState(4);

  const navItems = [
    {
      name: "Route",
      path: "/personal-select-driver-route/" + params?.id,
    },
    {
      name: "Availability",
      path: "/personal-select-driver-availability/" + params?.id,
    },
    {
      name: "Manual",
      path: "/personal-select-driver-manual/" + params?.id,
    },
    {
      name: "All",
      path: "/personal-select-all-driver/" + params?.id,
    },
  ];
  const [showSkeltonForDetails, setShowSkeltonForDetails] = useState(false);
  const [details, setDetails] = useState();
  const [counter, setCounter] = useState(0);
  const [allDriverIds, setAllDriverIds] = useState([]);


  const hydrateUI = (data) => {
    if (!data) return;
  
    const booking = data?.bookingDetails;
  
    // TIP restore
    const tip = booking?.tip_amount ?? 0;
    if (tip > 0) {
      setIsExtraChargeEnabled(true);
      setCustomAmount(tip);
      setSelectedValue("XX");
    }
  
    // Pickup time restore
    if (booking?.increased_pickup_time > 0) {
      setIsPickupTimeEnabled(true);
      setPickupTime(booking.increased_pickup_time);
    }
  
    // Schedule restore
    const scheduled = booking?.personal_schedule_retries || [];
    if (scheduled.length > 0) {
      setIsScheduleEnabled(true);
      setIsFinalScheduleDone(true);
      setIsScheduleSaved(true);
      setIsViewMode(true);
  
      setAttemptCount(Math.min(scheduled.length, 4));
  
      const formatted = scheduled.map((item, idx) => ({
        attempt: idx + 1,
        date: moment(item.run_at).format("DD MMM, YYYY"),
        time: moment(item.run_at).format("hh:mm A"),
      }));
      setScheduleAttempts(formatted.slice(0, 4));
    }
  };
  

  const getAvailableDriverByBooking = async () => {
    setShowSkeltonForDetails(true);
    try {
      let response = await getAvailableDriverByBookingServ({
        booking_id: params.id,
      });
      if (response?.data?.statusCode === "200") {
        const data = response.data.data;
        setDetails(data);
      
        // Save globally so other tabs don't reload
        setGlobalState(prev => ({
          ...prev,
          personalBookingDetails: data
        }));
      
        hydrateUI(data);
      }
      
    } catch (error) {}
    setShowSkeltonForDetails(false);
  };
  useEffect(() => {
    if (!globalState.personalBookingDetails) {
      getAvailableDriverByBooking();
    } else {
      setDetails(globalState.personalBookingDetails);
      hydrateUI(globalState.personalBookingDetails);
    }
  }, [globalState.personalBookingDetails]);
  
  
  const [globalAreAllIdsSelected, setGlobalAreAllIdsSelected] = useState(false);

  const addAllDriverIds = () => {
    // Fetch all driver IDs
    const allDriverIds = details?.availabliltyDrivers?.map((v) => v?.id) || [];

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
        details?.availabliltyDrivers?.map((v) => v?.driver_details?.id) || [];
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
    selectedFormData.append("booking_id", params?.id);

    // ---------------------- EXTRA CHARGE CALCULATION ----------------------
    let finalTipAmount = 0;
    const totalTripAmount =
      parseFloat(details?.bookingDetails?.total_trip_cost) || 0;

    if (isExtraChargeEnabled) {
      if (selectedValue.endsWith("%")) {
        const percent = parseFloat(selectedValue.replace("%", ""));
        finalTipAmount = ((percent / 100) * totalTripAmount).toFixed(2);
      } else if (customAmount) {
        finalTipAmount = parseFloat(customAmount).toFixed(2);
      }
    } else {
      finalTipAmount = 0;
    }

    // Add tip to formData
    selectedFormData.append("tip_amount", finalTipAmount);

    // ---------------------- PICKUP TIME CALCULATION ----------------------
    let finalPickupTime = "";
    if (isPickupTimeEnabled && pickupTime > 0) {
      finalPickupTime = pickupTime;
    }

    selectedFormData.append("increased_pickup_time", finalPickupTime);

    // ---------------------- DRIVER IDs ----------------------
    formData?.driver_ids?.forEach((id) => {
      selectedFormData.append("driver_ids[]", id);
    });

    try {
      let response = await selectDriverManuallyForPersonalServ(
        selectedFormData
      );
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        navigate("/personal-manual-booking");
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
  };

  const [isTipInputEdit, setIsTipInputEdit] = useState(false);
  const [isTimeInputEdit, setIsTimeInputEdit] = useState(false);
  const handleCounterFunc = (operation) => {
    try {
      if (operation == "add") {
        if (counter < 5) {
          setCounter(counter + 1);
        } else {
          alert("Maximum value is 5");
        }
      } else {
        if (counter > 0) {
          setCounter(counter - 1);
        } else {
          alert("Minimum value is 0");
        }
      }
    } catch (error) {}
  };
  const [schedulePopup, setSchedulePopup] = useState({
    show: false,
    retry_times: [],
    booking_id: "",
  });
  const handleConfirm = async () => {
    const retry_times = (schedulePopup.retry_times || []).map((v) => {
      return `${v?.date || ""} ${v?.time || ""}:00`;
    });

    const payload = {
      booking_id: params?.id,
      retry_times: retry_times,
    };

    console.log("Final Payload ===>", payload);
    try {
      let response = await schedulePersonalBookingServ(payload);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        setSchedulePopup({
          show: false,
          retry_times: [],
          booking_id: "",
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
  const addRetryTime = () => {
    const updatedRetries = [
      ...schedulePopup.retry_times,
      { date: "", time: "" },
    ];
    setSchedulePopup({ ...schedulePopup, retry_times: updatedRetries });
  };
  const handleRetryChange = (index, field, value) => {
    const updatedRetries = [...schedulePopup.retry_times];
    if (!updatedRetries[index]) {
      updatedRetries[index] = { date: "", time: "" };
    }
    updatedRetries[index][field] = value;
    setSchedulePopup({ ...schedulePopup, retry_times: updatedRetries });
  };
  const [showViewRecord, setShowViewRecord] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("%");
  const [customAmount, setCustomAmount] = useState("");
  const [isExtraChargeEnabled, setIsExtraChargeEnabled] = useState(false);
  const [isPickupTimeEnabled, setIsPickupTimeEnabled] = useState(false);
  const [pickupTime, setPickupTime] = useState("");
  const [isScheduleEnabled, setIsScheduleEnabled] = useState(false);

  // ---- New Route Popup States ----
  const [routePopupDetails, setRoutePopupDetails] = useState(null);
  const [routePopupLoader, setRoutePopupLoader] = useState(false);
  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (value) => {
    setSelectedValue(value);
    setIsOpen(false);
  };

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

  const [pageData, setPageData] = useState({
    total_pages: "",
    current_page: "",
  });

  const handleOpenSchedulePopup = () => {
    if (!isScheduleEnabled) {
      toast.error("Enable schedule first.");
      return;
    }

    if (attemptCount <= 0) {
      toast.error("Please select minimum 1 attempt.");
      return;
    }

    // If popup already has data → just open
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

 const handleFinalScheduleSubmit = async () => {
    if (!isScheduleSaved) {
      toast.error("Please set schedule attempts first.");
      return;
    }
  
    // ----------------- CALCULATE TIP AMOUNT -----------------
    let finalTipAmount = 0;
    const totalTripAmount =
      parseFloat(details?.bookingDetails?.total_trip_cost) || 0;
  
    if (isExtraChargeEnabled) {
      if (selectedValue.endsWith("%")) {
        const percent = parseFloat(selectedValue.replace("%", ""));
        finalTipAmount = ((percent / 100) * totalTripAmount).toFixed(2);
      } else if (customAmount) {
        finalTipAmount = parseFloat(customAmount).toFixed(2);
      }
    } else {
      finalTipAmount = 0;
    }
  
    // ----------------- CALCULATE INCREASED PICKUP TIME -----------------
    let finalPickupTime = "";
    if (isPickupTimeEnabled && pickupTime > 0) {
      finalPickupTime = pickupTime;
    }
  
    // ----------------- FORMAT RETRY TIMES -----------------
    const retryTimesForAPI = scheduleAttempts.map((a) =>
      moment(`${a.date} ${a.time}`, "DD MMM, YYYY hh:mm A").format(
        "YYYY-MM-DD HH:mm:ss"
      )
    );
  
    // ----------------- BUILD FORM DATA -----------------
    const selectedFormData = new FormData();
  
    selectedFormData.append("booking_id", params.id);
    selectedFormData.append("tip_amount", finalTipAmount);             // FIXED
    selectedFormData.append("increased_pickup_time", finalPickupTime); // FIXED
  
    retryTimesForAPI.forEach((time, index) => {
      selectedFormData.append(`retry_times[${index}]`, time);
    });
  
    formData.driver_ids.forEach((id, index) => {
      selectedFormData.append(`driver_ids[${index}]`, id);
    });
  
    // ----------------- API CALL -----------------
    try {
      let response = await schedulePersonalBookingServ(selectedFormData);
  
      if (response?.data?.statusCode === "200") {
        toast.success("Attempts scheduled successfully!");
        setIsFinalScheduleDone(true);
        setIsScheduleSaved(true);
        setIsViewMode(true);
        navigate("/personal-manual-booking");
      } else {
        toast.error(response?.data?.message || "Failed to schedule attempts");
      }
    } catch (error) {
      console.log(error);
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
                onClick={() => navigate("/personal-manual-booking")} // go back to manual booking
                style={{ cursor: "pointer" }}
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/128/2099/2099238.png"
                  alt="back"
                />
              </div>

              <div className="groupIdDiv">
                Booking ID :- {details?.bookingDetails?.id || "--"}
              </div>

              <div className="assignDriverPlaceDiv">
                <p>Source City</p>
                <h5>{details?.bookingDetails?.source || "N/A"}</h5>
              </div>

              <div className="assignDriverPlaceDiv">
                <p>Destination City</p>
                <h5>{details?.bookingDetails?.destination || "N/A"}</h5>
              </div>

              <div className="assignDriverPlaceDiv">
                <p>First Pickup Time</p>
                <h5>
                  {details?.bookingDetails?.pickup_time
                    ? moment(
                        details?.bookingDetails?.pickup_time,
                        "HH:mm"
                      ).format("hh:mm A")
                    : "--"}
                </h5>
              </div>

              <div className="assignDriverPlaceDiv">
                <p>Total Amount</p>
                <h5>
                  $
                  {details?.bookingDetails?.booking_amount
                    ? parseFloat(
                        details?.bookingDetails?.booking_amount
                      ).toFixed(2)
                    : "0.00"}
                </h5>
              </div>

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
              navItems={navItems}
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
                    : details?.availabliltyDrivers?.map((v, i) => {
                        const d = v;

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
        {isSchedulePopupOpen && (
          <>
            <div
              className="modal fade show d-flex align-items-center justify-content-center confirmPickupModal"
              tabIndex="-1"
            >
              <div className="modal-dialog">
                <div className="modal-content schedulePopupContent">
                  <div className="schedulePopupHeader">
                    <h5>
                      {isViewMode ? "Schedule Attempts" : "Schedule Attempts"}
                    </h5>
                  </div>

                  <div className="schedulePopupBody">
                    <div className="scheduleTableWrapper">
                      <table className="schedulePopupTable">
                        <thead>
                          <tr>
                            <th style={{ borderTopLeftRadius: "15px" }}>
                              Retry Attempt
                            </th>
                            <th>Date</th>
                            <th style={{ borderTopRightRadius: "15px" }}>
                              Time
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {scheduleAttempts.map((row, index) => (
                            <tr key={index}>
                              <td>Attempt {row.attempt}</td>

                              <td>
                                <input
                                  type="date"
                                  className="scheduleInput"
                                  readOnly={isViewMode}
                                  value={moment(
                                    row.date,
                                    "DD MMM, YYYY"
                                  ).format("YYYY-MM-DD")}
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

                    <div className="schedulePopupActions">
                      <button
                        className="cancelBtn"
                        onClick={() => setIsSchedulePopupOpen(false)}
                      >
                        Cancel
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
    </div>
  );
}

export default PersonalSelectDriverAvailability;
