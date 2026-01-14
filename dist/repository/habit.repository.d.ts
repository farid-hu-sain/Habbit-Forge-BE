import type { Prisma, PrismaClient, Habit } from "../../dist/generated";
export interface IHabitRepository {
    list(skip: number, take: number, where: Prisma.HabitWhereInput, orderBy: Prisma.HabitOrderByWithRelationInput): Promise<Habit[]>;
    countAll(where: Prisma.HabitWhereInput): Promise<number>;
    findById(id: string): Promise<Habit | null>;
    create(data: Prisma.HabitCreateInput): Promise<Habit>;
    update(id: string, data: Prisma.HabitUpdateInput): Promise<Habit>;
    softDelete(id: string): Promise<Habit>;
    toggleActive(id: string): Promise<Habit>;
}
export declare class HabitRepository implements IHabitRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    list(skip: number, take: number, where: Prisma.HabitWhereInput, orderBy: Prisma.HabitOrderByWithRelationInput): Promise<Habit[]>;
    countAll(where: Prisma.HabitWhereInput): Promise<number>;
    findById(id: string): Promise<Habit | null>;
    create(data: Prisma.HabitCreateInput): Promise<Habit>;
    update(id: string, data: Prisma.HabitUpdateInput): Promise<Habit>;
    softDelete(id: string): Promise<Habit>;
    toggleActive(id: string): Promise<Habit>;
}
//# sourceMappingURL=habit.repository.d.ts.map