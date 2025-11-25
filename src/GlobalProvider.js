import React, { createContext, useContext, useEffect, useState } from "react";

const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const [globalState, setGlobalState] = useState({
    user: null,
    access_token: null,
    permissions:null,
    isFillSidebarWidth100: true,
    base_url:"",
    notificationList:0,
    sharingBookingDetails: null,
    personalBookingDetails: null,
  });
  useEffect(() => {
    setGlobalState({
      user: JSON.parse(localStorage.getItem("mie_ride_user")),
      access_token: JSON.parse(localStorage.getItem("access_token")),
      permissions: JSON.parse(localStorage.getItem("permissions")),
      isFillSidebarWidth100:  window.innerWidth > 1200,
      // notificationList:0
    });
  }, []);
  return <GlobalStateContext.Provider value={{ globalState, setGlobalState }}>{children}</GlobalStateContext.Provider>;
};
export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return context;
};
