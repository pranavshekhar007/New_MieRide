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
export const addProvinceServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "add-province", formData, getConfig());
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
export const deleteProvinceServ = async (id) => {
  try {
    const response = await axios.delete(BASE_URL + "delete-province/"+id, getConfig());
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
export const getCategoryUpdateServ = async (id, formData) => {
  try {
    const response = await axios.post(BASE_URL + "update-ride-category-status/"+id, formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const addSharingPriceServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "store-sharing-ride-price",formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const sharingLocationListServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "get-ride-price-list",formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getSurgesListServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "list-surges",formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const addSurgesServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "store-surge",formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const editSurgesServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "update-surge",formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const editPriceFairServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "edit-sharing-ride-price",formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const deleteSurgesServ = async (id) => {
  try {
    const response = await axios.delete(BASE_URL + "delete-surge/"+id, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const deletePriceFairServ = async (id) => {
  try {
    const response = await axios.delete(BASE_URL + "delete-ride-price/"+id, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const deletePriceTierServ = async (id) => {
  try {
    const response = await axios.post(BASE_URL + "delete-price-tier",{id:id}, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};


export const addCommissionServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "store-commission",formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const editCommissionServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "update-commission",formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getCommissionListServ = async () => {
  try {
    const response = await axios.post(BASE_URL + "list-commissions", {}, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getGtChargeList = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "list-gt-charge", formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const addGtChargeServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "store-gt-charge", formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getInteracIdChargeList = async (formData) => {
  try {
    const response = await axios.get(BASE_URL + "list-interac-e-id", getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const addInteracIdChargeServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "store-interac-e-id", formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const updateInteracIdChargeServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "update-interac-e-id", formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getPayoutServ = async () => {
  try {
    const response = await axios.get(BASE_URL + "list-payoutinfo", getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const handleSubmitPayoutInfoServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "store-payoutinfo",formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const handleUpdateShareLocation = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "edit-sharing-ride-price",formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getProvinceViseLocation = async () => {
  try {
    const response = await axios.get(BASE_URL + "list-price-by-province", getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getPriceTriesServ = async () => {
  try {
    const response = await axios.post(BASE_URL + "list-price-tier",{}, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const addPriceTrieServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "store-price-tier",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const editPriceTrieServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "update-price-tier",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const fetchPriceBySourceAndDestinationServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "fetch-price-from-tier-data",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const calculatePriceServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "get-per-person-price",formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getGeoDealsServ= async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "list-location-discount",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const deleteGeoDealsServ= async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "delete-location-discount",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const storeGeoDealsServ= async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "store-location-discount",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const UpdateGeoDealsServ= async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "update-location-discount",payload, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};