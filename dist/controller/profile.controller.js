import { successResponse } from "../utils/response";
import { asyncHandler } from "../utils/asyncHandler";
export class ProfileController {
    profileService;
    constructor(profileService) {
        this.profileService = profileService;
    }
    getProfileByIdHandler = asyncHandler(async (req, res) => {
        const userId = req.user?.id;
        if (!userId)
            throw new Error("Unauthorized");
        const profile = await this.profileService.getProfileByUserId(userId);
        successResponse(res, "Profile berhasil diambil", profile);
    });
    updateProfileHandler = asyncHandler(async (req, res) => {
        const userId = req.user?.id;
        if (!userId)
            throw new Error("Unauthorized");
        const updateData = { ...req.body };
        if (req.file) {
            updateData.avatar = `/uploads/${req.file.filename}`;
        }
        const profile = await this.profileService.updateProfile(userId, updateData);
        successResponse(res, "Profile berhasil diupdate", profile);
    });
}
//# sourceMappingURL=profile.controller.js.map