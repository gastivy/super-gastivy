import {
  useMutation,
  type UseMutationOptions,
  useQuery,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

import type {
  AllCategoryResponse,
  CategoryRequest,
  CategoryResponse,
  DeleteCategoryRequest,
  GetCategoryRequest,
  UpdateCategoryRequest,
} from "../models";
import { CategoryServices } from "../services";

export const useGetCategory = (
  params?: GetCategoryRequest,
  options?: UseQueryOptions<AllCategoryResponse>
) =>
  useQuery({
    queryKey: ["all-category", params],
    queryFn: () => CategoryServices.getAll(params),
    ...options,
  });

export const useGetListCategory = (
  options?: UseQueryOptions<AllCategoryResponse>
) =>
  useQuery({
    queryKey: ["list-category"],
    queryFn: () => CategoryServices.getList(),
    ...options,
  });

export const useGetCategoryById = (
  categoryId: string,
  options?: UseQueryOptions<CategoryResponse>
) =>
  useQuery({
    queryKey: ["category-by-id", categoryId],
    queryFn: () => CategoryServices.getById(categoryId),
    ...options,
  });

export const useUpdateCategory = (
  options?: UseMutationOptions<void, AxiosError, UpdateCategoryRequest>
) =>
  useMutation({
    mutationFn: (data) => CategoryServices.update(data),
    ...options,
  });

export const useCreateCategory = (
  options?: UseMutationOptions<void, AxiosError, CategoryRequest>
) =>
  useMutation({
    mutationFn: (data) => CategoryServices.create(data),
    ...options,
  });

export const useDeleteCategory = (
  options?: UseMutationOptions<void, AxiosError, DeleteCategoryRequest>
) =>
  useMutation({
    mutationFn: (data) => CategoryServices.delete(data),
    ...options,
  });
