import React, { useEffect } from "react";
import moment from "moment";
import useExpiryTimer from "../hooks/useExpiryTimer";

export default function AssignedTimer({ assign_time, onExpire }) {
  const timerSec = useExpiryTimer(assign_time);

  useEffect(() => {
    if (timerSec === 0) {
      onExpire();
    }
  }, [timerSec]);

  const formatted = moment.utc(timerSec * 1000).format("mm:ss");

  return (
    <div className="timerDiv d-flex justify-content-center align-items-center mb-4">
      <img src="/imagefolder/greenTimer.png" />
      <p>{timerSec > 0 ? formatted : "Expired"}</p>
    </div>
  );
}
