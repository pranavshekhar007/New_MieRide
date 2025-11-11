import axios from "axios";

import { BASE_URL } from "../../src/utils/api_base_url_configration";

const getConfig = () => {
  return {
    headers: {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
      Authorization: `Bearer ${JSON.parse(localStorage.getItem("access_token"))}`,
    },
  };
};
export const getAdsListServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "list-ads",formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const storeAdsServ = async ( formData) => {
    try {
      const response = await axios.post(BASE_URL + "store-ads",formData, getConfig());
      return response;
    } catch (error) {
      // Handle error (e.g., log or throw an error)
      console.error("Error fetching data:", error);
      throw error;
    }
  };
export const updateAdsServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "update-ads",formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const deleteAdsServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "delete-ads",formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const createNotifyServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "notify-user-drivers",formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};