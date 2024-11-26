import { NextFunction, Request, Response } from "express";
import * as userService from "../services/users.service";
import { generateToken } from "../utils/jwt";

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await userService.register(req.body);
        const token = generateToken(user.id)
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user,
            token
        });
        return
    } catch (error) {
        next(error);
    }
}

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await userService.login(req.body);
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
            return
        }
        const token = generateToken(user.id)
        res.status(200).json({
            success: true,
            message: 'Login successful',
            user,
            token
        });
        return
    } catch (error) {
        next(error);
    }
}

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    // TODO: implement
}