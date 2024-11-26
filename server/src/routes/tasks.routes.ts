import { Router } from "express";
import * as tasksController from "../controllers/tasks.controller";


export const createTasksRouter =() => {
    const tasksRouter = Router({mergeParams: true})

    tasksRouter.route('/')
        .get(tasksController.getAllTasks)
        .post(tasksController.createTask)

    tasksRouter.route('/:taskId')
        .get(tasksController.getTask)
        .put(tasksController.updateTask)
        .delete(tasksController.deleteTask)

    return tasksRouter
}