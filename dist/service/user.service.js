import prisma from "../database";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../utils/env';
export class UserService {
    async register(data) {
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email }
        });
        if (existingUser)
            throw new Error("Email sudah terdaftar");
        const existingUsername = await prisma.user.findUnique({
            where: { username: data.username }
        });
        if (existingUsername)
            throw new Error("Username sudah terdaftar");
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await prisma.user.create({
            data: {
                email: data.email,
                username: data.username,
                password: hashedPassword,
                profile: { create: { fullName: data.username } }
            },
            include: { profile: true }
        });
        const token = this.generateToken(user.id, user.email, user.username);
        return {
            user: this.formatUserResponse(user),
            token
        };
    }
    async login(data) {
        const user = await prisma.user.findUnique({
            where: { email: data.email },
            include: { profile: true }
        });
        if (!user)
            throw new Error("Email atau password salah");
        const isValid = await bcrypt.compare(data.password, user.password);
        if (!isValid)
            throw new Error("Email atau password salah");
        const token = this.generateToken(user.id, user.email, user.username);
        return {
            user: this.formatUserResponse(user),
            token
        };
    }
    async getCurrentUser(userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                username: true,
                createdAt: true,
                updatedAt: true,
                profile: true
            }
        });
        if (!user)
            throw new Error("User tidak ditemukan");
        return this.formatUserResponse(user);
    }
    generateToken(userId, email, username) {
        return jwt.sign({
            id: userId,
            email: email,
            username: username,
            role: 'user'
        }, config.JWT_SECRET, { expiresIn: '7d' });
    }
    formatUserResponse(user) {
        return {
            id: user.id,
            email: user.email,
            username: user.username,
            profile: user.profile,
            createdAt: user.createdAt
        };
    }
}
//# sourceMappingURL=user.service.js.map