import { httpService } from "@libs/httpService";

import type {
  CreateActivityRequest,
  ParamsActivitesRequest,
  UpdateActivityRequest,
} from "../models";

export const ActivityServices = {
  getAll: (params?: ParamsActivitesRequest) =>
    httpService
      .get("/activity-app/activity", { params })
      .then((res) => res.data),

  create: (payload: CreateActivityRequest) =>
    httpService.post("/activity-app/activity", payload).then((res) => res.data),

  delete: (activityId: string) =>
    httpService
      .delete(`/activity-app/activity/${activityId}`)
      .then((res) => res.data),

  update: ({ id, ...payload }: UpdateActivityRequest) =>
    httpService
      .patch(`/activity-app/activity/${id}`, payload)
      .then((res) => res.data),
};
