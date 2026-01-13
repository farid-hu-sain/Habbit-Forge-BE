import { DashboardRepository } from "../repository/dashboard.repository.js";
export declare class DashboardService {
    private dashboardRepo;
    constructor(dashboardRepo: DashboardRepository);
    getDashboard(userId: string): Promise<{
        totalHabits: number;
        activeHabits: number;
        totalCheckIns: number;
        streak: number;
    }>;
    getTodayHabits(userId: string): Promise<{
        id: string;
        title: string;
        description: string | null;
        category: string;
        isCompleted: boolean;
        checkInTime: Date | null;
    }[]>;
    getStats(userId: string): Promise<{
        habitsByCategory: Record<string, number>;
        last7Days: {
            date: string | undefined;
            checkIns: number;
        }[];
        monthlyCompletion: number;
    }>;
}
//# sourceMappingURL=dashboard.service.d.ts.map
