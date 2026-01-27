import type { Request, Response } from "express";
import { successResponse } from "../utils/response.js";
import type { IHabitService } from "../service/habit.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Frequency } from "@prisma/client";
import { isValidDateString } from "../utils/timeUtils.js";

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
    const date = req.query.date as string; // 🆕 Filter check-ins by date
    const showInactive = req.query.showInactive === "true"; // 🆕 Show inactive habits

    // 🆕 Validasi format tanggal jika ada
    if (date && !isValidDateString(date)) {
      throw new Error("Format tanggal harus YYYY-MM-DD");
    }

    const result = await this.habitService.getAll(
      {
        page,
        limit,
        search,
        sortBy,
        sortOrder,
        includeCheckInsForDate: date, // 🆕 Pass date parameter
        showInactive, // 🆕 Pass showInactive parameter
      },
      userId,
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
      result.habits,
      pagination,
    );
  });

  getHabitByIdHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const habitId = req.params.id;
    if (!habitId) throw new Error("Habit ID diperlukan");

    const date = req.query.date as string; // 🆕 Optional date filter

    let habit;
    if (date) {
      // 🆕 Get habit with check-ins for specific date
      if (!isValidDateString(date)) {
        throw new Error("Format tanggal harus YYYY-MM-DD");
      }
      // Note: Service perlu method getHabitWithCheckIns
      // Untuk sekarang pakai getHabitById dulu
      habit = await this.habitService.getHabitById(habitId, userId);
    } else {
      habit = await this.habitService.getHabitById(habitId, userId);
    }

    successResponse(res, "Habit berhasil diambil", habit);
  });

  createHabitHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const { title, description, isActive, categoryId, startDate, frequency } =
      req.body;

    if (!title) throw new Error("Title diperlukan");
    if (!startDate) throw new Error("startDate diperlukan");
    if (!frequency) throw new Error("frequency diperlukan");

    // Validasi format tanggal
    if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
      throw new Error("Format startDate harus YYYY-MM-DD");
    }

    if (!isValidDateString(startDate)) {
      throw new Error("Tanggal tidak valid");
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
      frequency,
    });

    successResponse(res, "Habit berhasil dibuat", habit, null, 201);
  });

  updateHabitHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const habitId = req.params.id;
    if (!habitId) throw new Error("Habit ID diperlukan");

    // Validasi format tanggal jika di-update
    if (req.body.startDate) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(req.body.startDate)) {
        throw new Error("Format startDate harus YYYY-MM-DD");
      }
      if (!isValidDateString(req.body.startDate)) {
        throw new Error("Tanggal tidak valid");
      }
    }

    const habit = await this.habitService.updateHabit(
      habitId,
      req.body,
      userId,
    );
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

  // 🆕 Endpoint khusus untuk dashboard (hanya habit aktif dengan status hari ini)
  getHabitsWithTodayStatusHandler = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = req.user?.id;
      if (!userId) throw new Error("Unauthorized");

      const habitsWithStatus =
        await this.habitService.getHabitsWithTodayStatus(userId);

      successResponse(
        res,
        "Habits dengan status check-in hari ini berhasil diambil",
        habitsWithStatus,
      );
    },
  );
}
