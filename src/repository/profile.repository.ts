import type {   PrismaClient, Profile } from "@prisma/client";

export interface IProfileRepository {
    findByUserId(userId: string): Promise<Profile | null>;
  
    updateByUserId(userId: string, data: {
      fullName?: string;
      bio?: string;
      avatar?: string;
    }): Promise<Profile>;
  
}

export class ProfileRepository implements IProfileRepository {
    constructor(private prisma: PrismaClient) { }

    async findByUserId(userId: string): Promise<Profile | null> {
    return await this.prisma.profile.findUnique({
      where: { userId }
    });
  }

  async updateByUserId(userId: string, data: {
    fullName?: string;
    bio?: string;
    avatar?: string;
  }): Promise<Profile> {
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
