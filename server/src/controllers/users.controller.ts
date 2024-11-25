import { NextFunction, Request, Response } from "express";
import * as userService from "../services/users.service";

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userService.register(req.body);
        res.status(201).json(user)
    } catch (error) {
        next(error)
    }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userService.login(req.body);
        res.json(user)
    } catch (error) {
        next(error)
    }
}

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    // TODO: implement
}