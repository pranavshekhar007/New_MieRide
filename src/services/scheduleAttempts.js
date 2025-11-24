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

export const scheduleSharingBookingForAssignServ = async (payload) => {
  try {
    const response = await axios.post(
      BASE_URL + "schedule-sharing-booking-for-assign",
      payload,
      getConfig()
    );
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
