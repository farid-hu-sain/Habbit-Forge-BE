import { DashboardRepository } from '../repository/dashboard.repository';

export class DashboardService {
  constructor(private dashboardRepo: DashboardRepository) {}
  
  // GET /api/dashboard
  async getDashboard(userId: string) {
    return await this.dashboardRepo.getDashboard(userId);
  }
  
  // GET /api/dashboard/today
  async getTodayHabits(userId: string) {
    return await this.dashboardRepo.getTodayHabits(userId);
  }
  
  // GET /api/dashboard/stats
  async getStats(userId: string) {
    return await this.dashboardRepo.getStats(userId);
  }
}