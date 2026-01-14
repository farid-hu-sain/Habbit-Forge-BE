import type { PrismaClient, Profile } from "../../dist/generated";
export interface IProfileRepository {
    findByUserId(userId: string): Promise<Profile | null>;
    updateByUserId(userId: string, data: {
        fullName?: string;
        bio?: string;
        avatar?: string;
    }): Promise<Profile>;
}
export declare class ProfileRepository implements IProfileRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    findByUserId(userId: string): Promise<Profile | null>;
    updateByUserId(userId: string, data: {
        fullName?: string;
        bio?: string;
        avatar?: string;
    }): Promise<Profile>;
}
//# sourceMappingURL=profile.repository.d.ts.map