import { getTodayDateString, formatDateForFE, getDateRangeForQuery, parseDateFromFE, addDays, } from "../utils/timeUtils.js";
export class DashboardRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboard(userId) {
        const totalHabits = await this.prisma.habit.count({
            where: { userId, isActive: true },
        });
        const totalCheckIns = await this.prisma.checkIn.count({
            where: { userId },
        });
        const streak = await this.calculateUserStreak(userId);
        return {
            totalHabits,
            activeHabits: totalHabits,
            totalCheckIns,
            streak,
        };
    }
    async getTodayHabits(userId) {
        const todayStr = getTodayDateString(); // UTC date string
        const { start, end } = getDateRangeForQuery(todayStr);
        const habits = await this.prisma.habit.findMany({
            where: {
                userId,
                isActive: true,
            },
            select: {
                id: true,
                title: true,
                description: true,
                category: true,
                checkIn: {
                    where: {
                        date: {
                            gte: start,
                            lte: end,
                        },
                    },
                },
            },
        });
        return habits.map((habit) => ({
            id: habit.id,
            title: habit.title,
            description: habit.description,
            category: habit.category,
            isCompleted: habit.checkIn.length > 0,
            checkInDate: habit.checkIn[0]
                ? formatDateForFE(habit.checkIn[0].date)
                : null,
            checkInTime: habit.checkIn[0]?.createdAt || null,
            canCheckInToday: habit.checkIn.length === 0,
        }));
    }
    async getStats(userId) {
        const habits = await this.prisma.habit.findMany({
            where: {
                userId,
                isActive: true,
            },
            select: {
                category: true,
            },
        });
        const habitsByCategory = {};
        habits.forEach((habit) => {
            const categoryName = habit.category || "Uncategorized";
            habitsByCategory[categoryName] =
                (habitsByCategory[categoryName] || 0) + 1;
        });
        const last7Days = await this.getLast7DaysStats(userId);
        const monthlyCompletion = await this.getMonthlyCompletionRate(userId);
        return {
            habitsByCategory,
            last7Days,
            monthlyCompletion,
        };
    }
    async calculateUserStreak(userId) {
        const sixtyDaysAgoStr = addDays(getTodayDateString(), -60);
        const checkIns = await this.prisma.checkIn.findMany({
            where: {
                userId,
                date: {
                    gte: parseDateFromFE(sixtyDaysAgoStr),
                },
            },
            select: { date: true },
            orderBy: { date: "desc" },
        });
        const checkInDates = new Set();
        checkIns.forEach((checkIn) => {
            const dateStr = formatDateForFE(checkIn.date);
            checkInDates.add(dateStr);
        });
        let streak = 0;
        let currentDateStr = getTodayDateString();
        for (let i = 0; i < 60; i++) {
            if (checkInDates.has(currentDateStr)) {
                streak++;
                currentDateStr = addDays(currentDateStr, -1);
            }
            else {
                break;
            }
        }
        return streak;
    }
    async getLast7DaysStats(userId) {
        const checkIns = await this.prisma.checkIn.findMany({
            where: { userId },
            select: { date: true },
        });
        const checkInsByDay = new Map();
        checkIns.forEach((checkIn) => {
            const dateStr = formatDateForFE(checkIn.date);
            checkInsByDay.set(dateStr, (checkInsByDay.get(dateStr) || 0) + 1);
        });
        const last7Days = [];
        const todayStr = getTodayDateString();
        for (let i = 6; i >= 0; i--) {
            const dateStr = addDays(todayStr, -i);
            const checkInsCount = checkInsByDay.get(dateStr) || 0;
            const dateObj = parseDateFromFE(dateStr);
            last7Days.push({
                date: dateStr,
                dateDisplay: this.formatDateDisplay(dateObj),
                checkIns: checkInsCount,
            });
        }
        return last7Days;
    }
    async getMonthlyCompletionRate(userId) {
        const today = new Date();
        const firstDayOfMonth = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1));
        const activeHabits = await this.prisma.habit.count({
            where: { userId, isActive: true },
        });
        if (activeHabits === 0)
            return 0;
        const actualCheckIns = await this.prisma.checkIn.count({
            where: {
                userId,
                date: { gte: firstDayOfMonth },
            },
        });
        const daysInMonth = today.getUTCDate();
        const possibleCheckIns = activeHabits * daysInMonth;
        return Math.round((actualCheckIns / possibleCheckIns) * 100);
    }
    formatDateDisplay(date) {
        // Convert UTC date to Indonesia time for display
        return date.toLocaleDateString("id-ID", {
            weekday: "short",
            day: "numeric",
            month: "short",
            timeZone: "Asia/Jakarta",
        });
    }
}
