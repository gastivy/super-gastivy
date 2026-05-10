import { useQuery } from "@tanstack/react-query";

import useDebounce from "@hooks/useDebounce";

import type { StockItem } from "../models/stockTypes";
import { YahooFinanceService } from "../services/yahooFinance";

export const useExchangeRate = () => {
  return useQuery({
    queryKey: ["exchangeRate"],
    queryFn: async () => {
      return await YahooFinanceService.getExchangeRate();
    },
    staleTime: 300_000, // 5 minutes
    refetchInterval: 300_000,
  });
};

export const useStockPrices = (stockItems: StockItem[]) => {
  const symbols = [...new Set(stockItems.map((item) => item.symbol))];

  return useQuery({
    queryKey: ["stockPrices", symbols],
    queryFn: async () => {
      return await YahooFinanceService.getQuotes(symbols);
    },
    enabled: symbols.length > 0,
    staleTime: 60_000,
    refetchInterval: 60_000,
  });
};

export const useStockSearch = (query: string) => {
  const debouncedQuery = useDebounce(query.trim(), 700);

  return useQuery({
    queryKey: ["stockSearch", debouncedQuery.toUpperCase()],
    queryFn: async () => {
      return await YahooFinanceService.searchStocks(debouncedQuery);
    },
    enabled: debouncedQuery.length >= 1,
    staleTime: 30_000,
  });
};
