import type { Response } from "express";

interface ApiResponse {
  success: boolean;
  message: string;
  data?: unknown;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  errors?:
    | Array<{
        field: string;
        message: string;
      }>
    | { stack?: string };
}

export const successResponse = (
  res: Response,
  message: string,
  data: unknown = null,
  pagination: { page: number; limit: number; total: number, totalPages: number } | null = null,
  statusCode: number = 200
) => {
  const response: ApiResponse = {
    success: true,
    message,
  };

  if (data !== null) {
    response.data = data;
  }
  if (pagination) response.pagination = pagination;

  return res.status(statusCode).json(response);
};

export const errorResponse = (
  res: Response,
  message: string,
  statusCode: number = 400,
  errors:
    | Array<{ field: string; message: string }>
    | { stack?: string }
    | null = null
) => {
  const response: ApiResponse = {
    success: false,
    message,
  };

  if (errors) response.errors = errors;

  return res.status(statusCode).json(response);
};