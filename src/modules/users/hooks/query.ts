import {
  useQuery,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

import type {
  GetUsersRequest,
  UserResponse,
  UsersResponse,
} from "../models";
import { UserServices } from "../services";

export const userKeys = {
  all: ["users"] as const,
  lists: () => ["users", "list"] as const,
  list: (params?: GetUsersRequest) => ["users", "list", params] as const,
  detail: (id: string) => ["users", "detail", id] as const,
};

export const useUsers = (
  params?: GetUsersRequest,
  options?: UseQueryOptions<UsersResponse, AxiosError>
) =>
  useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => UserServices.get(params),
    ...options,
  });

export const useUserDetail = (
  userId: string,
  options?: UseQueryOptions<UserResponse, AxiosError>
) =>
  useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => UserServices.getDetail(userId),
    enabled: !!userId,
    ...options,
  });