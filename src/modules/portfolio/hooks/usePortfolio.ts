import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import DexieDB from "@libs/dexieDB";

import type { PortfolioItem } from "../models/types";

const PORTFOLIO_QUERY_KEY = ["portfolio"];

export const useGetPortfolio = () => {
  return useQuery({
    queryKey: PORTFOLIO_QUERY_KEY,
    queryFn: async () => {
      const items = await DexieDB.portfolio.toArray();
      return items.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    },
  });
};

export const useAddPortfolio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: Omit<PortfolioItem, "id">) => {
      const id = await DexieDB.portfolio.add(item);
      return { ...item, id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PORTFOLIO_QUERY_KEY });
    },
  });
};

export const useUpdatePortfolio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, amount }: { id: number; amount: number }) => {
      await DexieDB.portfolio.update(id, { amount });
      return { id, amount };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PORTFOLIO_QUERY_KEY });
    },
  });
};

export const useDeletePortfolio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await DexieDB.portfolio.delete(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PORTFOLIO_QUERY_KEY });
    },
  });
};
