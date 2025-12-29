import { useMemo, useState } from "react";

import { dateTime, type RangeDate } from "@libs/dateTime";

import type { LogActivity, ParamsActivitesRequest } from "../models";
import { useInifiteGetActivity } from "./useActivity";

export const useFilterActivity = () => {
  const [idCategories, setIdCategories] = useState<string[]>([]);
  const [currentRange, setCurrentRange] = useState<RangeDate | undefined>();
  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear()
  );
  const monthList = dateTime.generateMonths(currentYear);
  const [params, setParams] = useState<ParamsActivitesRequest>({
    category_id: undefined,
    page: 1,
    limit: 50,
    start_date: undefined,
    end_date: undefined,
  });

  const {
    data,
    isLoading: isLoadingActivity,
    isRefetching: isRefetchingActivity,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInifiteGetActivity(params);

  const logActivity = useMemo(() => {
    const dataActivity = data?.pages?.flatMap((res) => res.data || []) || [];
    const grouped: { [key: string]: LogActivity[] } = {};

    dataActivity.forEach((activity: LogActivity) => {
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
  }, [data]);

  const isLoading = isLoadingActivity || isRefetchingActivity;

  return {
    logActivity,
    isLoading,
    currentYear,
    currentRange,
    monthList,
    idCategories,
    isFetchingNextPage,
    hasNextPage,
    params,
    setParams,
    fetchNextPage,
    setIdCategories,
    setCurrentYear,
    setCurrentRange,
  };
};
