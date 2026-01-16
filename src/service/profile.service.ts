import type { Profile } from "../../dist/generated/index.js";
import type { IProfileRepository } from "../repository/profile.repository.js";

export interface IProfileService {
  getProfileByUserId(userId: string): Promise<Profile>;
  updateProfile(userId: string, data: {
    fullName?: string;
    bio?: string;
    avatar?: string;
  }): Promise<Profile>;
}

export class ProfileService implements IProfileService {
  constructor(private profileRepo: IProfileRepository) {}

  async getProfileByUserId(userId: string): Promise<Profile> {
    const profile = await this.profileRepo.findByUserId(userId);

    if (!profile) {
      throw new Error("Profile tidak ditemukan");
    }

    return profile;
  }

  async updateProfile(
    userId: string,
    data: {
      fullName?: string;
      bio?: string;
      avatar?: string;
    }
  ): Promise<Profile> {
    return await this.profileRepo.updateByUserId(userId, data);
  }
}