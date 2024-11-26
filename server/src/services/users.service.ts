import { User } from "@prisma/client";
import { UserValidationData } from "../utils/types";
import { hashPassword, comparePasswords } from "../utils/password";
import prisma from "../config/db.config";

export const register = async (data: UserValidationData): Promise<Omit<User, 'password'> | null> => {
    if (!data.email || !data.username || !data.password) {
        return null;
    }

    const existingUser = await prisma.user.findUnique({
        where: { email: data.email }
    });

    if (existingUser) {
        return null;
    }

    try {
        const hashedPassword = await hashPassword(data.password);
        const user = await prisma.user.create({
            data: {
                email: data.email,
                username: data.username,
                password: hashedPassword
            },
            select: {
                id: true,
                username: true,
                email: true
            }
        });
        return user;
    } catch (error) {
        return null;
    }
}

export const login = async (credentials: UserValidationData): Promise<Omit<User, 'password'> | null> => {
    const user = await prisma.user.findUnique({
        where: { email: credentials.email },
        include: {
            tasks: true
        }
    });

    if (!user) {
        return null;
    }

    const isPasswordValid = await comparePasswords(
        credentials.password,
        user.password
    );

    if (!isPasswordValid) {
        return null;
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}