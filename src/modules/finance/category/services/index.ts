import { httpService } from "@/utils/httpService";

import {
  CategoryTransactionRequest,
  CategoryTransactionResponse,
  DeleteCategoryTransactionRequest,
  DetailCategoryTransactionResponse,
  UpdateCategoryTransactionRequest,
} from "../models";

export const CategoryTransactionServices = {
  get: () =>
    httpService
      .get<CategoryTransactionResponse>("/finance-app/categories")
      .then((res) => res.data),

  getById: (categoryId: string) =>
    httpService
      .get<DetailCategoryTransactionResponse>(
        `/finance-app/categories/${categoryId}`
      )
      .then((res) => res.data),

  create: (payload: CategoryTransactionRequest) =>
    httpService
      .post("/finance-app/categories", payload)
      .then((res) => res.data),

  update: (payload: UpdateCategoryTransactionRequest) =>
    httpService
      .patch("/finance-app/categories", payload)
      .then((res) => res.data),

  delete: (payload: DeleteCategoryTransactionRequest) =>
    httpService
      .delete("/finance-app/categories", { data: payload })
      .then((res) => res.data),
};
