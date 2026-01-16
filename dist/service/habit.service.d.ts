import type { Habit } from "@prisma/client";
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
export declare class HabitService implements IHabitService {
    private habitRepo;
    constructor(habitRepo: IHabitRepository);
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
export {};
//# sourceMappingURL=habit.service.d.ts.map