import { DashboardRepository } from "../repository/dashboard.repository";
export declare class DashboardService {
    private dashboardRepo;
    constructor(dashboardRepo: DashboardRepository);
    getDashboard(userId: string): Promise<{
        totalHabits: any;
        activeHabits: any;
        totalCheckIns: any;
        streak: number;
    }>;
    getTodayHabits(userId: string): Promise<any>;
    getStats(userId: string): Promise<{
        habitsByCategory: Record<string, number>;
        last7Days: {
            date: string | undefined;
            checkIns: any;
        }[];
        monthlyCompletion: number;
    }>;
}
//# sourceMappingURL=dashboard.service.d.ts.map