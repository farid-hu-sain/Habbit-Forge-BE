import type { Habit, Frequency, Category } from "@prisma/client";
import type { IHabitRepository } from "../repository/habit.repository.js";
import {
  parseDateFromFE,
  formatDateForFE,
  getTodayDateString,
  getDateRangeForQuery,
  isValidDateString,
  formatToIndonesianDate,
} from "../utils/timeUtils.js";

export interface HabitResponse {
  id: string;
  title: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  startDate: string;
  frequency: Frequency;
  userId: string;
  category: Category | null;
  checkIn?: any[];
}

interface FindAllParams {
  page: number;
  limit: number;
  search?: { title?: string };
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  showInactive?: boolean;
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
  createHabit(data: {
    title: string;
    description?: string;
    isActive?: boolean;
    userId: string;
    category?: Category | null;
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
  getAvailableCategories(): Category[];
}

export class HabitService implements IHabitService {
  constructor(private habitRepo: IHabitRepository) {}

  getAvailableCategories(): Category[] {
    return ["HEALTH", "FINANCE", "WORK", "LEARNING", "SOCIAL"];
  }

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
      showInactive = false,
    } = params;
    const skip = (page - 1) * limit;

    const whereClause: any = {
      userId,
      ...(!showInactive && { isActive: true }),
    };

    if (search?.title) {
      whereClause.title = { contains: search.title, mode: "insensitive" };
    }

    const sortCriteria: any = sortBy
      ? { [sortBy]: sortOrder || "desc" }
      : { createdAt: "desc" };

    const habits = await this.habitRepo.list(
      skip,
      limit,
      whereClause,
      sortCriteria,
    );
    const formattedHabits = habits.map((habit) =>
      this.formatHabitResponse(habit),
    );
    const total = await this.habitRepo.countAll(whereClause);

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

  async createHabit(data: {
    title: string;
    description?: string;
    isActive?: boolean;
    userId: string;
    category?: Category | null;
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

    if (
      data.category &&
      !this.getAvailableCategories().includes(data.category)
    ) {
      throw new Error("Kategori tidak valid");
    }

    const habitData: any = {
      title: data.title.trim(),
      description: data.description?.trim() || null,
      isActive: data.isActive ?? true,
      user: { connect: { id: data.userId } },
      startDate: parseDateFromFE(data.startDate),
      frequency: data.frequency,
    };

    if (data.category !== undefined) {
      habitData.category = data.category;
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

    const updateData: any = { ...data };

    if (data.startDate && typeof data.startDate === "string") {
      if (!isValidDateString(data.startDate)) {
        throw new Error("Format startDate harus YYYY-MM-DD");
      }
      updateData.startDate = parseDateFromFE(data.startDate);
    }

    if (
      data.category &&
      !this.getAvailableCategories().includes(data.category)
    ) {
      throw new Error("Kategori tidak valid");
    }

    const updated = await this.habitRepo.update(id, updateData);
    return this.formatHabitResponse(updated);
  }

  async deleteHabit(id: string, userId: string): Promise<HabitResponse> {
    await this.getHabitById(id, userId);
    const deleted = await this.habitRepo.hardDelete(id);
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

    const habits = await this.habitRepo.getHabitsWithTodayCheckIns(userId, {
      start,
      end,
    });

    return habits.map((habit: any) => ({
      id: habit.id,
      title: habit.title,
      description: habit.description,
      frequency: habit.frequency,
      isActive: habit.isActive,
      category: habit.category,
      startDate: formatDateForFE(habit.startDate),
      startDateDisplay: formatToIndonesianDate(habit.startDate),
      createdAt: habit.createdAt,
      isCheckedToday: habit.checkIn.length > 0,
      todayCheckIn: habit.checkIn[0]
        ? {
            ...habit.checkIn[0],
            date: formatDateForFE(habit.checkIn[0].date),
          }
        : null,
      canCheckInToday: habit.isActive && habit.checkIn.length === 0,
    }));
  }

  private formatHabitResponse(habit: any): HabitResponse {
    return {
      id: habit.id,
      title: habit.title,
      description: habit.description,
      isActive: habit.isActive,
      createdAt: habit.createdAt,
      updatedAt: habit.updatedAt,
      startDate: formatDateForFE(habit.startDate),
      frequency: habit.frequency,
      userId: habit.userId,
      category: habit.category || null,
      checkIn: habit.checkIn || [],
    };
  }
}
