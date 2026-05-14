import { useEffect, useRef, useState } from "react";

import westminsterChimes from "@assets/sounds/westminster_himes.mp3";
import { dateTime } from "@libs/dateTime";

import type { Timer } from "./useStopwatch";

interface UsePomodoroOptions {
  duration: number; // total duration in seconds
  dataTimer: Timer[];
  onComplete?: () => void;
  interval?: number;
}

const usePomodoro = ({
  duration,
  dataTimer,
  onComplete,
  interval = 1000,
}: UsePomodoroOptions) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const onCompleteRef = useRef(onComplete);
  const hasCompletedRef = useRef(false);

  onCompleteRef.current = onComplete;

  // Calculate elapsed time from completed intervals
  const completedSeconds = dataTimer
    .filter((item) => item.end_date)
    .map((time) => {
      const start = new Date(time.start_date).getTime();
      const end = new Date(time.end_date).getTime();
      return Math.floor((end - start) / 1000);
    })
    .reduce((acc, curr) => acc + curr, 0);

  useEffect(() => {
    if (dataTimer.length === 0) {
      setElapsedSeconds(completedSeconds);
      hasCompletedRef.current = false;
      return;
    }

    const lastTimer = dataTimer[dataTimer.length - 1];
    const start = new Date(lastTimer.start_date).getTime();

    if (lastTimer.end_date) {
      setElapsedSeconds(completedSeconds);
      hasCompletedRef.current = false;
    } else {
      const updateTimer = () => {
        const now = new Date().getTime();
        const elapsed = Math.floor((now - start) / 1000) + completedSeconds;
        setElapsedSeconds(elapsed);

        if (duration > 0 && elapsed >= duration && !hasCompletedRef.current) {
          hasCompletedRef.current = true;
          onCompleteRef.current?.();
        }
      };

      updateTimer();

      const intervalId = setInterval(updateTimer, interval);
      return () => clearInterval(intervalId);
    }
  }, [dataTimer, duration, completedSeconds, interval]);

  const remainingSeconds = Math.max(0, duration - elapsedSeconds);
  const progress = Math.min(100, (elapsedSeconds / duration) * 100);

  return {
    elapsedSeconds,
    remainingSeconds,
    formatted: dateTime.formatSecondsToHMS(remainingSeconds, true),
    progress,
    isCompleted: remainingSeconds <= 0,
  };
};

export const playAlarmSound = (): (() => void) => {
  const audio = new Audio(westminsterChimes);
  audio.loop = true;
  audio.volume = 0.5;
  audio.play();

  return () => {
    audio.pause();
    audio.currentTime = 0;
  };
};

export default usePomodoro;
