import { User } from "@prisma/client";
import { UserValidationData } from "../utils/types";
import { hashPassword, comparePasswords } from "../utils/password";
import prisma from "../config/db.config";

export const register = async (data: UserValidationData): Promise<Omit<User, 'password'>> => {
    if (!data.email || !data.password) {
        throw new Error('Username and password are required');
    }

    const existingUser = await prisma.user.findUnique({
        where: { username: data.email }
    });

    if (existingUser) {
        throw new Error('Username already exists');
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
        data: {
            username: data.email,
            password: hashedPassword
        },
        select: {
            id: true,
            username: true
        }
    });

    return user;
}

export const login = async (credentials: UserValidationData): Promise<Omit<User, 'password'> | null> => {
    const user = await prisma.user.findUnique({
        where: { username: credentials.email }
    });

    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isPasswordValid = await comparePasswords(
        credentials.password,
        user.password
    );

    if (!isPasswordValid) {
        throw new Error('Invalid credentials');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}