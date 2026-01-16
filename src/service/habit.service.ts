import type { Prisma, Habit } from "../../dist/generated/index.js";
import type { IHabitRepository } from "../repository/habit.repository.js";

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
  }): Promise<Habit>;
  updateHabit(id: string, data: Partial<Habit>, userId: string): Promise<Habit>;
  deleteHabit(id: string, userId: string): Promise<Habit>;
  toggleHabit(id: string, userId: string): Promise<Habit>;
}

export class HabitService implements IHabitService {
  constructor(private habitRepo: IHabitRepository) {}

  async getAll(params: FindAllParams, userId: string): Promise<HabitListResponse> {
    const { page, limit, search, sortBy, sortOrder } = params;

    const skip = (page - 1) * limit;

    const whereClause: Prisma.HabitWhereInput = {
      userId: userId // Auto-filter by user
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
      sortCriteria
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
    };

    if (data.categoryId) {
      habitData.category = { connect: { id: data.categoryId } };
    }

    return await this.habitRepo.create(habitData);
  }

  async updateHabit(id: string, data: Partial<Habit>, userId: string): Promise<Habit> {
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
      isActive: !habit.isActive
    });
  }
}