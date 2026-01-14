import { PrismaClient } from "../../dist/generated";
export declare class DashboardRepository {
    private prisma;
    constructor(prisma: PrismaClient);
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
    private calculateStreak;
}
//# sourceMappingURL=dashboard.repository.d.ts.map