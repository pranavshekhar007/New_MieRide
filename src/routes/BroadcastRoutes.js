import { Routes, Route } from "react-router-dom";
import BroadcastUserScheduleBookingSharing from "../pages/Broadcast/UserSchedule/BroadcastUserScheduleBookingSharing";
import BroadcastUserScheduleBookingPersonal from "../pages/Broadcast/UserSchedule/BroadcastUserScheduleBookingPersonal";
import BroadcastUserScheduleDeals from "../pages/Broadcast/UserSchedule/BroadcastUserScheduleDeals";
import BroadcastUserScheduleHolidays from "../pages/Broadcast/UserSchedule/BroadcastUserScheduleHolidays";
import BroadcastUserScheduleAppUpdate from "../pages/Broadcast/UserSchedule/BroadcastUserScheduleAppUpdate";
import BroadcastUserScheduleMaintanance from "../pages/Broadcast/UserSchedule/BroadcastUserScheduleMaintanance";

import BroadcastDriverScheduleBookingSharing from "../pages/Broadcast/DriverSchedule/BroadcastDriverScheduleBookingSharing";
import BroadcastDriverScheduleBookingPersonal from "../pages/Broadcast/DriverSchedule/BroadcastDriverScheduleBookingPersonal";
import BroadcastDriverScheduleDeals from "../pages/Broadcast/DriverSchedule/BroadcastDriverScheduleDeals";
import BroadcastDriverScheduleHolidays from "../pages/Broadcast/DriverSchedule/BroadcastDriverScheduleHolidays";
import BroadcastDriverScheduleAppUpdate from "../pages/Broadcast/DriverSchedule/BroadcastDriverScheduleAppUpdate";
import BroadcastDriverScheduleMaintanance from "../pages/Broadcast/DriverSchedule/BroadcastDriverScheduleMaintanance";
import BroadcastUserFixed from "../pages/Broadcast/UserFixed/BroadcastUserFixed";
import BroadcastDriverFixed from "../pages/Broadcast/DriverFixed/BroadcastDriverFixed";
import BroadcastOverview from "../pages/Broadcast/Overview/BroadcastOverview";
import BroadcastUserPromptBookingSharing from "../pages/Broadcast/UserPrompt/BroadcastUserScheduleBookingSharing";

function BroadcastRoutes() {
  return (
    <Routes>
       {/* Broadcast started */}

      {/* user schedule started */}
      <Route path="/" element={<BroadcastUserScheduleBookingSharing/>} />
      <Route path="/broadcast-user-schedule-booking-sharing" element={<BroadcastUserScheduleBookingSharing/>} />
      <Route path="/broadcast-user-schedule-booking-personal" element={<BroadcastUserScheduleBookingPersonal/>} />
      <Route path="/broadcast-user-schedule-deals" element={<BroadcastUserScheduleDeals/>} />
      <Route path="/broadcast-user-schedule-holidays" element={<BroadcastUserScheduleHolidays/>} />
      <Route path="/broadcast-user-schedule-app-update" element={<BroadcastUserScheduleAppUpdate/>} />
      <Route path="/broadcast-user-schedule-maintenance" element={<BroadcastUserScheduleMaintanance/>} />
      {/* user schedule ended */}

      {/* driver schedule started */}
      <Route path="/broadcast-driver-schedule-booking-sharing" element={<BroadcastDriverScheduleBookingSharing/>} />
      <Route path="/broadcast-driver-schedule-booking-personal" element={<BroadcastDriverScheduleBookingPersonal/>} />
      <Route path="/broadcast-driver-schedule-deals" element={<BroadcastDriverScheduleDeals/>} />
      <Route path="/broadcast-driver-schedule-holidays" element={<BroadcastDriverScheduleHolidays/>} />
      <Route path="/broadcast-driver-schedule-app-update" element={<BroadcastDriverScheduleAppUpdate/>} />
      <Route path="/broadcast-driver-schedule-maintenance" element={<BroadcastDriverScheduleMaintanance/>} />
      {/* driver schedule ended */}

      {/* user fixed started */}
      <Route path="/broadcast-user-fixed" element={<BroadcastUserFixed/>} />
      {/* user fixed ended */}

      {/* driver fixed started */}
      <Route path="/broadcast-driver-fixed" element={<BroadcastDriverFixed/>} />
      {/* driver fixed ended */}

      {/* overview started */}
      <Route path="/broadcast-overview" element={<BroadcastOverview/>} />
      {/* overview ended */}

      {/* user prompt started */}
      <Route path="/broadcast-user-prompt-booking-sharing" element={<BroadcastUserPromptBookingSharing/>} />
     
      {/* user prompt ended */}

      {/* Broadcast ended */}
    </Routes>
  );
}

export default BroadcastRoutes;
