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

export const listFaqServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "list-faq", formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const deleteFaqServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "delete-faq", formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const addFaqServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "store-faq", formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const updateFaqServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "update-faq", formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getTermsAndConditionServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "list-term-condition", formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const addTermsAndConditionServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "store-term-condition", formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const updateTermsAndConditionServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "update-term-condition", formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const deleteTermsAndConditionServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "delete-term-condition", formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getPrivacyPolicyServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "list-privacy-policy", formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const addPrivacyPolicyServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "store-privacy-policy", formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const updatePrivacyPolicyServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "update-privacy-policy", formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const deletePrivacyPolicyServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "delete-privacy-policy", formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getSupportRecordServ = async () => {
  try {
    const response = await axios.get(BASE_URL + "list-support-records", getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const addSupportRecordServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "store-support-records", formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const updateSupportRecordServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "update-support-records", formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const deleteSupportRecordServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "delete-support-records", formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getChatSupportListServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "list-all-live-support-case", formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getChatSupportCategoryListServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "list-live-support-chat-category-admin", formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const addCategoryServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "store-live-support-chat-category", formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getChatSupportByCaseId = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "get-live-support-chat-message-by-case", formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const markChatAsReadServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "read-live-support-chat-multiple-messages", formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getMediaOfUserServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "get-live-support-chat-media-by-case", formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const supportSendMessageServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "send-live-support-chat-message", formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const supportChatAddParticipentServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "support/add-participant", formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const supportMessageMarkRead = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "read-live-support-chat-message", formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getUnReadMessageCount = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "chat/get-unread-message-count", formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const supportUpdateServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "update-live-support-case-status", formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const contactQueryListServ = async () => {
  try {
    const response = await axios.get(BASE_URL + "list-queries", getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getParticipentListForChat = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "support/get-participant", formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};