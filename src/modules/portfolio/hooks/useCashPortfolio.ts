import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import DexieDB from "@libs/dexieDB";

import type { CashPortfolioItem } from "../models/cashTypes";

const CASH_PORTFOLIO_QUERY_KEY = ["cashPortfolio"];

export const useGetCashPortfolio = () => {
  return useQuery({
    queryKey: CASH_PORTFOLIO_QUERY_KEY,
    queryFn: async () => {
      const items = await DexieDB.cashPortfolio.toArray();
      return items.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    },
  });
};

export const useAddCashPortfolio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: Omit<CashPortfolioItem, "id">) => {
      const id = await DexieDB.cashPortfolio.add(item);
      return { ...item, id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CASH_PORTFOLIO_QUERY_KEY });
    },
  });
};

export const useUpdateCashPortfolio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: {
      id: number;
      name?: string;
      value?: number;
    }) => {
      await DexieDB.cashPortfolio.update(id, updates);
      return { id, ...updates };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CASH_PORTFOLIO_QUERY_KEY });
    },
  });
};

export const useDeleteCashPortfolio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await DexieDB.cashPortfolio.delete(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CASH_PORTFOLIO_QUERY_KEY });
    },
  });
};
