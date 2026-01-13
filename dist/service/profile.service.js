export class ProfileService {
    profileRepo;
    constructor(profileRepo) {
        this.profileRepo = profileRepo;
    }
    async getProfileById(id) {
        const profile = await this.profileRepo.findByUserId(id);
        if (!profile) {
            throw new Error('Profile tidak ditemukan');
        }
        return profile;
    }
    async updateProfile(userId, data) {
        return await this.profileRepo.updateByUserId(userId, data);
    }
}
//# sourceMappingURL=profile.service.js.map