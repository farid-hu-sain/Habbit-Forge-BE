import { DashboardRepository } from "../repository/dashboard.repository";
export class DashboardService {
    dashboardRepo;
    constructor(dashboardRepo) {
        this.dashboardRepo = dashboardRepo;
    }
    async getDashboard(userId) {
        return await this.dashboardRepo.getDashboard(userId);
    }
    async getTodayHabits(userId) {
        return await this.dashboardRepo.getTodayHabits(userId);
    }
    async getStats(userId) {
        return await this.dashboardRepo.getStats(userId);
    }
}
//# sourceMappingURL=dashboard.service.js.map