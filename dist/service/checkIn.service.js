import prisma from "../database";
export class CheckInService {
    checkInRepo;
    constructor(checkInRepo) {
        this.checkInRepo = checkInRepo;
    }
    async getCheckInById(id, userId) {
        const checkIn = await this.checkInRepo.findById(id);
        if (!checkIn) {
            throw new Error("CheckIn tidak ditemukan");
        }
        // Auto-validate ownership
        if (checkIn.userId !== userId) {
            throw new Error("CheckIn tidak ditemukan");
        }
        return checkIn;
    }
    async createCheckIn(data) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        // Validasi: Habit harus milik user DAN aktif
        const habit = await prisma.habit.findFirst({
            where: {
                id: data.habitId,
                userId: data.userId,
                isActive: true
            }
        });
        if (!habit) {
            throw new Error("Habit tidak ditemukan atau tidak aktif");
        }
        const existingCheckIn = await this.checkInRepo.findTodayCheckIn(data.habitId, today);
        if (existingCheckIn) {
            throw new Error("Sudah check-in hari ini");
        }
        const input = {
            date: today,
            note: data.note,
            habit: { connect: { id: data.habitId } },
            user: { connect: { id: data.userId } },
        };
        return await this.checkInRepo.create(input);
    }
    async updateCheckIn(id, data, userId) {
        // Validasi ownership
        await this.getCheckInById(id, userId);
        return await this.checkInRepo.update(id, data);
    }
    async deleteCheckIn(id, userId) {
        // Validasi ownership
        await this.getCheckInById(id, userId);
        return await this.checkInRepo.softDelete(id);
    }
}
//# sourceMappingURL=checkIn.service.js.map