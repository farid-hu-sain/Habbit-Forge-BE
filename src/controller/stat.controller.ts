import type { Request, Response } from "express";
import prisma from "../database";
import { asyncHandler } from "../utils/asyncHandler";
import { successResponse } from "../utils/response";

export const getHabitStreak = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const habitId = req.params.id;

  if (!userId || !habitId) {
    throw new Error("Bad request");
  }

  // ⭐ VALIDASI HABIT MILIK USER
  const habit = await prisma.habit.findFirst({
    where: { id: habitId, userId },
  });
  
  if (!habit) throw new Error("Habit not found");

  let streak = 0;
  let date = new Date();
  date.setHours(0, 0, 0, 0);

  while (true) {
    const checkIn = await prisma.checkIn.findFirst({
      where: {
        habitId: habitId,
        date: { gte: date, lt: new Date(date.getTime() + 86400000) },
      },
    });
    if (!checkIn) break;
    streak++;
    date.setDate(date.getDate() - 1);
  }

  successResponse(res, "Streak berhasil diambil", { habitId, streak });
});

export const getMonthlyStats = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) throw new Error("Unauthorized");

  const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  const habits = await prisma.habit.count({
    where: { userId, isActive: true },
  });
  
  const checkIns = await prisma.checkIn.count({
    where: { userId, date: { gte: firstDay } },
  });

  const days = new Date().getDate();
  const completion = habits > 0 ? Math.round((checkIns / (habits * days)) * 100) : 0;

  successResponse(res, "Statistik bulanan berhasil diambil", { 
    habits, 
    checkIns, 
    completion 
  });
});