import type { Request, Response } from "express";
import { successResponse } from "../utils/response.js";
import type { IProfileService } from "../service/profile.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export class ProfileController {
  constructor(private profileService: IProfileService) {}

  getProfileByIdHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const profile = await this.profileService.getProfileByUserId(userId);
    successResponse(res, "Profile berhasil diambil", profile);
  });

  updateProfileHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const updateData: any = { ...req.body };
    if (req.file) {
      updateData.avatar = `/uploads/${req.file.filename}`;
    }

    const profile = await this.profileService.updateProfile(userId, updateData);
    successResponse(res, "Profile berhasil diupdate", profile);
  });
}