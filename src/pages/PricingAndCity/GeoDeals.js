import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import axios from "axios";
import {
  addProvinceServ,
  listProvinceServ,
  deleteProvinceServ,
} from "../../services/priceAndCity.services";
import {
  getGeoDealsServ,
  deleteGeoDealsServ,
  storeGeoDealsServ,
  UpdateGeoDealsServ,
} from "../../services/priceAndCity.services";
import LocationAutoComplete from "../../components/LocationAutoComplete";
import { MultiSelect } from "react-multi-select-component";
import moment from "moment";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useGlobalState } from "../../GlobalProvider";
import NewSidebar from "../../components/NewSidebar";
import CustomTopNav from "../../components/CustomTopNav";
import CustomPagination from "../../components/CustomPazination";
import NoRecordFound from "../../components/NoRecordFound";
function GeoDeals() {
  const { setGlobalState, globalState } = useGlobalState();
  const [list, setList] = useState([]);
  const [editForm, setEditForm] = useState({
    lat: "",
    long: "",
    location: "",
    province: "",
    discount_amount: "",
    discount_message: "",
    ride_categories: [],
    start_date: "",
    time_choice: "",
    deal_times:[],
    status: "",
    id: "",
  });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [editSelectedCategories, setEditSelectedCategories] = useState([]);
  const deleteGeoDealsFunc = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete the price record?"
    );
    if (isConfirmed) {
      try {
        let response = await deleteGeoDealsServ({ id });
        if (response?.data?.statusCode == "200") {
          toast.success(response?.data?.message);
          getGeoDealsFunc();
        }
      } catch (error) {
        toast?.error(error?.response?.data?.message);
      }
    }
  };
  const navItems = [
    [
      {
        name: "Categories",
        path: "/pricing-categories",
      },
      {
        name: "Province",
        path: "/pricing-province",
      },
      {
        name: "Location",
        path: "/pricing-sharing-location",
      },

      {
        name: "Commission",
        path: "/pricing-commission",
      },
      {
        name: "Payment & Payout ",
        path: "/pricing-payout-info",
      },
      {
        name: "Geo Deals",
        path: "/pricing-payout-info",
      },
    ],
  ];
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState([]);
  const API_KEY = "AIzaSyD6KJOHKQLUWMAh9Yl5NQrEAI9bxrvYCqQ";
  const [formData, setFormData] = useState({
    name: "",
    long: "",
    lat: "",
  });
  const [payload, setPayload] = useState({
    ride_category: "",
    start_date: "",
    end_date: "",
    time_choice: "",
    search_key: "",
  });
  const [showLoader, setShowLoader] = useState(false);
  const getGeoDealsFunc = async () => {
    setShowSkelton(true);
    try {
      let response = await getGeoDealsServ(payload);
      if (response?.data?.statusCode == "200") {
        setList(response?.data?.data);
      }
    } catch (error) {}

    setShowSkelton(false);
  };
  useEffect(() => {
    getGeoDealsFunc();
  }, [payload]);
  const handleSearch = async (input) => {
    setQuery(input);

    if (input.length > 0) {
      // Start searching after 3 characters
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        input
      )}&key=${API_KEY}`;

      try {
        const response = await axios.get(url);
        console.log(response?.data.results);
        setLocation(response?.data.results);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    }
  };

  const handleSubmitProvince = async () => {
    try {
      setShowLoader(true);
      let response = await addProvinceServ(formData);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        setFormData({
          name: "",
          long: "",
          lat: "",
        });
        setQuery("");
        setLocation([]);
        handleGetProvinceListFunc();
      } else if (response?.data?.statusCode == "400") {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
    setShowLoader(false);
  };
  const [showSkelton, setShowSkelton] = useState(false);
  const [provinceList, setProvienceList] = useState([]);
  const handleGetProvinceListFunc = async () => {
    if (provinceList?.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await listProvinceServ();
      if (response?.data?.statusCode == "200") {
        setProvienceList(response?.data?.data);
      }
    } catch (error) {}
    setShowSkelton(false);
  };
  useEffect(() => {
    handleGetProvinceListFunc();
  }, []);

  const handleProvinceDeleteFunc = async (id) => {
    // Ask for confirmation before proceeding
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this province?"
    );

    if (isConfirmed) {
      try {
        let response = await deleteProvinceServ(id);
        if (response?.data?.statusCode === "200") {
          toast.success(response?.data?.message);
          handleGetProvinceListFunc();
        }
      } catch (error) {
        toast.error("Internal Server Error");
      }
    }
  };
  const [showAddPopup, setShowAddPopup] = useState(false);

  const setCityLocationFunc = (obj) => {
    console.log(obj);
    setFormData({
      ...formData,
      location: obj.location,
      long: obj.lng,
      lat: obj.lat,
      province: obj.provienceName,
    });
  };
  const [isSubmiting, setIsSubmiting] = useState(false);
  const handleSubmitGeoDeal = async () => {
  setIsSubmiting(true);
  try {
    let data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "deal_times" && key !== "ride_categories") {
        data.append(key, value);
      }
    });
    (formData?.deal_times || []).forEach((time) => {
      data.append("deal_times[]", time);
    });
    selectedCategories.forEach((cat) => {
      data.append("ride_categories[]", cat?.value);
    });
    let response = await storeGeoDealsServ(data);

    if (response?.data?.statusCode == "200") {
      toast.success(response?.data?.message);
      setShowAddPopup(false);
      setFormData({
        lat: "",
        long: "",
        location: "",
        province: "",
        discount_amount: "",
        discount_message: "",
        ride_categories: [],
        start_date: "",
        deal_times: [],
        time_choice: "",
        status: "",
      });
      setSelectedCategories([]);
      getGeoDealsFunc();
    }
  } catch (error) {
    toast?.error(error?.response?.data?.message || "Something went wrong!");
  }
  setIsSubmiting(false);
};

  const [isEditSubmiting, setIsEditSubmiting] = useState(false);
  const handleUpdateGeoDeal = async () => {
  setIsEditSubmiting(true);
  try {
    const data = new FormData();

    // ✅ Append all key-value pairs from editForm
    Object.entries(editForm).forEach(([key, value]) => {
       if (key !== "deal_times" && key !== "ride_categories") {
        data.append(key, value);
      }
    });

    (editForm?.deal_times || []).forEach((time) => {
      data.append("deal_times[]", time);
    });

    // ✅ Append ride categories array
    editSelectedCategories.forEach((cat) => {
      data.append("ride_categories[]", cat?.value);
    });

    console.log("Update Payload ===>", [...data]);

    // ✅ Send to API service
    const response = await UpdateGeoDealsServ(data);

    // ✅ Handle success
    if (response?.data?.statusCode == "200") {
      toast.success(response?.data?.message || "Geo deal updated successfully!");

      // ✅ Reset edit form after successful update
      setEditForm({
        id: "",
        lat: "",
        long: "",
        location: "",
        province: "",
        discount_amount: "",
        discount_message: "",
        ride_categories: [],
        start_date: "",
        start_time: "",
        end_date: "",
        end_time: "",
        deal_times: [],
        time_choice: "",
        status: "",
      });

      setEditSelectedCategories([]);
      getGeoDealsFunc(); // Refresh list
    }
  } catch (error) {
    console.error("Update Error:", error);
    toast.error(error?.response?.data?.message || "Something went wrong!");
  } finally {
    setIsEditSubmiting(false);
  }
};

  return (
    <div className="mainBody">
      <NewSidebar selectedItem="Settings" />
      <div className="contentLayout">
        <div className="bgWhite borderRadius30 p-4 minHeight100vh">
          <div className="sticky-top bgWhite">
            <CustomTopNav navItems={navItems} selectedNav="Geo Deals" />
          </div>
          <div className="row my-4 d-flex align-items-center">
            <div className="col-3   ">
              <div className="fundInputBoxBtn">
                <button
                  className="w-100 h-100"
                  onClick={() => setShowAddPopup(true)}
                >
                  <i
                    className="fa fa-plus me-3 "
                    style={{ fontWeight: "300" }}
                  />{" "}
                  Create Geo Deals
                </button>
              </div>
            </div>
            <div className="col  ">
              <div className="fundInputBox">
                <select
                  className="form-control"
                  onChange={(e) =>
                    setPayload({ ...payload, ride_category: e?.target.value })
                  }
                >
                  <option value="">Category</option>
                  <option value="1">Sharing</option>
                  <option value="2">Personal</option>
                </select>
              </div>
            </div>
            <div className="col   ">
              <div className="fundInputBox">
                <select
                  className="form-control"
                  onChange={(e) =>
                    setPayload({ ...payload, time_choice: e?.target.value })
                  }
                >
                  <option value="">Time Choice</option>
                  <option value="pickupat">Pickup</option>
                  <option value="dropoffby">Drop-off</option>
                </select>
              </div>
            </div>
            <div className="col ">
              <div className="fundInputBox d-flex align-items-center">
                <span className="ms-2">Start</span>
                <input
                  className="form-control ms-2"
                  type="date"
                  placeholder="Search"
                  style={{ border: "none" }}
                  onChange={(e) =>
                    setPayload({
                      ...payload,
                      start_date: payload?.start_date
                        ? moment(e.target.value).format("YYYY-MM-DD")
                        : null,
                    })
                  }
                />
              </div>
            </div>

            <div className="col   ">
              <div className="fundInputBox">
                <select
                  className="form-control"
                  onChange={(e) =>
                    setPayload({ ...payload, status: e?.target.value })
                  }
                >
                  <option value="">Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">In-Active</option>
                </select>
              </div>
            </div>
          </div>
          <div className="tableOuterContainer bgDark">
            <div>
              <table className="table">
                <thead className="">
                  <tr>
                    <th
                      scope="col"
                      style={{ borderRadius: "24px 0px 0px 24px" }}
                    >
                      Sr. No
                    </th>
                    <th scope="col">Location</th>
                    <th scope="col">Category</th>
                    <th scope="col">Time Choice</th>
                    <th scope="col">Deals Date</th>
                    <th scope="col">Deals Time</th>

                    <th scope="col" style={{ width: "150px" }}>
                      Discount (%)
                    </th>
                    <th scope="col">Discount Message</th>
                    <th scope="col">Status</th>

                    <th
                      scope="col"
                      style={{ borderRadius: "0px 24px 24px 0px" }}
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <div className="pt-4"></div>
                <tbody>
                  {showSkelton
                    ? [1, 2, 3, 4, 5, 6, 7, 8, 9]?.map((v, i) => {
                        return (
                          <tr key={i}>
                            <td>
                              <Skeleton width={50} />
                            </td>
                            <td>
                              <Skeleton width={100} />
                            </td>
                            <td>
                              <Skeleton width={100} />
                            </td>

                            <td>
                              <Skeleton width={100} />
                            </td>

                            <td>
                              <Skeleton width={100} />
                            </td>
                            <td>
                              <Skeleton width={100} />
                            </td>
                            <td>
                              <Skeleton width={100} />
                            </td>
                            <td>
                              <Skeleton width={100} />
                            </td>
                            <td>
                              <Skeleton width={100} />
                            </td>
                            <td>
                              <Skeleton width={100} />
                            </td>
                          </tr>
                        );
                      })
                    : list.map((v, i) => {
                        return (
                          <>
                            <tr
                              style={{
                                background: "#fff",
                              }}
                            >
                              <td
                                scope="row"
                                style={{
                                  borderRadius: "25px 0px 0px 25px",
                                }}
                              >
                                {i + 1}
                              </td>
                              <td
                                style={{
                                  width: "180px",
                                  wordWrap: "break-word",
                                  whiteSpace: "normal",
                                }}
                              >
                                {v?.location}
                              </td>
                              <td>
                                <div>
                                  {JSON.parse(v?.ride_categories).includes(
                                    "1"
                                  ) && (
                                    <>
                                      <i
                                        className="fa fa-circle me-2"
                                        style={{
                                          fontSize: "5px",
                                          position: "relative",
                                          top: "-2.5px",
                                        }}
                                      ></i>
                                      Sharing
                                    </>
                                  )}
                                </div>
                                <div>
                                  {JSON.parse(v?.ride_categories).includes(
                                    "2"
                                  ) && (
                                    <>
                                      <i
                                        className="fa fa-circle me-2"
                                        style={{
                                          fontSize: "5px",
                                          position: "relative",
                                          top: "-2.5px",
                                        }}
                                      ></i>
                                      Personal
                                    </>
                                  )}
                                </div>
                              </td>
                              <td>
                                {v?.time_choice == "dropoffby" ? (
                                  <>
                                    <i
                                      className="fa fa-circle me-2"
                                      style={{
                                        fontSize: "5px",
                                        position: "relative",
                                        top: "-2.5px",
                                      }}
                                    ></i>
                                    Drop-off
                                  </>
                                ) : (
                                  <>
                                    <i
                                      className="fa fa-circle me-2"
                                      style={{
                                        fontSize: "5px",
                                        position: "relative",
                                        top: "-2.5px",
                                      }}
                                    ></i>
                                    Pickup
                                  </>
                                )}
                              </td>
                              <td>
                                <div>
                                  {moment(v?.start_date).format("DD MMM, YYYY")}{" "}
                                </div>
                              </td>
                              <td>
                                <div className="d-flex justify-content-center">
                                  {JSON.parse(v?.deal_times)?.map((v, i) => {
                                    return (
                                      <div>
                                        <span
                                          className="mx-1 p-1"
                                          style={{
                                            background: "#E5E5E5",
                                            borderRadius: "6px",
                                          }}
                                        >
                                          {moment(v, "HH:mm").format("hh:mm A")}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </td>

                              <td style={{ width: "100px" }}>
                                {v?.discount_amount}%
                              </td>
                              <td
                                style={{
                                  width: "180px",
                                  wordWrap: "break-word",
                                  whiteSpace: "normal",
                                }}
                              >
                                {v?.discount_message}
                              </td>

                              <td>
                                {v?.status == "inactive" ? (
                                  <button
                                    //   onClick={() => deletePriceFunc(v?.id)}
                                    className="btn btn-danger"
                                    style={{
                                      borderRadius: "5px",
                                      fontSize: "12px",
                                      background: "#DD4132",
                                      border: "none",
                                      height: "30px",
                                      width: "80px",
                                    }}
                                  >
                                    In-Active
                                  </button>
                                ) : (
                                  <button
                                    //   onClick={() => deletePriceFunc(v?.id)}
                                    className="btn btn-danger"
                                    style={{
                                      borderRadius: "5px",
                                      fontSize: "12px",
                                      background: "#00A431",
                                      border: "none",
                                      height: "30px",
                                      width: "80px",
                                    }}
                                  >
                                    Active
                                  </button>
                                )}
                              </td>

                              <td style={{ borderRadius: "0px 25px 25px 0px" }}>
                                <div>
                                  <img
                                    src="https://cdn-icons-png.flaticon.com/128/10337/10337385.png"
                                    className="me-2"
                                    style={{ height: "20px" }}
                                    onClick={() => {
                                      setEditForm({
                                        lat: v?.lat,
                                        long: v?.long,
                                        location: v?.location,
                                        province: v?.province,
                                        discount_amount: v?.discount_amount,
                                        discount_message: v?.discount_message,
                                        start_date: v?.start_date,
                                        deal_times:JSON.parse(v?.deal_times),
                                        time_choice: v?.time_choice,
                                        
                                        status: v?.status,
                                        id: v?.id,
                                      });
                                      const categories = JSON.parse(
                                        v?.ride_categories || "[]"
                                      )
                                        .map((id) => {
                                          if (id == "1" || id == 1)
                                            return {
                                              label: "Sharing",
                                              value: "1",
                                            };
                                          if (id == "2" || id == 2)
                                            return {
                                              label: "Personal",
                                              value: "2",
                                            };
                                          return null;
                                        })
                                        .filter(Boolean);

                                      setEditSelectedCategories(categories);
                                    }}
                                  />
                                  <img
                                    src="https://cdn-icons-png.flaticon.com/128/6861/6861362.png"
                                    style={{ height: "20px" }}
                                    onClick={() => deleteGeoDealsFunc(v?.id)}
                                  />
                                </div>
                              </td>
                            </tr>
                            <div className="my-3"></div>
                          </>
                        );
                      })}
                </tbody>
              </table>
              {list.length == 0 && !showSkelton && (
                <NoRecordFound theme="light" marginTop="-20px" />
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
      {showAddPopup && (
        <div
          className="modal fade show d-flex align-items-center   justify-content-center "
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div
              className="modal-content"
              style={{
                borderRadius: "16px",
                background: "#f7f7f5",
                width: "1070px",
                position: "relative",
                left: "-200px",
              }}
            >
              <div className="d-flex justify-content-between pt-4 pb-0 px-4">
                <p
                  className="mb-0"
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    fontFamily: "nexa",
                  }}
                >
                  Create new Geo Deals
                </p>
              </div>

              <div className="modal-body" style={{ fontFamily: "poppins" }}>
                <div
                  style={{
                    wordWrap: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                  className="d-flex justify-content-center w-100"
                >
                  <div className="w-100  createGeoDealsPopupBody">
                    <div className="row">
                      <div className="col-6 mb-3">
                        <label>Location</label>
                        <LocationAutoComplete
                          placeholder="Search Location"
                          isGeoDeal={true}
                          callBackFunc={setCityLocationFunc}
                          // clearInput={clearInput}
                        />
                      </div>
                      <div className="col-6 mb-3">
                        <label>Time Choice</label>
                        <select
                          className="form-control"
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              time_choice: e?.target?.value,
                            })
                          }
                          value={formData?.time_choice}
                        >
                          <option value="">Select</option>
                          <option value="pickupat">Pickup</option>
                          <option value="dropoffby">Drop-off</option>
                        </select>
                      </div>
                      <div className="col-6 mb-3">
                        <label>Category</label>
                        <MultiSelect
                          options={[
                            { label: "Sharing", value: "1" },
                            { label: "Personal", value: "2" },
                          ]}
                          value={selectedCategories}
                          onChange={setSelectedCategories}
                          labelledBy="Select Ride Category"
                          hasSelectAll={true}
                          overrideStrings={{
                            selectSomeItems: "Select Category", // Placeholder text
                            allItemsAreSelected: "All categories are selected",
                            selectAll: "Select All",
                            search: "Search ...",
                          }}
                        />
                      </div>
                      <div className="col-6 mb-3">
                        <label>Status</label>
                        <select
                          className="form-control"
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              status: e?.target?.value,
                            })
                          }
                          value={formData?.status}
                        >
                          <option value="">Select</option>
                          <option value="active">Active</option>
                          <option value="inactive">In-Active</option>
                        </select>
                      </div>
                      <div className="col-6 mb-3">
                        <label>Discount</label>
                        <input
                          className="form-control"
                          type="number"
                          min={0}
                          max={100}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              discount_amount: e?.target?.value,
                            })
                          }
                          value={formData?.discount_amount}
                        />
                      </div>
                      <div className="col-6 mb-3">
                        <label>Deals Date & Time</label>
                        <input
                          className="form-control  me-1"
                          type="date"
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              start_date: e?.target?.value,
                            })
                          }
                          value={formData?.start_date}
                        />
                      </div>
                      <div className="col-6 mb-3">
                        <label>Discount Message</label>
                        <textarea
                          className="form-control"
                          rows={5}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              discount_message: e?.target?.value,
                            })
                          }
                          value={formData?.discount_message}
                        />
                      </div>
                      <div className="col-6 mb-3">
                        <div className="timeInputGroup">
                          <div
                            className=""
                            style={{ maxHeight: "120px", overflowY: "scroll" }}
                          >
                            {formData?.deal_times?.map((v, i) => {
                              return (
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                  <input value={v} readOnly />
                                  <button
                                    onClick={() => {
                                      const updatedTimes =
                                        formData.deal_times.filter(
                                          (_, index) => index !== i
                                        );
                                      setFormData({
                                        ...formData,
                                        deal_times: updatedTimes,
                                      });
                                    }}
                                  >
                                    Remove
                                  </button>
                                </div>
                              );
                            })}
                          </div>

                          <div className="d-flex align-items-center justify-content-between pt-2">
                            <input
                              value={formData?.new_time || ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  new_time: e.target.value,
                                })
                              }
                              type="time"
                            />
                            <button
                              onClick={() => {
                                if (formData?.new_time) {
                                  const updatedTimes = [
                                    ...(formData.deal_times || []),
                                    formData.new_time,
                                  ];
                                  setFormData({
                                    ...formData,
                                    deal_times: updatedTimes,
                                    new_time: "",
                                  });
                                }
                              }}
                            >
                              <i className="fa fa-plus me-2"></i> Add Time
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-end geoDealsButtonGroup">
                  <button
                    onClick={() => {
                      setShowAddPopup(false);
                      setFormData({
                        lat: "",
                        long: "",
                        location: "",
                        province: "",
                        discount_amount: "",
                        discount_message: "",
                        ride_categories: [],
                        start_date: "",
                        time_choice: "",
                        deal_times:[],
                        status: "",
                      });
                      setSelectedCategories([]);
                    }}
                  >
                    Cancel
                  </button>
                  {
                  formData?.location &&
                  formData?.discount_amount &&
                  selectedCategories?.length > 0 &&
                  formData?.discount_message &&
                  
                  formData?.start_date &&
                  formData?.deal_times?.length > 0 &&
                
                  formData?.status ? (
                    isSubmiting ? (
                      <button
                        className="ms-3"
                        style={{
                          background: "#1C1C1C",
                          color: "#fff",
                          opacity: "0.5",
                        }}
                      >
                        Submiting ...
                      </button>
                    ) : (
                      <button
                        className="ms-3"
                        style={{ background: "#1C1C1C", color: "#fff" }}
                        onClick={() => handleSubmitGeoDeal()}
                      >
                        Save
                      </button>
                    )
                  ) : (
                    <button
                      className="ms-3"
                      style={{
                        background: "#1C1C1C",
                        color: "#fff",
                        opacity: "0.5",
                      }}
                    >
                      Save
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showAddPopup && <div className="modal-backdrop fade show"></div>}
      {editForm?.id && (
        <div
          className="modal fade show d-flex align-items-center   justify-content-center "
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div
              className="modal-content"
              style={{
                borderRadius: "16px",
                background: "#f7f7f5",
                width: "1070px",
                position: "relative",
                left: "-150px",
              }}
            >
              <div className="d-flex justify-content-between pt-4 pb-0 px-4">
                <p
                  className="mb-0"
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    fontFamily: "nexa",
                  }}
                >
                  Update new Geo Deals
                </p>
              </div>

              <div className="modal-body" style={{ fontFamily: "poppins" }}>
                <div
                  style={{
                    wordWrap: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                  className="d-flex justify-content-center w-100"
                >
                  <div className="w-100  createGeoDealsPopupBody">
                    <div className="row">
                      <div className="col-6 mb-3">
                        <label>Location</label>
                        <input
                          className="form-control "
                          style={{ background: "whitesmoke" }}
                          readOnly={true}
                          value={editForm?.location}
                        />
                      </div>
                      <div className="col-6 mb-3">
                        <label>Time Choice</label>
                        <select
                          className="form-control"
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              time_choice: e?.target?.value,
                            })
                          }
                          value={editForm?.time_choice}
                        >
                          <option value="">Select</option>
                          <option value="pickupat">Pickup</option>
                          <option value="dropoffby">Drop-off</option>
                        </select>
                      </div>
                      <div className="col-6 mb-3">
                        <label>Category</label>
                        <MultiSelect
                          options={[
                            { label: "Sharing", value: "1" },
                            { label: "Personal", value: "2" },
                          ]}
                          value={editSelectedCategories}
                          onChange={setEditSelectedCategories}
                          labelledBy="Select Ride Category"
                          hasSelectAll={true}
                          overrideStrings={{
                            selectSomeItems: "Select Category", // Placeholder text
                            allItemsAreSelected: "All categories are selected",
                            selectAll: "Select All",
                            search: "Search ...",
                          }}
                        />
                        
                      </div>
                      <div className="col-6 mb-3">
                        <label>Status</label>
                        <select
                          className="form-control"
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              status: e?.target?.value,
                            })
                          }
                          value={editForm?.status}
                        >
                          <option value="">Select</option>
                          <option value="active">Active</option>
                          <option value="inactive">In-Active</option>
                        </select>
                      </div>
                      <div className="col-6 mb-3">
                        <label>Discount</label>
                        <input
                          className="form-control"
                          type="number"
                          min={0}
                          max={100}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              discount_amount: e?.target?.value,
                            })
                          }
                          value={editForm?.discount_amount}
                        />
                      </div>
                      <div className="col-6 mb-3">
                        <label>Deals Date & Time</label>
                        <div className="d-flex ">
                          <input
                            className="form-control "
                            type="date"
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                start_date: e?.target?.value,
                              })
                            }
                            value={editForm?.start_date}
                          />
                          
                        </div>
                      </div>
                      <div className="col-6 mb-3">
                        <label>Discount Message</label>
                        <textarea
                          className="form-control"
                         rows={5}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              discount_message: e?.target?.value,
                            })
                          }
                          value={editForm?.discount_message}
                        />
                      </div>
                      <div className="col-6 mb-3">
                        <div className="timeInputGroup">
                          <div
                            className=""
                            style={{ maxHeight: "120px", overflowY: "scroll" }}
                          >
                            {editForm?.deal_times?.map((v, i) => {
                              return (
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                  <input value={v} readOnly />
                                  <button
                                    onClick={() => {
                                      const updatedTimes =
                                        editForm.deal_times.filter(
                                          (_, index) => index !== i
                                        );
                                      setFormData({
                                        ...editForm,
                                        deal_times: updatedTimes,
                                      });
                                    }}
                                  >
                                    Remove
                                  </button>
                                </div>
                              );
                            })}
                          </div>

                          <div className="d-flex align-items-center justify-content-between pt-2">
                            <input
                              value={editForm?.new_time || ""}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  new_time: e.target.value,
                                })
                              }
                              type="time"
                            />
                            <button
                              onClick={() => {
                                if (editForm?.new_time) {
                                  const updatedTimes = [
                                    ...(editForm.deal_times || []),
                                    editForm.new_time,
                                  ];
                                  setEditForm({
                                    ...editForm,
                                    deal_times: updatedTimes,
                                    new_time: "",
                                  });
                                }
                              }}
                            >
                              <i className="fa fa-plus me-2"></i> Add Time
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-end geoDealsButtonGroup">
                  <button
                    onClick={() => {
                      setEditForm({
                        lat: "",
                        long: "",
                        location: "",
                        province: "",
                        discount_amount: "",
                        discount_message: "",
                        ride_categories: [],
                        start_date: "",
                        time_choice: "",
                        deal_times:[],
                        status: "",
                        id: "",
                      });
                      setSelectedCategories([]);
                    }}
                  >
                    Cancel
                  </button>
                  {editForm?.location &&
                  editForm?.discount_amount &&
                  editSelectedCategories?.length > 0 &&
                  editForm?.discount_message &&
                  
                  editForm?.start_date &&
                  editForm?.deal_times?.length>0 &&
                  editForm?.status ? (
                    isEditSubmiting ? (
                      <button
                        className="ms-3"
                        style={{
                          background: "#1C1C1C",
                          color: "#fff",
                          opacity: "0.5",
                        }}
                      >
                        Updating ...
                      </button>
                    ) : (
                      <button
                        className="ms-3"
                        style={{ background: "#1C1C1C", color: "#fff" }}
                        onClick={() => handleUpdateGeoDeal()}
                      >
                        Update
                      </button>
                    )
                  ) : (
                    <button
                      className="ms-3"
                      style={{
                        background: "#1C1C1C",
                        color: "#fff",
                        opacity: "0.5",
                      }}
                    >
                      Update
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {editForm?.id && <div className="modal-backdrop fade show"></div>}
    </div>
  );
  return (
    <div className="main_layout  bgBlack d-flex">
      {/* sidebar started */}
      <Sidebar selectedItem="Settings" />
      {/* sidebar ended */}

      {/* sectionLayout started */}
      <section
        className="section_layout"
        style={{
          marginLeft: globalState?.isFillSidebarWidth100 ? "260px" : "80px",
        }}
      >
        {/* top nav started  */}
        <TopNav
          navItems={navItems}
          navColor="#fff"
          navBg="orange"
          divideRowClass="col-xl-6 col-lg-6 col-md-6 col-6"
          selectedItem="Province"
          sectedNavBg="#fff"
          selectedNavColor="#030303"
          isItemMoreThen8={true}
        />
        {/* top nav ended  */}
        {/* table List started */}
        <div className="tableMain">
          <div
            className="tableBody py-2 px-4 borderRadius50All"
            style={{ background: "#F3F3F3" }}
          >
            <div className="row mx-0 p-0  marginY35">
              <div className="col-lg-8 row m-0 p-0">
                <div className="col-lg-6  m-0 ">
                  <div className="d-flex justify-content-between align-items-center locationSearchBtn">
                    <input
                      placeholder="Search Source"
                      style={{ width: "70%" }}
                      onChange={(e) => handleSearch(e.target.value)}
                      value={query}
                      readOnly={formData?.name}
                    />
                    {formData?.name ? (
                      <i
                        className="fa fa-close"
                        onClick={() => {
                          setFormData({
                            name: "",
                            long: "",
                            lat: "",
                          });
                          setQuery("");
                          setLocation([]);
                        }}
                      ></i>
                    ) : (
                      <img src="https://cdn-icons-png.flaticon.com/128/751/751463.png" />
                    )}
                  </div>
                  {location.length > 0 && formData?.name == "" && (
                    <ul className="priceCityUl shadow-sm">
                      {location.map((v, i) => {
                        const stateComponent = v?.address_components.find(
                          (component) =>
                            component.types.includes(
                              "administrative_area_level_1"
                            )
                        );

                        // Only render if the state component is found
                        return stateComponent ? (
                          <li
                            onClick={() => {
                              setQuery(stateComponent.long_name);
                              setFormData({
                                name: stateComponent.long_name,
                                long: v?.geometry?.location.lng,
                                lat: v?.geometry?.location.lat,
                              });
                            }}
                            key={i}
                          >
                            {stateComponent.long_name}
                          </li>
                        ) : null;
                      })}
                    </ul>
                  )}
                </div>
                <div className="col-lg-4 m-0 ">
                  <div className="d-flex justify-content-between align-items-center ">
                    {showLoader ? (
                      <button
                        className="btn btn-success w-100 bgSuccess disabled"
                        style={{ opacity: "0.8" }}
                      >
                        <div
                          className="spinner-border text-light me-2"
                          role="status"
                          style={{ height: "15px", width: "15px" }}
                        ></div>
                        Submitting. . .
                      </button>
                    ) : (
                      <button
                        className="btn btn-success w-100 bgSuccess"
                        onClick={() => {
                          handleSubmitProvince();
                        }}
                        style={{ border: "none" }}
                      >
                        Submit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ margin: "0px 10px" }}>
              <table className="table">
                <thead>
                  <tr style={{ background: "#DCE4E7" }}>
                    <th scope="col" style={{ borderRadius: "8px 0px 0px 8px" }}>
                      Sr. No
                    </th>
                    <th scope="col">Province</th>
                    <th scope="col" style={{ borderRadius: "0px 8px 8px 0px" }}>
                      <div className="d-flex justify-content-end align-items-center me-4">
                        Action
                      </div>
                    </th>
                  </tr>
                </thead>
                <div className="py-2"></div>
                <tbody>
                  {showSkelton
                    ? // Show Skeletons while loading
                      Array.from({ length: 5 }).map((_, index) => (
                        <tr key={index}>
                          <td>
                            <Skeleton width={20} height={25} />
                          </td>
                          <td>
                            <Skeleton width={100} height={25} />
                          </td>
                          <td className="d-flex justify-content-end align-items-center">
                            <Skeleton width={50} height={25} />
                          </td>
                        </tr>
                      ))
                    : // Render province list when loaded
                      provinceList.map((v, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{v?.name}</td>
                          <td className="d-flex justify-content-end align-items-center">
                            <button
                              className="p-2"
                              onClick={() => handleProvinceDeleteFunc(v?.id)}
                              style={{
                                background: "#E8210A",
                                fontSize: "12px",
                                color: "#fff",
                                border: "none",
                                width: "100px",
                                borderRadius: "7px",
                                marginTop: "-6px",
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* table List ended */}
      </section>
      {/* sectionLayout ended */}
    </div>
  );
}

export default GeoDeals;
