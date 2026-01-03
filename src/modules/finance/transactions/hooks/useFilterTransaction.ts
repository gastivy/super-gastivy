import { useQueryClient } from "@tanstack/react-query";
import { useDisclosure } from "astarva-ui";
import { useEffect, useState } from "react";

import { dateTime, RangeDate } from "@/utils/dateTime";
import { lodash } from "@/utils/lodash";

import { useInfiniteTransactions } from "./useTransaction";

export const useFilterTransactions = () => {
  const queryClient = useQueryClient();
  const [currentRange, setCurrentRange] = useState<Partial<RangeDate>>({});
  const [currentYear, setCurrentYear] = useState<number>(0);
  const [idCategories, setIdCategories] = useState<string[]>([]);
  const [idsWallet, setIdsWallet] = useState<string[]>([]);
  const filterDisclosure = useDisclosure({ open: false });

  const optionsTab = [
    { label: "All", value: {} },
    ...dateTime.generateMonths(currentYear),
  ];

  const yearList = [
    { label: "All The Time", value: 0 },
    ...dateTime
      .generateYears(2010)
      .sort((a, b) => b - a)
      .map((year) => ({ label: String(year), value: year })),
  ];

  const {
    isRefetching,
    isLoading,
    isFetchingNextPage,
    data,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteTransactions(
    {
      ...(!lodash.isObjectEmpty(currentRange) && { ...currentRange }),
      ...(idCategories.length > 0 && { category_ids: idCategories }),
      ...(idsWallet.length > 0 && { wallet_ids: idsWallet }),
    },
    {
      enabled: Boolean(currentRange),
      queryKey: ["transactions", currentRange],
      retry: 0,
      getNextPageParam: (lastPage) => {
        const { current_page = 1, total_pages = 1 } = lastPage.pagination || {};
        if (current_page < total_pages) {
          return current_page + 1;
        } else {
          return undefined;
        }
      },
      initialPageParam: 1,
    }
  );

  useEffect(() => {
    if (!lodash.isObjectEmpty(currentRange)) {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    }
  }, [currentRange, idCategories, idsWallet]);

  return {
    currentRange,
    currentYear,
    data,
    filterDisclosure,
    idCategories,
    idsWallet,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    hasNextPage,
    optionsTab,
    yearList,
    fetchNextPage,
    refetch,
    setCurrentRange,
    setCurrentYear,
    setIdCategories,
    setIdsWallet,
  };
};
