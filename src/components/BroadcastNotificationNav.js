import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { createScheduleNotification } from "../services/broadcast.service";
import { toast } from "react-toastify";
function BroadcastNotificationNav({
  navBg,
  navItems,
  sectedNavBg,
  selectedItem,
  selectedNavColor,
  navColor,
  payload,
  getScheduledNotificationFunc
}) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    show: false,
    user_type: payload?.user_type,
    title: "",
    message: "",
    type: payload?.type,
    scheduled_date: "",
    scheduled_times: [],
    status: "1",
    category:payload?.category,
  });
  const [loader, setLoader] = useState(false);
  const handleCreateNotification = async () => {
    setLoader(true);
    try {
      let response = await createScheduleNotification({
        ...formData,
        scheduled_times: [JSON.parse(formData?.scheduled_times)[0]],
      });
      if (response?.data?.statusCode=="200") {
        toast.success(response?.data?.message);
        getScheduledNotificationFunc()
        setFormData({
          show: false,
          user_type: payload?.user_type,
          title: "",
          message: "",
          type: payload?.type,
          scheduled_date: "",
          scheduled_times: [],
          status: "1",
          category:payload?.category
        });
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
    setLoader(false);
  };
  return (
    <div className="row">
      <div className="col-10 " style={{ marginTop: "0px" }}>
        <nav className="topNavMain " style={{ background: navBg }}>
          <div className="row m-0 p-1  ">
            {navItems?.map((v, i) => {
              return (
                <div className="col-lg-2  m-0 p-0">
                  <div
                    onClick={() => navigate(v?.path)}
                    className=" navItem d-flex justify-content-center align-items-center"
                    style={{
                      background: v?.name == selectedItem ? sectedNavBg : "",
                    }}
                  >
                    <p
                      className="mb-0 "
                      style={{
                        color:
                          v?.name == selectedItem ? selectedNavColor : navColor,
                      }}
                    >
                      {v?.name}
                    </p>
                    {v?.notificationLength > 0 && (
                      <div
                        className=" d-flex justify-content-center align-items-center"
                        style={{
                          fontSize: "10px",
                          height: "16px",
                          width: "16px",
                          borderRadius: "50%",
                          background: "#FB000C",
                          position: "relative",
                          top: "10px",
                          left: "0px",
                        }}
                      >
                        <span className="text-light">
                          {v?.notificationLength}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </nav>
      </div>
      <div className="col-2 my-auto">
        <button
          className="notificationBtn "
          onClick={() => setFormData({ ...formData, show: true })}
        >
          <img src="/icons/greenPlusIcon.png" />
          <span>Notification</span>
        </button>
      </div>
      {formData?.show && (
        <div
          className="modal fade show d-flex align-items-center manualSetPopup  justify-content-center "
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div
              className="modal-content"
              style={{
                borderRadius: "20px",
                // background: "#353535",
                width: "580px",
              }}
            >
              <div className="modal-body p-0" style={{ fontFamily: "poppins" }}>
                <div
                  style={{
                    wordWrap: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                  className="d-flex justify-content-center w-100"
                >
                  <div
                    className="w-100"
                    style={{
                      borderRadius: "15px 15px 0px 0px",
                      padding: "20px",
                      background: "#353535",
                      color: "#fff",
                    }}
                  >
                    <p className="text-center">Create Notification</p>
                  </div>
                </div>
                <div className="notificationFormContent">
                  <div className="d-flex justify-content-between">
                    <div className="categorySelectedDiv">{selectedItem}</div>
                  </div>
                  <input
                    className="form-control my-3"
                    placeholder="Enter Title"
                    value={formData?.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        title: e?.target.value,
                      })
                    }
                  />
                  <textarea
                    className="form-control"
                    placeholder="Enter Message"
                    value={formData?.message}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        message: e?.target.value,
                      })
                    }
                  />
                  <div className="my-3">
                    <label>Schedule Date & Time</label>
                    <div className="d-flex">
                      <input
                        className="form-control me-2"
                        type="date"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            scheduled_date: e?.target?.value,
                          })
                        }
                      />
                      <input
                        className="form-control ms-2"
                        type="time"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            scheduled_times: JSON.stringify([e.target.value]),
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="d-flex justify-content-end notificationFormActionBtn mt-4">
                    <button
                      onClick={() => setFormData(null)}
                      style={{ background: "#fff" }}
                      className="me-4"
                    >
                      Cancel
                    </button>
                    {formData?.title &&
                    formData?.message &&
                    formData?.scheduled_date &&
                    formData?.scheduled_times ? (
                      loader ? (
                        <button
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
                          onClick={handleCreateNotification}
                          style={{ background: "#1C1C1C", color: "#fff" }}
                        >
                          Schedule
                        </button>
                      )
                    ) : (
                      <button
                        onClick={handleCreateNotification}
                        style={{
                          background: "#1C1C1C",
                          color: "#fff",
                          opacity: "0.5",
                        }}
                      >
                        Schedule
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {formData?.show && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}

export default BroadcastNotificationNav;
