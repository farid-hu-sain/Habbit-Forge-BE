import { DashboardRepository } from "../repository/dashboard.repository.js";

export class DashboardService {
  constructor(private dashboardRepo: DashboardRepository) {}

  async getDashboard(userId: string) {
    return await this.dashboardRepo.getDashboard(userId);
  }

  async getTodayHabits(userId: string) {
    return await this.dashboardRepo.getTodayHabits(userId);
  }

  async getStats(userId: string) {
    return await this.dashboardRepo.getStats(userId);
  }
}
