import { useEffect, useState } from "react";

export interface Timer {
  start_date: string | Date;
  end_date: string | Date;
}

const formatSecondsToHMS = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const hoursStr = hours.toString().padStart(2, "0");
  const minutesStr = minutes.toString().padStart(2, "0");
  const secondsStr = secs.toString().padStart(2, "0");

  if (hoursStr === "00") return `${minutesStr} : ${secondsStr}`;
  return `${hoursStr} : ${minutesStr} : ${secondsStr}`;
};

const useStopwatch = (dataTimer: Timer[], interval?: number) => {
  const [timer, setTimer] = useState(0);

  // Calculate Timer
  const count = dataTimer
    .filter((item) => item.end_date)
    .map((time) => {
      const start = new Date(time.start_date).getTime();
      const end = new Date(time.end_date).getTime();
      const difference = end - start;
      return Math.floor(difference / 1000);
    })
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  useEffect(() => {
    if (dataTimer.length === 0) {
      setTimer(count);
      return;
    }

    const start = new Date(
      dataTimer[dataTimer.length - 1].start_date
    ).getTime();

    if (dataTimer[dataTimer.length - 1].end_date) {
      setTimer(count);
    } else {
      const updateTimer = () => {
        const now = new Date().getTime();
        const difference = now - start;

        setTimer(Math.floor(difference / 1000) + count);

        if (difference <= 0) {
          clearInterval(intervalId);
          setTimer(0);
        }
      };

      updateTimer();

      const intervalId = setInterval(updateTimer, interval || 1000);
      return () => clearInterval(intervalId);
    }
  }, [dataTimer]);

  return {
    formatted: formatSecondsToHMS(timer),
    seconds: timer,
  };
};

export default useStopwatch;
