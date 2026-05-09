import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

import type {
  CreateUserRequest,
  UpdateUserRequest,
  UserResponse,
} from "../models";
import { UserServices } from "../services";

export const useCreateUser = (
  options?: UseMutationOptions<UserResponse, AxiosError, CreateUserRequest>
) =>
  useMutation({
    mutationFn: (data) => UserServices.create(data),
    ...options,
  });

export const useUpdateUser = (
  options?: UseMutationOptions<UserResponse, AxiosError, UpdateUserRequest>
) =>
  useMutation({
    mutationFn: (data) => UserServices.update(data),
    ...options,
  });

export const useDeleteUser = (
  options?: UseMutationOptions<void, AxiosError, string>
) =>
  useMutation({
    mutationFn: (userId) => UserServices.delete(userId),
    ...options,
  });