import { useMemo } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";

import { routes } from "@constants/routes";
import useStopwatch from "@hooks/useStopwatch";
import DexieDB from "@libs/dexieDB";
import { useCreateActivity } from "@modules/activity/activity-log/hooks/useActivity";

export const useTimerActivity = () => {
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

  const { formatted, seconds } = useStopwatch(timer);

  const lastItem = currentActivity?.data?.at(-1);
  const existingTime =
    currentActivity?.data.filter((time) => time.end_date) || [];

  const isStarted = useMemo(() => lastItem && !lastItem?.end_date, [lastItem]);

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
    });
  };

  const handlePauseTimer = async () => {
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

  return {
    currentActivity,
    formatted,
    seconds,
    isStarted,
    name,
    isLoadingCreate,
    handleTimer,
    handleFinishActivity,
  };
};
