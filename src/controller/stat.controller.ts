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
      startDate: formatDateForFE(habit.startDate), // 🆕 UTC string
    });
  },
);

export const getMonthlyStats = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const today = new Date();
    const firstDay = new Date(Date.UTC(
      today.getUTCFullYear(), 
      today.getUTCMonth(), 
      1
    ));

    const habits = await prisma.habit.count({
      where: { userId, isActive: true },
    });

    const checkIns = await prisma.checkIn.count({
      where: {
        userId,
        date: { gte: firstDay },
      },
    });

    const days = today.getUTCDate(); // 🆕 UTC day
    const completion = habits > 0 ? Math.round((checkIns / (habits * days)) * 100) : 0;

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
        category: {
          select: { name: true, color: true },
        },
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
          startDate: formatDateForFE(habit.startDate), // 🆕 UTC string
          category: habit.category?.name || "No category",
          color: habit.category?.color || "#6B7280",
        };
      })
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
        timeZone: "UTC", // 🆕 Display UTC month
      }),
      topHabits,
    });
  },
);

// Helper function untuk hitung streak habit (UTC)
async function calculateHabitStreakOptimized(habitId: string): Promise<number> {
  const ninetyDaysAgoStr = addDays(getTodayDateString(), -90); // 🆕 UTC date string

  const checkIns = await prisma.checkIn.findMany({
    where: {
      habitId,
      date: { gte: parseDateFromFE(ninetyDaysAgoStr) }, // 🆕 UTC date
    },
    select: { date: true },
    orderBy: { date: "desc" },
  });

  const checkInDates = new Set<string>();
  checkIns.forEach((checkIn) => {
    const dateStr = formatDateForFE(checkIn.date); // 🆕 UTC date string
    checkInDates.add(dateStr);
  });

  let streak = 0;
  let currentDateStr = getTodayDateString(); // 🆕 UTC today

  for (let i = 0; i < 90; i++) {
    if (checkInDates.has(currentDateStr)) {
      streak++;
      currentDateStr = addDays(currentDateStr, -1); // 🆕 Mundur 1 hari (UTC)
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
    const sevenDaysAgoStr = addDays(getTodayDateString(), -6); // 🆕 UTC date string

    const checkIns = await prisma.checkIn.findMany({
      where: {
        habitId,
        date: { gte: parseDateFromFE(sevenDaysAgoStr) }, // 🆕 UTC date
      },
      select: { date: true },
    });

    // Group by day (UTC dates)
    const checkInsByDay = new Set<string>();
    checkIns.forEach((checkIn) => {
      const dateStr = formatDateForFE(checkIn.date); // 🆕 UTC date string
      checkInsByDay.add(dateStr);
    });

    // Format response (7 hari terakhir UTC)
    const weekProgress = [];
    const todayStr = getTodayDateString(); // 🆕 UTC today

    for (let i = 6; i >= 0; i--) {
      const dateStr = addDays(todayStr, -i); // 🆕 UTC date string
      const hasCheckIn = checkInsByDay.has(dateStr);
      const dateObj = parseDateFromFE(dateStr);

      weekProgress.push({
        date: dateStr,
        day: dateObj.toLocaleDateString("id-ID", { 
          weekday: "short",
          timeZone: "UTC"
        }),
        completed: hasCheckIn,
        displayDate: dateObj.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          timeZone: "UTC"
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
      startDate: formatDateForFE(habit.startDate), // 🆕 UTC string
      weekProgress,
      completedDays,
      weeklyCompletion,
      streak,
    });
  },
);