import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

import {
  CategoryTransactionRequest,
  CategoryTransactionResponse,
  DeleteCategoryTransactionRequest,
  DetailCategoryTransactionResponse,
  UpdateCategoryTransactionRequest,
} from "../models";
import { CategoryTransactionServices } from "../services";

export const useGetCategoryTransaction = (
  options?: UseQueryOptions<CategoryTransactionResponse>
) =>
  useQuery({
    queryKey: ["category-transaction"],
    queryFn: () => CategoryTransactionServices.get(),
    ...options,
  });

export const useGetDetailCategoryTransaction = (
  categoryId: string,
  options?: UseQueryOptions<DetailCategoryTransactionResponse>
) =>
  useQuery({
    queryKey: ["category-transaction-by-id", categoryId],
    queryFn: () => CategoryTransactionServices.getById(categoryId),
    ...options,
  });

export const useCreateCategoryTransaction = (
  options?: UseMutationOptions<void, AxiosError, CategoryTransactionRequest>
) =>
  useMutation({
    mutationFn: (data) => CategoryTransactionServices.create(data),
    ...options,
  });

export const useUpdateCategoryTransaction = (
  options?: UseMutationOptions<
    void,
    AxiosError,
    UpdateCategoryTransactionRequest
  >
) =>
  useMutation({
    mutationFn: (data) => CategoryTransactionServices.update(data),
    ...options,
  });

export const useDeleteCategoryTransaction = (
  options?: UseMutationOptions<
    void,
    AxiosError,
    DeleteCategoryTransactionRequest
  >
) =>
  useMutation({
    mutationFn: (data) => CategoryTransactionServices.delete(data),
    ...options,
  });
