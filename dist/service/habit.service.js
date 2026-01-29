import { parseDateFromFE, formatDateForFE, getTodayDateString, getDateRangeForQuery, isValidDateString, formatToIndonesianDate, } from "../utils/timeUtils.js";
export class HabitService {
    habitRepo;
    constructor(habitRepo) {
        this.habitRepo = habitRepo;
    }
    getAvailableCategories() {
        return ["HEALTH", "FINANCE", "WORK", "LEARNING", "SOCIAL"];
    }
    async getAll(params, userId) {
        const { page, limit, search, sortBy, sortOrder, showInactive = false, } = params;
        const skip = (page - 1) * limit;
        const whereClause = {
            userId,
            ...(!showInactive && { isActive: true }),
        };
        if (search?.title) {
            whereClause.title = { contains: search.title, mode: "insensitive" };
        }
        const sortCriteria = sortBy
            ? { [sortBy]: sortOrder || "desc" }
            : { createdAt: "desc" };
        const habits = await this.habitRepo.list(skip, limit, whereClause, sortCriteria);
        const formattedHabits = habits.map((habit) => this.formatHabitResponse(habit));
        const total = await this.habitRepo.countAll(whereClause);
        return {
            habits: formattedHabits,
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
        if (habit.userId !== userId) {
            throw new Error("Akses ditolak");
        }
        return this.formatHabitResponse(habit);
    }
    async createHabit(data) {
        if (!data.title || data.title.trim().length < 3) {
            throw new Error("Title harus minimal 3 karakter");
        }
        if (!/^\d{4}-\d{2}-\d{2}$/.test(data.startDate)) {
            throw new Error("Format startDate harus YYYY-MM-DD");
        }
        if (!isValidDateString(data.startDate)) {
            throw new Error("Tanggal tidak valid");
        }
        if (data.category &&
            !this.getAvailableCategories().includes(data.category)) {
            throw new Error("Kategori tidak valid");
        }
        const habitData = {
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
    async updateHabit(id, data, userId) {
        await this.getHabitById(id, userId);
        const updateData = { ...data };
        if (data.startDate && typeof data.startDate === "string") {
            if (!isValidDateString(data.startDate)) {
                throw new Error("Format startDate harus YYYY-MM-DD");
            }
            updateData.startDate = parseDateFromFE(data.startDate);
        }
        if (data.category &&
            !this.getAvailableCategories().includes(data.category)) {
            throw new Error("Kategori tidak valid");
        }
        const updated = await this.habitRepo.update(id, updateData);
        return this.formatHabitResponse(updated);
    }
    async deleteHabit(id, userId) {
        await this.getHabitById(id, userId);
        const deleted = await this.habitRepo.hardDelete(id);
        return this.formatHabitResponse(deleted);
    }
    async toggleHabit(id, userId) {
        const habit = await this.getHabitById(id, userId);
        const toggled = await this.habitRepo.update(id, {
            isActive: !habit.isActive,
        });
        return this.formatHabitResponse(toggled);
    }
    async getHabitsWithTodayStatus(userId) {
        const todayStr = getTodayDateString();
        const { start, end } = getDateRangeForQuery(todayStr);
        const habits = await this.habitRepo.getHabitsWithTodayCheckIns(userId, {
            start,
            end,
        });
        return habits.map((habit) => ({
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
    formatHabitResponse(habit) {
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
