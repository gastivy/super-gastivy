import { useState } from "react";
import type { DateRange } from "react-day-picker";

import { useNavigate } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";

import { routes } from "@constants/routes";
import { dateTime } from "@libs/dateTime";
import DexieDB from "@libs/dexieDB";

import { useGetCategory } from "../categories/hooks/useCategory";
import type { Category } from "../categories/models";

export const useSummaryActivity = () => {
  const navigate = useNavigate();
  const [range, setRange] = useState<DateRange | undefined>(undefined);
  const activities = useLiveQuery(() => DexieDB.activities.toArray(), []) || [];

  const handleRangeSelect = (selectedRange: DateRange | undefined) => {
    setRange(selectedRange);
  };

  const params = range?.from
    ? {
        start_date: dateTime.formatDate(range?.from || new Date()),
        end_date: dateTime.formatDate(range?.to || new Date()),
      }
    : {};

  const { data, isLoading } = useGetCategory({ ...params });

  const handleClickActivity = async (activity: Category) => {
    if (
      activities.length > 0 &&
      activities?.[0].data.length > 0 &&
      activities?.[0].id !== activity.id
    )
      return;

    if (activities?.[0]?.data.length > 0) {
      navigate({ to: routes.activity.timer.path });
      return;
    }

    await DexieDB.activities.clear();
    await DexieDB.activities.put({
      id: activity.id || "",
      name: activity.name || "",
      data: [],
    });
    navigate({ to: routes.activity.timer.path });
  };

  return {
    activities: data?.data || [],
    isLoading,
    range,
    handleRangeSelect,
    handleClickActivity,
  };
};
