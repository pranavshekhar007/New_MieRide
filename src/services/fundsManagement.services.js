import axios from "axios";

import { BASE_URL } from "../../src/utils/api_base_url_configration";

const access_token = localStorage.getItem("access_token");

const getConfig = () => {
  return {
    headers: {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
      Authorization: `Bearer ${JSON.parse(localStorage.getItem("access_token"))}`,
    },
  };
};
export const getUserInteractETransferServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "list-intrac-e-transfer",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const updateUserInteracStatusServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "update-intrac-e-transfer-status",formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getUserQuickServ = async (payload) => {
    try {
      const response = await axios.post(BASE_URL + "list-quick-deposit-payment",payload, getConfig());
      return response;
    } catch (error) {
      // Handle error (e.g., log or throw an error)
      console.error("Error fetching data:", error);
      throw error;
    }
};
export const getDriverPayableListFunc = async (payload) => {
    try {
      const response = await axios.post(BASE_URL + "list-payable-drivers",payload, getConfig());
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

export const getDriverQuickWithdrawListServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "driver-quick-withdraw-list",formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getDriverApprovedListServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "list-approve-drivers",formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const updateQuickWithdrawServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "update-quick-withdraw-request-status",formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const driverWeeklyWithdrawByAdminServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "driver-weekly-withdraw-by-admin",formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const listSwitchAccountServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "list-switch-account",formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const updateSwitchAccountServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "update-switch-account-status",formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getAgentWithdrawListServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "list-all-agent-withdraw-request",formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const agentWithdrawPayServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "update-agent-withdraw-request",formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};