import { DashboardService } from "../service/dashboard.service.js";
import { DashboardRepository } from "../repository/dashboard.repository.js";
import { PrismaClient } from "../../dist/generated/index.js";
const prisma = new PrismaClient();
const dashboardRepo = new DashboardRepository(prisma);
const dashboardService = new DashboardService(dashboardRepo);
// GET /api/dashboard
export const getDashboard = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const dashboardData = await dashboardService.getDashboard(userId);
        return res.status(200).json({
            success: true,
            data: dashboardData
        });
    }
    catch (error) {
        console.error("Dashboard error:", error);
        return res.status(500).json({ error: "Failed to get dashboard" });
    }
};
// GET /api/dashboard/today
export const getTodayHabits = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const todayHabits = await dashboardService.getTodayHabits(userId);
        return res.status(200).json({
            success: true,
            data: todayHabits
        });
    }
    catch (error) {
        console.error("Today habits error:", error);
        return res.status(500).json({ error: "Failed to get today habits" });
    }
};
// GET /api/dashboard/stats
export const getStats = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const stats = await dashboardService.getStats(userId);
        return res.status(200).json({
            success: true,
            data: stats
        });
    }
    catch (error) {
        console.error("Stats error:", error);
        return res.status(500).json({ error: "Failed to get stats" });
    }
};
//# sourceMappingURL=dashboard.controller.js.map
