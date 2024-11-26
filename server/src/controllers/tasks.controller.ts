import { NextFunction, Request, Response } from "express";
import * as taskService from "../services/tasks.service";

interface AuthenticatedRequest extends Request {
    user?: { id: string };
}

export const getAllTasks = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const tasks = await taskService.getAllTasks(req.user.id)
        res.json(tasks)
    } catch (error) {
        next(error)
    }
}

export const getTask = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const task = await taskService.getTask(req.params.taskId)
        res.json(task)
    } catch (error) {
        next(error)
    }
}

export const createTask = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const userId = req.user.id
        const task = await taskService.createTask({
            ...req.body,
            userId
        });
        res.status(201).json(task)
    } catch (error) {
        next(error)
    }
}

export const updateTask = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const task = await taskService.updateTask(req.params.taskId, req.body)
        res.json(task)
    } catch (error) {
        next(error)
    }
}

export const deleteTask = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        await taskService.deleteTask(req.params.taskId)
        res.status(204).send()
    } catch (error) {
        next(error)
    }
}