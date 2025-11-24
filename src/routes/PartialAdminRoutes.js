import { Routes, Route } from "react-router-dom";
import SharingNewBooking from "../pages/BookingDashboard/Sharing/SharingNewBooking";
import SharingAnalyticsBooking from "../pages/BookingDashboard/Sharing/SharingAnalyticsBooking";
import SharingConfirmedBooking from "../pages/BookingDashboard/Sharing/SharingConfirmedBooking";
import SharingGroupBooking from "../pages/BookingDashboard/Sharing/SharingGroupBooking";
import SharingUpcomingGroupBooking from "../pages/BookingDashboard/Sharing/SharingUpcomingGroupBooking";
import SharingRouteBooking from "../pages/BookingDashboard/Sharing/SharingRouteBooking";
import SharingAssignedBooking from "../pages/BookingDashboard/Sharing/SharingAssignedBooking";
import SharingManualBooking from "../pages/BookingDashboard/Sharing/SharingManualBooking";
import SharingMissedBooking from "../pages/BookingDashboard/Sharing/SharingMissedBooking";
import SharingAcceptedBooking from "../pages/BookingDashboard/Sharing/SharingAcceptedBooking";
import SharingEnrouteBooking from "../pages/BookingDashboard/Sharing/SharingEnrouteBooking";
import SharingCompletedBooking from "../pages/BookingDashboard/Sharing/SharingCompletedBooking";
import SharingCancelledBooking from "../pages/BookingDashboard/Sharing/SharingCancelledBooking";
import SharingSelectDriverBooking from "../pages/BookingDashboard/Sharing/SharingSelectDriverBooking";
import SharingSelectRouteDriverBooking from "../pages/BookingDashboard/Sharing/SharingSelectRouteDriverBooking";
import SharingSelectManualDriverBooking from "../pages/BookingDashboard/Sharing/SharingSelectManualDriverBooking";
import SharingSelectAvalabilityDriverBooking from "../pages/BookingDashboard/Sharing/SharingSelectAvalabilityBooking";
import PersonalAnalyticsBooking from "../pages/BookingDashboard/Personal/PersonalAnalyticsBooking";
import PersonalNewBooking from "../pages/BookingDashboard/Personal/PersonalNewBooking";
import PersonalLaterBooking from "../pages/BookingDashboard/Personal/PersonalLaterBooking";
import PersonalGroupBooking from "../pages/BookingDashboard/Personal/PersonalGroupBooking";
import PersonalAssignedBooking from "../pages/BookingDashboard/Personal/PersonalAssignedBooking";
import PersonalConfirmedBooking from "../pages/BookingDashboard/Personal/PersonalConfirmedBooking";
import PersonalAcceptedBooking from "../pages/BookingDashboard/Personal/PersonalAcceptedBooking";
import PersonalEnrouteBooking from "../pages/BookingDashboard/Personal/PersonalEnrouteBooking";
import PersonalCompletedBooking from "../pages/BookingDashboard/Personal/PersonalCompletedSharing";
import PersonalCancelledBooking from "../pages/BookingDashboard/Personal/PersonalCancelledBooking";
import PersonalManualBooking from "../pages/BookingDashboard/Personal/PersonalManualBooking";
import PersonalMissedBooking from "../pages/BookingDashboard/Personal/PersonalMissedBooking";
import PersonalSelectDriverAvailability from "../pages/BookingDashboard/Personal/PersonalSelectDriverAvailability";
import PersonalSelectDriverRoute from "../pages/BookingDashboard/Personal/PersonalSelectDriverRoute";
import PersonalSelectAllDriver from "../pages/BookingDashboard/Personal/PersonalSelectAllDriver";
import PersonalSelectDriverManually from "../pages/BookingDashboard/Personal/PersonalSelectDriverManually";
import PersonalUnacceptedBooking from "../pages/BookingDashboard/Personal/PersonalUnacceptedBooking";
import DriveNewBooking from "../pages/BookingDashboard/DriveTest/DriveNewBooking";
import DriveConfirmedBooking from "../pages/BookingDashboard/DriveTest/DriveConfirmedBooking";
import DriveGroupBooking from "../pages/BookingDashboard/DriveTest/DriveGroupBooking";
import DriveAssignedBooking from "../pages/BookingDashboard/DriveTest/DriveAssignedBooking";
import DriveAcceptBooking from "../pages/BookingDashboard/DriveTest/DriveAcceptBooking";
import DriveEnrouteBooking from "../pages/BookingDashboard/DriveTest/DriveEnrouteBooking";
import DriveCompletedBooking from "../pages/BookingDashboard/DriveTest/DriveCompletedBooking";
import DriveCancelledBooking from "../pages/BookingDashboard/DriveTest/DriveCancelledBooking";
import AvailabilityNewBooking from "../pages/BookingDashboard/Availability/AvailabilityNewBooking";
import AvailabilityConfirmedBooking from "../pages/BookingDashboard/Availability/AvailabilityConfirmedBooking";
import AvailabilityCancelledBooking from "../pages/BookingDashboard/Availability/AvailabilityCancelledBooking";
import RouteNewBooking from "../pages/BookingDashboard/Route/RouteNewBooking";
import RouteConfirmed from "../pages/BookingDashboard/Route/RouteConfirmed";
import RouteCancelled from "../pages/BookingDashboard/Route/RouteCancelled";
import AirportCommingSoon from "../pages/BookingDashboard/Airport/AirportCommingSoon";
import IntercityCommingSoon from "../pages/BookingDashboard/Intercity/IntercityCommingSoon";
import UserChatSupport from "../pages/ChatSupport/UserChatSupport";
import DriverChatSupport from "../pages/ChatSupport/DriverChatSupport";
import UserChatBox from "../pages/ChatSupport/UserChatBox";
import DriverChatBox from "../pages/ChatSupport/DriverChatBox";
import ChatSupportCategory from "../pages/ChatSupport/ChatSupportCategory";
import UserInteracDeposite from "../pages/FundsAndManagement/UserInteracDeposite";
import UserQuickDeposite from "../pages/FundsAndManagement/UserQuickDeposite";
import DriverWeeklyWithdraw from "../pages/FundsAndManagement/DriverWeeklyWithdraw";
import DriverQuickWithdraw from "../pages/FundsAndManagement/DriverQuickWithdraw";
import FundsSwitch from "../pages/FundsAndManagement/FundsSwitch";
import FundsCancelResponse from "../pages/FundsAndManagement/FundsCancelResponse";
import IntegratedEmail from "../pages/FundsAndManagement/IntegratedEmail";
import DriverTransactionCharge from "../pages/FundsAndManagement/DriverTransectionCharge";
import AgentWithdraw from "../pages/FundsAndManagement/AgentWithdraw";
import OutOfArea from "../pages/BookingDashboard/OutOfArea/OutOfArea";
import ChatWelcomeScreen from "../pages/SupportChat/ChatWelcomeScreen";


function PartialAdminRoutes() {
  return (
    <Routes>
 {/* Partial Admin Start  */}

        {/* Booking Dashboard Routes Started */}
        <Route path="/" element={<SharingGroupBooking />} />
        <Route path="/sharing-new-booking" element={<SharingNewBooking />} />
      <Route path="/sharing-new-booking" element={<SharingNewBooking />} />
      <Route path="/sharing-analytics-booking" element={<SharingAnalyticsBooking />} />
      <Route path="/sharing-confirmed-booking" element={<SharingConfirmedBooking />} />
      <Route path="/sharing-group-booking" element={<SharingGroupBooking />} />
      <Route path="/sharing-upcoming-group-booking" element={<SharingUpcomingGroupBooking />} />
      <Route path="/sharing-route-booking" element={<SharingRouteBooking />} />
      <Route path="/sharing-assigned-booking" element={<SharingAssignedBooking />} />
      <Route path="/sharing-manual-booking" element={<SharingManualBooking />} />
      <Route path="/sharing-missed-booking" element={<SharingMissedBooking />} />
      <Route path="/sharing-accepted-booking" element={<SharingAcceptedBooking />} />
      <Route path="/sharing-enroute-booking" element={<SharingEnrouteBooking />} />
      <Route path="/sharing-completed-booking" element={<SharingCompletedBooking />} />
      <Route path="/sharing-cancelled-booking" element={<SharingCancelledBooking />} />
      <Route path="/sharing-select-driver/:id" element={<SharingSelectDriverBooking />} />
      <Route path="/sharing-select-route-driver/:id" element={<SharingSelectRouteDriverBooking />} />
      <Route path="/sharing-select-manual-driver/:id" element={<SharingSelectManualDriverBooking />} />
      <Route path="/sharing-select-avilability-driver/:id" element={<SharingSelectAvalabilityDriverBooking />} />

      <Route path="/personal-analytics-booking" element={<PersonalAnalyticsBooking />} />
      <Route path="/personal-new-booking" element={<PersonalNewBooking />} />
      <Route path="/personal-later-booking" element={<PersonalLaterBooking />} />
      <Route path="/personal-confirmed-booking" element={<PersonalConfirmedBooking />} />
      <Route path="/personal-group-booking" element={<PersonalGroupBooking />} />
      <Route path="/personal-assigned-booking" element={<PersonalAssignedBooking />} />
      <Route path="/personal-accepted-booking" element={<PersonalAcceptedBooking />} /> 
      <Route path="/personal-enroute-booking" element={<PersonalEnrouteBooking />} />
      <Route path="/personal-completed-booking" element={<PersonalCompletedBooking />} />
      <Route path="/personal-cancelled-booking" element={<PersonalCancelledBooking />} />
      <Route path="/personal-manual-booking" element={<PersonalManualBooking />} />
      <Route path="/personal-missed-booking" element={<PersonalMissedBooking />} />
      <Route path="/personal-select-driver-availability/:id" element={<PersonalSelectDriverAvailability />} />
      <Route path="/personal-select-driver-route/:id" element={<PersonalSelectDriverRoute />} />
      <Route path="/personal-select-all-driver/:id" element={<PersonalSelectAllDriver />} />
      <Route path="/personal-select-driver-manual/:id" element={<PersonalSelectDriverManually />} />
      <Route path="/personal-unaccepted-booking" element={<PersonalUnacceptedBooking />} />

      <Route path="/drive-test-new-booking" element={<DriveNewBooking />} />
      <Route path="/drive-test-confirmed-booking" element={<DriveConfirmedBooking />} />
      <Route path="/drive-test-group-booking" element={<DriveGroupBooking />} />
      <Route path="/drive-test-assigned-booking" element={<DriveAssignedBooking />} />
      <Route path="/drive-test-accepted-booking" element={<DriveAcceptBooking />} />
      <Route path="/drive-test-enroute-booking" element={<DriveEnrouteBooking />} />
      <Route path="/drive-test-completed-booking" element={<DriveCompletedBooking />} />
      <Route path="/drive-test-cancelled-booking" element={<DriveCancelledBooking />} />

      <Route path="/availability-new-booking" element={<AvailabilityNewBooking />} />
      <Route path="/availability-confirmed" element={<AvailabilityConfirmedBooking />} />
      <Route path="/availability-cancelled" element={<AvailabilityCancelledBooking />} />

      <Route path="/route-new-booking" element={<RouteNewBooking />} />
      <Route path="/route-confirmed" element={<RouteConfirmed />} />
      <Route path="/route-cancelled" element={<RouteCancelled />} />

      <Route path="/airport-comming-soon" element={<AirportCommingSoon />} />
      <Route path="/intercity-comming-soon" element={<IntercityCommingSoon />} />
      <Route path="/out-of-area" element={<OutOfArea />} />

      {/* Booking Dashboard Routes Ended */}

      {/* Chat Support Route Started */}
      <Route path="/user-chat-support" element={<UserChatSupport />} />
      <Route path="/driver-chat-support" element={<DriverChatSupport />} />
      <Route path="/user-chat-box/:id" element={<UserChatBox />} />
      <Route path="/driver-chat-box/:id" element={<DriverChatBox />} />
      <Route path="/chat-support-category" element={<ChatSupportCategory />} />
      {/* Chat Support Route Ended */}

      {/* Funds Management Routes Started */}
      <Route path="/user-interac-deposite" element={<UserInteracDeposite />} />
      <Route path="/user-quick-deposite" element={<UserQuickDeposite />} />
      <Route path="/driver-weekly-withdraw" element={<DriverWeeklyWithdraw />} />
      <Route path="/driver-quick-withdraw" element={<DriverQuickWithdraw />} />
      <Route path="/funds-switch" element={<FundsSwitch />} />
      <Route path="/funds-cancel-response" element={<FundsCancelResponse />} />
      <Route path="/integrated-email" element={<IntegratedEmail />} />
      <Route path="/driver-transaction-charge" element={<DriverTransactionCharge />} />
      <Route path="/agent-weekly-withdraw" element={<AgentWithdraw />} />
      <Route path="/chat-support" element={<ChatWelcomeScreen/>} />
      {/* Funds Management Routes Ended */}

    </Routes>
  );
}

export default PartialAdminRoutes;
