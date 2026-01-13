import prisma from "../database.js";
import config from "../utils/env.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const register = async (data) => {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
        throw new Error("Email sudah terdaftar");
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
        data: {
            email: data.email,
            username: data.username,
            password: hashedPassword,
        }
    });
    return {
        email: user.email,
        username: user.username,
    };
};
export const login = async (data) => {
    const user = await prisma.user.findUnique({
        where: { email: data.email }
    });
    if (!user) {
        throw new Error("Email atau password salah");
    }
    const isValid = await bcrypt.compare(data.password, user.password);
    if (!isValid) {
        throw new Error("Email atau password salah");
    }
    const token = jwt.sign({ id: user.id }, config.JWT_SECRET, { expiresIn: "1h" });
    const userReturn = {
        email: user.email,
        username: user.username,
    };
    return { userReturn, token };
};
export const getCurrentUser = async (userId) => {
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
    if (!user) {
        throw new Error("User tidak ditemukan");
    }
    return user;
};
//# sourceMappingURL=auth.service.js.map
