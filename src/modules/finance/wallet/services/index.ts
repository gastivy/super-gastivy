import { httpService } from "@libs/httpService";

import type {
  BalanceResponse,
  CreateWalletRequest,
  UpdateWalletRequest,
  WalletDetailResponse,
  WalletResponse,
} from "../models";

export const WalletServices = {
  get: () =>
    httpService
      .get<WalletResponse>("/finance-app/wallet")
      .then((res) => res.data),

  getBalance: () =>
    httpService
      .get<BalanceResponse>("/finance-app/wallet/balance")
      .then((res) => res.data),

  getDetail: (walletId: string) =>
    httpService
      .get<WalletDetailResponse>(`/finance-app/wallet/${walletId}`)
      .then((res) => res.data),

  create: (payload: CreateWalletRequest) =>
    httpService.post("/finance-app/wallet", payload).then((res) => res.data),

  update: (payload: UpdateWalletRequest) =>
    httpService.patch("/finance-app/wallet", payload).then((res) => res.data),
};
