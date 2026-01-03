import { HttpResponse } from "@/types/HttpResponse";

export interface CategoryTransactionRequest {
  name: string;
  type: number;
}

export interface UpdateCategoryTransactionRequest {
  id: string;
  name: string;
  type: number;
}

export interface DeleteCategoryTransactionRequest {
  categoryId: string;
}

export enum TypesTransactions {
  INCOME = 1,
  EXPENSES = 2,
  TRANSFER = 3,
  FEE_TRANSFER = 4,
  PROFIT = 5,
  LOSS = 6,
}

export interface CategoryTransaction {
  id: string;
  name: string;
  type: TypesTransactions;
}

export type CategoryTransactionResponse = HttpResponse<CategoryTransaction[]>;
export type DetailCategoryTransactionResponse =
  HttpResponse<CategoryTransaction>;
