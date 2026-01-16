import type { Response, Request } from "express";
import * as authService from "../service/auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { successResponse } from "../utils/response.js";

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);
  successResponse(res, "Login sukses", result, null, 200);
});

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);
  successResponse(res, "Registrasi berhasil", result, null, 201);
});