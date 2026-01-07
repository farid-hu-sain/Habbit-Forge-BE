import prisma from "../database";
import config from '../utils/env'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

export const register = async (data: {
    username: string;
    email: string;
    password: string;
}) => {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } })
    if (existingUser) {
        throw new Error("Email sudah terdaftar")
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)

    const user =  await prisma.user.create({
        data: {
            email: data.email,
            username: data.username,
            password: hashedPassword,
        }
    })

    return {
        email: user.email,
        username: user.username,
    }
}


export const login = async (data: { email: string; password: string }) => {
    const user = await prisma.user.findUnique({
        where: { email: data.email }
    })
    if (!user) {
        const error = new Error("Email atau password salah")
        error.name = "AuthenticationError" 
        throw error
    }

    const isValid = await bcrypt.compare(data.password, user.password)
    if (!isValid) {
        throw new Error("Email atau password salah")
    }

    const token = jwt.sign(
        { id: user.id },
        config.JWT_SECRET,
        { expiresIn: '1h' }
    )

    const userReturn = {
        email: user.email,
        username: user.username,
    }

    return { userReturn, token }
}


export const getCurrentUser = async (userId: string) => {
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