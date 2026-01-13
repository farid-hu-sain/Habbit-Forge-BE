export class HabitRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(skip, take, where, orderBy) {
        return await this.prisma.habit.findMany({
            skip,
            take,
            where,
            orderBy,
            include: {
                category: true,
                user: true
            }
        });
    }
    async countAll(where) {
        return await this.prisma.habit.count({ where });
    }
    async findById(id) {
        return await this.prisma.habit.findUnique({
            where: {
                id: id,
            },
            include: {
                category: true,
                user: true,
                checkIn: true
            }
        });
    }
    async create(data) {
        return await this.prisma.habit.create({ data });
    }
    async update(id, data) {
        return await this.prisma.habit.update({
            where: {
                id
            },
            data
        });
    }
    async softDelete(id) {
        return await this.prisma.habit.update({
            where: { id },
            data: {
                isActive: false
            }
        });
    }
    async toggleActive(id) {
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
//# sourceMappingURL=habit.repository.js.map