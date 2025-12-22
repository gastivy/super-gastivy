import {
  useMutation,
  type UseMutationOptions,
  useQuery,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

import type {
  CreateActivityRequest,
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
