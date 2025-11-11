import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Authentication/Login"
import ForgotPassword from "../pages/Authentication/ForgotPassword";
function UnAuthenticatedRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  );
}

export default UnAuthenticatedRoutes;
