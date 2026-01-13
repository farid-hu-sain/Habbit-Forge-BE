export class ProfileRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByUserId(userId) {
        return await this.prisma.profile.findUnique({
            where: { userId }
        });
    }
    async updateByUserId(userId, data) {
        return await this.prisma.profile.update({
            where: { userId },
            data: {
                ...(data.fullName !== undefined && { fullName: data.fullName }),
                ...(data.bio !== undefined && { bio: data.bio }),
                ...(data.avatar !== undefined && { avatar: data.avatar })
            }
        });
    }
}
//# sourceMappingURL=profile.repository.js.map