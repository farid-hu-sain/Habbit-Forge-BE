import { PrismaClient } from "@prisma/client";
import {
  getTodayDateString,
  formatDateForFE,
  getDateRangeForQuery,
  parseDateFromFE,
} from "../utils/timeUtils.js";

export class DashboardRepository {
  constructor(private prisma: PrismaClient) {}

  // GET Dashboard utama
  async getDashboard(userId: string) {
    // 1. Hitung total habits user (hanya yang aktif)
    const totalHabits = await this.prisma.habit.count({
      where: { userId, isActive: true }, // 🆕 Filter isActive: true
    });

    // 2. Hitung habits aktif (sama dengan totalHabits sekarang)
    const activeHabits = totalHabits;

    // 3. Hitung total check-ins user
    const totalCheckIns = await this.prisma.checkIn.count({
      where: { userId },
    });

    // 4. Hitung streak (OPTIMIZED) - minimal 1 check-in per hari
    const streak = await this.calculateUserStreak(userId);

    return {
      totalHabits,
      activeHabits,
      totalCheckIns,
      streak,
    };
  }

  // GET Habits untuk hari ini (hanya yang aktif)
  async getTodayHabits(userId: string) {
    const todayStr = getTodayDateString();
    const { start, end } = getDateRangeForQuery(todayStr);

    const habits = await this.prisma.habit.findMany({
      where: {
        userId,
        isActive: true, // 🆕 Hanya habit aktif
      },
      include: {
        category: true,
        checkIn: {
          where: {
            date: {
              gte: start,
              lte: end,
            },
          },
        },
      },
    });

    return habits.map((habit) => ({
      id: habit.id,
      title: habit.title,
      description: habit.description,
      category: habit.category?.name || "No category",
      isCompleted: habit.checkIn.length > 0,
      checkInDate: habit.checkIn[0]
        ? formatDateForFE(habit.checkIn[0].date)
        : null,
      checkInTime: habit.checkIn[0]?.createdAt || null,
      // 🆕 Tambah field untuk FE
      canCheckInToday: habit.isActive && habit.checkIn.length === 0,
    }));
  }

  // GET Stats detail
  async getStats(userId: string) {
    // 1. Habits per kategori (hanya yang aktif)
    const habits = await this.prisma.habit.findMany({
      where: {
        userId,
        isActive: true, // 🆕 Hanya habit aktif
      },
      include: { category: true },
    });

    const habitsByCategory: Record<string, number> = {};
    habits.forEach((habit) => {
      const categoryName = habit.category?.name || "Uncategorized";
      habitsByCategory[categoryName] =
        (habitsByCategory[categoryName] || 0) + 1;
    });

    // 2. Progress 7 hari terakhir
    const last7Days = await this.getLast7DaysStats(userId);

    // 3. Completion rate bulan ini
    const monthlyCompletion = await this.getMonthlyCompletionRate(userId);

    return {
      habitsByCategory,
      last7Days,
      monthlyCompletion,
    };
  }

  // ========== PRIVATE HELPER METHODS ==========

  /**
   * Hitung streak user (consecutive days dengan minimal 1 check-in)
   */
  private async calculateUserStreak(userId: string): Promise<number> {
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    sixtyDaysAgo.setHours(0, 0, 0, 0);

    const checkIns = await this.prisma.checkIn.findMany({
      where: {
        userId,
        date: { gte: sixtyDaysAgo },
      },
      select: { date: true },
      orderBy: { date: "desc" },
    });

    // Unique dates dengan check-in
    const checkInDates = new Set<string>();
    checkIns.forEach((checkIn) => {
      const dateStr = formatDateForFE(checkIn.date);
      checkInDates.add(dateStr);
    });

    // Hitung streak
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < 60; i++) {
      const dateStr = formatDateForFE(currentDate);

      if (checkInDates.has(dateStr)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }

  /**
   * Progress 7 hari terakhir
   */
  private async getLast7DaysStats(userId: string) {
    const checkIns = await this.prisma.checkIn.findMany({
      where: { userId },
      select: { date: true },
    });

    // Kelompokkan per hari
    const checkInsByDay = new Map<string, number>();
    checkIns.forEach((checkIn) => {
      const dateStr = formatDateForFE(checkIn.date);
      checkInsByDay.set(dateStr, (checkInsByDay.get(dateStr) || 0) + 1);
    });

    // Format untuk 7 hari terakhir
    const last7Days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      const dateStr = formatDateForFE(date);
      const checkInsCount = checkInsByDay.get(dateStr) || 0;

      last7Days.push({
        date: dateStr,
        dateDisplay: date.toLocaleDateString("id-ID", {
          weekday: "short",
          day: "numeric",
          month: "short",
        }),
        checkIns: checkInsCount,
      });
    }

    return last7Days;
  }

  /**
   * Completion rate bulan ini (hanya habit aktif)
   */
  private async getMonthlyCompletionRate(userId: string): Promise<number> {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfMonth = parseDateFromFE(formatDateForFE(firstDayOfMonth));

    // 🆕 Hanya hitung habit aktif
    const activeHabits = await this.prisma.habit.count({
      where: { userId, isActive: true },
    });

    if (activeHabits === 0) return 0;

    const actualCheckIns = await this.prisma.checkIn.count({
      where: {
        userId,
        date: { gte: startOfMonth },
      },
    });

    const daysInMonth = today.getDate();
    const possibleCheckIns = activeHabits * daysInMonth;

    return Math.round((actualCheckIns / possibleCheckIns) * 100);
  }
}
