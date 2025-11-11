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
export const getListReferalServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "list-referral-commission",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const storeReferalCommissionServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "store-referral-commission",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const updateReferalCommissionServ = async (payload) => {
    try {
      const response = await axios.post(BASE_URL + "update-referral-commission",payload, getConfig());
      return response;
    } catch (error) {
      // Handle error (e.g., log or throw an error)
      console.error("Error fetching data:", error);
      throw error;
    }
  };
export const deleteReferalCommissionServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "delete-refferal-commission",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const storeWalletRechargeServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "store-wallet-recharge-commission",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getWalletRechargeServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "list-wallet-recharge-commission",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const handleDeleteRechargeCommissionServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "delete-wallet-recharge-commission",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const updateWalletRechargeCommissionServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "update-wallet-recharge-commission",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};

