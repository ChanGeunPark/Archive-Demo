"use client";

import { useEffect, useState } from "react";

type BasicTimerProps = {
  endTime: number;
  finishTitle?: string;
  className?: string;
  dayTitle?: string;
  isBanner?: boolean;
};

export default function BasicTimer({
  endTime,
  finishTitle = "finish",
  className,
  dayTitle,
  isBanner = false,
}: BasicTimerProps) {
  const [hour, setHour] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [finish, setFinish] = useState(false);

  useEffect(() => {
    const tick = () => {
      const dis = endTime - Date.now();
      if (dis <= 0) {
        setFinish(true);
        setHour(0);
        setMinutes(0);
        setSeconds(0);
        return;
      }

      const min1 = 1000 * 60;
      setHour(Math.max(0, Math.floor(dis / (min1 * 60))));
      setMinutes(Math.max(0, Math.floor((dis % (min1 * 60)) / min1)));
      setSeconds(Math.max(0, Math.floor((dis % min1) / 1000)));
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  if (finish) {
    return finishTitle ? <span className={className}>{finishTitle}</span> : null;
  }

  if (hour >= 24 && dayTitle && isBanner) {
    return (
      <span className={className}>
        {Math.floor(hour / 24)}
        {dayTitle}
      </span>
    );
  }

  if (hour < 24) {
    return (
      <span className={className}>
        {`${hour < 10 ? `0${hour}` : hour}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}
      </span>
    );
  }

  return null;
}
