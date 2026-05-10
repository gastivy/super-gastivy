import { httpService } from "@libs/httpService";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "@modules/auth/models/Auth";

export const AuthServices = {
  login: (payload: LoginRequest) =>
    httpService
      .post<LoginResponse>("/auth/login", payload)
      .then((res) => res.data),

  register: (payload: RegisterRequest) =>
    httpService
      .post<RegisterResponse>("/auth/register", payload)
      .then((res) => res.data),

  refresh: () =>
    httpService
      .post("/auth/refresh", {}, { withCredentials: true })
      .then((res) => res.data)
      .catch(() => {
        const windowObj = typeof window !== "undefined" ? window : undefined;

        const baseUrl = windowObj?.location.origin;
        const currentUrl = windowObj?.location.href;

        if (windowObj) {
          windowObj.location.href = `${baseUrl}/login?referrer=${currentUrl}`;
        }
      }),

  logout: () => httpService.post("/auth/logout").then((res) => res.data),
};
