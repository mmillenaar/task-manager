import { NextFunction, Request, Response } from "express";
import * as taskService from "../services/tasks.service";

export const getTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const task = await taskService.getTask(req.params.id)
        res.json(task)
    } catch (error) {
        next(error)
    }
}

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id
        const task = await taskService.createTask({
            ...req.body,
            userId
        });
        res.status(201).json(task)
    } catch (error) {
        next(error)
    }
}

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const task = await taskService.updateTask(req.params.id, req.body)
        res.json(task)
    } catch (error) {
        next(error)
    }
}

export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await taskService.deleteTask(req.params.id)
        res.status(204).send()
    } catch (error) {
        next(error)
    }
}