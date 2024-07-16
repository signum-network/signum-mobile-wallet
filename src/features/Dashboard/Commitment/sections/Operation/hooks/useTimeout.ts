import { useEffect, useRef, useState } from "react";
import { addSeconds, intervalToDuration, Duration } from "date-fns";

export const useTimeout = (blocksUntilActionEnd: number): string => {
  let intervalHandle = useRef<ReturnType<typeof setTimeout>>();
  const [actionDuration, setActionDuration] = useState<Duration | null>(null);

  const resetTimeout = () => {
    intervalHandle.current && clearInterval(intervalHandle.current);
  };

  useEffect(() => {
    if (!blocksUntilActionEnd) return;
    resetTimeout();
    const startDate = new Date();
    intervalHandle.current = setInterval(() => {
      const duration = intervalToDuration({
        start: new Date(),
        end: addSeconds(startDate, blocksUntilActionEnd * 4 * 60),
      });
      setActionDuration(duration);
    }, 1000);

    return () => {
      resetTimeout();
    };
  }, [blocksUntilActionEnd]);

  if (!actionDuration) return "";

  const {
    years = 0,
    months = 0,
    days = 0,
    hours = 0,
    minutes = 0,
  } = actionDuration;

  let timeoutLabel = "";

  const formattedDays = years * 365 + months * 30 + days;

  const dayLabel = ` day${formattedDays > 1 ? "s" : ""} `;
  const hourLabel = ` hour${hours > 1 ? "s" : ""} `;
  const minuteLabel = ` minute${minutes > 1 ? "s" : ""} `;

  if (formattedDays) timeoutLabel += formattedDays + dayLabel;
  if (hours) timeoutLabel += hours + hourLabel;
  if (minutes) timeoutLabel += minutes + minuteLabel;

  return timeoutLabel;
};
