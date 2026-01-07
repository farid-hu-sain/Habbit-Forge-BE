import type {  Prisma, PrismaClient, Habit } from "../generated";

export interface IHabitRepository {
    list(
        skip: number,
        take: number,
        where: Prisma.HabitWhereInput,
        orderBy: Prisma.HabitOrderByWithRelationInput
    ): Promise<Habit[]>;
    countAll(where: Prisma.HabitWhereInput): Promise<number>;
    findById(id: string): Promise<Habit | null>;
    create(data: Prisma.HabitCreateInput): Promise<Habit>;
    update(id: string, data: Prisma.HabitUpdateInput): Promise<Habit>;
    softDelete(id: string): Promise<Habit>
    toggleActive(id: string): Promise<Habit>;
}

export class HabitRepository implements IHabitRepository {
    constructor(private prisma: PrismaClient) { }

    async list(
        skip: number,
        take: number,
        where: Prisma.HabitWhereInput,
        orderBy: Prisma.HabitOrderByWithRelationInput
    ): Promise<Habit[]> {
        return await this.prisma.habit.findMany({
            skip,
            take,
            where,
            orderBy,
            include: { 
                category: true,
                user: true
             }
        })
    }

    async countAll(where: Prisma.HabitWhereInput): Promise<number> {
        return await this.prisma.habit.count({ where })
    }

    async findById(id: string): Promise<Habit | null> {
        return await this.prisma.habit.findUnique({
            where: {
                id: id,
            },
            include: {
                category: true,
                user: true,
                checkIn: true
            }
        })
    }

    async create(data: Prisma.HabitCreateInput): Promise<Habit> {
        return await this.prisma.habit.create({ data })
    }

    async update(id: string, data: Prisma.HabitUpdateInput): Promise<Habit> {
        return await this.prisma.habit.update({
            where: {
                id
            },
            data
        })
    }

    async softDelete(id: string): Promise<Habit> {
    return await this.prisma.habit.update({
        where: { id },
        data: {  
            isActive: false      
        }
    });
}

    async toggleActive(id: string): Promise<Habit> {
        const habit = await this.prisma.habit.findUnique({
            where: { 
                id, 
            },
            select: { isActive: true }
        });

        if (!habit) {
            throw new Error('Habit tidak ditemukan');
        }

        return await this.prisma.habit.update({
            where: { 
                id
            },
            data: {
                isActive: !habit.isActive
            }
        });
    }
}
