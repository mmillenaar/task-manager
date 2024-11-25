import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader) {
            throw new Error('No authorization header')
        }

        const token = authHeader.split(' ')[1] // Bearer <token>
        if (!token) {
            throw new Error('No token provided')
        }

        const decoded = verifyToken(token)
        req.user = { id: decoded.id }
        next()
    } catch (error) {
        res.status(401).json({
            message: error instanceof Error ? error.message : 'Authentication failed'
        })
    }
}