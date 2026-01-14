import { PrismaClient } from "../../dist/generated";
export class DashboardRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    // GET Dashboard utama
    async getDashboard(userId) {
        // 1. Hitung total habits user
        const totalHabits = await this.prisma.habit.count({
            where: { userId }
        });
        // 2. Hitung habits aktif
        const activeHabits = await this.prisma.habit.count({
            where: { userId, isActive: true }
        });
        // 3. Hitung total check-ins user
        const totalCheckIns = await this.prisma.checkIn.count({
            where: { userId }
        });
        // 4. Hitung streak (hari berturut-turut check-in)
        const streak = await this.calculateStreak(userId);
        return {
            totalHabits,
            activeHabits,
            totalCheckIns,
            streak
        };
    }
    // GET Habits untuk hari ini
    async getTodayHabits(userId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set ke awal hari
        // 1. Ambil semua habits aktif user
        const habits = await this.prisma.habit.findMany({
            where: { userId, isActive: true },
            include: {
                category: true,
                checkIn: {
                    where: {
                        date: {
                            gte: today, // Dari awal hari ini
                            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) // Sampai akhir hari
                        }
                    }
                }
            }
        });
        // 2. Format response
        return habits.map(habit => ({
            id: habit.id,
            title: habit.title,
            description: habit.description,
            category: habit.category?.name || 'No category',
            isCompleted: habit.checkIn.length > 0, // Sudah check-in hari ini
            checkInTime: habit.checkIn[0]?.createdAt || null
        }));
    }
    // GET Stats detail
    async getStats(userId) {
        // 1. Habits per kategori
        const habits = await this.prisma.habit.findMany({
            where: { userId },
            include: { category: true }
        });
        const habitsByCategory = {};
        habits.forEach(habit => {
            const categoryName = habit.category?.name || 'Uncategorized';
            habitsByCategory[categoryName] = (habitsByCategory[categoryName] || 0) + 1;
        });
        // 2. Progress 7 hari terakhir
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            const checkIns = await this.prisma.checkIn.count({
                where: {
                    userId,
                    date: {
                        gte: date,
                        lt: new Date(date.getTime() + 24 * 60 * 60 * 1000)
                    }
                }
            });
            last7Days.push({
                date: date.toISOString().split('T')[0], // Format: YYYY-MM-DD
                checkIns
            });
        }
        // 3. Completion rate bulan ini
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const activeHabits = await this.prisma.habit.count({
            where: { userId, isActive: true }
        });
        const daysInMonth = today.getDate(); // Hari ke berapa sekarang
        const possibleCheckIns = activeHabits * daysInMonth;
        const actualCheckIns = await this.prisma.checkIn.count({
            where: {
                userId,
                date: { gte: firstDayOfMonth }
            }
        });
        const completionRate = possibleCheckIns > 0
            ? Math.round((actualCheckIns / possibleCheckIns) * 100)
            : 0;
        return {
            habitsByCategory,
            last7Days,
            monthlyCompletion: completionRate
        };
    }
    // Helper: Hitung streak
    async calculateStreak(userId) {
        let streak = 0;
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        while (true) {
            const hasCheckIn = await this.prisma.checkIn.findFirst({
                where: {
                    userId,
                    date: {
                        gte: currentDate,
                        lt: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000)
                    }
                }
            });
            if (!hasCheckIn)
                break;
            streak++;
            currentDate.setDate(currentDate.getDate() - 1); // Sehari sebelumnya
        }
        return streak;
    }
}
//# sourceMappingURL=dashboard.repository.js.map