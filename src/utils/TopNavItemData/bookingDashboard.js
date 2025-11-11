export const getNavItems = (globalState) => {
  return [
    {
      name: "Sharing Ride",
      path: "/sharing-group-booking",
      notificationLength: globalState?.notificationList?.filter((v) => {
        return (
          (v?.category == "new_booking" ||
            v?.category == "new_route_created" ||
            v?.category == "booking_accepted" ||
            v?.category == "booking_rejected" ||
            v?.category == "booking_missed" ||
            v?.category == "booking_ride_started" ||
            v?.category == "booking_arrived" ||
            v?.category == "booking_pickup_started" ||
            v?.category == "booking_drop_started" ||
            v?.category == "booking_completed" ||
            v?.category == "booking_canceled" ||
            v?.category == "booking_ride_canceled") &&
          v?.is_read == 0
        );
      })?.length,
    },
    {
      name: "Personal Ride",
      path: "/personal-later-booking",
      notificationLength: globalState?.notificationList?.filter((v) => {
        return (
          (v?.category == "personal_new_booking" ||
            v?.category == "personal_booking_accepted" ||
            v?.category == "personal_booking_ride_canceled" ||
            v?.category == "personal_booking_missed" ||
            v?.category == "personal_booking_ride_started" ||
            v?.category == "personal_booking_completed" ||
            v?.category == "personal_booking_canceled") &&
          v?.is_read == 0
        );
      })?.length,
    },
     {
      name: "Family Ride",
      path: "/family-ride",
    },
    
    {
      name: "Driver's Availability",
      path: "/availability-confirmed",
      notificationLength: globalState?.notificationList?.filter((v) => {
        return v.category == "driver_availability" && v?.is_read == 0;
      })?.length,
    },
    {
      name: "Driver's Route",
      path: "/route-confirmed",
      notificationLength: globalState?.notificationList?.filter((v) => {
        return v.category == "driver_share_route" && v?.is_read == 0;
      })?.length,
    },
    {
      name: "Out Of Area",
      path: "/out-of-area",
      notificationLength: globalState?.notificationList?.filter((v) => {
        return v.category == "out_of_area" && v?.is_read == 0;
      })?.length,
    },
  ];
};
