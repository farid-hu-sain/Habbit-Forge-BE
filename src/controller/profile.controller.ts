import type { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/response";
import type { IProfileService } from "../service/profile.service";

export interface IProfileController {
  getProfileByIdHandler(req: Request, res: Response): Promise<void>;
  updateProfileHandler(req: Request, res: Response): Promise<void>;
}

export class ProfileController implements IProfileController {
  constructor(private profileService: IProfileService) {
    this.getProfileByIdHandler = this.getProfileByIdHandler.bind(this);
    this.updateProfileHandler = this.updateProfileHandler.bind(this);
  }

  async getProfileByIdHandler(req: Request, res: Response) {
    if (!req.params.id) {
      throw new Error("tidak ada param");
    }

    const profile = await this.profileService.getProfileById(req.params.id);

    successResponse(res, "profile sudah diambil", profile);
  }

  async updateProfileHandler(req: Request, res: Response) {
    try {
      const userId = req.params.id!;
      const updateData: any = { ...req.body };

      // ✅ Handle uploaded file
      if (req.file) {
        // File path relatif dari public folder
        updateData.avatar = `/uploads/${req.file.filename}`;
      }

      const profile = await this.profileService.updateProfile(
        userId,
        updateData
      );

      successResponse(res, "profile berhasil di update", profile);
    } catch (error: any) {
      errorResponse(res, error.message, 400);
    }
  }
}
