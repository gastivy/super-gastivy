import { useState } from "react";

import { dateTime } from "@libs/dateTime";

import { useGetCategory } from "../categories/hooks/useCategory";

interface Range {
  start_date?: string;
  end_date?: string;
}

export interface ListTab {
  name: string;
  value: string;
  range: Range;
}

export const useSummaryActivity = () => {
  const [currentTab, setCurrentTab] = useState("all");

  const rangeDaily = dateTime.getRangeDaily();
  const rangeWeekly = dateTime.getRangeWeekly();
  const rangeMonthly = dateTime.getRangeThisMonth();
  const rangeYearly = dateTime.getRangeThisYear();

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleChangeRange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const listTab: ListTab[] = [
    { name: "All", value: "all", range: {} },
    { name: "Daily", value: "day", range: rangeDaily },
    { name: "Weekly", value: "week", range: rangeWeekly },
    {
      name: "Monthly",
      value: "month",
      range: rangeMonthly,
    },
    {
      name: "Yearly",
      value: "year",
      range: rangeYearly,
    },
    {
      name: "Custom",
      value: "custom",
      range: {},
    },
  ];
  const selectedTypeSummary = listTab.find((item) => item.value === currentTab);

  const params =
    currentTab === "custom"
      ? {
          start_date: dateTime.formatDate(startDate || new Date()),
          end_date: dateTime.formatDate(endDate || new Date()),
        }
      : selectedTypeSummary?.range;
  const { data, isLoading, isRefetching, refetch } = useGetCategory({
    ...params,
  });

  return {
    currentTab,
    data,
    isLoading,
    isRefetching,
    listTab,
    selectedTypeSummary,
    startDate,
    endDate,
    refetch,
    setCurrentTab,
    handleChangeRange,
  };
};
