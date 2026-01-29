import type { Request, Response } from "express";
import prisma from "../database.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { successResponse } from "../utils/response.js";
import {
  formatDateForFE,
  parseDateFromFE,
  addDays,
  getTodayDateString,
} from "../utils/timeUtils.js";

export const getHabitStreak = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const habitId = req.params.id;

    if (!userId || !habitId) {
      throw new Error("Bad request");
    }

    const habit = await prisma.habit.findFirst({
      where: { id: habitId, userId },
    });

    if (!habit) throw new Error("Habit not found");

    // Hitung streak real-time (UTC)
    const streak = await calculateHabitStreakOptimized(habitId);

    successResponse(res, "Streak berhasil diambil", {
      habitId,
      streak,
      habitTitle: habit.title,
      startDate: formatDateForFE(habit.startDate),
      startDateDisplay: formatToIndonesianDate(habit.startDate), // ✅ Added display date
    });
  },
);

export const getMonthlyStats = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const today = new Date();
    const firstDayOfMonth = new Date(
      Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1),
    );

    const habits = await prisma.habit.count({
      where: { userId, isActive: true },
    });

    const checkIns = await prisma.checkIn.count({
      where: {
        userId,
        date: { gte: firstDayOfMonth },
      },
    });

    const daysInMonth = today.getUTCDate();
    const completion =
      habits > 0 ? Math.round((checkIns / (habits * daysInMonth)) * 100) : 0;

    // Ambil semua habits aktif untuk hitung streak
    const allHabits = await prisma.habit.findMany({
      where: {
        userId,
        isActive: true,
      },
      select: {
        id: true,
        title: true,
        startDate: true,
        category: true,
      },
    });

    // Hitung streak untuk setiap habit
    const habitsWithStreak = await Promise.all(
      allHabits.map(async (habit) => {
        const streak = await calculateHabitStreakOptimized(habit.id);
        return {
          id: habit.id,
          title: habit.title,
          streak,
          startDate: formatDateForFE(habit.startDate),
          startDateDisplay: formatToIndonesianDate(habit.startDate), // ✅ Added
          category: habit.category || "No category",
        };
      }),
    );

    // Sort by streak desc dan ambil top 3
    const topHabits = habitsWithStreak
      .sort((a, b) => b.streak - a.streak)
      .slice(0, 3);

    successResponse(res, "Statistik bulanan berhasil diambil", {
      habits,
      checkIns,
      completion,
      month: today.toLocaleDateString("id-ID", {
        month: "long",
        year: "numeric",
        timeZone: "Asia/Jakarta", // ✅ FIXED: Display month in Indonesia time
      }),
      topHabits,
    });
  },
);

// Helper function untuk hitung streak habit (UTC)
async function calculateHabitStreakOptimized(habitId: string): Promise<number> {
  const ninetyDaysAgoStr = addDays(getTodayDateString(), -90);

  const checkIns = await prisma.checkIn.findMany({
    where: {
      habitId,
      date: { gte: parseDateFromFE(ninetyDaysAgoStr) },
    },
    select: { date: true },
    orderBy: { date: "desc" },
  });

  const checkInDates = new Set<string>();
  checkIns.forEach((checkIn) => {
    const dateStr = formatDateForFE(checkIn.date);
    checkInDates.add(dateStr);
  });

  let streak = 0;
  let currentDateStr = getTodayDateString();

  for (let i = 0; i < 90; i++) {
    if (checkInDates.has(currentDateStr)) {
      streak++;
      currentDateStr = addDays(currentDateStr, -1);
    } else {
      break;
    }
  }

  return streak;
}

export const getWeeklyProgress = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const habitId = req.params.id;

    if (!userId || !habitId) {
      throw new Error("Bad request");
    }

    const habit = await prisma.habit.findFirst({
      where: { id: habitId, userId },
    });

    if (!habit) throw new Error("Habit not found");

    // Ambil check-ins 7 hari terakhir (UTC)
    const sevenDaysAgoStr = addDays(getTodayDateString(), -6);

    const checkIns = await prisma.checkIn.findMany({
      where: {
        habitId,
        date: { gte: parseDateFromFE(sevenDaysAgoStr) },
      },
      select: { date: true },
    });

    // Group by day (UTC dates)
    const checkInsByDay = new Set<string>();
    checkIns.forEach((checkIn) => {
      const dateStr = formatDateForFE(checkIn.date);
      checkInsByDay.add(dateStr);
    });

    // Format response (7 hari terakhir UTC)
    const weekProgress = [];
    const todayStr = getTodayDateString();

    for (let i = 6; i >= 0; i--) {
      const dateStr = addDays(todayStr, -i);
      const hasCheckIn = checkInsByDay.has(dateStr);
      const dateObj = parseDateFromFE(dateStr);

      weekProgress.push({
        date: dateStr,
        dateDisplay: formatToIndonesianDate(dateObj), // ✅ FIXED: Use helper function
        day: dateObj.toLocaleDateString("id-ID", {
          weekday: "short",
          timeZone: "Asia/Jakarta", // ✅ FIXED: Convert to WIB
        }),
        completed: hasCheckIn,
        displayDate: dateObj.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          timeZone: "Asia/Jakarta", // ✅ FIXED: Convert to WIB
        }),
      });
    }

    const completedDays = weekProgress.filter((day) => day.completed).length;
    const weeklyCompletion = Math.round((completedDays / 7) * 100);

    // Hitung streak real-time (UTC)
    const streak = await calculateHabitStreakOptimized(habitId);

    successResponse(res, "Progress mingguan berhasil diambil", {
      habitId,
      habitTitle: habit.title,
      startDate: formatDateForFE(habit.startDate),
      startDateDisplay: formatToIndonesianDate(habit.startDate), // ✅ Added
      weekProgress,
      completedDays,
      weeklyCompletion,
      streak,
    });
  },
);

// ✅ NEW HELPER: Format UTC date to Indonesian date string
function formatToIndonesianDate(utcDate: Date): string {
  return utcDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  });
}
