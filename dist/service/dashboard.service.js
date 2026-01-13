// services/DashboardService.ts
import { DashboardRepository } from "../repository/dashboard.repository.js";
export class DashboardService {
    dashboardRepo;
    constructor(dashboardRepo) {
        this.dashboardRepo = dashboardRepo;
    }
    // GET /api/dashboard
    async getDashboard(userId) {
        return await this.dashboardRepo.getDashboard(userId);
    }
    // GET /api/dashboard/today
    async getTodayHabits(userId) {
        return await this.dashboardRepo.getTodayHabits(userId);
    }
    // GET /api/dashboard/stats
    async getStats(userId) {
        return await this.dashboardRepo.getStats(userId);
    }
}
//# sourceMappingURL=dashboard.service.js.map
