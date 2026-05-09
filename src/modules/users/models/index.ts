import type { HttpResponse } from "@custom-types/HttpResponse";

// ===================== Request Types =====================

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserRequest {
  id: string;
  name?: string;
  email?: string;
  password?: string;
  avatar?: string;
}

export interface GetUsersRequest {
  limit?: number;
  page?: number;
  search?: string;
}

// ===================== Response Types =====================

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export type UserResponse = HttpResponse<UserProfile>;
export type UsersResponse = HttpResponse<UserProfile[]>;