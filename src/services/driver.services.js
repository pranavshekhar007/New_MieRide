import axios from "axios";

import { BASE_URL } from "../../src/utils/api_base_url_configration";// const BASE_URL = "https://api.faizah.in/api/";


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
export const getDriverListServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "list-drivers",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
// New Service for new registration system
export const getDriverNewListServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "list-drivers-new",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getAllDriverListServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "list-all-drivers",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const addDriverByAdminServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "add-driver-by-admin",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getDriverByIdServ = async (id) => {
  try {
    const response = await axios.get(BASE_URL + "driver/"+id, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const updateDriverServ = async (id, formData) => {
  try {
    const response = await axios.post(BASE_URL + "edit-driver/"+id,formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const deleteDriverServ = async (id) => {
  try {
    const response = await axios.delete(BASE_URL + "delete-driver/"+id, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getDriverTransectionListServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "list-driver-transaction-by-id" , formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getDriverRewiewServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "get-driver-rating-review" , formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const updateDriverWalletAmountServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "update-driver-wallet-amount",formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
