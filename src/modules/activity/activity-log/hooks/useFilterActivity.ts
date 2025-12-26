import { useEffect, useState } from "react";

import { dateTime, type RangeDate } from "@libs/dateTime";

import type { LogActivity } from "../models";
import { useGetActivity } from "./useActivity";

export const useFilterActivity = () => {
  const [idCategories, setIdCategories] = useState<string[]>([]);
  const [currentRange, setCurrentRange] = useState<RangeDate | undefined>();
  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear()
  );
  const monthList = dateTime.generateMonths(currentYear);

  const { data, isLoading, isRefetching, refetch } = useGetActivity(
    {
      ...(idCategories.length > 0 && { category_id: idCategories }),
      start_date: currentRange?.start_date,
      end_date: currentRange?.end_date,
    }
    // {
    //   enabled:
    //     Boolean(currentRange?.start_date && currentRange.end_date) ||
    //     idCategories.length > 0,
    //   queryKey: ["activities", currentRange],
    // }
  );

  const logActivity = (() => {
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
  })();

  // useEffect(() => {
  //   const thisMonth = monthList[new Date().getMonth()];
  //   setCurrentRange(thisMonth.value);
  // }, [currentYear]);

  useEffect(() => {
    if (currentRange) refetch();
  }, [currentRange, idCategories]);

  return {
    logActivity,
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
