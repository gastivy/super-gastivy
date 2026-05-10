import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import DexieDB from "@libs/dexieDB";

import type { PortfolioGroup } from "../models/types";

const GROUP_QUERY_KEY = ["portfolioGroups"];

export const useGetGroups = () => {
  return useQuery({
    queryKey: GROUP_QUERY_KEY,
    queryFn: async () => {
      const groups = await DexieDB.portfolioGroups.toArray();
      return groups.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    },
  });
};

export const useAddGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (group: Omit<PortfolioGroup, "id">) => {
      const id = await DexieDB.portfolioGroups.add(group);
      return { ...group, id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GROUP_QUERY_KEY });
    },
  });
};

export const useUpdateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name }: { id: number; name: string }) => {
      await DexieDB.portfolioGroups.update(id, { name });
      return { id, name };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GROUP_QUERY_KEY });
    },
  });
};

export const useDeleteGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      // Delete all items in this group first
      await DexieDB.portfolio.where("groupId").equals(id).delete();
      // Then delete the group
      await DexieDB.portfolioGroups.delete(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GROUP_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
    },
  });
};
