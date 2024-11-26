import { NextFunction, Request, Response } from "express";
import * as userService from "../services/users.service";
import { generateToken } from "../utils/jwt";

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, username, password } = req.body;

    // Validate required fields first
    if (!email || !username || !password) {
        res.status(400).json({
            success: false,
            message: 'Email, username and password are required'
        });
        return;
    }

    try {
        const user = await userService.register(req.body);
        if (!user) {
            res.status(409).json({
                success: false,
                message: 'Email already exists'
            });
            return;
        }

        const token = generateToken(user.id)
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user,
            token
        });
        return;
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'An unexpected error occurred'
        });
        return;
    }
}

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await userService.login(req.body);
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
            return;
        }
        const token = generateToken(user.id)
        res.status(200).json({
            success: true,
            message: 'Login successful',
            user,
            token
        });
        return;
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'An unexpected error occurred'
        });
        return;
    }
}

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        success: true,
        message: 'Logout successful'
    });
    return
}
