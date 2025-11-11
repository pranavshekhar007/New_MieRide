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
function SharingSelectAvalabilityDriverBooking() {
  const [formData, setFormData] = useState({
    booking_route_id: "",
    driver_ids: [],
    tip_amount: "",
    increased_pickup_time: "",
  });
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
  const getBookingDetailsFunc = async () => {
    setShowSkeltonForDetails(true);
    try {
      let response = await getRouteByGroupIdServ({ group_id: params.id });
      if (response?.data?.statusCode == "200") {
        setDetails(response?.data?.data);
        setFormData({
          driver_ids: [],
          tip_amount: "",
          booking_route_id: response?.data?.data?.routeDetails?.id,
          increased_pickup_time: "",
        });
        setAllDriverIds(
          details?.driverAvailabilities?.map((v) => v?.driver_details?.id) || []
        );
        setGlobalAreAllIdsSelected(false);
      }
    } catch (error) {}
    setShowSkeltonForDetails(false);
  };
  useEffect(() => {
    getBookingDetailsFunc();
  }, []);
  const [globalAreAllIdsSelected, setGlobalAreAllIdsSelected] = useState(false);

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
    selectedFormData?.append("tip_amount", formData?.tip_amount);
    selectedFormData?.append(
      "increased_pickup_time",
      formData?.increased_pickup_time
    );
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

              {isScheduleEnabled ? (
                <button
                  className="bgSuccess textDark"
                  style={{ width: "180px" }}
                  onClick={() => toast.info("Schedule feature coming soon")}
                >
                  Schedule
                </button>
              ) : (
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
                      onChange={(e) => setIsScheduleEnabled(e.target.checked)}
                    />
                    <span>Schedule</span>
                  </label>

                  <div className="counter">
                    <button className="counterBtn">−</button>
                    <span className="counterValue">00</span>
                    <button className="counterBtn">+</button>
                  </div>

                  <button className="selectTimeBtn">Select Time</button>
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
                        <div className="d-flex justify-content-center ">
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
                            {globalAreAllIdsSelected ? "✔" : " "}
                          </button>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <div className="pt-3 pb-2 "></div>
                  {showSkeltonForDetails
                    ? [1, 2, 3, 4, 5, 6, 7, 8, 9]?.map((v, i) => {
                        return (
                          <>
                            <tr key={i}>
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
                            <div className="py-3"></div>
                          </>
                        );
                      })
                    : details?.driverAvailabilities?.map((v, i) => {
                        return (
                          <>
                            <tr className=" ">
                              <td
                                scope="row"
                                style={{
                                  borderTopLeftRadius: "24px",
                                  borderBottomLeftRadius: "24px",
                                }}
                              >
                                {i + 1}
                              </td>

                              <td className="">
                                <div className="d-flex justify-content-center ">
                                  <div className="manualDriverBox d-flex py-3 justify-content-center align-items-center">
                                    <div>
                                      <img
                                        src={
                                          Image_Base_Url +
                                          v?.driver_details?.image
                                        }
                                        className="me-3"
                                      />
                                    </div>
                                    <div>
                                      <p>Driver ID : {v?.driver_details?.id}</p>
                                      <h4>{v?.driver_details?.first_name}</h4>
                                      <div
                                        className="d-flex align-items-center justify-content-center"
                                        style={{
                                          background: "#3B82F6",
                                          borderRadius: "5px",
                                          width: "100px",
                                        }}
                                      >
                                        <img
                                          className="me-2 carImg"
                                          style={{
                                            filter: "brightness(0) invert(1)",
                                          }}
                                          src="https://cdn-icons-png.flaticon.com/128/7571/7571054.png"
                                        />{" "}
                                        <div className="text-light">
                                          {v?.driver_details?.vehicle_no}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
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
                                    className="btn btn-warning "
                                    onClick={() =>
                                      addDriverId(v?.driver_details?.id)
                                    }
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
                                    {formData?.driver_ids?.includes(
                                      v?.driver_details?.id
                                    )
                                      ? "✔"
                                      : " "}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          </>
                        );
                      })}
                </table>

                {details?.driverAvailabilities?.length == 0 && !showSkelton && (
                  <NoRecordFound theme="light" marginTop="0px" />
                )}
              </div>
            </div>
            {/* <CustomPagination
            current_page={pageData?.current_page}
            onPerPageChange={onPerPageChange}
            last_page={pageData?.total_pages}
            per_page={payload?.per_page}
            onPageChange={onPageChange}
          /> */}
          </div>
        </div>
      </div>
      {/* {routePopupDetails && (
        <div
          className="modal fade show d-flex align-items-center justify-content-center"
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content managepopupgroup">
              <div className="modal-body p-0">
                <div className="row m-0 p-0">
                  <div className="col-8 m-0 p-0">
                    <div className="managepopupgroupleft me-3">
                      {routePopupDetails?.routeDetails?.pickup_points?.map((v, i) => {
                        return (
                          <div
                            key={i}
                            className="d-flex justify-content-between align-items-center py-2 managePopUpTable"
                            style={{
                              background: "#F7F7F7",
                            }}
                          >
                            <div className="px-3">
                              <button
                                style={{
                                  background: "#000",
                                  color: "#D0FF13",
                                  border: "none",
                                  width: "120px",
                                  height: "30px",
                                  fontFamily: "Poppins",
                                  fontSize: "12px",
                                  borderRadius: "5px",
                                  fontWeight: "500",
                                }}
                              >
                                Booking ID : {v?.booking_id || `#${i + 1}`}
                              </button>
                            </div>
      
                            <div className="d-flex align-items-center px-3">
                              <img
                                src="/imagefolder/locationGreenIcon.png"
                                alt="pickup"
                              />
                              <p
                                className="ms-2"
                                style={{
                                  color: "#1C1C1C",
                                  fontSize: "12px",
                                  fontFamily: "Nexa",
                                  marginBottom: "0",
                                }}
                              >
                                {v?.place_name}
                              </p>
                            </div>
                            <div className="d-flex align-items-center">
                              <img
                                src="/imagefolder/locationRedIcon.png"
                                alt="drop"
                              />
                              <p
                                className="ms-2"
                                style={{
                                  color: "#1C1C1C",
                                  fontSize: "12px",
                                  fontFamily: "Nexa",
                                  marginBottom: "0",
                                }}
                              >
                                {
                                  routePopupDetails?.routeDetails?.dropoff_points?.[i]
                                    ?.place_name
                                }
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="col-4 m-0 p-0">
                    <div className="managepopupgroupleft ms-2">
                      <select style={{ opacity: "1" }}>
                        <option>
                          Group ID : {routePopupDetails?.routeDetails?.group_id}
                        </option>
                      </select>
      
                      <div className="mt-4">
                        <button
                          className="shiftButton"
                          style={{
                            background: "#D0FF13",
                            color: "#000",
                          }}
                        >
                          Shift
                        </button>
                      </div>
                    </div>
      
                    <div className="managepopupgroupleft mt-4 ms-2">
                      <div className="mb-3">
                        <button
                          className="shiftButton"
                          style={{
                            backgroundColor: "#353535",
                            color: "#D0FF13",
                            opacity: 1,
                          }}
                        >
                          Unlink
                        </button>
                      </div>
                      <div>
                        <button
                          className="shiftButton"
                          style={{
                            backgroundColor: "#353535",
                            color: "#D0FF13",
                            opacity: 1,
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
      
      
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
      
      {routePopupDetails && <div className="modal-backdrop fade show"></div>} */}

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
    </div>
  );
  return (
    <div className="main_layout  bgBlack d-flex">
      {/* sidebar started */}
      <Sidebar selectedItem="Booking Dashboard" />
      {/* sidebar ended */}

      {/* sectionLayout started */}
      <section
        className="section_layout "
        style={{
          marginLeft: globalState?.isFillSidebarWidth100 ? "260px" : "80px",
        }}
      >
        <div className="row">
          <div className="col-8">
            <div className="row manualTopNav ">
              <div className="col-3 ">
                <div className="manualAmountBox">
                  <p>Total Amount</p>
                  <h3>
                    $
                    {details?.routeDetails?.total_trip_amount
                      ? details?.routeDetails?.total_trip_amount
                      : " ..."}
                  </h3>
                </div>
              </div>
              <div className="col-3">
                <div
                  className="manualAmountBox"
                  style={{ background: "#00A431" }}
                >
                  <p>First Pickup Time</p>
                  <h3>
                    {details?.routeDetails?.first_pickup_time
                      ? details?.routeDetails?.first_pickup_time
                      : "..."}
                  </h3>
                </div>
              </div>
              <div className="col-6 my-auto">
                <div className="d-flex align-items-center justify-content-between w-100 manualwhiteBtn mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={isTipInputEdit}
                    onChange={(e) => setIsTipInputEdit(e.target.checked)}
                  />
                  <input
                    style={{ border: "none", outline: "none" }}
                    type="number"
                    placeholder="Extra Charges"
                    readOnly={!isTipInputEdit}
                    value={formData?.tip_amount}
                    onChange={(e) =>
                      setFormData({ ...formData, tip_amount: e.target.value })
                    }
                  />
                  <h6 className="mb-0 me-3">$</h6>
                </div>
                <div className="d-flex align-items-center justify-content-between w-100 manualwhiteBtn">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={isTimeInputEdit}
                    onChange={(e) => setIsTimeInputEdit(e.target.checked)}
                  />
                  <input
                    style={{ border: "none", outline: "none" }}
                    type="number"
                    placeholder="Increase Pickup Time"
                    readOnly={!isTimeInputEdit}
                    value={formData?.increased_pickup_time}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        increased_pickup_time: e.target.value,
                      })
                    }
                  />
                  <h6 className="mb-0 me-3">Min</h6>
                </div>
              </div>
            </div>
            <div className="mt-4"></div>
            <TopNav
              navItems={navItems}
              navColor="#000"
              navBg="#fff"
              divideRowClass="col-xl-12 col-lg-12 col-md-12 col-12"
              selectedItem="Availability"
              sectedNavBg="#353535"
              selectedNavColor="#fff"
            />
            <div className="row my-4">
              <div className="col-6">
                <div className="d-flex align-items-center manualInputDiv">
                  <img src="https://cdn-icons-png.flaticon.com/128/54/54481.png" />
                  <input placeholder="Search driver" />
                </div>
              </div>
              <div className="col-6">
                <div className="manualInputDiv">
                  <select>
                    <option>Select Vechile Type</option>
                  </select>
                </div>
              </div>
            </div>
            <div
              style={{
                margin: "20px 0px",
              }}
            >
              <table className="table manualTable mb-0">
                <thead>
                  <tr style={{ background: "#DDDDDD", color: "#000" }}>
                    <th
                      scope="col"
                      style={{ borderRadius: "20px 0px 0px 20px" }}
                    >
                      <span>Sr. No</span>
                    </th>
                    <th scope="col">
                      {" "}
                      <span>Driver Details</span>{" "}
                    </th>

                    <th
                      scope="col"
                      style={{ borderRadius: "0px 20px 20px 0px" }}
                    >
                      <div className="d-flex align-items-center justify-content-center">
                        <button
                          className="btn btn-warning shadow"
                          onClick={addAllDriverIds}
                          style={{
                            padding: "2.5px 4px",
                            background: "#fff",
                            border: "2px solid black",
                            width: "25px",
                            height: "25px",
                            color: "#139F02",
                            fontWeight: "600",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {globalAreAllIdsSelected ? "✔" : " "}
                        </button>
                        <div className="ms-2">All</div>
                      </div>
                    </th>
                  </tr>
                </thead>
                <div className="py-2"></div>
                <tbody>
                  {showSkeltonForDetails
                    ? [1, 2, 3, 4, 5]?.map((v, i) => {
                        return (
                          <tr className=" ">
                            <td
                              scope="row"
                              style={{
                                borderTopLeftRadius: "24px",
                                borderBottomLeftRadius: "24px",
                              }}
                            >
                              <Skeleton width={30} />
                            </td>

                            <td style={{ width: "300px" }}>
                              <Skeleton width={100} />
                            </td>

                            <td
                              style={{
                                borderTopRightRadius: "24px",
                                borderBottomRightRadius: "24px",
                                overflow: "hidden",
                              }}
                            >
                              <Skeleton width={100} />
                            </td>
                          </tr>
                        );
                      })
                    : details?.driverAvailabilities?.map((v, i) => {
                        return (
                          <>
                            <tr className=" ">
                              <td
                                scope="row"
                                style={{
                                  borderTopLeftRadius: "24px",
                                  borderBottomLeftRadius: "24px",
                                }}
                              >
                                {i + 1}
                              </td>

                              <td className="">
                                <div className="d-flex justify-content-center ">
                                  <div className="manualDriverBox d-flex py-3 justify-content-center align-items-center">
                                    <div>
                                      <img
                                        src={
                                          Image_Base_Url +
                                          v?.driver_details?.image
                                        }
                                        className="me-3"
                                      />
                                    </div>
                                    <div>
                                      <p>Driver ID : {v?.driver_details?.id}</p>
                                      <h4>{v?.driver_details?.first_name}</h4>
                                      <div
                                        className="d-flex align-items-center justify-content-center"
                                        style={{
                                          background: "#3B82F6",
                                          borderRadius: "5px",
                                          width: "100px",
                                        }}
                                      >
                                        <img
                                          className="me-2 carImg"
                                          style={{
                                            filter: "brightness(0) invert(1)",
                                          }}
                                          src="https://cdn-icons-png.flaticon.com/128/7571/7571054.png"
                                        />{" "}
                                        <div className="text-light">
                                          {v?.driver_details?.vehicle_no}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
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
                                    className="btn btn-warning "
                                    onClick={() =>
                                      addDriverId(v?.driver_details?.id)
                                    }
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
                                    {formData?.driver_ids?.includes(
                                      v?.driver_details?.id
                                    )
                                      ? "✔"
                                      : " "}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          </>
                        );
                      })}
                </tbody>
              </table>
            </div>
            {details?.sharedRoutesDetails?.length == 0 && (
              <NoRecordFound removeMarginTop={true} />
            )}
          </div>
          <div className="col-4">
            <div className="d-flex justify-content-between manualButtonGroup">
              {formData?.driver_ids?.length > 0 ? (
                <button onClick={handleSubmitDriverSelectFunc}>Submit</button>
              ) : (
                <button style={{ opacity: "0.5" }}>Submit</button>
              )}
              <button
                className="text-light"
                style={{ width: "40px", background: "#CC1200", border: "none" }}
                onClick={() => navigate("/sharing-manual-booking")}
              >
                <h4 className="mb-0">
                  <i className="fa fa-close"></i>{" "}
                </h4>
              </button>
            </div>
            <div className="manualEnrouteBox h-100">
              {details?.routeDetails?.pickup_points &&
                details?.routeDetails?.pickup_points?.map((v, i) => {
                  return (
                    <div
                      className="halfTopCard"
                      style={{
                        top: `-${i * 50}px`,
                        background: i % 2 != 0 ? "#000" : "#fff",
                        borderRadius: i == 7 ? "31px" : "31px 31px 0px 0px",
                        color: i % 2 != 0 ? " #fff" : "#000 ",
                      }}
                    >
                      <div className="d-flex justify-content-between px-4">
                        <div className="d-flex align-items-center w-100 row">
                          <p className="col-1">{i + 1}.</p>
                          <p className="col-2">{v?.booking_id}</p>

                          <Tippy
                            style={{ background: "red" }}
                            content={
                              <span
                                style={{
                                  color: "#139F01",
                                  fontFamily: "poppins",
                                  borderRadius: "6px",
                                  padding: "2px 4px",
                                }}
                                className="col-3"
                              >
                                {v?.place_name}
                              </span>
                            }
                            placement="top"
                            theme="custom-tooltip"
                          >
                            <p className="col-9">
                              {v?.place_name.substring(0, 25)}...
                            </p>
                          </Tippy>
                        </div>
                      </div>
                    </div>
                  );
                })}
              {details?.routeDetails?.dropoff_points &&
                details?.routeDetails?.dropoff_points?.map((v, i) => {
                  return (
                    <div
                      className="halfTopCard"
                      style={{
                        top: `-${
                          i * 50 +
                          details?.routeDetails?.pickup_points?.length * 50
                        }px`,

                        background:
                          (details?.routeDetails?.pickup_points?.length + i) %
                            2 !=
                          0
                            ? "#000"
                            : "#fff",
                        borderRadius:
                          i == details?.routeDetails?.pickup_points?.length - 1
                            ? "31px"
                            : "31px 31px 0px 0px",
                        color:
                          (i + details?.routeDetails?.pickup_points.length) %
                            2 !=
                          0
                            ? " #fff"
                            : "#000 ",
                      }}
                    >
                      <div className="d-flex justify-content-between px-4">
                        <div className="d-flex align-items-center w-100 row">
                          <p className="col-1">
                            {details?.routeDetails?.pickup_points?.length +
                              i +
                              1}
                            .
                          </p>
                          <p className="col-2">{v?.booking_id}</p>

                          <Tippy
                            style={{ background: "red" }}
                            content={
                              <span
                                style={{
                                  color: "#139F01",
                                  fontFamily: "poppins",
                                  borderRadius: "6px",
                                  padding: "2px 4px",
                                }}
                                className="col-3"
                              >
                                {v?.place_name}
                              </span>
                            }
                            placement="top"
                            theme="custom-tooltip"
                          >
                            <p className="col-9">
                              {v?.place_name.substring(0, 25)}...
                            </p>
                          </Tippy>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </section>
      {/* sectionLayout ended */}
    </div>
  );
}

export default SharingSelectAvalabilityDriverBooking;
