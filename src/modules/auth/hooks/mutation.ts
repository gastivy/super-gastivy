import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "../models/Auth";
import { AuthServices } from "../services";

export const useLogin = (
  options?: UseMutationOptions<LoginResponse, AxiosError, LoginRequest>
) =>
  useMutation({
    mutationFn: (data) => AuthServices.login(data),
    ...options,
  });

export const useRegister = (
  options?: UseMutationOptions<RegisterResponse, AxiosError, RegisterRequest>
) =>
  useMutation({
    mutationFn: (data) => AuthServices.register(data),
    ...options,
  });

export const useLogout = (options?: UseMutationOptions<unknown, AxiosError>) =>
  useMutation({
    mutationFn: () => AuthServices.logout(),
    ...options,
  });
