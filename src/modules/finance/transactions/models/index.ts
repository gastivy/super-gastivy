import { HttpInfiniteResponse, HttpResponse } from "@/types/HttpResponse";

export type TransactionsResponse = HttpResponse<Transactions[]>;
export type TransactionInfinteResponse =
  HttpInfiniteResponse<TransactionsResponse>;
export type DetailTransactionsResponse = HttpResponse<DetailTransaction>;

interface TransactionRequest {
  category_id: string;
  name: string;
  description?: string;
  from_wallet?: string;
  to_wallet?: string;
  money: number;
  date: Date;
  fee?: number;
}

export interface CreateTransactionRequest {
  transactions: TransactionRequest[];
}

export interface UpdateTransactionRequest extends TransactionRequest {}

export interface Transactions {
  id: string;
  category_id: string;
  category_name: string;
  name: string;
  description: string | null;
  money: number;
  date: Date;
  from_wallet_name: string | null;
  to_wallet_name: string | null;
  type: 1 | 2 | 3;
}

export interface DetailTransaction {
  id: string;
  category_id: string;
  category_name: string;
  name: string;
  description: string | null;
  money: number;
  date: Date;
  from_wallet: string | null;
  to_wallet: string | null;
  type: 1 | 2 | 3;
  fee?: number;
}

export interface GetTransactionRequest {
  limit?: number;
  page?: number;
  start_date?: string;
  end_date?: string;
  category_ids?: string[];
  wallet_ids?: string[];
}
