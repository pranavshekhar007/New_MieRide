import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import TableNav from "../../components/TableNav";
import { getDriverRewiewServ } from "../../services/driver.services";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";
import { useGlobalState } from "../../GlobalProvider";
import { Image_Base_Url } from "../../utils/api_base_url_configration";
import NoRecordFound from "../../components/NoRecordFound"
function DriverRating() {
  const { setGlobalState, globalState } = useGlobalState();
  const params = useParams();
  const tableNav = [
    {
      name: "Profile",
      path: `/driver-profile/${params?.id}`,
    },
    {
      name: "Document",
      path: `/driver-document/${params?.id}`,
    },
    {
      name: "Account",
      path: `/driver-account/${params?.id}`,
    },
    {
      name: "Rating",
      path: `/driver-rating/${params?.id}`,
    },
    {
      name: "Transaction History",
      path: `/driver-transaction-history/${params?.id}`,
    },
    {
      name: "Updated Fields",
      path: `/driver-updated-fields/${params?.id}`,
    },
  ];
  const [showSkelton, setShowSkelton] = useState(false);
  const [reviewData, setReviewData] = useState();
  const handleGetDriverReviwFunc = async () => {
    setShowSkelton(true);
    try {
      let response = await getDriverRewiewServ({ driver_id: params?.id });
      if (response?.data?.statusCode == "200") {
        setReviewData(response?.data?.data);
      }
    } catch (error) {}
    setShowSkelton(false);
  };
  useEffect(() => {
    handleGetDriverReviwFunc();
  }, []);
  const renderStar = (count) => {
    if (count == 0) {
      return (
        <div className="d-flex justify-content-between ">
          <i className="fa fa-star "></i>
          <i className="fa fa-star "></i>
          <i className="fa fa-star "></i>
          <i className="fa fa-star"></i>
          <i className="fa fa-star"></i>
        </div>
      );
    }
    if (count == 1) {
      return (
        <div className="d-flex justify-content-between ">
          <i className="fa fa-star textSuccess"></i>
          <i className="fa fa-star "></i>
          <i className="fa fa-star "></i>
          <i className="fa fa-star"></i>
          <i className="fa fa-star"></i>
        </div>
      );
    }
    if (count == 2) {
      return (
        <div className="d-flex justify-content-between ">
          <i className="fa fa-star textSuccess"></i>
          <i className="fa fa-star textSuccess"></i>
          <i className="fa fa-star "></i>
          <i className="fa fa-star"></i>
          <i className="fa fa-star"></i>
        </div>
      );
    }
    if (count == 3) {
      return (
        <div className="d-flex justify-content-between ">
          <i className="fa fa-star textSuccess"></i>
          <i className="fa fa-star textSuccess"></i>
          <i className="fa fa-star textSuccess"></i>
          <i className="fa fa-star"></i>
          <i className="fa fa-star"></i>
        </div>
      );
    }

    if (count == 4) {
      return (
        <div className="d-flex justify-content-between ">
          <i className="fa fa-star textSuccess"></i>
          <i className="fa fa-star textSuccess"></i>
          <i className="fa fa-star textSuccess"></i>
          <i className="fa fa-star textSuccess"></i>
          <i className="fa fa-star"></i>
        </div>
      );
    }

    if (count == 5) {
      return (
        <div className="d-flex justify-content-between ">
          <i className="fa fa-star textSuccess"></i>
          <i className="fa fa-star textSuccess"></i>
          <i className="fa fa-star textSuccess"></i>
          <i className="fa fa-star textSuccess"></i>
          <i className="fa fa-star textSuccess"></i>
        </div>
      );
    }
  };
  return (
    <div className="main_layout  bgBlack d-flex">
      {/* sidebar started */}
      <Sidebar selectedItem="Driver" />
      {/* sidebar ended */}

      {/* sectionLayout started */}
      <section
        className="section_layout"
        style={{ marginLeft: globalState?.isFillSidebarWidth100 ? "260px" : "80px", minWidth: "1400px" }}
      >
        {/* top nav started  */}

        {/* top nav ended  */}
        {/* table List started */}
        <div className="">
          <TableNav tableNav={tableNav} selectedItem="Rating" sectedItemBg="#FDEEE7" />
          <div className="tableBody py-2 px-4 borderRadius50All" style={{ background: "#FDEEE7" }}>
            <div className=" p-5 px-4 my-4" style={{ borderRadius: "20px", background: "#fff" }}>
              {reviewData && !showSkelton ? <div className="row m-0 p-0">
                <div className="col-6 ">
                  <div className="ratigBox d-flex align-items-center justify-content-center">
                    <div className="ratingBlackBox shadow d-flex justify-content-center align-items-center">
                      <div>{reviewData?.average_rating}</div>
                    </div>
                    <div className="starBox">{renderStar(reviewData?.average_rating)}</div>
                  </div>

                  <div className="d-flex align-items-center my-5">
                    <div style={{ width: "20%" }} className="text-center">
                      5 Star
                    </div>
                    <div
                      className=""
                      style={{ width: "80%", background: "#F3F3F3", borderRadius: "8px", height: "30px" }}
                    >
                      <div
                        style={{
                          height: "30px",
                          background: "#139F01",
                          width: reviewData?.rating_percentages[5] + "%",
                          borderRadius: "8px",
                        }}
                      ></div>
                    </div>
                    <div style={{ width: "20%" }} className="text-center">
                      {reviewData?.rating_percentages[5]}%
                    </div>
                  </div>
                  <div className="d-flex align-items-center my-5">
                    <div style={{ width: "20%" }} className="text-center">
                      4 Star
                    </div>
                    <div
                      className=""
                      style={{ width: "80%", background: "#F3F3F3", borderRadius: "8px", height: "30px" }}
                    >
                      <div
                        style={{
                          height: "30px",
                          background: "#139F01",
                          width: reviewData?.rating_percentages[4] + "%",
                          borderRadius: "8px",
                        }}
                      ></div>
                    </div>
                    <div style={{ width: "20%" }} className="text-center">
                      {reviewData?.rating_percentages[4]}%
                    </div>
                  </div>
                  <div className="d-flex align-items-center my-5">
                    <div style={{ width: "20%" }} className="text-center">
                      3 Star
                    </div>
                    <div
                      className=""
                      style={{ width: "80%", background: "#F3F3F3", borderRadius: "8px", height: "30px" }}
                    >
                      <div
                        style={{
                          height: "30px",
                          background: "#139F01",
                          width: reviewData?.rating_percentages[3] + "%",
                          borderRadius: "8px",
                        }}
                      ></div>
                    </div>
                    <div style={{ width: "20%" }} className="text-center">
                      {reviewData?.rating_percentages[3]}%
                    </div>
                  </div>
                  <div className="d-flex align-items-center my-5">
                    <div style={{ width: "20%" }} className="text-center">
                      2 Star
                    </div>
                    <div
                      className=""
                      style={{ width: "80%", background: "#F3F3F3", borderRadius: "8px", height: "30px" }}
                    >
                      <div
                        style={{
                          height: "30px",
                          background: "#139F01",
                          width: reviewData?.rating_percentages[2] + "%",
                          borderRadius: "8px",
                        }}
                      ></div>
                    </div>
                    <div style={{ width: "20%" }} className="text-center">
                      {reviewData?.rating_percentages[2]}%
                    </div>
                  </div>
                  <div className="d-flex align-items-center my-5">
                    <div style={{ width: "20%" }} className="text-center">
                      1 Star
                    </div>
                    <div
                      className=""
                      style={{ width: "80%", background: "#F3F3F3", borderRadius: "8px", height: "30px" }}
                    >
                      <div
                        style={{
                          height: "30px",
                          background: "#139F01",
                          width: reviewData?.rating_percentages[1] + "%",
                          borderRadius: "8px",
                        }}
                      ></div>
                    </div>
                    <div style={{ width: "20%" }} className="text-center">
                      {reviewData?.rating_percentages[1]}%
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="ratigBox h-100">
                    <h4 className="text-center mb-4">Reviews</h4>
                    {showSkelton
                      ? [1, 2, 3, 4, 5]?.map(() => {
                          return (
                            <div className="reviewBox d-flex align-items-center " style={{ margin: "10px 0px" }}>
                              <div>
                                <Skeleton width={50} height={50} borderRadius={50} />
                              </div>
                              <div className="w-100 ms-2">
                                <div className="d-flex justify-content-between w-100">
                                  <div>
                                    <i className="fa fa-star text-secondary"></i>
                                    <i className="fa fa-star text-secondary"></i>
                                    <i className="fa fa-star text-secondary"></i>
                                    <i className="fa fa-star text-secondary"></i>
                                    <i className="fa fa-star text-secondary"></i>
                                    <Skeleton width={100} />
                                  </div>
                                  <Skeleton width={40} />
                                </div>
                                <div className="mt-1 me-4">
                                  <Skeleton width="100%" />
                                </div>
                              </div>
                            </div>
                          );
                        })
                      : reviewData?.reviews?.map((v, i) => {
                          return (
                            <div className="reviewBox d-flex align-items-center " style={{ margin: "10px 0px" }}>
                              <div>
                                <img
                                  style={{ borderRadius: "50%", height: "50px", width: "50px" }}
                                  src={
                                    v?.user_details?.image
                                      ? Image_Base_Url + v?.user_details?.image
                                      : "https://cdn-icons-png.flaticon.com/128/3687/3687416.png"
                                  }
                                />
                              </div>
                              <div className="w-100 ms-2">
                                <div className="d-flex justify-content-between w-100">
                                  <div className="d-flex">
                                    {renderStar(v?.driver_rating)}

                                    <b className="ms-2" style={{ fontSize: "18px", marginTop: "-5px" }}>
                                      {v?.user_details?.first_name + " " + v?.user_details?.last_name}
                                    </b>
                                  </div>
                                  <p className="mb-0">1 day ago</p>
                                </div>
                                <p className="mb-0 mt-1">{v?.driver_feedback}</p>
                              </div>
                            </div>
                          );
                        })}
                  </div>
                </div>
              </div>:
              <NoRecordFound/>}
              
            </div>
          </div>
        </div>
        {/* table List ended */}
      </section>
      {/* sectionLayout ended */}
    </div>
  );
}

export default DriverRating;
