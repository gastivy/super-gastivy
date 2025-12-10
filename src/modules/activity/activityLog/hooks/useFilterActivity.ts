import { useEffect, useState } from "react";

import { dateTime, type RangeDate } from "@libs/dateTime";

import type { LogActivity } from "../models";
import { useGetActivity } from "./useActivity";

export const useFilterActivity = () => {
  const [idCategories, setIdCategories] = useState<string[]>([]);
  const [currentRange, setCurrentRange] = useState<RangeDate>();
  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear()
  );
  const monthList = dateTime.generateMonths(currentYear);

  const { data, isLoading, isRefetching, refetch } = useGetActivity(
    {
      ...currentRange,
      ...(idCategories.length > 0 && { category_id: idCategories }),
    },
    {
      enabled: Boolean(currentRange) || idCategories.length > 0,
      queryKey: ["activities", currentRange],
    }
  );

  const getLogActivity = () => {
    const grouped: { [key: string]: LogActivity[] } = {};

    data?.data.forEach((activity: LogActivity) => {
      const date = dateTime
        .convertToLocalTime(String(activity.start_date))
        .split("T")[0];

      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(activity);
    });

    return Object.keys(grouped).map((date) => ({
      key: date,
      logActivity: grouped[date],
    }));
  };

  useEffect(() => {
    const thisMonth = monthList[new Date().getMonth()];
    setCurrentRange(thisMonth.value);
  }, [currentYear]);

  useEffect(() => {
    if (currentRange) refetch();
  }, [currentRange, idCategories]);

  return {
    logActivity: getLogActivity(),
    isLoading,
    isRefetching,
    currentYear,
    currentRange,
    monthList,
    idCategories,
    setIdCategories,
    setCurrentYear,
    setCurrentRange,
  };
};
