export class HabitService {
    habitRepo;
    constructor(habitRepo) {
        this.habitRepo = habitRepo;
    }
    async getAll(params, userId) {
        const { page, limit, search, sortBy, sortOrder } = params;
        const skip = (page - 1) * limit;
        const whereClause = {
            userId: userId // Auto-filter by user
        };
        if (search?.title) {
            whereClause.title = { contains: search.title, mode: "insensitive" };
        }
        const sortCriteria = sortBy
            ? { [sortBy]: sortOrder || "desc" }
            : { createdAt: "desc" };
        const habit = await this.habitRepo.list(skip, limit, whereClause, sortCriteria);
        const total = await this.habitRepo.countAll(whereClause);
        return {
            habit,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        };
    }
    async getHabitById(id, userId) {
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
    async createHabit(data) {
        // Validasi input
        if (!data.title || data.title.trim().length < 3) {
            throw new Error("Title harus minimal 3 karakter");
        }
        const habitData = {
            title: data.title.trim(),
            description: data.description?.trim() || null,
            isActive: data.isActive ?? true,
            user: { connect: { id: data.userId } },
            startDate: new Date(data.startDate),
            lastCheckIn: new Date(data.lastCheckIn),
            frequency: data.frequency
        };
        if (data.categoryId) {
            habitData.category = { connect: { id: data.categoryId } };
        }
        return await this.habitRepo.create(habitData);
    }
    async updateHabit(id, data, userId) {
        // Validasi ownership
        await this.getHabitById(id, userId);
        return await this.habitRepo.update(id, data);
    }
    async deleteHabit(id, userId) {
        // Validasi ownership
        await this.getHabitById(id, userId);
        return await this.habitRepo.softDelete(id);
    }
    async toggleHabit(id, userId) {
        const habit = await this.getHabitById(id, userId);
        return await this.habitRepo.update(id, {
            isActive: !habit.isActive
        });
    }
}
