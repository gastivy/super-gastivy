import DexieDB from "@libs/dexieDB";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { StockGroup } from "../models/stockTypes";

const STOCK_GROUP_QUERY_KEY = ["stockGroups"];

export const useGetStockGroups = () => {
  return useQuery({
    queryKey: STOCK_GROUP_QUERY_KEY,
    queryFn: async () => {
      const groups = await DexieDB.stockGroups.toArray();
      return groups.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    },
  });
};

export const useAddStockGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (group: Omit<StockGroup, "id">) => {
      const id = await DexieDB.stockGroups.add(group);
      return { ...group, id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STOCK_GROUP_QUERY_KEY });
    },
  });
};

export const useUpdateStockGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name }: { id: number; name: string }) => {
      await DexieDB.stockGroups.update(id, { name });
      return { id, name };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STOCK_GROUP_QUERY_KEY });
    },
  });
};

export const useDeleteStockGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      // Delete all items in this group first
      await DexieDB.stockPortfolio.where("groupId").equals(id).delete();
      // Then delete the group
      await DexieDB.stockGroups.delete(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STOCK_GROUP_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["stockPortfolio"] });
    },
  });
};