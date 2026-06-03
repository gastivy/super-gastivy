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

// --- Shared alarm state (singleton pattern for cross-component sync) ---
let alarmAudio: HTMLAudioElement | null = null;
let sharedIsAlarmPlaying = false;
const alarmStateListeners = new Set<(playing: boolean) => void>();

const notifyAlarmStateListeners = (playing: boolean) => {
  for (const listener of alarmStateListeners) {
    listener(playing);
  }
};

export const useIsAlarmPlaying = (): {
  isAlarmPlaying: boolean;
} => {
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(sharedIsAlarmPlaying);

  useEffect(() => {
    alarmStateListeners.add(setIsAlarmPlaying);
    return () => {
      alarmStateListeners.delete(setIsAlarmPlaying);
    };
  }, []);

  return { isAlarmPlaying };
};

export const stopAlarmSound = (): void => {
  if (alarmAudio) {
    alarmAudio.pause();
    alarmAudio.currentTime = 0;
    alarmAudio = null;
  }
  if (sharedIsAlarmPlaying) {
    sharedIsAlarmPlaying = false;
    notifyAlarmStateListeners(false);
  }
};

export const playAlarmSound = (): (() => void) => {
  // If an alarm is already playing, don't create a new one
  if (alarmAudio) {
    return stopAlarmSound;
  }

  alarmAudio = new Audio(westminsterChimes);
  alarmAudio.loop = true;
  alarmAudio.volume = 0.5;
  alarmAudio.play();

  sharedIsAlarmPlaying = true;
  notifyAlarmStateListeners(true);

  return stopAlarmSound;
};

export default usePomodoro;
