import { PrismaClient } from "@prisma/client";
import {
  getTodayDateString,
  formatDateForFE,
  getDateRangeForQuery,
  parseDateFromFE,
  addDays,
} from "../utils/timeUtils.js";

export class DashboardRepository {
  constructor(private prisma: PrismaClient) {}

  // GET Dashboard utama
  async getDashboard(userId: string) {
    // 1. Hitung total habits user (hanya yang aktif)
    const totalHabits = await this.prisma.habit.count({
      where: { userId, isActive: true },
    });

    // 2. Hitung habits aktif (sama dengan totalHabits sekarang)
    const activeHabits = totalHabits;

    // 3. Hitung total check-ins user
    const totalCheckIns = await this.prisma.checkIn.count({
      where: { userId },
    });

    // 4. Hitung streak (minimal 1 check-in per hari) - UTC
    const streak = await this.calculateUserStreak(userId);

    return {
      totalHabits,
      activeHabits,
      totalCheckIns,
      streak,
    };
  }

  // GET Habits untuk hari ini (hanya yang aktif) - UTC
  async getTodayHabits(userId: string) {
    const todayStr = getTodayDateString(); // 🆕 UTC today
    const { start, end } = getDateRangeForQuery(todayStr);

    const habits = await this.prisma.habit.findMany({
      where: {
        userId,
        isActive: true,
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
        ? formatDateForFE(habit.checkIn[0].date) // 🆕 UTC to string
        : null,
      checkInTime: habit.checkIn[0]?.createdAt || null,
      canCheckInToday: habit.isActive && habit.checkIn.length === 0,
    }));
  }

  // GET Stats detail
  async getStats(userId: string) {
    // 1. Habits per kategori (hanya yang aktif)
    const habits = await this.prisma.habit.findMany({
      where: {
        userId,
        isActive: true,
      },
      include: { category: true },
    });

    const habitsByCategory: Record<string, number> = {};
    habits.forEach((habit) => {
      const categoryName = habit.category?.name || "Uncategorized";
      habitsByCategory[categoryName] =
        (habitsByCategory[categoryName] || 0) + 1;
    });

    // 2. Progress 7 hari terakhir (UTC)
    const last7Days = await this.getLast7DaysStats(userId);

    // 3. Completion rate bulan ini (UTC)
    const monthlyCompletion = await this.getMonthlyCompletionRate(userId);

    return {
      habitsByCategory,
      last7Days,
      monthlyCompletion,
    };
  }

  // ========== PRIVATE HELPER METHODS ==========

  /**
   * Hitung streak user (consecutive days dengan minimal 1 check-in) - UTC
   */
  private async calculateUserStreak(userId: string): Promise<number> {
    const sixtyDaysAgoStr = addDays(getTodayDateString(), -60); // 🆕 UTC date string

    const checkIns = await this.prisma.checkIn.findMany({
      where: {
        userId,
        date: {
          gte: parseDateFromFE(sixtyDaysAgoStr), // 🆕 UTC date
        },
      },
      select: { date: true },
      orderBy: { date: "desc" },
    });

    // Unique dates dengan check-in (UTC dates)
    const checkInDates = new Set<string>();
    checkIns.forEach((checkIn) => {
      const dateStr = formatDateForFE(checkIn.date); // 🆕 UTC date string
      checkInDates.add(dateStr);
    });

    // Hitung streak mundur dari hari ini (UTC)
    let streak = 0;
    let currentDateStr = getTodayDateString(); // 🆕 UTC today

    for (let i = 0; i < 60; i++) {
      if (checkInDates.has(currentDateStr)) {
        streak++;
        currentDateStr = addDays(currentDateStr, -1); // 🆕 Mundur 1 hari (UTC)
      } else {
        break;
      }
    }

    return streak;
  }

  /**
   * Progress 7 hari terakhir (UTC)
   */
  private async getLast7DaysStats(userId: string) {
    const checkIns = await this.prisma.checkIn.findMany({
      where: { userId },
      select: { date: true },
    });

    // Kelompokkan per hari (UTC dates)
    const checkInsByDay = new Map<string, number>();
    checkIns.forEach((checkIn) => {
      const dateStr = formatDateForFE(checkIn.date); // 🆕 UTC date string
      checkInsByDay.set(dateStr, (checkInsByDay.get(dateStr) || 0) + 1);
    });

    // Format untuk 7 hari terakhir (UTC)
    const last7Days = [];
    const todayStr = getTodayDateString(); // 🆕 UTC today

    for (let i = 6; i >= 0; i--) {
      const dateStr = addDays(todayStr, -i); // 🆕 UTC date string
      const checkInsCount = checkInsByDay.get(dateStr) || 0;

      // Buat Date object untuk format display (pakai UTC)
      const dateObj = parseDateFromFE(dateStr);

      last7Days.push({
        date: dateStr,
        dateDisplay: this.formatDateDisplay(dateObj),
        checkIns: checkInsCount,
      });
    }

    return last7Days;
  }

  /**
   * Completion rate bulan ini (UTC)
   */
  private async getMonthlyCompletionRate(userId: string): Promise<number> {
    const today = new Date();
    const firstDayOfMonth = new Date(
      Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1),
    );

    const startOfMonth = firstDayOfMonth;

    // Hanya hitung habit aktif
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

    const daysInMonth = today.getUTCDate(); // 🆕 UTC day of month
    const possibleCheckIns = activeHabits * daysInMonth;

    return Math.round((actualCheckIns / possibleCheckIns) * 100);
  }

  /**
   * Format date untuk display (localized)
   */
  private formatDateDisplay(date: Date): string {
    // Gunakan locale Indonesia, tapi date tetap UTC
    return date.toLocaleDateString("id-ID", {
      weekday: "short",
      day: "numeric",
      month: "short",
      timeZone: "UTC", // 🆕 Tampilkan sebagai UTC
    });
  }
}
