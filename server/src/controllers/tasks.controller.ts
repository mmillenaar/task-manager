import { NextFunction, Request, Response } from "express";
import * as taskService from "../services/tasks.service";
import { TaskStatus } from "../utils/constants";

interface AuthenticatedRequest extends Request {
    user?: { id: string };
}

export const getAllTasks = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        // Parse tags from query parameters
        const tags = req.query.tags ?
            Array.isArray(req.query.tags) ?
                req.query.tags as string[] :
                [req.query.tags as string]
            : undefined;

        // Add status from query parameters
        const status = req.query.status as TaskStatus | undefined;

        const tasks = await taskService.getAllTasks(req.user.id, { tags, status })
        res.json(tasks)
    } catch (error) {
        next(error)
    }
}

export const getTask = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
            return;
        }

        const task = await taskService.getTask(req.params.taskId)
        if (!task) {
            res.status(404).json({
                success: false,
                message: 'Task not found'
            });
            return;
        }

        res.json({
            success: true,
            task
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'An unexpected error occurred'
        });
    }
}

export const createTask = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
            return;
        }

        if (!req.body.title) {
            res.status(400).json({
                success: false,
                message: 'Title is required'
            });
            return;
        }

        const task = await taskService.createTask({
            ...req.body,
            userId: req.user.id
        });

        if (!task) {
            res.status(500).json({
                success: false,
                message: 'Failed to create task'
            });
            return;
        }

        res.status(201).json({
            success: true,
            task
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'An unexpected error occurred'
        });
    }
}

export const updateTask = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
            return;
        }

        const task = await taskService.updateTask(req.params.taskId, req.body)
        if (!task) {
            res.status(404).json({
                success: false,
                message: 'Task not found'
            });
            return;
        }

        res.json({
            success: true,
            task
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'An unexpected error occurred'
        });
    }
}

export const deleteTask = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
            return;
        }

        const success = await taskService.deleteTask(req.params.taskId)
        if (!success) {
            res.status(404).json({
                success: false,
                message: 'Task not found'
            });
            return;
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'An unexpected error occurred'
        });
    }
}