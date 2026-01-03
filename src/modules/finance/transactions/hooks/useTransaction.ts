import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

import {
  CreateTransactionRequest,
  DetailTransactionsResponse,
  GetTransactionRequest,
  TransactionInfinteResponse,
  TransactionsResponse,
  UpdateTransactionRequest,
} from "../models";
import { TransactionServices } from "../services";

export const useCreateTransactions = (
  options?: UseMutationOptions<void, AxiosError, CreateTransactionRequest>
) =>
  useMutation({
    mutationFn: (data) => TransactionServices.create(data),
    ...options,
  });

export const useGetTransactions = (
  request?: GetTransactionRequest,
  options?: UseQueryOptions<TransactionsResponse>
) =>
  useQuery({
    queryKey: ["transactions", request],
    queryFn: () => TransactionServices.get(request),
    ...options,
  });

export const useInfiniteTransactions = (
  request: GetTransactionRequest,
  options?: UseInfiniteQueryOptions<
    TransactionsResponse,
    AxiosError,
    TransactionInfinteResponse,
    [string, GetTransactionRequest]
  >
) => {
  return useInfiniteQuery({
    queryKey: ["infinite-transactions", request],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const response = await TransactionServices.get({
          ...request,
          page: pageParam as number,
        });
        return response;
      } catch (error) {
        if ((error as AxiosError).response?.status === 404) {
          return {
            data: [],
            pagination: {
              current_page: pageParam,
              total_pages: 1,
            },
          };
        }
        throw error;
      }
    },
    getNextPageParam: (lastPage) => {
      const { current_page = 1, total_pages = 1 } = lastPage.pagination || {};
      if (current_page < total_pages) {
        return total_pages + 1;
      } else {
        return undefined;
      }
    },
    initialPageParam: 1,
    ...options,
  });
};

export const useGetDetailTransactions = (
  transactionId: string,
  options?: UseQueryOptions<DetailTransactionsResponse>
) =>
  useQuery({
    queryKey: ["detail-transaction"],
    queryFn: () => TransactionServices.getDetail(transactionId),
    ...options,
  });

export const useDeleteTransaction = (
  options?: UseMutationOptions<void, AxiosError, string>
) =>
  useMutation({
    mutationFn: (transactionId) => TransactionServices.delete(transactionId),
    ...options,
  });

export const useUpdateTransactions = (
  options?: UseMutationOptions<void, AxiosError, UpdateTransactionRequest>
) =>
  useMutation({
    mutationFn: (data) => TransactionServices.update(data),
    ...options,
  });
