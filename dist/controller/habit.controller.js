import { successResponse } from "../utils/response";
import { asyncHandler } from "../utils/asyncHandler";
export class HabitController {
    habitService;
    constructor(habitService) {
        this.habitService = habitService;
    }
    getAllHabitHandler = asyncHandler(async (req, res) => {
        const userId = req.user?.id;
        if (!userId)
            throw new Error("Unauthorized");
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search;
        const sortBy = req.query.sortBy;
        const sortOrder = req.query.sortOrder || "desc";
        const result = await this.habitService.getAll({
            page,
            limit,
            search,
            sortBy,
            sortOrder,
        }, userId // ⭐ KIRIM userId
        );
        const pagination = {
            page: result.currentPage,
            limit,
            total: result.total,
            totalPages: result.totalPages,
        };
        successResponse(res, "Daftar habit berhasil diambil", result.habit, pagination);
    });
    getHabitByIdHandler = asyncHandler(async (req, res) => {
        const userId = req.user?.id;
        if (!userId)
            throw new Error("Unauthorized");
        const habitId = req.params.id;
        if (!habitId)
            throw new Error("Habit ID diperlukan");
        const habit = await this.habitService.getHabitById(habitId, userId);
        successResponse(res, "Habit berhasil diambil", habit);
    });
    createHabitHandler = asyncHandler(async (req, res) => {
        const userId = req.user?.id;
        if (!userId)
            throw new Error("Unauthorized");
        const { title, description, isActive, categoryId } = req.body;
        if (!title)
            throw new Error("Title diperlukan");
        const habit = await this.habitService.createHabit({
            title,
            description,
            isActive,
            userId,
            categoryId,
        });
        successResponse(res, "Habit berhasil dibuat", habit, null, 201);
    });
    updateHabitHandler = asyncHandler(async (req, res) => {
        const userId = req.user?.id;
        if (!userId)
            throw new Error("Unauthorized");
        const habitId = req.params.id;
        if (!habitId)
            throw new Error("Habit ID diperlukan");
        const habit = await this.habitService.updateHabit(habitId, req.body, userId);
        successResponse(res, "Habit berhasil diupdate", habit);
    });
    deleteHabitHandler = asyncHandler(async (req, res) => {
        const userId = req.user?.id;
        if (!userId)
            throw new Error("Unauthorized");
        const habitId = req.params.id;
        if (!habitId)
            throw new Error("Habit ID diperlukan");
        const deleted = await this.habitService.deleteHabit(habitId, userId);
        successResponse(res, "Habit berhasil dihapus", deleted);
    });
    toggleHabitHandler = asyncHandler(async (req, res) => {
        const userId = req.user?.id;
        if (!userId)
            throw new Error("Unauthorized");
        const habitId = req.params.id;
        if (!habitId)
            throw new Error("Habit ID diperlukan");
        const toggledHabit = await this.habitService.toggleHabit(habitId, userId);
        const message = toggledHabit.isActive
            ? "Habit berhasil diaktifkan"
            : "Habit berhasil dinonaktifkan";
        successResponse(res, message, toggledHabit);
    });
}
//# sourceMappingURL=habit.controller.js.map