import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import TopNav from "../../../components/TopNav";
import TableNav from "../../../components/TableNav";
import {
  getSurgesListServ,
  addSurgesServ,
  deleteSurgesServ,
  editSurgesServ,
} from "../../../services/priceAndCity.services";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import { useGlobalState } from "../../../GlobalProvider";
function PersonalSharingSurges() {
  const { setGlobalState, globalState } = useGlobalState();
  const navItems = [
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
      name: "Surges",
      path: "/pricing-sharing-surges",
    },
    {
      name: "Commission",
      path: "/pricing-commission",
    },
   
    {
      name: "Interac Id",
      path: "/pricing-iterac-id",
    },
    {
      name: "Payout Info",
      path: "/pricing-payout-info",
    },
    {
      name: "Cancel",
      path: "/pricing-cancel",
    },
    {
      name: "Price Calculator",
      path: "/pricing-calculator",
    },
  ];
  const tableNav = [
    {
      name: "Sharing",
      path: "/pricing-sharing-surges",
    },
    {
      name: "Personal",
      path: "/pricing-personal-surges",
    },
    {
      name: "To Airport",
      path: "/pricing-to-airport-surges",
    },
    {
      name: "From Airport",
      path: "/pricing-from-airport-surges",
    },
    {
      name: "Drive Test",
      path: "/pricing-drive-test-surges",
    },
    {
      name: "Intercity",
      path: "/pricing-intercity-surges",
    },
  ];
  const [showSkelton, setShowSkelton] = useState(false);
  const [surgesList, setSurgesList] = useState([]);
  const getSurgesListFunc = async () => {
    if (surgesList.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await getSurgesListServ({ category_id: 1 });
      if (response?.data?.statusCode == "200") {
        setSurgesList(response?.data?.data);
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
    setShowSkelton(false);
  };
  useEffect(() => {
    getSurgesListFunc();
  }, []);
  const [formData, setFormData] = useState({
    category_id: "1",
    title: "",
    time: "",
    charge: "",
  });
  const handleAddSurge = async () => {
    try {
      let response = await addSurgesServ(formData);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        setFormData({
          category_id: "1",
          title: "",
          time: "",
          charge: "",
        });
        getSurgesListFunc();
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
  };
  const deleteSurgeFunc = async (id) => {
    // Ask for confirmation before deleting
    const isConfirmed = window.confirm("Are you sure you want to delete this surge?");

    if (isConfirmed) {
      try {
        let response = await deleteSurgesServ(id);
        if (response?.data?.statusCode == "200") {
          toast.success(response?.data?.message);
          getSurgesListFunc(); // Refresh the list after successful delete
        }
      } catch (error) {
        toast.error("Internal Server Error");
      }
    }
  };
  const [editFormData, setEditFormData] = useState({
    title: "",
    time: "",
    charge: "",
    category_id: "1",
    id: "",
  });
  const handleEditSurge = async () => {
    try {
      let response = await editSurgesServ(editFormData);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        setEditFormData({
          title: "",
          time: "",
          charge: "",
          category_id: "1",
          id: "",
        });
        getSurgesListFunc();
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
  };
  const [actionValue, setActionValue]=useState("")
  return (
    <div className="main_layout  bgBlack d-flex">
      {/* sidebar started */}
      <Sidebar selectedItem="Settings" />
      {/* sidebar ended */}

      {/* sectionLayout started */}
      <section className="section_layout" style={{ marginLeft :globalState?.isFillSidebarWidth100 ? "260px": "80px" }}>
        {/* top nav started  */}
        <TopNav
          navItems={navItems}
          navColor="#fff"
          navBg="#A5754D"
          divideRowClass="col-xl-6 col-lg-6 col-md-6 col-6"
          selectedItem="Surges"
          sectedNavBg="#fff"
          selectedNavColor="#030303"
          isItemMoreThen8={true}
        />
        {/* top nav ended  */}
        {/* table List started */}
        <div className="tableMain">
          <TableNav tableNav={tableNav} selectedItem="Sharing" sectedItemBg="#F3F3F3" />
          <div className="tableBody py-2 px-4 borderRadius50exceptTopLeft" style={{ background: "#F3F3F3" }}>
            {/* <div className="row mx-0 p-0  marginY35">
              <div className="col-lg-8 row m-0 p-0">
                <div className="col-lg-4  m-0 ">
                  <div className="d-flex justify-content-between align-items-center locationSearchBtn">
                    <input
                      placeholder="Surge Title"
                      style={{ width: "100%" }}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      value={formData?.title}
                    />
                  </div>
                </div>
                <div className="col-lg-4 m-0">
                  <div className="d-flex justify-content-between align-items-center locationSearchBtn">
                    <input
                      placeholder="Surge Time"
                      style={{ width: "100%" }}
                      type="number"
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      value={formData?.time}
                    />
                  </div>
                </div>
                <div className="col-lg-3 m-0 ">
                  <div className="d-flex justify-content-between align-items-center locationSearchBtn">
                    <input
                      placeholder="Charges"
                      style={{ width: "100%" }}
                      type="number"
                      onChange={(e) => setFormData({ ...formData, charge: e.target.value })}
                      value={formData?.charge}
                    />
                    <p className="mb-0 me-2">%</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-2 m-0 ">
                <div className="d-flex justify-content-between align-items-center ">
                  {formData.charge && formData.time && formData.time ? (
                    <button
                      onClick={handleAddSurge}
                      className="btn btn-success w-100 bgSuccess"
                      style={{ border: "none" }}
                    >
                      Submit
                    </button>
                  ) : (
                    <button className="btn btn-success w-100 bgSuccess" style={{ border: "none", opacity: "0.5" }}>
                      Submit
                    </button>
                  )}
                </div>
              </div>
            </div> */}

            <div style={{ margin: "20px 10px" }}>
              <table className="table">
                <thead>
                  <tr style={{ background: "#DDDDDB" }}>
                    <th scope="col" style={{ borderRadius: "8px 0px 0px 8px" }}>
                      Sr. No
                    </th>
                    <th scope="col">Surge Title</th>
                    <th scope="col">Surge Time</th>
                    <th scope="col">Charges %</th>
                    <th scope="col" style={{ borderRadius: "0px 8px 8px 0px" }}>
                      Action
                    </th>
                  </tr>
                </thead>
                <div className="py-2"></div>
                <tbody className="driverTable">
                  {showSkelton
                    ? Array.from({ length: 5 }).map((_, index) => (
                        <tr key={index}>
                          <td>
                            <Skeleton width={20} />
                          </td>
                          <td>
                            <Skeleton width={80} />
                          </td>
                          <td>
                            <Skeleton width={80} />
                          </td>
                          <td>
                            <Skeleton width={80} />
                          </td>
                          <td>
                            <Skeleton width={80} />
                          </td>
                        </tr>
                      ))
                    : surgesList?.map((v, i) => {
                        return (
                          <tr style={{ background: i % 2 !== 0 ? "#EBE6E2" : "#F3F3F3", cursor: "pointer" }}>
                            <td style={{ borderRadius: "12px 0px 0px 12px" }}>{i + 1}</td>
                            <td>{v?.title}</td>
                            <td>{v?.time}</td>

                            <td>{v?.charge}</td>

                            <td style={{ borderRadius: "0px 12px 12px 0px" }}>
                              <div className="d-flex justify-content-center align-items-center">
                                <select
                                value={actionValue}
                                  onChange={(e) => {
                                    if (e.target.value === "Delete") {
                                      deleteSurgeFunc(v?.id);
                                      setActionValue("")
                                    } else if (e.target.value === "Edit") {
                                      setEditFormData({
                                        title: v?.title,
                                        time: v?.time,
                                        charge: v?.charge,
                                        category_id: "1",
                                        id: v?.id,
                                      });
                                      setActionValue("")
                                    }
                                  }}
                                >
                                  <option value="">Action</option>
                                  <option value="Edit">Edit</option>
                                  <option value="Delete">Delete</option>
                                </select>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* table List ended */}
      </section>
      {/* view transaction socument popup start */}
      {/* Modal */}
      {editFormData.id && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Surge</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() =>
                    setEditFormData({
                      title: "",
                      time: "",
                      charge: "",
                      category_id: "1",
                      id: "",
                    })
                  }
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <label>Surge Title</label>
                <input
                  className="form-control mb-3"
                  value={editFormData?.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                />
                <label>Surge Time</label>
                <input
                  className="form-control mb-3"
                  value={editFormData?.time}
                  onChange={(e) => setEditFormData({ ...editFormData, time: e.target.value })}
                  type="number"
                />
                <label>Charge</label>
                <input
                  className="form-control"
                  value={editFormData?.charge}
                  onChange={(e) => setEditFormData({ ...editFormData, charge: e.target.value })}
                  type="number"
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() =>
                    setEditFormData({
                      title: "",
                      time: "",
                      charge: "",
                      category_id: "1",
                      id: "",
                    })
                  }
                >
                  Close
                </button>
                {editFormData.charge && editFormData.time && editFormData.time ? (
                  <button onClick={handleEditSurge} type="button" className="btn btn-primary">
                    Submit
                  </button>
                ) : (
                  <button type="button" className="btn btn-primary" style={{ opacity: "0.5" }}>
                    Submit
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* view transaction socument popup end*/}
      {/* sectionLayout ended */}
    </div>
  );
}

export default PersonalSharingSurges;
