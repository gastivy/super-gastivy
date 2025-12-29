import type {
  HttpInfiniteResponse,
  HttpResponse,
} from "@custom-types/HttpResponse";

export interface Activity {
  category_id: string;
  start_date: Date | null;
  end_date: Date | null;
  is_done: boolean;
  description: string;
}

export interface LogActivity {
  id: string;
  user_id: string;
  category_id: string;
  start_date: Date;
  end_date: Date;
  is_done: boolean;
  seconds: number;
  description: string;
  category_name?: string;
}

export interface ParamsActivitesRequest {
  category_id?: string[];
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
}

export interface CreateActivityRequest {
  activities: Activity[];
}

export interface UpdateActivityRequest {
  id: string; // Activity ID
  category_id?: string;
  is_done: boolean;
  seconds: number;
  start_date: Date;
  end_date: Date;
}

export type LogActivityResponse = HttpResponse<LogActivity[]>;
export type LogActivityInfinityResponse =
  HttpInfiniteResponse<LogActivityResponse>;
