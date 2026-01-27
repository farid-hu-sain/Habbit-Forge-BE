import type {
  Prisma,
  Habit,
  Frequency,
  CheckIn,
  Category,
} from "@prisma/client";
import type { IHabitRepository } from "../repository/habit.repository.js";
import {
  parseDateFromFE,
  formatDateForFE,
  getTodayDateString,
  getDateRangeForQuery,
  isValidDateString,
} from "../utils/timeUtils.js";

// Interface untuk response ke FE
export interface HabitResponse {
  id: string;
  title: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  startDate: string; // String YYYY-MM-DD untuk FE
  frequency: Frequency;
  userId: string;
  categoryId: string | null;
  category?: Category | null;
  checkIn?: CheckIn[]; // 🆕 Check-ins (bisa difilter by date)
  streak?: {
    current: number;
    longest: number;
  };
}

interface FindAllParams {
  page: number;
  limit: number;
  search?: {
    title?: string;
  };
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  includeCheckInsForDate?: string; // 🆕 Filter check-ins by date
  showInactive?: boolean; // 🆕 Tampilkan habit nonaktif
}

export interface HabitListResponse {
  habits: HabitResponse[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export interface IHabitService {
  getAll(params: FindAllParams, userId: string): Promise<HabitListResponse>;
  getHabitById(id: string, userId: string): Promise<HabitResponse>;
  getHabitWithCheckIns(
    id: string,
    userId: string,
    date?: string,
  ): Promise<HabitResponse>;
  createHabit(data: {
    title: string;
    description?: string;
    isActive?: boolean;
    userId: string;
    categoryId?: string;
    startDate: string;
    frequency: Frequency;
  }): Promise<HabitResponse>;
  updateHabit(
    id: string,
    data: Partial<Habit>,
    userId: string,
  ): Promise<HabitResponse>;
  deleteHabit(id: string, userId: string): Promise<HabitResponse>;
  toggleHabit(id: string, userId: string): Promise<HabitResponse>;
  getHabitsWithTodayStatus(userId: string): Promise<any[]>;
}

export class HabitService implements IHabitService {
  constructor(private habitRepo: IHabitRepository) {}

  async getAll(
    params: FindAllParams,
    userId: string,
  ): Promise<HabitListResponse> {
    const {
      page,
      limit,
      search,
      sortBy,
      sortOrder,
      includeCheckInsForDate,
      showInactive = false, // 🆕 Default hanya aktif
    } = params;
    const skip = (page - 1) * limit;

    // 🆕 Filter isActive: true kecuali showInactive = true
    const whereClause: Prisma.HabitWhereInput = {
      userId,
      ...(!showInactive && { isActive: true }), // 🆕 Filter aktif saja
    };

    if (search?.title) {
      whereClause.title = { contains: search.title, mode: "insensitive" };
    }

    const sortCriteria: Prisma.HabitOrderByWithRelationInput = sortBy
      ? { [sortBy]: sortOrder || "desc" }
      : { createdAt: "desc" };

    // 🆕 Include check-ins jika ada parameter date
    const include: Prisma.HabitInclude = {
      category: true,
    };

    if (includeCheckInsForDate && isValidDateString(includeCheckInsForDate)) {
      const { start, end } = getDateRangeForQuery(includeCheckInsForDate);
      include.checkIn = {
        where: {
          date: {
            gte: start,
            lte: end,
          },
        },
      };
    } else {
      include.checkIn = false; // 🆕 Tidak include check-ins kalau tidak perlu
    }

    // 🆕 Gunakan prisma langsung dari repo untuk include yang kompleks
    const habits = await (this.habitRepo as any).prisma.habit.findMany({
      skip,
      take: limit,
      where: whereClause,
      orderBy: sortCriteria,
      include,
    });

    // Format semua habits untuk FE
    const formattedHabits = habits.map((habit: any) =>
      this.formatHabitResponse(habit),
    );

    const total = await (this.habitRepo as any).prisma.habit.count({
      where: whereClause,
    });

    return {
      habits: formattedHabits,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  async getHabitById(id: string, userId: string): Promise<HabitResponse> {
    const habit = await this.habitRepo.findById(id);

    if (!habit) {
      throw new Error("Habit tidak ditemukan");
    }

    if (habit.userId !== userId) {
      throw new Error("Akses ditolak");
    }

    return this.formatHabitResponse(habit);
  }

  // 🆕 Method baru: Get habit dengan check-ins untuk tanggal tertentu
  async getHabitWithCheckIns(
    id: string,
    userId: string,
    date?: string,
  ): Promise<HabitResponse> {
    const habit = await this.getHabitById(id, userId);

    // Jika ada parameter date, hitung check-in untuk tanggal tersebut
    if (date && isValidDateString(date)) {
      const { start, end } = getDateRangeForQuery(date);

      const checkIns = await (this.habitRepo as any).prisma.checkIn.findMany({
        where: {
          habitId: id,
          date: {
            gte: start,
            lte: end,
          },
        },
      });

      return {
        ...habit,
        checkIn: checkIns.map((checkIn: CheckIn) => ({
          ...checkIn,
          date: formatDateForFE(checkIn.date), // Convert ke string
        })),
      };
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
  }): Promise<HabitResponse> {
    if (!data.title || data.title.trim().length < 3) {
      throw new Error("Title harus minimal 3 karakter");
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.startDate)) {
      throw new Error("Format startDate harus YYYY-MM-DD");
    }

    if (!isValidDateString(data.startDate)) {
      throw new Error("Tanggal tidak valid");
    }

    const habitData: Prisma.HabitCreateInput = {
      title: data.title.trim(),
      description: data.description?.trim() || null,
      isActive: data.isActive ?? true,
      user: { connect: { id: data.userId } },
      startDate: parseDateFromFE(data.startDate),
      frequency: data.frequency,
    };

    if (data.categoryId) {
      habitData.category = { connect: { id: data.categoryId } };
    }

    const habit = await this.habitRepo.create(habitData);
    return this.formatHabitResponse(habit);
  }

  async updateHabit(
    id: string,
    data: Partial<Habit>,
    userId: string,
  ): Promise<HabitResponse> {
    await this.getHabitById(id, userId);

    const updateData: Prisma.HabitUpdateInput = { ...data };

    // Handle date conversion jika update startDate
    if (data.startDate && typeof data.startDate === "string") {
      if (!isValidDateString(data.startDate)) {
        throw new Error("Format startDate harus YYYY-MM-DD");
      }
      updateData.startDate = parseDateFromFE(data.startDate);
    }

    const updated = await this.habitRepo.update(id, updateData);
    return this.formatHabitResponse(updated);
  }

  async deleteHabit(id: string, userId: string): Promise<HabitResponse> {
    await this.getHabitById(id, userId);
    const deleted = await this.habitRepo.update(id, { isActive: false });
    return this.formatHabitResponse(deleted);
  }

  async toggleHabit(id: string, userId: string): Promise<HabitResponse> {
    const habit = await this.getHabitById(id, userId);
    const toggled = await this.habitRepo.update(id, {
      isActive: !habit.isActive,
    });
    return this.formatHabitResponse(toggled);
  }

  async getHabitsWithTodayStatus(userId: string): Promise<any[]> {
    const todayStr = getTodayDateString();
    const { start, end } = getDateRangeForQuery(todayStr);

    const habits = await (this.habitRepo as any).prisma.habit.findMany({
      where: {
        userId,
        isActive: true, // 🆕 Filter hanya habit aktif
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
    });

    return habits.map((habit: any) => ({
      id: habit.id,
      title: habit.title,
      description: habit.description,
      frequency: habit.frequency,
      isActive: habit.isActive,
      category: habit.category,
      startDate: formatDateForFE(habit.startDate),
      createdAt: habit.createdAt,

      // 🆕 Logika yang sesuai dengan FE
      isCheckedToday: habit.checkIn.length > 0,
      todayCheckIn: habit.checkIn[0]
        ? {
            ...habit.checkIn[0],
            date: formatDateForFE(habit.checkIn[0].date),
          }
        : null,

      // 🆕 canCheckInToday: hanya jika habit aktif DAN belum check-in hari ini
      canCheckInToday: habit.isActive && habit.checkIn.length === 0,
    }));
  }

  // Helper method untuk format response
  private formatHabitResponse(
    habit: Habit & {
      category?: Category;
      checkIn?: CheckIn[];
    },
  ): HabitResponse {
    const response: HabitResponse = {
      id: habit.id,
      title: habit.title,
      description: habit.description,
      isActive: habit.isActive,
      createdAt: habit.createdAt,
      updatedAt: habit.updatedAt,
      startDate: formatDateForFE(habit.startDate),
      frequency: habit.frequency,
      userId: habit.userId,
      categoryId: habit.categoryId,
      category: habit.category || null,
      checkIn: habit.checkIn || [],
    };

    return response;
  }
}
