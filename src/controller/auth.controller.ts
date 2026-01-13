import type { Response, Request } from "express";
import * as authService from "../service/auth.service";
import { asyncHandler } from "../utils/asyncHandler";
import { successResponse } from "../utils/response";

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);
  successResponse(res, "Login sukses", result, null, 200);
});

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);
  successResponse(res, "Registrasi berhasil", result, null, 201);
});