interface Pagination {
  total_pages: number;
  current_page: number;
  total_data: number;
}

export interface HttpResponse<T> {
  data: T;
  code: number;
  message: string;
  pagination?: Pagination;
}

export interface HttpInfiniteResponse<T> {
  pages: T[];
  pageParams: number[];
}
