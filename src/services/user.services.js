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
export const getUserListServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "list-users",formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getAllUserListServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "list-all-users",formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const addUserByAdminServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "add-user-by-admin",formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const updateUserWalletAmountServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "update-user-wallet-amount",formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const listProvinceServ = async () => {
    try {
      const response = await axios.get(BASE_URL + "list-province", getConfig());
      return response;
    } catch (error) {
      // Handle error (e.g., log or throw an error)
      console.error("Error fetching data:", error);
      throw error;
    }
};
export const getCategoryServ = async () => {
    try {
      const response = await axios.get(BASE_URL + "list-ride-category", getConfig());
      return response;
    } catch (error) {
      // Handle error (e.g., log or throw an error)
      console.error("Error fetching data:", error);
      throw error;
    }
};
export const deleteUserServ = async (id) => {
  try {
    const response = await axios.delete(BASE_URL + "delete-user/"+id, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};