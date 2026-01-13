import type { Profile } from "../../dist/generated/index.js";
import type { IProfileRepository } from "../repository/profile.repository.js";
export interface ProfileListRespone {
    profile: Profile[];
    total: number;
    totalPages: number;
    currentPage: number;
}
export interface IProfileService {
    getProfileById(id: string): Promise<Profile | null>;
    updateProfile(id: string, data: Partial<Profile>): Promise<Profile>;
}
export declare class ProfileService implements IProfileService {
    private profileRepo;
    constructor(profileRepo: IProfileRepository);
    getProfileById(id: string): Promise<Profile | null>;
    updateProfile(userId: string, data: Partial<Profile>): Promise<Profile>;
}
//# sourceMappingURL=profile.service.d.ts.map
