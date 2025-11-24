import axios from "axios";

import { BASE_URL } from "../utils/api_base_url_configration";

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

export const storePersonalRideOperationalCityServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "store-personal-ride-operational-city",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const storePersonalRideRateServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "store-personal-ride-price",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getPriceRateOfPersonalServ = async () => {
    try {
      const response = await axios.get(BASE_URL + "list-personal-ride-price", getConfig());
      return response;
    } catch (error) {
      // Handle error (e.g., log or throw an error)
      console.error("Error fetching data:", error);
      throw error;
    }
};
export const getPersonalLaterListServ = async (payload) => {
    try {
      const response = await axios.post(BASE_URL + "get-personal-confirmed-booking-later",payload, getConfig());
      return response;
    } catch (error) {
      // Handle error (e.g., log or throw an error)
      console.error("Error fetching data:", error);
      throw error;
    }
};
export const getUnacceptedPersonalListServ = async (payload) => {
    try {
      const response = await axios.post(BASE_URL + "get-personal-unaccepted-booking",payload, getConfig());
      return response;
    } catch (error) {
      // Handle error (e.g., log or throw an error)
      console.error("Error fetching data:", error);
      throw error;
    }
};
export const assignPersonalDriverServ = async (payload) => {
    try {
      const response = await axios.post(BASE_URL + "assign-personal-booking-by-admin",payload, getConfig());
      return response;
    } catch (error) {
      // Handle error (e.g., log or throw an error)
      console.error("Error fetching data:", error);
      throw error;
    }
};
export const manualPersonalDriverServ = async (payload) => {
    try {
      const response = await axios.post(BASE_URL + "send-personal-booking-to-manual",payload, getConfig());
      return response;
    } catch (error) {
      // Handle error (e.g., log or throw an error)
      console.error("Error fetching data:", error);
      throw error;
    }
};
export const cancelPersonalServ = async (payload) => {
    try {
      const response = await axios.post(BASE_URL + "cancel-personal-booking-by-admin",payload, getConfig());
      return response;
    } catch (error) {
      // Handle error (e.g., log or throw an error)
      console.error("Error fetching data:", error);
      throw error;
    }
};

export const getPersonalConfirmedListFunc= async () => {
  try {
    const response = await axios.get(BASE_URL + "get-personal-confirmed-booking",  getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getPersonalAssignedListFunc= async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "get-personal-assigned-booking", payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getPersonalAcceptedBookingRecordServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "get-personal-accepted-booking",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getPersonalManualBookingRecordServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "get-personal-manual-booking",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getPersonalMissedBookingRecordServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "get-personal-missed-booking",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const continueWithSameDriverServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "continue-with-same-driver-personal-ride",formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const reasignDriverServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "reassign-driver-to-missed-personal-ride",formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getPersonalCanceledBookingRecordServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "get-personal-cancelled-booking",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getPersonalCompletedBookingRecordServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "get-personal-completed-booking",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getPersonalEnrouteBookingRecordServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "get-personal-enroute-booking",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getProvinceViseLocationOfPersonal = async () => {
  try {
    const response = await axios.get(BASE_URL + "list-personal-ride-operational-city", getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getAvailableDriverByBookingServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "get-available-drivers-by-booking-id",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const selectDriverManuallyForPersonalServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "assign-drivers-to-personal-manual-booking",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const schedulePersonalBookingServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "schedule-personal-booking-for-assign-new",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};






