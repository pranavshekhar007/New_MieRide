import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import UserQuickDeposite from "../pages/FundsAndManagement/UserQuickDeposite";
import UserInteracDeposite from "../pages/FundsAndManagement/UserInteracDeposite";
import DriverWeeklyWithdraw from "../pages/FundsAndManagement/DriverWeeklyWithdraw";
import DriverQuickWithdraw from "../pages/FundsAndManagement/DriverQuickWithdraw";
import FundsSwitch from "../pages/FundsAndManagement/FundsSwitch";
import FundsCancelResponse from "../pages/FundsAndManagement/FundsCancelResponse";
import PricingCategories from "../pages/PricingAndCity/PricingCategories";
import SharingLocation from "../pages/PricingAndCity/SharingLocation";
import PersonalLocation from "../pages/PricingAndCity/PersonalLocation";
import ToAirportLocation from "../pages/PricingAndCity/ToAirportLocation";
import FromAirportLocation from "../pages/PricingAndCity/FromAirportLocation";
import IntercityLocation from "../pages/PricingAndCity/IntercityLocation";
import DriveTestLocation from "../pages/PricingAndCity/DriveTestLocation";
import PricingSharingSurges from "../pages/PricingAndCity/Surges/PricingSharingSurges";
import PricingPersonalSurges from "../pages/PricingAndCity/Surges/PricingPersonalSurges";
import PersonalToAirportSurges from "../pages/PricingAndCity/Surges/PricingToAirportSurges";
import PricingCommission from "../pages/PricingAndCity/PricingCommisision";
import PricingGtCharges from "../pages/PricingAndCity/PricingGtCharges";
import PricingInteracId from "../pages/PricingAndCity/PricingInteracId";
import PricingPayoutInfo from "../pages/PricingAndCity/PricingPayoutInfo";
import PricingCancel from "../pages/PricingAndCity/PricingCancel";
import SupportFaqUser from "../pages/Support/SupportFaqUser";
import SupportFaqDriver from "../pages/Support/SupportFaqDriver";
import SupportTcUser from "../pages/Support/SupportTcUser";
import SupportTcDriver from "../pages/Support/SupportTcDriver";
import SupportPpUser from "../pages/Support/SupportPpUser";
import SupportPpDriver from "../pages/Support/SupportPpDriver";
import SupportAll from "../pages/Support/SupportAll";
import MainDashboard from "../pages/Dasboard/MainDashboard";
import UserList from "../pages/User/UserList";
import DriverList from "../pages/Driver/DriverList";
import CreateRole from "../pages/CommandCenter/CreateRole";
import RolePermission from "../pages/CommandCenter/RolePermission";
import AssignRole from "../pages/CommandCenter/AssignRole";
import OrganisationTree from "../pages/CommandCenter/OrganisationTree";

import SharingNewBooking from "../pages/BookingDashboard/Sharing/SharingNewBooking";
import SharingGroupBooking from "../pages/BookingDashboard/Sharing/SharingGroupBooking";
import SharingAssignedBooking from "../pages/BookingDashboard/Sharing/SharingAssignedBooking";
import SharingEnrouteBooking from "../pages/BookingDashboard/Sharing/SharingEnrouteBooking";
import SharingCompletedBooking from "../pages/BookingDashboard/Sharing/SharingCompletedBooking";
import SharingCancelledBooking from "../pages/BookingDashboard/Sharing/SharingCancelledBooking";
import SharingAcceptedBooking from "../pages/BookingDashboard/Sharing/SharingAcceptedBooking";
import SharingConfirmedBooking from "../pages/BookingDashboard/Sharing/SharingConfirmedBooking";
import PersonalNewBooking from "../pages/BookingDashboard/Personal/PersonalNewBooking";
import PersonalConfirmedBooking from "../pages/BookingDashboard/Personal/PersonalConfirmedBooking";
import PersonalGroupBooking from "../pages/BookingDashboard/Personal/PersonalGroupBooking";
import PersonalAssignedBooking from "../pages/BookingDashboard/Personal/PersonalAssignedBooking";
import PersonalAcceptedBooking from "../pages/BookingDashboard/Personal/PersonalAcceptedBooking";
import PersonalEnrouteBooking from "../pages/BookingDashboard/Personal/PersonalEnrouteBooking";
import PersonalCompletedBooking from "../pages/BookingDashboard/Personal/PersonalCompletedSharing";
import PersonalCancelledBooking from "../pages/BookingDashboard/Personal/PersonalCancelledBooking";
import DriveNewBooking from "../pages/BookingDashboard/DriveTest/DriveNewBooking";
import DriveAcceptBooking from "../pages/BookingDashboard/DriveTest/DriveAcceptBooking";
import DriveConfirmedBooking from "../pages/BookingDashboard/DriveTest/DriveConfirmedBooking";
import DriveEnrouteBooking from "../pages/BookingDashboard/DriveTest/DriveEnrouteBooking";
import DriveAssignedBooking from "../pages/BookingDashboard/DriveTest/DriveAssignedBooking";
import DriveCompletedBooking from "../pages/BookingDashboard/DriveTest/DriveCompletedBooking";
import DriveCancelledBooking from "../pages/BookingDashboard/DriveTest/DriveCancelledBooking";
import DriveGroupBooking from "../pages/BookingDashboard/DriveTest/DriveGroupBooking";
import AirportCommingSoon from "../pages/BookingDashboard/Airport/AirportCommingSoon";
import IntercityCommingSoon from "../pages/BookingDashboard/Intercity/IntercityCommingSoon";
import AvailabilityNewBooking from "../pages/BookingDashboard/Availability/AvailabilityNewBooking";
import OutOfArea from "../pages/BookingDashboard/OutOfArea/OutOfArea";
import PriceProvience from "../pages/PricingAndCity/PriceProvience";
import AddUser from "../pages/User/AddUser";
import AddDriver from "../pages/Driver/AddDriver";
import AdControlPanelCommingSoon from "../pages/AdControlPanel/AdControlPanelCommingSoon";
import UserChatSupport from "../pages/ChatSupport/UserChatSupport";
import CommissionCommingSoon from "../pages/Commission/CommissionCommingSoon";
import ReportCommingSoon from "../pages/Report/ReportCommingSoon";
import DriverPersonalDetailsVerification from "../pages/Driver/DriverPersonalDetailsVerification";
import DriverCarDetailsVerification from "../pages/Driver/DriverCarDetailsVerification";
import DriverProfileDetailsVerification from "../pages/Driver/DriverProfileDetailsVerification";
import DriverLicenseDetailsVerification from "../pages/Driver/DriverLicenseDetailsVerification";
import DriverOwnershipDetailsVerification from "../pages/Driver/DriverOwnershipDetailsVerification";
import DriverInsuranceDetailsVerification from "../pages/Driver/DriverInsuranceVerification";
import DriverReviewDetailsVerification from "../pages/Driver/DriverReviewDetailsVerification";
import DriverProfile from "../pages/Driver/DriverProfile";
import DriverDocument from "../pages/Driver/DriverDocument";
import DriverAccount from "../pages/Driver/DriverAccount";
import DriverRating from "../pages/Driver/DriverRating";
import DriverTransactionHistory from "../pages/Driver/DriverTransactionHistory";
import DriverUpdatedField from "../pages/Driver/DriverUpdatedField";
import PersonalFromAirportSurges from "../pages/PricingAndCity/Surges/PricingFromAirportSurges";
import PersonalDriveTestSurges from "../pages/PricingAndCity/Surges/PricingDriveTestSurges";
import PersonalIntercitySurges from "../pages/PricingAndCity/Surges/PricingIntercitySurges";
import AvailabilityConfirmedBooking from "../pages/BookingDashboard/Availability/AvailabilityConfirmedBooking";
import AvailabilityCancelledBooking from "../pages/BookingDashboard/Availability/AvailabilityCancelledBooking";
import SharingManualBooking from "../pages/BookingDashboard/Sharing/SharingManualBooking";
import SharingMissedBooking from "../pages/BookingDashboard/Sharing/SharingMissedBooking";
import RouteNewBooking from "../pages/BookingDashboard/Route/RouteNewBooking";
import RouteConfirmed from "../pages/BookingDashboard/Route/RouteConfirmed";
import RouteCancelled from "../pages/BookingDashboard/Route/RouteCancelled";
import UserAds from "../pages/AdControlPanel/Ads/UserAds";
import OnRouteAds from "../pages/AdControlPanel/Ads/OnRouteAds";
import EndReceiptAds from "../pages/AdControlPanel/Ads/EndReceiptAds";
import DriverAds from "../pages/AdControlPanel/Ads/DriverAds";
import IntegratedEmail from "../pages/FundsAndManagement/IntegratedEmail";
import DriverChatSupport from "../pages/ChatSupport/DriverChatSupport";
import UserChatBox from "../pages/ChatSupport/UserChatBox";
import DriverChatBox from "../pages/ChatSupport/DriverChatBox";
import SharingRouteBooking from "../pages/BookingDashboard/Sharing/SharingRouteBooking";
import WebsiteAds from "../pages/AdControlPanel/WebsiteAds";
import NotifyAds from "../pages/AdControlPanel/NotifyAds";
import SharingSelectDriverBooking from "../pages/BookingDashboard/Sharing/SharingSelectDriverBooking";
import SharingSelectAvalabilityDriverBooking from "../pages/BookingDashboard/Sharing/SharingSelectAvalabilityBooking";
import SharingSelectManualDriverBooking from "../pages/BookingDashboard/Sharing/SharingSelectManualDriverBooking";
import SharingSelectRouteDriverBooking from "../pages/BookingDashboard/Sharing/SharingSelectRouteDriverBooking";
import UserNotification from "../pages/Notification/UserNotification";
import DriverNotification from "../pages/Notification/DriverNotification";
import FundsNotification from "../pages/Notification/FundsNotification";
import BookingNotification from "../pages/Notification/BookingNotification";
import SupportNotification from "../pages/Notification/SupportNotification";
import DriverTransactionCharge from "../pages/FundsAndManagement/DriverTransectionCharge"
import PersonalManualBooking from "../pages/BookingDashboard/Personal/PersonalManualBooking";
import PersonalMissedBooking from "../pages/BookingDashboard/Personal/PersonalMissedBooking";
import PersonalSelectAllDriver from "../pages/BookingDashboard/Personal/PersonalSelectAllDriver";
import PersonalSelectDriverAvailability from "../pages/BookingDashboard/Personal/PersonalSelectDriverAvailability";
import AgentList from "../pages/Agent/AgentList";
import AgentProfile from "../pages/Agent/AgentProfile";
import AgentAcountInformation from "../pages/Agent/AgentAcountInformation";
import SupportFaqAgent from "../pages/Support/SupportFaqAgent";
import SupportPpAgent from "../pages/Support/SupportPpAgent";
import SupportTcAgent from "../pages/Support/SupportTcAgent";
import AddAgent from "../pages/Agent/AddAgent";
import AgentWithdraw from "../pages/FundsAndManagement/AgentWithdraw";
import Finance from "../pages/FinanceHub/Finance";
import BonusList from "../pages/FinanceHub/BonusList";
import AgentRefferedUserList from "../pages/Agent/AgentRefferedUserList";
import AgentRefferedDriverList from "../pages/Agent/AgentRefferedDriverList";
import AgentTransectionList from "../pages/Agent/AgentTransectionList";
import PricingCalculator from "../pages/PricingAndCity/PricingCalculator";
import SupportContactQueryList from "../pages/Support/SupportContactQueryList";
import BlogList from "../pages/Blog/BlogList";
import CreateBlog from "../pages/Blog/CreateBlog";
import BlogCategoryList from "../pages/Blog/BlogCategoryList";
import UpdateBlog from "../pages/Blog/UpdateBlog";
import CoupanList from "../pages/Coupon/CouponList";
import CouponList from "../pages/Coupon/CouponList";
import CategoryCouponList from "../pages/Coupon/CategoryCouponList";
import GiftVouchersList from "../pages/Coupon/GiftVouchersList";
import FirstRideList from "../pages/Coupon/FirstRideList";
import WelcomeCouponList from "../pages/Coupon/WelcomeCouponList";
import CityToCityCoupon from "../pages/Coupon/CityToCityCoupon";
import RideComplitionCouponList from "../pages/Coupon/RideComplitionCouponList";
import SharingAnalyticsBooking from "../pages/BookingDashboard/Sharing/SharingAnalyticsBooking";
import PersonalLaterBooking from "../pages/BookingDashboard/Personal/PersonalLaterBooking";
import CommingSoon from "../pages/BookingDashboard/FamilyRide/CommingSoon";
import PersonalSelectDriverRoute from "../pages/BookingDashboard/Personal/PersonalSelectDriverRoute";
import PersonalSelectDriverManually from "../pages/BookingDashboard/Personal/PersonalSelectDriverManually";
import PersonalUnacceptedBooking from "../pages/BookingDashboard/Personal/PersonalUnacceptedBooking";
import ChatSupportCategory from "../pages/ChatSupport/ChatSupportCategory";
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
import SharingUpcomingGroupBooking from "../pages/BookingDashboard/Sharing/SharingUpcomingGroupBooking";
import UserActiveChat from "../pages/SupportChat/ChatBox";
import ChatWelcomeScreen from "../pages/SupportChat/ChatWelcomeScreen";
import ChatBox from "../pages/SupportChat/ChatBox";
import SurgesList from "../pages/PricingAndCity/SurgesList";
import GeoDeals from "../pages/PricingAndCity/GeoDeals";
import PersonalAnalyticsBooking from "../pages/BookingDashboard/Personal/PersonalAnalyticsBooking";

function AuthenticatedRoutes() {
  
  return (
    <Routes>
      {/* Dashboard Routes Statred */}
      <Route path="/" element={<MainDashboard />} />
      {/* Dashboard Routes Ended */}

      {/* Command Center Routes Started */}
      <Route path="/create-role" element={<CreateRole />} />
      <Route path="/permissions" element={<RolePermission />} />
      <Route path="/assign-role" element={<AssignRole />} />
      <Route path="/organisation-tree" element={<OrganisationTree />} />
      {/* Command Center Routes Ended */}

      {/* Booking Dashboard Routes Started */}
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
      {/* Funds Management Routes Ended */}

      {/* Ad Control Panel Routes Started */}
      <Route path="/ads-user-panel" element={<UserAds />} />
      <Route path="/ads-on-route-panel" element={<OnRouteAds />} />
      <Route path="/ads-end-receipt-panel" element={<EndReceiptAds />} />
      <Route path="/ads-driver-panel" element={<DriverAds />} />
      <Route path="/website-ads" element={<WebsiteAds />} />
      <Route path="/notify-ads" element={<NotifyAds />} />
      {/* Ad Control Panel Routes Ended */}

      {/* Pricing & Cities Routes Started */}
      <Route path="pricing-categories" element={<PricingCategories />} />
      <Route path="pricing-sharing-location" element={<SharingLocation />} />
      <Route path="pricing-personal-location" element={<PersonalLocation />} />
      <Route path="pricing-to-airport" element={<ToAirportLocation />} />
      <Route path="pricing-from-airport" element={<FromAirportLocation />} />
      <Route path="pricing-drive-test" element={<DriveTestLocation />} />
      <Route path="pricing-intercity" element={<IntercityLocation />} />
      <Route path="pricing-commission" element={<PricingCommission />} />
      <Route path="pricing-gt-charges" element={<PricingGtCharges />} />
      <Route path="pricing-iterac-id" element={<PricingInteracId />} />
      <Route path="pricing-payout-info" element={<PricingPayoutInfo />} />
      <Route path="pricing-cancel" element={<PricingCancel />} />
      <Route path="pricing-calculator" element={<PricingCalculator />} />
      <Route path="pricing-province" element={<PriceProvience />} />
      <Route path="geo-deals" element={<GeoDeals />} />

      <Route path="pricing-sharing-surges" element={<PricingSharingSurges />} />
      <Route path="pricing-surges" element={<SurgesList />} />
      <Route path="pricing-personal-surges" element={<PricingPersonalSurges />} />
      <Route path="pricing-to-airport-surges" element={<PersonalToAirportSurges />} />
      <Route path="pricing-from-airport-surges" element={<PersonalFromAirportSurges />} />
      <Route path="pricing-drive-test-surges" element={<PersonalDriveTestSurges />} />
      <Route path="pricing-intercity-surges" element={<PersonalIntercitySurges />} />

      {/* Pricing & Cities Routes Ended */}

      {/* User Routes Started */}
      <Route path="user-list" element={<UserList />} />
      <Route path="add-user" element={<AddUser />} />
      {/* User Routes Ended */}

      {/* Driver Routes Started */}
      <Route path="driver-list" element={<DriverList />} />
      <Route path="add-driver" element={<AddDriver />} />
      <Route path="driver-profile/:id" element={<DriverProfile />} />
      <Route path="driver-document/:id" element={<DriverDocument />} />
      <Route path="driver-account/:id" element={<DriverAccount />} />
      <Route path="driver-rating/:id" element={<DriverRating />} />
      <Route path="driver-transaction-history/:id" element={<DriverTransactionHistory />} />
      <Route path="driver-personal-details-verification/:id" element={<DriverPersonalDetailsVerification/>}/>
      <Route path="driver-car-details-verification/:id" element={<DriverCarDetailsVerification/>}/>
      <Route path="driver-profile-details-verification/:id" element={<DriverProfileDetailsVerification/>}/>
      <Route path="driver-license-details-verification/:id" element={<DriverLicenseDetailsVerification/>}/>
      <Route path="driver-ownership-details-verification/:id" element={<DriverOwnershipDetailsVerification/>}/>
      <Route path="driver-insurance-details-verification/:id" element={<DriverInsuranceDetailsVerification/>}/>
      <Route path="driver-review-details-verification/:id" element={<DriverReviewDetailsVerification/>}/>
      <Route path="driver-updated-fields/:id" element={<DriverUpdatedField/>}/>
      {/* Driver Routes Ended */}

      {/* Agent Routes Started */}
      <Route path="agent-list" element={<AgentList/>}/>
      <Route path="add-agent" element={<AddAgent/>}/>
      <Route path="agent-profile/:id" element={<AgentProfile/>}/>
      <Route path="agent-account-information/:id" element={<AgentAcountInformation/>}/>
      <Route path="agent-user-app/:id" element={<AgentRefferedUserList/>}/>
      <Route path="agent-driver-app/:id" element={<AgentRefferedDriverList/>}/>
      <Route path="agent-transaction-history/:id" element={<AgentTransectionList/>}/>
      {/* Agent Routes Ended */}

      {/* Commision Routes Started*/}
      <Route path="commission" element={<CommissionCommingSoon />} />
      {/* Commision Routes Ended*/}

      {/* Report Routes Started*/}
      <Route path="report" element={<ReportCommingSoon />} />
      {/* Report Routes Ended*/}

      {/* Support Routes Started */}
      <Route path="support-faq-user" element={<SupportFaqUser />} />
      <Route path="support-faq-driver" element={<SupportFaqDriver />} />
      <Route path="support-faq-agent" element={<SupportFaqAgent />} />
      <Route path="support-tc-user" element={<SupportTcUser />} />
      <Route path="support-tc-driver" element={<SupportTcDriver />} />
      <Route path="support-tc-agent" element={<SupportTcAgent />} />
      <Route path="support-pp-user" element={<SupportPpUser />} />
      <Route path="support-pp-driver" element={<SupportPpDriver />} />
      <Route path="support-pp-agent" element={<SupportPpAgent />} />
      <Route path="support-all" element={<SupportAll />} />
      <Route path="support-query-list" element={<SupportContactQueryList />} />
      {/* Support Routes Ended */}

      {/* Notification Routes Started */}
      <Route path="user-notification" element={<UserNotification />} />
      <Route path="driver-notification" element={<DriverNotification />} />
      <Route path="fund-notification" element={<FundsNotification />} />
      <Route path="booking-notification" element={<BookingNotification/>} />
      <Route path="support-notification" element={<SupportNotification/>} />
      {/* Notification Routes Ended */}

      {/* finance Hub Started */}
      <Route path="rewards-details" element={<Finance/>} />
      <Route path="bonus-list" element={<BonusList/>} />
      {/* finance Hub Ended */}

      {/* blogs started */}
      <Route path="blog-list" element={<BlogList/>} />
      <Route path="create-blog" element={<CreateBlog/>} />
     <Route path="/blog-categories" element={<BlogCategoryList />} /> 
      <Route path="/update-blog/:id" element={<UpdateBlog/>} />

      {/* coupons started */}
      <Route path="/coupon-categories" element={<CategoryCouponList/>} />
      
      <Route path="/coupon-list" element={<CouponList/>} />
      <Route path="/coupon-git-vouchers-list" element={<GiftVouchersList/>} />
      <Route path="/coupon-first-ride-list" element={<FirstRideList/>} />
      <Route path="/coupon-welcome-vouchers-list" element={<WelcomeCouponList/>} />
      <Route path="/coupon-city-to-city-list" element={<CityToCityCoupon/>} />
      <Route path="/coupon-ride-completion-list" element={<RideComplitionCouponList/>} />
      <Route path="/family-ride" element={<CommingSoon/>} />

      {/* Broadcast started */}

      {/* user schedule started */}
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

      {/* Support chat started*/}
      <Route path="/chat-box/:user_type/:id" element={<ChatBox/>} />
      <Route path="/chat-support" element={<ChatWelcomeScreen/>} />
      {/* Support chat ended */}

    </Routes>
  );
}

export default AuthenticatedRoutes;
