import prisma from "../database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../utils/env.js";

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  profile: {
    fullName?: string;
    bio?: string;
    avatar?: string;
  } | null;
  createdAt: Date;
}

export class UserService {
  async register(
    data: RegisterData,
  ): Promise<{ user: UserProfile; token: string }> {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) throw new Error("Email sudah terdaftar");

    const existingUsername = await prisma.user.findUnique({
      where: { username: data.username },
    });

    if (existingUsername) throw new Error("Username sudah terdaftar");

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        password: hashedPassword,
        profile: { create: { fullName: data.username } },
      },
      include: { profile: true },
    });

    const token = this.generateToken(user.id, user.email, user.username);

    return {
      user: this.formatUserResponse(user),
      token,
    };
  }

  async login(data: LoginData): Promise<{ user: UserProfile; token: string }> {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: { profile: true },
    });

    if (!user) throw new Error("Email atau password salah");

    const isValid = await bcrypt.compare(data.password, user.password);
    if (!isValid) throw new Error("Email atau password salah");

    const token = this.generateToken(user.id, user.email, user.username);

    return {
      user: this.formatUserResponse(user),
      token,
    };
  }

  async getCurrentUser(userId: string): Promise<UserProfile> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        updatedAt: true,
        profile: true,
      },
    });

    if (!user) throw new Error("User tidak ditemukan");

    return this.formatUserResponse(user);
  }

  private generateToken(
    userId: string,
    email: string,
    username: string,
  ): string {
    return jwt.sign(
      {
        id: userId,
        email: email,
        username: username,
        role: "user",
      },
      config.JWT_SECRET,
      { expiresIn: "7d" },
    );
  }

  private formatUserResponse(user: any): UserProfile {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      profile: user.profile,
      createdAt: user.createdAt,
    };
  }
}
