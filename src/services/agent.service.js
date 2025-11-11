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
export const getAgentListServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "list-agents",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const deleteAgentServ = async (id) => {
  try {
    const response = await axios.post(BASE_URL + "delete-agent",{id}, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const addAgentByAdminServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "add-agent",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getAgentByIdServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "get-agent-by-id", payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const updateAgentServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "edit-agent", payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getRefferedUserListServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "get-agent-referred-users", payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getRefferedDriverListServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "get-agent-referred-drivers", payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getTransectionHistoryServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "get-agent-transaction-history", payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getAllAgentListServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "list-all-agents",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
