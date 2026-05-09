import { httpService } from "@libs/httpService";
import type {
  CreateUserRequest,
  GetUsersRequest,
  UpdateUserRequest,
} from "../models";

export const UserServices = {
  get: (params?: GetUsersRequest) =>
    httpService
      .get("/users", { params })
      .then((res) => res.data),

  getDetail: (userId: string) =>
    httpService
      .get(`/users/${userId}`)
      .then((res) => res.data),

  create: (payload: CreateUserRequest) =>
    httpService
      .post("/users", payload)
      .then((res) => res.data),

  update: (payload: UpdateUserRequest) =>
    httpService
      .patch(`/users/${payload.id}`, payload)
      .then((res) => res.data),

  delete: (userId: string) =>
    httpService
      .delete(`/users/${userId}`)
      .then((res) => res.data),
};