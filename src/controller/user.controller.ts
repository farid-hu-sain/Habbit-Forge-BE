import type { Request, Response } from "express";
import { successResponse } from "../utils/response";
import { UserService } from "../service/user.service";
import { asyncHandler } from "../utils/asyncHandler";

export class UserController {
  constructor(private userService: UserService) {}

  getCurrentUserHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const user = await this.userService.getCurrentUser(userId);
    successResponse(res, "User data retrieved", user);
  });
}