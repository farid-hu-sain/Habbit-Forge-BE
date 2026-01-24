import type {
  Prisma,
  Habit,
  Frequency,
  CheckIn,
  Category,
} from "@prisma/client";
import type { IHabitRepository } from "../repository/habit.repository.js";
import { getTodayRange } from "../utils/timeUtils.js";

interface FindAllParams {
  page: number;
  limit: number;
  search?: {
    title?: string;
  };
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface HabitListResponse {
  habit: Habit[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export interface IHabitService {
  getAll(params: FindAllParams, userId: string): Promise<HabitListResponse>;
  getHabitById(id: string, userId: string): Promise<Habit>;
  createHabit(data: {
    title: string;
    description?: string;
    isActive?: boolean;
    userId: string;
    categoryId?: string;
    startDate: string;
    frequency: Frequency;
  }): Promise<Habit>;
  updateHabit(id: string, data: Partial<Habit>, userId: string): Promise<Habit>;
  deleteHabit(id: string, userId: string): Promise<Habit>;
  toggleHabit(id: string, userId: string): Promise<Habit>;
  getHabitsWithTodayStatus(userId: string): Promise<any[]>;
}

export class HabitService implements IHabitService {
  constructor(private habitRepo: IHabitRepository) {}

  async getAll(
    params: FindAllParams,
    userId: string,
  ): Promise<HabitListResponse> {
    const { page, limit, search, sortBy, sortOrder } = params;

    const skip = (page - 1) * limit;

    const whereClause: Prisma.HabitWhereInput = {
      userId: userId, // Auto-filter by user
    };

    if (search?.title) {
      whereClause.title = { contains: search.title, mode: "insensitive" };
    }

    const sortCriteria: Prisma.HabitOrderByWithRelationInput = sortBy
      ? { [sortBy]: sortOrder || "desc" }
      : { createdAt: "desc" };

    const habit = await this.habitRepo.list(
      skip,
      limit,
      whereClause,
      sortCriteria,
    );

    const total = await this.habitRepo.countAll(whereClause);

    return {
      habit,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  async getHabitById(id: string, userId: string): Promise<Habit> {
    const habit = await this.habitRepo.findById(id);

    if (!habit) {
      throw new Error("Habit tidak ditemukan");
    }

    // Auto-validate ownership
    if (habit.userId !== userId) {
      throw new Error("Habit tidak ditemukan");
    }

    return habit;
  }

  async createHabit(data: {
    title: string;
    description?: string;
    isActive?: boolean;
    userId: string;
    categoryId?: string;
    startDate: string;
    frequency: Frequency;
  }): Promise<Habit> {
    // Validasi input
    if (!data.title || data.title.trim().length < 3) {
      throw new Error("Title harus minimal 3 karakter");
    }

    const habitData: Prisma.HabitCreateInput = {
      title: data.title.trim(),
      description: data.description?.trim() || null,
      isActive: data.isActive ?? true,
      user: { connect: { id: data.userId } },
      startDate: new Date(data.startDate),
      frequency: data.frequency,
    };

    if (data.categoryId) {
      habitData.category = { connect: { id: data.categoryId } };
    }

    return await this.habitRepo.create(habitData);
  }

  async updateHabit(
    id: string,
    data: Partial<Habit>,
    userId: string,
  ): Promise<Habit> {
    // Validasi ownership
    await this.getHabitById(id, userId);

    return await this.habitRepo.update(id, data);
  }

  async deleteHabit(id: string, userId: string): Promise<Habit> {
    // Validasi ownership
    await this.getHabitById(id, userId);

    return await this.habitRepo.softDelete(id);
  }

  async toggleHabit(id: string, userId: string): Promise<Habit> {
    const habit = await this.getHabitById(id, userId);

    return await this.habitRepo.update(id, {
      isActive: !habit.isActive,
    });
  }

  async getHabitsWithTodayStatus(userId: string): Promise<any[]> {
    const { start, end } = getTodayRange();

    // Type the result from Prisma
    type HabitWithCheckIns = Habit & {
      category: Category | null;
      checkIn: CheckIn[];
    };

    const habits = (await (this.habitRepo as any).prisma.habit.findMany({
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
          select: {
            id: true,
            date: true,
            note: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })) as HabitWithCheckIns[];

    // Format response untuk FE
    return habits.map((habit: HabitWithCheckIns) => ({
      id: habit.id,
      title: habit.title,
      description: habit.description,
      frequency: habit.frequency,
      isActive: habit.isActive,
      category: habit.category,
      startDate: habit.startDate,
      currentStreak: habit.currentStreak,
      longestStreak: habit.longestStreak,
      createdAt: habit.createdAt,

      // ✅ CRITICAL FOR FE: Check-in status today
      isCheckedToday: habit.checkIn.length > 0,
      todayCheckIn: habit.checkIn[0] || null,

      // Bonus info untuk FE
      canCheckInToday: habit.isActive && habit.checkIn.length === 0,
      totalCheckIns: 0, // Bisa dihitung jika perlu
    }));
  }

  async getHabitWithDateRangeStatus(
    habitId: string,
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<any> {
    // Validasi ownership
    const habit = await this.getHabitById(habitId, userId);

    const checkIns = (await (this.habitRepo as any).prisma.checkIn.findMany({
      where: {
        habitId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        id: true,
        date: true,
        note: true,
      },
      orderBy: { date: "asc" },
    })) as CheckIn[];

    // Format untuk calendar view di FE
    const checkInDates = new Set(
      checkIns.map((checkIn: CheckIn) => {
        const date = new Date(checkIn.date);
        return date.toISOString().split("T")[0]; // YYYY-MM-DD
      }),
    );

    return {
      habit: {
        id: habit.id,
        title: habit.title,
        description: habit.description,
        frequency: habit.frequency,
      },
      checkIns,
      checkInDates: Array.from(checkInDates),
      totalDaysInRange:
        Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
        ) + 1,
      completedDays: checkInDates.size,
    };
  }
}
