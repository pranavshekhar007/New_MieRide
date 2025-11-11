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
export const getBlogCategoryListServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "list-blog-category",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const updateBlogServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "edit-blog", formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getBlogDetailsServ = async (id) => {
  try {
    const response = await axios.get(BASE_URL + "blog/"+id);
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getBlogListServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "list-blogs",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const deleteBlogCategoryServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "delete-blog-category",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const deleteBlogServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "delete-blog",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const addBlogCategoryServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "create-blog-category",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const createBlogServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "create-blog",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const updateBlogCategoryServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "edit-blog-category", payload, getConfig());
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
