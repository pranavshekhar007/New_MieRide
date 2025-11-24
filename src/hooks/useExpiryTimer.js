import { useState, useEffect } from "react";
import moment from "moment-timezone";

export default function useExpiryTimer(assign_time) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (!assign_time) return;

    const assigned = moment.tz(assign_time, "America/Toronto");
    const expiry = assigned.clone().add(2, "minutes");

    const updateTimer = () => {
      const now = moment.tz("America/Toronto");
      const diff = expiry.diff(now, "seconds");
      setRemaining(diff > 0 ? diff : 0);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [assign_time]);

  return remaining;
}
