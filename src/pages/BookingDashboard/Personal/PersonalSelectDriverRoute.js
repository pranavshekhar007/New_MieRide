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
function PersonalSelectDriverRoute() {
  const params = useParams();
  const [formData, setFormData] = useState({
    booking_id: params?.id,
    driver_ids: [],
  });
  const navigate = useNavigate();
  const { setGlobalState, globalState } = useGlobalState();
  const [carSize, setCarSize] = useState(4);
  const [counter, setCounter] = useState(0);
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
  const [allDriverIds, setAllDriverIds] = useState([]);
  const getAvailableDriverByBooking = async () => {
    setShowSkeltonForDetails(true);
    try {
      let response = await getAvailableDriverByBookingServ({
        booking_id: params.id,
      });
      if (response?.data?.statusCode == "200") {
        setDetails(response?.data?.data);
        setAllDriverIds(details?.shareRouteDrivers?.map((v) => v?.id) || []);
        setGlobalAreAllIdsSelected(false);
        setCounter(response?.data?.data?.bookingDetails?.personal_schedule_retries?.length )
      }
    } catch (error) {}
    setShowSkeltonForDetails(false);
  };
  useEffect(() => {
    getAvailableDriverByBooking();
  }, []);
  const [globalAreAllIdsSelected, setGlobalAreAllIdsSelected] = useState(false);

  const addAllDriverIds = () => {
    // Fetch all driver IDs
    const allDriverIds = details?.shareRouteDrivers?.map((v) => v?.id) || [];

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
    selectedFormData?.append("booking_id", params?.id);
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
      } else if (response?.data?.statusCode == "400") {
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
const [showViewRecord, setShowViewRecord] =useState(false)
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
              {!details?.bookingDetails ? <div className="col-5">
                <Skeleton height={120}/>
              </div>:<div className="col-5 ">
                <div className="manualAmountBoxForPersonal d-flex justify-content-center align-items-center mb-3">
                  <h5>Driver Earning</h5>
                  <h3>$ {details?.bookingDetails?.driver_earning}</h3>
                </div>
                <div className="manualAmountBoxForPersonal d-flex justify-content-center align-items-center">
                  <h5>Pickup Time</h5>
                  <h3>
                    {moment(
                      details?.bookingDetails?.pickup_time,
                      "HH:mm"
                    ).format("hh:mm A")}
                  </h3>
                </div>
              </div>}
              
              {/* <div className="col-3">
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
              </div> */}
              {details?.bookingDetails ?  <div className="col-7 row mx-0 px-0 my-auto">
                <div className="col-9 ">
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
                <div className="col-3 ps-0 ">
                  <div className="retryBox w-100 h-100 ">
                    <h5>Retries</h5>
                    {details?.bookingDetails?.personal_schedule_retries?.length > 0 && <div className="my-2">{counter}</div>}
                    {details?.bookingDetails?.personal_schedule_retries?.length == 0 && <div className="retryCounter d-flex align-items-center justify-content-between">
                        <div>
                        <img
                          onClick={() => handleCounterFunc("minus")}
                          src="https://cdn-icons-png.flaticon.com/128/43/43625.png"
                        />
                      </div>
                     
                      <span>{counter}</span>
                      <div>
                        <img
                          onClick={() => handleCounterFunc("add")}
                          src="https://cdn-icons-png.flaticon.com/128/3524/3524388.png"
                        />
                      </div>
                      
                    </div>}
                    {details?.bookingDetails?.personal_schedule_retries?.length == 0 ?<button
                      className="mt-2"
                      onClick={() =>
                        setSchedulePopup({ ...schedulePopup, show: true })
                      }
                    >
                       Schedule
                    </button>:<button
                      className="mt-2"
                      onClick={() =>
                        setShowViewRecord(true)
                      }
                    >
                      View
                    </button>}
                    
                  </div>
                </div>
              </div>:<div className="col-7">
                <Skeleton height={120}/></div>}
             
            </div>

            <div className="row mt-5 pt-5">
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
            {details?.bookingDetails ? <div className="personalRouteBox">
              <div className="row">
                <div className="col-6 d-flex align-items-center ">
                  <button className="">
                    Booking ID :- {details?.bookingDetails?.id}
                  </button>
                </div>
                <div className="col-6 ">
                  <p>Username</p>
                  <h4>
                    {details?.bookingDetails?.user_details?.first_name +
                      " " +
                      details?.bookingDetails?.user_details?.last_name}
                  </h4>
                </div>
                <div className="col-12 my-2">
                  <p>Source</p>
                  <h4>{details?.bookingDetails?.source?.substring(0, 30)}</h4>
                </div>
                <div className="col-12 ">
                  <p>Destination</p>
                  <h4>{details?.bookingDetails?.destination?.substring(0, 30)}</h4>
                </div>
              </div>
            </div>:<div className="personalRouteBox">
              <Skeleton height={200}/></div>}
            
          </div>
        </div>
        <div className="my-4"></div>
        <TopNav
          navItems={navItems}
          navColor="#000"
          navBg="#fff"
          divideRowClass="col-xl-12 col-lg-12 col-md-12 col-12"
          selectedItem="Route"
          sectedNavBg="#353535"
          selectedNavColor="#fff"
        />
        <div
          style={{
            margin: "20px 0px",
            borderRadius: "30px",
            padding: "20px",
            border: "0.5px solid #E5E5E5",
            background: "#353535",
            boxShadow: "1px 1px 10px 0px rgba(0, 0, 0, 0.12)",
          }}
        >
          <table className="table manualTable mb-0 personalManualTab">
            <thead>
              <tr style={{ background: "#D0FF13", color: "#000" }}>
                <th scope="col" style={{ borderRadius: "20px 0px 0px 20px" }}>
                  <span>Sr. No</span>
                </th>
                <th scope="col">
                  {" "}
                  <span>Driver Details</span>{" "}
                </th>

                <th scope="col" style={{ borderRadius: "0px 20px 20px 0px" }}>
                  <div className="d-flex align-items-center justify-content-center">
                    <div className="me-2">Select All</div>
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
                : details?.shareRouteDrivers?.map((v, i) => {
                    return (
                      <>
                        <tr className=" bg-light">
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
                              <div
                                className="manualDriverBox d-flex py-3 justify-content-center align-items-center"
                                style={{ background: "#353535" }}
                              >
                                <div>
                                  <img
                                    src={Image_Base_Url + v?.image}
                                    className="me-3"
                                  />
                                </div>
                                <div>
                                  <p style={{ color: "#fff" }}>
                                    Driver ID : {v?.id}
                                  </p>
                                  <h4 style={{ color: "#fff" }}>
                                    {v?.first_name + " " + v?.last_name}
                                  </h4>
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
                                      {v?.vehicle_no}
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
                                onClick={() => addDriverId(v?.id)}
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
                                {formData?.driver_ids?.includes(v?.id)
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
        {!showSkeltonForDetails && details?.shareRouteDrivers?.length == 0 && (
          <NoRecordFound removeMarginTop={true} />
        )}
        {schedulePopup?.show && (
          <div
            className="modal fade show d-flex align-items-center manualSetPopup  justify-content-center "
            tabIndex="-1"
          >
            <div className="modal-dialog">
              <div
                className="modal-content"
                style={{
                  borderRadius: "16px",
                  background: "#f7f7f5",
                  width: "580px",
                }}
              >
                <div className="d-flex justify-content-between pt-4 pb-0 px-4">
                  <p className="mb-0">
                    <u>Schedule Retry Attempts</u>
                  </p>
                  {/* <i
                    className="fa fa-close text-secondary"
                    onClick={() => {
                      // setPaymentDetailsPopup(null);
                    }}
                  ></i> */}
                </div>
                {/* <hr className="mt-0" /> */}
                <div
                  className="modal-body retryContainer"
                  style={{ fontFamily: "poppins" }}
                >
                  <div
                    style={{
                      wordWrap: "break-word",
                      whiteSpace: "pre-wrap",
                    }}
                    // className="d-flex justify-content-center w-100"
                  >
                    <div
                      className="row m-0 p-0 py-3 d-flex align-items-center "
                      style={{
                        borderRadius: "10px 10px 0px 0px",
                        background: "#D0FF13",
                      }}
                    >
                      <div className="col-4">Retry Attempts</div>
                      <div className="col-4">Date (DD-MM-YYYY)</div>
                      <div className="col-4">Time (12 Hr Format)</div>
                    </div>
                    {[...Array(counter)]?.map((v, i) => {
                      return (
                        <div
                          className={
                            "row m-0 px-0 py-2 align-items-center d-flex "
                          }
                          style={{
                            background: i % 2 == 0 ? "#F7F7F7" : "#353535",
                            color: i % 2 == 0 ? "#000" : "#fff",
                          }}
                        >
                          <div className="col-4">Retry {i + 1}</div>
                          <div className="col-4 d-flex justify-content-center">
                            <input
                              type="date"
                              className="form-control"
                              // value={v.date}
                              onChange={(e) =>
                                handleRetryChange(i, "date", e.target.value)
                              }
                            />
                          </div>
                          <div className="col-4 d-flex justify-content-center">
                            <input
                              type="time"
                              className="form-control"
                              // value={v.time}
                              onChange={(e) =>
                                handleRetryChange(i, "time", e.target.value)
                              }
                            />
                          </div>
                        </div>
                      );
                    })}
                    <div className="mt-4 d-flex justify-content-end retryBtnGroup">
                      <button
                        className="me-3"
                        onClick={() => setSchedulePopup(false)}
                      >
                        Cancel
                      </button>
                      <button
                        style={{ background: "#353535", color: "#fff" }}
                        onClick={handleConfirm}
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                  <div className="d-flex justify-content-center"></div>
                </div>
              </div>
            </div>
          </div>
        )}
        {schedulePopup?.show && (
          <div className="modal-backdrop fade show"></div>
        )}
        {showViewRecord && (
                  <div
                    className="modal fade show d-flex align-items-center manualSetPopup  justify-content-center "
                    tabIndex="-1"
                  >
                    <div className="modal-dialog">
                      <div
                        className="modal-content"
                        style={{
                          borderRadius: "16px",
                          background: "#f7f7f5",
                          width: "580px",
                        }}
                      >
                        <div className="d-flex justify-content-between pt-4 pb-0 px-4">
                          <p className="mb-0">
                            <u>Scheduled retires</u>
                          </p>
                          {/* <i
                            className="fa fa-close text-secondary"
                            onClick={() => {
                              // setPaymentDetailsPopup(null);
                            }}
                          ></i> */}
                        </div>
                        {/* <hr className="mt-0" /> */}
                        <div
                          className="modal-body retryContainer"
                          style={{ fontFamily: "poppins" }}
                        >
                          <div
                            style={{
                              wordWrap: "break-word",
                              whiteSpace: "pre-wrap",
                            }}
                            // className="d-flex justify-content-center w-100"
                          >
                            <div
                              className="row m-0 p-0 py-3 d-flex align-items-center "
                              style={{
                                borderRadius: "10px 10px 0px 0px",
                                background: "#D0FF13",
                              }}
                            >
                              <div className="col-4">Retry Attempts</div>
                              <div className="col-4">Date (DD-MM-YYYY)</div>
                              <div className="col-4">Time (12 Hr Format)</div>
                            </div>
                            {details?.bookingDetails?.personal_schedule_retries?.map((v, i) => {
                              return (
                                <div
                                  className={
                                    "row m-0 px-0 py-3 align-items-center d-flex "
                                  }
                                  style={{
                                    background: i % 2 == 0 ? "#F7F7F7" : "#353535",
                                    color: i % 2 == 0 ? "#000" : "#fff",
                                  }}
                                >
                                  <div className="col-4">Retry {i + 1}</div>
                                  <div className="col-4 d-flex justify-content-center">
                                     
                                    <div>{moment(v?.run_at).format("DD MMM, YYYY")}</div>
                                    
                                  </div>
                                  <div className="col-4 d-flex justify-content-center">
                                      {moment(v?.run_at, "HH:mm").format(
                                                                        "hh:mm A"
                                                                      )}
                                  </div>
                                </div>
                              );
                            })}
                            <div className="mt-4 d-flex justify-content-end retryBtnGroup">
                              <button
                                className="me-3"
                                onClick={() => setShowViewRecord(false)}
                              >
                                Close
                              </button>
                              
                            </div>
                          </div>
                          <div className="d-flex justify-content-center"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {showViewRecord && (
                  <div className="modal-backdrop fade show"></div>
                )}
      </section>
      {/* sectionLayout ended */}
    </div>
  );
}

export default PersonalSelectDriverRoute;
