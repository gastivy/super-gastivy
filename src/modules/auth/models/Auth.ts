import type { HttpResponse } from "@customTypes/HttpResponse";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenLogin {
  token: string;
}

export type LoginResponse = HttpResponse<TokenLogin>;

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface User {
  name?: string;
  password?: string;
  email?: string;
  id?: string;
  created_at?: Date;
  updated_at?: Date;
}

export type RegisterResponse = HttpResponse<User>;
