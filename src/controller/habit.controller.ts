import type { Request, Response } from "express";
import { successResponse } from "../utils/response.js";
import type { IHabitService } from "../service/habit.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Frequency } from "@prisma/client";

export class HabitController {
  constructor(private habitService: IHabitService) {}

  getAllHabitHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search as any;
    const sortBy = req.query.sortBy as string;
    const sortOrder = (req.query.sortOrder as "asc" | "desc") || "desc";

    const result = await this.habitService.getAll(
      {
        page,
        limit,
        search,
        sortBy,
        sortOrder,
      },
      userId // ⭐ KIRIM userId
    );

    const pagination = {
      page: result.currentPage,
      limit,
      total: result.total,
      totalPages: result.totalPages,
    };

    successResponse(
      res,
      "Daftar habit berhasil diambil",
      result.habit,
      pagination
    );
  });

  getHabitByIdHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const habitId = req.params.id;
    if (!habitId) throw new Error("Habit ID diperlukan");

    const habit = await this.habitService.getHabitById(habitId, userId);
    successResponse(res, "Habit berhasil diambil", habit);
  });

  createHabitHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const { title, description, isActive, categoryId, startDate, frequency } = req.body;
    
    if (!title) throw new Error("Title diperlukan");
    if (!startDate) throw new Error("startDate diperlukan");
    if (!frequency) throw new Error("frequency diperlukan");

    const normalizedStartDate = new Date(`${startDate}T00:00:00Z`);
    if (isNaN(normalizedStartDate.getTime())) {
      throw new Error("Format startDate tidak valid (YYYY-MM-DD)");
    }

    if (!Object.values(Frequency).includes(frequency)) {
      throw new Error("Frequency tidak valid");
    }
    
    const habit = await this.habitService.createHabit({
      title,
      description,
      isActive,
      userId,
      categoryId,
      startDate,
      frequency
    });

    successResponse(res, "Habit berhasil dibuat", habit, null, 201);
  });

  updateHabitHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const habitId = req.params.id;
    if (!habitId) throw new Error("Habit ID diperlukan");

    const habit = await this.habitService.updateHabit(habitId, req.body, userId);
    successResponse(res, "Habit berhasil diupdate", habit);
  });

  deleteHabitHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const habitId = req.params.id;
    if (!habitId) throw new Error("Habit ID diperlukan");

    const deleted = await this.habitService.deleteHabit(habitId, userId);
    successResponse(res, "Habit berhasil dihapus", deleted);
  });

  toggleHabitHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const habitId = req.params.id;
    if (!habitId) throw new Error("Habit ID diperlukan");

    const toggledHabit = await this.habitService.toggleHabit(habitId, userId);
    
    const message = toggledHabit.isActive 
      ? "Habit berhasil diaktifkan" 
      : "Habit berhasil dinonaktifkan";
    
    successResponse(res, message, toggledHabit);
  });
}