import DexieDB from "@libs/dexieDB";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { StockItem } from "../models/stockTypes";

const STOCK_QUERY_KEY = ["stockPortfolio"];

export const useGetStockPortfolio = () => {
  return useQuery({
    queryKey: STOCK_QUERY_KEY,
    queryFn: async () => {
      const items = await DexieDB.stockPortfolio.toArray();
      return items.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    },
  });
};

export const useAddStockPortfolio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: Omit<StockItem, "id">) => {
      const id = await DexieDB.stockPortfolio.add(item);
      return { ...item, id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEY });
    },
  });
};

export const useUpdateStockPortfolio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, shares }: { id: number; shares: number }) => {
      await DexieDB.stockPortfolio.update(id, { shares });
      return { id, shares };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEY });
    },
  });
};

export const useDeleteStockPortfolio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await DexieDB.stockPortfolio.delete(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEY });
    },
  });
};