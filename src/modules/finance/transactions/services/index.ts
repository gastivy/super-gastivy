import { httpService } from "@/utils/httpService";

import {
  CreateTransactionRequest,
  DetailTransactionsResponse,
  GetTransactionRequest,
  UpdateTransactionRequest,
} from "../models";

export const TransactionServices = {
  get: (params?: GetTransactionRequest) =>
    httpService
      .get("/finance-app/transactions", { params })
      .then((res) => res.data),

  getDetail: (transactionId: string) =>
    httpService
      .get<DetailTransactionsResponse>(
        `/finance-app/transactions/${transactionId}`
      )
      .then((res) => res.data),

  create: (payload: CreateTransactionRequest) =>
    httpService
      .post("/finance-app/transactions", payload)
      .then((res) => res.data),

  delete: (transactionId: string) =>
    httpService
      .delete(`/finance-app/transactions/${transactionId}`)
      .then((res) => res.data),

  update: (payload: UpdateTransactionRequest) =>
    httpService
      .patch(`/finance-app/transactions`, payload)
      .then((res) => res.data),
};
