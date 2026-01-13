export class HabitService {
    habitRepo;
    constructor(habitRepo) {
        this.habitRepo = habitRepo;
    }
    async getAll(params) {
        const { page, limit, search, sortBy, sortOrder } = params;
        const skip = (page - 1) * limit;
        const whereClause = {};
        if (search?.title) {
            whereClause.title = { contains: search.title, mode: "insensitive" };
        }
        const sortCriteria = sortBy ? { [sortBy]: sortOrder || "desc" } : { createdAt: "desc" };
        const habit = await this.habitRepo.list(skip, limit, whereClause, sortCriteria);
        const total = await this.habitRepo.countAll(whereClause);
        return {
            habit,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        };
    }
    async getHabitById(id) {
        const habit = await this.habitRepo.findById(id);
        if (!habit) {
            throw new Error('Habit tidak ditemukan');
        }
        return habit;
    }
    async createHabit(data) {
        return await this.habitRepo.create({
            ...data,
            user: {
                connect: { id: data.userId }
            }
        });
    }
    async updateHabit(id, data) {
        await this.getHabitById(id);
        return await this.habitRepo.update(id, data);
    }
    async deleteHabit(id) {
        return await this.habitRepo.softDelete(id);
    }
    async toggleHabit(id) {
        return await this.habitRepo.toggleActive(id);
    }
}
//# sourceMappingURL=habit.service.js.map