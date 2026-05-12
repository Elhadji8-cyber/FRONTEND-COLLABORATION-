export interface ApiError {
  code?: string;
  message?: string;
}

export interface ApiResponse<T = unknown> {
  success?: boolean;
  data: T;
  message?: string;
  error?: ApiError | string;
}
