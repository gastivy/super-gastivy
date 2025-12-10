import type { HttpResponse } from "@customTypes/HttpResponse";

export interface CategoryRequest {
  name: string;
  target: number;
}

export interface GetCategoryRequest {
  start_date?: string;
  end_date?: string;
  categoryId?: string[];
}

export interface UpdateCategoryRequest {
  id: string;
  name: string;
  target: number;
}

export interface DeleteCategoryRequest {
  categoryIds: string[];
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  target: number;
  seconds: number;
  minutes: number;
  start_date: Date;
  created_at: Date;
  updated_at: Date;
}

export type AllCategoryResponse = HttpResponse<Category[]>;
export type CategoryResponse = HttpResponse<Category>;
