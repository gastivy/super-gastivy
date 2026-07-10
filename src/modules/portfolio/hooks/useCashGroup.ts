import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import DexieDB from "@libs/dexieDB";

import type { CashGroup } from "../models/cashTypes";

const CASH_GROUP_QUERY_KEY = ["cashGroups"];

export const useGetCashGroups = () => {
  return useQuery({
    queryKey: CASH_GROUP_QUERY_KEY,
    queryFn: async () => {
      const groups = await DexieDB.cashGroups.toArray();
      return groups.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    },
  });
};

export const useAddCashGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (group: Omit<CashGroup, "id">) => {
      const id = await DexieDB.cashGroups.add(group);
      return { ...group, id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CASH_GROUP_QUERY_KEY });
    },
  });
};

export const useUpdateCashGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name }: { id: number; name: string }) => {
      await DexieDB.cashGroups.update(id, { name });
      return { id, name };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CASH_GROUP_QUERY_KEY });
    },
  });
};

export const useDeleteCashGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      // Delete all items in this group first
      await DexieDB.cashPortfolio.where("groupId").equals(id).delete();
      // Then delete the group
      await DexieDB.cashGroups.delete(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CASH_GROUP_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["cashPortfolio"] });
    },
  });
};
