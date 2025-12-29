import {
  useInfiniteQuery,
  type UseInfiniteQueryOptions,
  useMutation,
  type UseMutationOptions,
  useQuery,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

import type {
  CreateActivityRequest,
  LogActivityInfinityResponse,
  LogActivityResponse,
  ParamsActivitesRequest,
  UpdateActivityRequest,
} from "../models";
import { ActivityServices } from "../services";

export const useCreateActivity = (
  options?: UseMutationOptions<void, AxiosError, CreateActivityRequest>
) =>
  useMutation({
    mutationFn: (data) => ActivityServices.create(data),
    ...options,
  });

export const useGetActivity = (
  params?: ParamsActivitesRequest,
  options?: UseQueryOptions<LogActivityResponse>
) =>
  useQuery({
    queryKey: ["activities", params],
    queryFn: () => ActivityServices.getAll(params),
    ...options,
  });

export const useInifiteGetActivity = (
  params?: ParamsActivitesRequest,
  options?: UseInfiniteQueryOptions<
    LogActivityResponse,
    AxiosError,
    LogActivityInfinityResponse,
    [string, ParamsActivitesRequest | undefined]
  >
) => {
  return useInfiniteQuery({
    queryKey: ["infinity-activities", params],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const response = await ActivityServices.getAll({
          ...params,
          page: pageParam as number,
        });
        return response;
      } catch (error) {
        const err = error as AxiosError;

        if (err.response?.status === 404) {
          return {
            data: [],
            pagination: {
              current_page: pageParam,
              total_pages: pageParam,
            },
          };
        }

        throw error;
      }
    },
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.pagination?.current_page ?? 1;
      const totalPages = lastPage.pagination?.total_pages ?? 1;

      if (currentPage < totalPages) {
        return currentPage + 1; // ✅ FIX UTAMA
      }

      return undefined;
    },
    initialPageParam: 1,
    ...options,
  });
};

export const useDeleteActivity = (
  options?: UseMutationOptions<void, AxiosError, string>
) =>
  useMutation({
    mutationFn: (activityId) => ActivityServices.delete(activityId),
    ...options,
  });

export const useUpdateActivity = (
  options?: UseMutationOptions<void, AxiosError, UpdateActivityRequest>
) =>
  useMutation({
    mutationFn: (data) => ActivityServices.update(data),
    ...options,
  });
