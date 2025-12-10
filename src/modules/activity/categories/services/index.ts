import { httpService } from "@libs/httpService";

import type {
  AllCategoryResponse,
  CategoryRequest,
  CategoryResponse,
  DeleteCategoryRequest,
  GetCategoryRequest,
  UpdateCategoryRequest,
} from "../models";

export const CategoryServices = {
  getAll: (params?: GetCategoryRequest) =>
    httpService
      .get<AllCategoryResponse>("/activity-app/categories", { params })
      .then((res) => res.data),

  getList: () =>
    httpService
      .get<AllCategoryResponse>("/activity-app/categories/list")
      .then((res) => res.data),

  getById: (categoryId: string) =>
    httpService
      .get<CategoryResponse>(`/activity-app/categories/${categoryId}`)
      .then((res) => res.data),

  create: (payload: CategoryRequest) =>
    httpService
      .post("/activity-app/categories", payload)
      .then((res) => res.data),

  update: (payload: UpdateCategoryRequest) =>
    httpService
      .patch("/activity-app/categories", payload)
      .then((res) => res.data),

  delete: (payload: DeleteCategoryRequest) =>
    httpService
      .delete("/activity-app/categories", { data: payload })
      .then((res) => res.data),
};
