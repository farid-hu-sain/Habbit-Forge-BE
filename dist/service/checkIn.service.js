export class CheckInService {
    checkInRepo;
    constructor(checkInRepo) {
        this.checkInRepo = checkInRepo;
    }
    async getCheckInById(id) {
        const checkIn = await this.checkInRepo.findById(id);
        if (!checkIn) {
            throw new Error('CheckIn tidak ditemukan');
        }
        return checkIn;
    }
    async createCheckIn(data) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const input = {
            date: today,
            note: data.note,
            habit: { connect: { id: data.habitId } },
            user: { connect: { id: data.userId } }
        };
        return await this.checkInRepo.create(input);
    }
    async updateCheckIn(id, data) {
        await this.getCheckInById(id);
        return await this.checkInRepo.update(id, data);
    }
    async deleteCheckIn(id) {
        return await this.checkInRepo.softDelete(id);
    }
}
//# sourceMappingURL=checkIn.service.js.map