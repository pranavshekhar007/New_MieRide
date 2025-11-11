import axios from "axios";

import { BASE_URL } from "../../src/utils/api_base_url_configration";

const access_token = localStorage.getItem("access_token");

const config = {
  headers: {
    "Content-Type": "multipart/form-data",
    Accept: "application/json",
    Authorization: `Bearer ${access_token}`,
  },
};
const getConfig = () => {
  return {
    headers: {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
      Authorization: `Bearer ${JSON.parse(localStorage.getItem("access_token"))}`,
    },
  };
};

export const getDriverRouteListServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "list-driver-share-route",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const updateDriverRouteServ = async (payload) => {
    try {
      const response = await axios.post(BASE_URL + "update-driver-share-route",payload, getConfig());
      return response;
    } catch (error) {
      // Handle error (e.g., log or throw an error)
      console.error("Error fetching data:", error);
      throw error;
    }
};


export const getDriverAvailabilityListServ = async (payload) => {
    try {
      const response = await axios.post(BASE_URL + "list-driver-availability",payload, getConfig());
      return response;
    } catch (error) {
      // Handle error (e.g., log or throw an error)
      console.error("Error fetching data:", error);
      throw error;
    }
  };
  export const deleteDriverAvailability = async (payload) => {
    try {
      const response = await axios.post(BASE_URL + "delete-driver-availability",payload, getConfig());
      return response;
    } catch (error) {
      // Handle error (e.g., log or throw an error)
      console.error("Error fetching data:", error);
      throw error;
    }
  };
  export const getRouteByGroupIdServ = async (payload) => {
    try {
      const response = await axios.post(BASE_URL + "get-route-bookings-by-group-id",payload, getConfig());
      return response;
    } catch (error) {
      // Handle error (e.g., log or throw an error)
      console.error("Error fetching data:", error);
      throw error;
    }
  };
  export const updateDriverAvailabilityServ = async (payload) => {
    try {
      const response = await axios.post(BASE_URL + "update-driver-availability",payload, getConfig());
      return response;
    } catch (error) {
      // Handle error (e.g., log or throw an error)
      console.error("Error fetching data:", error);
      throw error;
    }
};

export const getOutOfAreaListServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "list-out-of-area-records",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getBookingRecordServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "get-booking-records",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getGroupBookingRecordServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "get-sharing-booking-group",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getMissedBookingRecordServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "get-missed-booking-by-group", payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getCompletedBookingRecordServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "get-completed-booking-by-group",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getCompletedBookingRecordServFlatedArray = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "get-completed-booking-by-group",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getCanceledBookingRecordServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "get-canceled-booking-by-group",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const cancelRefundServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "refund-user-cancellation-charge",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getEnrouteBookingRecordServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "get-enroute-booking-by-group",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getAssignedBookingRecordServ = async () => {
  try {
    const response = await axios.post(BASE_URL + "get-assigned-booking-by-group",{}, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getAcceptedBookingRecordServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "get-accepted-booking-by-group",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getManualBookingRecordServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "get-manual-booking-by-group",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const createMannualOptimiseRouteServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "create-mannual-optimize-route",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getBookingListForMnualAssign = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "fetch-blank-group-for-manual-assign",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getBookingListForReverceGroup = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "fetch-blank-group-for-reverse-group",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const mergeReverseGroupServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "merge-reverse-groups",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const assignBookingToExistingGroupServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "assign-booking-to-existing-group",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const mergeBookingToExistingGroupServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "merge-booking-to-any-existing-group",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const unlinkGroupServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "unlink-booking-from-group",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const cancelSharingBookingServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "cancel-sharing-booking-by-admin",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const switchRideServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "send-switch-ride-request",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const switchTimeRideServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "send-switch-time-slot-request",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getUpcomingDateServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "get-sharing-upcoming-group-dates",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getGroupRouteRecordServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "get-booking-routes",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const assignDriverManuallyServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "assign-driver-logic-mannual",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const selectDriverManuallyServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "assign-driver-to-manual-bookings",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};


export const continueWithSameDriverServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "continue-with-same-driver",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const reassignDriverForMissedBookingServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "reassign-driver-for-missed-booking",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const sendBookingToManual = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "send-bookings-to-manual", formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};