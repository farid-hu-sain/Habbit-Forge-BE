import type { Profile } from "../../dist/generated";
import type { IProfileRepository } from "../repository/profile.repository";
export interface IProfileService {
    getProfileByUserId(userId: string): Promise<Profile>;
    updateProfile(userId: string, data: {
        fullName?: string;
        bio?: string;
        avatar?: string;
    }): Promise<Profile>;
}
export declare class ProfileService implements IProfileService {
    private profileRepo;
    constructor(profileRepo: IProfileRepository);
    getProfileByUserId(userId: string): Promise<Profile>;
    updateProfile(userId: string, data: {
        fullName?: string;
        bio?: string;
        avatar?: string;
    }): Promise<Profile>;
}
//# sourceMappingURL=profile.service.d.ts.map