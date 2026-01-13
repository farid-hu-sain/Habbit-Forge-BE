import { successResponse } from "../utils/response.js";
export class CheckInController {
    checkInService;
    constructor(checkInService) {
        this.checkInService = checkInService;
        this.getCheckInByIdHandler = this.getCheckInByIdHandler.bind(this);
        this.createCheckInHandler = this.createCheckInHandler.bind(this);
        this.updateCheckInHandler = this.updateCheckInHandler.bind(this);
        this.deleteCheckInHandler = this.deleteCheckInHandler.bind(this);
    }
    async getCheckInByIdHandler(req, res) {
        if (!req.params.id) {
            throw new Error("tidak ada param");
        }
        const checkIn = await this.checkInService.getCheckInById(req.params.id);
        successResponse(res, "checkIn sudah diambil", checkIn);
    }
    async createCheckInHandler(req, res) {
        const { habitId, userId, note } = req.body;
        const data = {
            habitId: habitId.toString(),
            userId: userId.toString(),
            note: note.toString(),
        };
        const checkIns = await this.checkInService.createCheckIn(data);
        successResponse(res, "checkIn berhasil ditambakan", checkIns, null, 201);
    }
    async updateCheckInHandler(req, res) {
        const checkIn = await this.checkInService.updateCheckIn(req.params.id, req.body);
        successResponse(res, "checkIn berhasil di update", checkIn);
    }
    async deleteCheckInHandler(req, res) {
        const deleted = await this.checkInService.deleteCheckIn(req.params.id);
        res.json({
            success: true,
            message: "kategoti berhasil dihapus",
            data: deleted
        });
    }
}
//# sourceMappingURL=checkIn.controller.js.map
