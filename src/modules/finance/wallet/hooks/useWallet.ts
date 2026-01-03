import {
  useMutation,
  type UseMutationOptions,
  useQuery,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

import type {
  BalanceResponse,
  CreateWalletRequest,
  UpdateWalletRequest,
  WalletDetailResponse,
  WalletResponse,
} from "../models";
import { WalletServices } from "../services";

export const useGetWallet = (options?: UseQueryOptions<WalletResponse>) =>
  useQuery({
    queryKey: ["wallet"],
    queryFn: () => WalletServices.get(),
    ...options,
  });

export const useCreateWallet = (
  options?: UseMutationOptions<void, AxiosError, CreateWalletRequest>
) =>
  useMutation({
    mutationFn: (data) => WalletServices.create(data),
    ...options,
  });

export const useGetBalance = (options?: UseQueryOptions<BalanceResponse>) =>
  useQuery({
    queryKey: ["balance"],
    queryFn: () => WalletServices.getBalance(),
    ...options,
  });

export const useGetDetailWallet = (
  walletId: string,
  options?: UseQueryOptions<WalletDetailResponse>
) =>
  useQuery({
    queryKey: ["wallet-detail", walletId],
    queryFn: () => WalletServices.getDetail(walletId),
    ...options,
  });

export const useUpdateWallet = (
  options?: UseMutationOptions<void, AxiosError, UpdateWalletRequest>
) =>
  useMutation({
    mutationFn: (data) => WalletServices.update(data),
    ...options,
  });
