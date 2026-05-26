import React, { useEffect, useRef, useState } from "react";

interface TimerProps {
  endTime: string | null;
  finishTitle: string;
  refresh?: boolean;
  className?: string;
  timeStyle?: "FULL" | "BASIC";
  endEvent?(): void;
}

function TimerTextItem({
  endTime,
  timeStyle = "BASIC",
  finishTitle,
  endEvent,
  className,
  refresh = false,
}: TimerProps) {
  //state
  const [remainingSeconds, setRemainingSeconds] = useState<number>(1);
  const endEventCalled = useRef<boolean>(false);
  const endEventRef = useRef<TimerProps["endEvent"]>(endEvent);
  const endTimeMs = endTime ? new Date(endTime).getTime() : 0;

  const getRemainingSeconds = () => {
    if (!endTimeMs) return 0;

    const dis = endTimeMs - Date.now();

    return Math.max(0, Math.floor(dis / 1000));
  };

  useEffect(() => {
    endEventRef.current = endEvent;
  }, [endEvent]);

  useEffect(() => {
    endEventCalled.current = false;
    // setRemainingSeconds(getRemainingSeconds());

    const countdown = setInterval(() => {
      const nextRemainingSeconds = getRemainingSeconds();

      setRemainingSeconds(nextRemainingSeconds);

      if (refresh && nextRemainingSeconds === 0) {
        window.location.reload();
      }
      if (
        endEventRef.current &&
        nextRemainingSeconds === 0 &&
        !endEventCalled.current
      ) {
        endEventCalled.current = true;
        endEventRef.current();
      }
    }, 1000);

    return () => clearInterval(countdown);
  }, [endTimeMs, refresh]);

  const hour = Math.floor(remainingSeconds / (60 * 60));
  const minutes = Math.floor((remainingSeconds % (60 * 60)) / 60);
  const seconds = remainingSeconds % 60;
  const finish = remainingSeconds === 0;

  switch (timeStyle) {
    case "FULL":
      return (
        <>
          {finish ? (
            <span>{finishTitle}</span>
          ) : (
            <span className={className}>
              {`${hour < 10 ? `0${hour}` : hour}h`}{" "}
              {`${minutes < 10 ? `0${minutes}` : minutes}m`}{" "}
              {`${seconds < 10 ? `0${seconds}` : seconds}s`}{" "}
            </span>
          )}
        </>
      );
    case "BASIC":
      return (
        <>
          {finish ? (
            <span>{finishTitle}</span>
          ) : (
            <span className={className}>
              {!hour ? null : `${hour}h`}{" "}
              {!hour && !minutes ? null : `${minutes}m`}{" "}
              {!hour && !minutes && !seconds ? null : `${seconds}s`}
            </span>
          )}
        </>
      );
    default:
      return <div></div>;
  }
}

export default TimerTextItem;
