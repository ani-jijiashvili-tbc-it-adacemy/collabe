export interface ApiError {
  code: string;
  message: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
}

export interface ApiErrorResponse {
  error: ApiError;
  timestamp: string;
}
export interface FormFieldError {
  field: string;
  message: string;
}