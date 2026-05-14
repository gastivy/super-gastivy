import { useCallback, useMemo, useRef, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";

import { routes } from "@constants/routes";
import usePomodoro, { playAlarmSound } from "@hooks/usePomodoro";
import useStopwatch from "@hooks/useStopwatch";
import DexieDB from "@libs/dexieDB";
import { useCreateActivity } from "@modules/activity/activity-log/hooks/useActivity";
import type { TimerType } from "@modules/activity/activity-log/models/dexie";

export const useTimerActivity = (
  timerType: TimerType = "stopwatch",
  pomodoroDuration: number = 0
) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const activities = useLiveQuery(() => DexieDB.activities.toArray(), []) || [];
  const currentActivity = activities?.[0];

  const { mutate, isPending: isLoadingCreate } = useCreateActivity({
    onSuccess: async () => {
      await DexieDB.activities.clear();
      navigate({ to: routes.activity.overview.path });
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      queryClient.invalidateQueries({ queryKey: ["all-category"] });
    },
  });

  const timer =
    currentActivity?.data?.map(({ start_date, end_date }) => ({
      start_date: start_date || "",
      end_date: end_date || "",
    })) || [];

  const name = currentActivity?.name || "";

  const lastItem = currentActivity?.data?.at(-1);
  const existingTime =
    currentActivity?.data.filter((time) => time.end_date) || [];

  const isStarted = useMemo(() => lastItem && !lastItem?.end_date, [lastItem]);

  // Use a ref for the pause handler so pomodoro can call it
  const stopAlarmRef = useRef<(() => void) | null>(null);
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);
  const handlePauseTimerRef = useRef<(() => Promise<void>) | null>(null);

  const handlePauseTimer = useCallback(async () => {
    if (!currentActivity) return;
    if (lastItem?.end_date) return;
    const data = [
      ...existingTime,
      { start_date: lastItem?.start_date, end_date: new Date() },
    ];
    await DexieDB.activities.put({
      id: currentActivity.id || "",
      name: currentActivity.name || "",
      data: data.map((item) => ({
        ...item,
        is_done: false,
        description: "",
      })),
      timer_type: currentActivity.timer_type || timerType,
      pomodoro_duration: currentActivity.pomodoro_duration || pomodoroDuration,
    });
  }, [currentActivity, lastItem, existingTime, timerType, pomodoroDuration]);

  handlePauseTimerRef.current = handlePauseTimer;

  const handlePomodoroComplete = useCallback(() => {
    const stopAlarm = playAlarmSound();
    stopAlarmRef.current = stopAlarm;
    setIsAlarmPlaying(true);
    handlePauseTimerRef.current?.();
  }, []);

  const handleStopAlarm = useCallback(() => {
    stopAlarmRef.current?.();
    stopAlarmRef.current = null;
    setIsAlarmPlaying(false);
  }, []);

  // Resolve actual values: prefer saved activity data over hook parameters.
  // This ensures TimerPopover (which passes no args) uses the correct duration
  // from the DexieDB record instead of defaulting to 25 minutes.
  const resolvedTimerType: TimerType = currentActivity?.timer_type || timerType;
  const resolvedPomodoroDuration: number =
    currentActivity?.pomodoro_duration || pomodoroDuration;

  // Stopwatch hook
  const stopwatchResult = useStopwatch(timer);

  // Pomodoro hook
  const pomodoroResult = usePomodoro({
    duration: resolvedPomodoroDuration,
    dataTimer: timer,
    onComplete: handlePomodoroComplete,
  });

  const isPomodoro = resolvedTimerType === "pomodoro";

  const formatted = isPomodoro
    ? pomodoroResult.formatted
    : stopwatchResult.formatted;

  const seconds = isPomodoro
    ? pomodoroResult.remainingSeconds
    : stopwatchResult.seconds;

  const progress = isPomodoro ? pomodoroResult.progress : 0;

  const handleStartTimer = async () => {
    if (!currentActivity.id) return;

    const data = [
      ...existingTime,
      { start_date: new Date(), end_date: undefined },
    ];
    await DexieDB.activities.put({
      id: currentActivity?.id || "",
      name: currentActivity?.name || "",
      data: data.map((item) => ({
        ...item,
        is_done: false,
        description: "",
      })),
      timer_type: timerType,
      pomodoro_duration: pomodoroDuration,
    });
  };

  const handleTimer = () => {
    // Start Timer
    if (!lastItem || (lastItem?.start_date && lastItem?.end_date)) {
      handleStartTimer();
      return;
    }

    // Stop timer
    if (lastItem && !lastItem?.end_date) {
      handlePauseTimer();
      return;
    }
  };

  const handleFinishActivity = () => {
    mutate({
      activities: currentActivity?.data.map((act, index) => ({
        ...act,
        category_id: currentActivity.id,
        start_date: act.start_date || null,
        end_date: act.end_date || null,
        is_done: currentActivity.data.length - 1 === index,
        description: act.description,
      })),
    });
  };

  const handleCancelActivity = async () => {
    await DexieDB.activities.clear();
    stopAlarmRef.current?.();
    stopAlarmRef.current = null;
    setIsAlarmPlaying(false);
  };

  return {
    currentActivity,
    formatted,
    seconds,
    progress,
    isStarted,
    name,
    isLoadingCreate,
    handleTimer,
    handleFinishActivity,
    handleCancelActivity,
    isAlarmPlaying,
    handleStopAlarm,
  };
};
