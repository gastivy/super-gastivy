import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

import type { HttpResponse } from "@custom-types/HttpResponse";
import { httpService } from "@libs/httpService";

import type { User } from "../models/Auth";

export const authKeys = {
  all: ["auth"] as const,
  currentUser: ["auth", "currentUser"] as const,
};

export const useCurrentUser = (
  options?: UseQueryOptions<HttpResponse<User>, AxiosError>
) =>
  useQuery({
    queryKey: authKeys.currentUser,
    queryFn: () =>
      httpService.get<HttpResponse<User>>("/auth/me").then((res) => res.data),
    ...options,
  });
