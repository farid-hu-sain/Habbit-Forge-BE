import { PrismaClient } from "@prisma/client";
import { getStartOfDate, getTodayRange } from "../utils/timeUtils.js";

export class DashboardRepository {
  constructor(private prisma: PrismaClient) {}

  // GET Dashboard utama
  async getDashboard(userId: string) {
    // 1. Hitung total habits user
    const totalHabits = await this.prisma.habit.count({
      where: { userId },
    });

    // 2. Hitung habits aktif
    const activeHabits = await this.prisma.habit.count({
      where: { userId, isActive: true },
    });

    // 3. Hitung total check-ins user
    const totalCheckIns = await this.prisma.checkIn.count({
      where: { userId },
    });

    // 4. Hitung streak (OPTIMIZED)
    const streak = await this.calculateStreakOptimized(userId);

    return {
      totalHabits,
      activeHabits,
      totalCheckIns,
      streak,
    };
  }

  // GET Habits untuk hari ini
  async getTodayHabits(userId: string) {
    const { start, end } = getTodayRange();

    const habits = await this.prisma.habit.findMany({
      where: { userId, isActive: true },
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
      checkInTime: habit.checkIn[0]?.date || null,
    }));
  }

  // GET Stats detail
  async getStats(userId: string) {
    // 1. Habits per kategori
    const habits = await this.prisma.habit.findMany({
      where: { userId },
      include: { category: true },
    });

    const habitsByCategory: Record<string, number> = {};
    habits.forEach((habit) => {
      const categoryName = habit.category?.name || "Uncategorized";
      habitsByCategory[categoryName] =
        (habitsByCategory[categoryName] || 0) + 1;
    });

    // 2. Progress 7 hari terakhir (OPTIMIZED)
    const last7Days = await this.getLast7DaysStats(userId);

    // 3. Completion rate bulan ini
    const completionRate = await this.getMonthlyCompletionRate(userId);

    return {
      habitsByCategory,
      last7Days,
      monthlyCompletion: completionRate,
    };
  }

  private async calculateStreakOptimized(userId: string): Promise<number> {
    // Ambil 60 hari terakhir sekaligus
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    sixtyDaysAgo.setHours(0, 0, 0, 0);

    // 1 QUERY untuk semua check-in
    const checkIns = await this.prisma.checkIn.findMany({
      where: {
        userId,
        date: { gte: sixtyDaysAgo },
      },
      select: { date: true },
      orderBy: { date: "desc" },
    });

    // Convert ke Set of dates (YYYY-MM-DD)
    const checkInDates = this.extractUniqueDates(checkIns);

    // Hitung streak
    return this.calculateStreakFromDates(checkInDates);
  }

  /**
   * Progress 7 hari terakhir (OPTIMIZED)
   */
  private async getLast7DaysStats(userId: string) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // 7 hari termasuk hari ini
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // 1 QUERY untuk 7 hari
    const checkIns = await this.prisma.checkIn.findMany({
      where: {
        userId,
        date: { gte: sevenDaysAgo },
      },
      select: { date: true },
    });

    // Kelompokkan per hari
    const checkInsByDay = this.groupCheckInsByDay(checkIns);

    // Format untuk 7 hari terakhir
    const last7Days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      const dateKey = this.getDateKey(date);
      if (!dateKey) continue; // Guard clause

      const checkInsCount = checkInsByDay.get(dateKey) || 0;

      last7Days.push({
        date: dateKey,
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
   * Completion rate bulan ini (OPTIMIZED)
   */
  private async getMonthlyCompletionRate(userId: string): Promise<number> {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfMonth = getStartOfDate(firstDayOfMonth);

    // 1. Hitung habits aktif (1 query)
    const activeHabits = await this.prisma.habit.count({
      where: { userId, isActive: true },
    });

    if (activeHabits === 0) return 0;

    // 2. Hitung check-ins bulan ini (1 query)
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

  // ========== HELPER METHODS ==========

  /**
   * Safe method untuk get date key
   */
  private getDateKey(date: Date): string | null {
    try {
      const isoString = date.toISOString();
      const parts = isoString.split("T");
      if (parts.length < 2) return null;

      const dateKey = parts[0];
      return dateKey || null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Extract unique dates dari check-ins
   */
  private extractUniqueDates(checkIns: { date: Date }[]): Set<string> {
    const dates = new Set<string>();

    checkIns.forEach((checkIn) => {
      const dateKey = this.getDateKey(new Date(checkIn.date));
      if (dateKey) {
        dates.add(dateKey);
      }
    });

    return dates;
  }

  /**
   * Hitung streak dari Set of dates
   */
  private calculateStreakFromDates(checkInDates: Set<string>): number {
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Max streak 60 hari
    for (let i = 0; i < 60; i++) {
      const dateKey = this.getDateKey(currentDate);
      if (!dateKey) break; // Guard clause

      if (checkInDates.has(dateKey)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }

  /**
   * Group check-ins by day
   */
  private groupCheckInsByDay(checkIns: { date: Date }[]): Map<string, number> {
    const map = new Map<string, number>();

    checkIns.forEach((checkIn) => {
      const dateKey = this.getDateKey(new Date(checkIn.date));
      if (!dateKey) return; // Guard clause

      map.set(dateKey, (map.get(dateKey) || 0) + 1);
    });

    return map;
  }
}
