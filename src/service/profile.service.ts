import type { Profile} from "../generated";
import type { IProfileRepository } from "../repository/profile.repository"



export interface ProfileListRespone{
    profile:Profile[], 
    total: number, 
    totalPages: number, 
    currentPage: number 
}
export interface IProfileService {
  getProfileById (id: string): Promise<Profile | null>;
  updateProfile(id: string, data: Partial<Profile>) : Promise <Profile>
}

export class ProfileService implements IProfileService { 
    constructor (private profileRepo: IProfileRepository) {}


  async getProfileById(id: string): Promise<Profile | null> {  
    const profile = await this.profileRepo.findByUserId(id); 
    
    if (!profile) {
        throw new Error('Profile tidak ditemukan');
    }
    
    return profile;
}


    async updateProfile(userId: string, data: Partial<Profile>): Promise<Profile> {
    return await this.profileRepo.updateByUserId(userId, data as any);
}


}
