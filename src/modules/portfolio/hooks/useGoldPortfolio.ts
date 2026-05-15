import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import axios from "axios";
import DexieDB from "@libs/dexieDB";

import type { GoldItem, GoldPriceData } from "../models/goldTypes";

const GOLD_PORTFOLIO_QUERY_KEY = ["goldPortfolio"];
const GOLD_PRICE_QUERY_KEY = ["goldPrice"];

// --- Gold Portfolio CRUD ---

export const useGetGoldPortfolio = () => {
  return useQuery({
    queryKey: GOLD_PORTFOLIO_QUERY_KEY,
    queryFn: async () => {
      const items = await DexieDB.goldPortfolio.toArray();
      return items.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    },
  });
};

export const useAddGoldPortfolio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: Omit<GoldItem, "id">) => {
      const id = await DexieDB.goldPortfolio.add(item);
      return { ...item, id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GOLD_PORTFOLIO_QUERY_KEY });
    },
  });
};

export const useUpdateGoldPortfolio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: {
      id: number;
      name?: string;
      grams?: number;
    }) => {
      await DexieDB.goldPortfolio.update(id, updates);
      return { id, ...updates };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GOLD_PORTFOLIO_QUERY_KEY });
    },
  });
};

export const useDeleteGoldPortfolio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await DexieDB.goldPortfolio.delete(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GOLD_PORTFOLIO_QUERY_KEY });
    },
  });
};

// --- Gold Price API ---

const GOLD_API_URL =
  "https://api-pluang.pluang.com/api/v3/asset/gold/pricing";

interface GoldPriceResponse {
  statusCode: number;
  data: {
    currency: string;
    current: {
      midPrice: number;
      sell: number;
      buy: number;
      installment: number;
      updated_at: string;
      priceChanges: {
        ONE_DAY: number;
        ONE_WEEK: number;
        ONE_MONTH: number;
        SIX_MONTH: number;
        ONE_YEAR: number;
        THREE_YEAR: number;
        FIVE_YEAR: number;
      };
    };
  };
}

export const useGoldPrice = () => {
  return useQuery({
    queryKey: GOLD_PRICE_QUERY_KEY,
    queryFn: async (): Promise<GoldPriceData> => {
      const response = await axios.get<GoldPriceResponse>(GOLD_API_URL);
      const current = response.data.data.current;
      return {
        currency: response.data.data.currency,
        midPrice: current.midPrice,
        sell: current.sell,
        buy: current.buy,
        updatedAt: current.updated_at,
        priceChanges: current.priceChanges,
      };
    },
    refetchInterval: 60000, // Refetch every 60 seconds
    staleTime: 30000, // Consider data stale after 30 seconds
  });
};