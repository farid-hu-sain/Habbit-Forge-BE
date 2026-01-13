import { successResponse } from "../utils/response.js";
export class HabitController {
    habitService;
    constructor(habitService) {
        this.habitService = habitService;
        this.getAllHabitHandler = this.getAllHabitHandler.bind(this);
        this.getHabitByIdHandler = this.getHabitByIdHandler.bind(this);
        this.createHabitHandler = this.createHabitHandler.bind(this);
        this.updateHabitHandler = this.updateHabitHandler.bind(this);
        this.deleteHabitHandler = this.deleteHabitHandler.bind(this);
    }
    async getAllHabitHandler(req, res) {
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
            sortOrder
        });
        const pagination = {
            page: result.currentPage,
            limit,
            total: result.total,
            totalPages: result.totalPages
        };
        successResponse(res, "habit berhasil ditambahkan", result.habit, pagination);
    }
    async getHabitByIdHandler(req, res) {
        if (!req.params.id) {
            throw new Error("tidak ada param");
        }
        const habit = await this.habitService.getHabitById(req.params.id);
        successResponse(res, "habit sudah diambil", habit);
    }
    async createHabitHandler(req, res) {
        const { title, description, isActive, userId } = req.body;
        const data = {
            title: title.toString(),
            description: description.toString(),
            isActive: Boolean(isActive),
            userId: userId.toString()
        };
        const habits = await this.habitService.createHabit(data);
        successResponse(res, "habit berhasil ditambakan", habits, null, 201);
    }
    async updateHabitHandler(req, res) {
        const habit = await this.habitService.updateHabit(req.params.id, req.body);
        successResponse(res, "habit berhasil di update", habit);
    }
    async deleteHabitHandler(req, res) {
        const deleted = await this.habitService.deleteHabit(req.params.id);
        res.json({
            success: true,
            message: "habit berhasil dihapus",
            data: deleted
        });
    }
    async toggleHabitHandler(req, res) {
        const toggledHabit = await this.habitService.toggleHabit(req.params.id);
        res.json({
            success: true,
            message: `Habit status: ${toggledHabit.isActive ? "Active" : "Inactive"}`,
            data: toggledHabit
        });
    }
}
//# sourceMappingURL=habit.controller.js.map
