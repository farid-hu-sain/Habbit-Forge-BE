import { successResponse } from "../utils/response.js";
export class ProfileController {
    profileService;
    constructor(profileService) {
        this.profileService = profileService;
        this.getProfileByIdHandler = this.getProfileByIdHandler.bind(this);
        this.updateProfileHandler = this.updateProfileHandler.bind(this);
    }
    async getProfileByIdHandler(req, res) {
        if (!req.params.id) {
            throw new Error("tidak ada param");
        }
        const profile = await this.profileService.getProfileById(req.params.id);
        successResponse(res, "profile sudah diambil", profile);
    }
    async updateProfileHandler(req, res) {
        const profile = await this.profileService.updateProfile(req.params.id, req.body);
        successResponse(res, "buku berhasil di update", profile);
    }
}
//# sourceMappingURL=profile.controller.js.map
