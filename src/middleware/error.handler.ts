import type { NextFunction, Request, Response } from "express";
import { errorResponse } from "../utils/response";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error("ERROR:", err.message);

  const statusCode = err.message.includes("tidak ditemukan") ? 404 : 400;

  errorResponse(
    res,
    err.message || "terjadi kesalahan",
    statusCode,
    process.env.NODE_ENV === "development"
      ? ({ stack: err.stack } as { stack?: string })
      : null
  );
};
