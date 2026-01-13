import type { Habit } from "../../dist/generated/index.js";
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
export interface HabitListRespone {
    habit: Habit[];
    total: number;
    totalPages: number;
    currentPage: number;
}
export interface IHabitService {
    getAll(params: FindAllParams): Promise<HabitListRespone>;
    getHabitById(id: string): Promise<Habit | null>;
    createHabit(data: {
        title: string;
        description: string;
        isActive: boolean;
        userId: string;
    }): Promise<Habit>;
    updateHabit(id: string, data: Partial<Habit>): Promise<Habit>;
    deleteHabit(id: string): Promise<Habit>;
    toggleHabit(id: string): Promise<Habit>;
}
export declare class HabitService implements IHabitService {
    private habitRepo;
    constructor(habitRepo: IHabitRepository);
    getAll(params: FindAllParams): Promise<HabitListRespone>;
    getHabitById(id: string): Promise<Habit | null>;
    createHabit(data: {
        title: string;
        description: string;
        isActive: boolean;
        userId: string;
    }): Promise<Habit>;
    updateHabit(id: string, data: Partial<Habit>): Promise<Habit>;
    deleteHabit(id: string): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        title: string;
        isActive: boolean;
        updatedAt: Date;
        userId: string;
        categoryId: string | null;
    }>;
    toggleHabit(id: string): Promise<Habit>;
}
export {};
//# sourceMappingURL=habit.service.d.ts.map
