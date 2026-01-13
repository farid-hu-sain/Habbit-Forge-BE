import { PrismaClient } from "../../dist/generated/index.js";
export declare class DashboardRepository {
    private prisma;
    constructor(prisma: PrismaClient);
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
    private calculateStreak;
}
//# sourceMappingURL=dashboard.repository.d.ts.map
