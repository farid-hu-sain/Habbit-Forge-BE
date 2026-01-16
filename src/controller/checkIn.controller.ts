import type { Request, Response } from "express";
import { successResponse } from "../utils/response.js";
import type { ICheckInService } from "../service/checkIn.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export class CheckInController {
  constructor(private checkInService: ICheckInService) {}

  getCheckInByIdHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const checkInId = req.params.id;
    if (!checkInId) throw new Error("CheckIn ID diperlukan");

    const checkIn = await this.checkInService.getCheckInById(checkInId, userId);
    successResponse(res, "CheckIn berhasil diambil", checkIn);
  });

  createCheckInHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const { habitId, note } = req.body;
    
    if (!habitId) throw new Error("Habit ID diperlukan");

    const checkIn = await this.checkInService.createCheckIn({
      habitId,
      userId,
      note
    });

    successResponse(res, "CheckIn berhasil dibuat", checkIn, null, 201);
  });

  updateCheckInHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const checkInId = req.params.id;
    if (!checkInId) throw new Error("CheckIn ID diperlukan");

    const checkIn = await this.checkInService.updateCheckIn(
      checkInId, 
      req.body, 
      userId
    );
    
    successResponse(res, "CheckIn berhasil diupdate", checkIn);
  });

  deleteCheckInHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const checkInId = req.params.id;
    if (!checkInId) throw new Error("CheckIn ID diperlukan");

    const deleted = await this.checkInService.deleteCheckIn(checkInId, userId);
    
    successResponse(res, "CheckIn berhasil dihapus", deleted);
  });
}