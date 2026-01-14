import { DashboardService } from "../service/dashboard.service";
import { DashboardRepository } from "../repository/dashboard.repository";
import prismaInstance from "../database";
import { asyncHandler } from "../utils/asyncHandler";
import { successResponse } from "../utils/response";
const prisma = prismaInstance;
const dashboardRepo = new DashboardRepository(prisma);
const dashboardService = new DashboardService(dashboardRepo);
export const getDashboard = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new Error("Unauthorized");
    }
    const dashboardData = await dashboardService.getDashboard(userId);
    successResponse(res, "Dashboard data retrieved", dashboardData);
});
export const getTodayHabits = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const todayHabits = await dashboardService.getTodayHabits(userId);
        return res.status(200).json({
            success: true,
            data: todayHabits,
        });
    }
    catch (error) {
        console.error("Today habits error:", error);
        return res.status(500).json({ error: "Failed to get today habits" });
    }
};
export const getStats = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const stats = await dashboardService.getStats(userId);
        return res.status(200).json({
            success: true,
            data: stats,
        });
    }
    catch (error) {
        console.error("Stats error:", error);
        return res.status(500).json({ error: "Failed to get stats" });
    }
};
//# sourceMappingURL=dashboard.controller.js.map