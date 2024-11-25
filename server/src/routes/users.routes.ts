import { Router } from "express";
import { createTasksRouter } from "./tasks.routes";
import * as usersController from "../controllers/users.controller";
import { authMiddleware } from "../middlewares/auth.middleware";


export const createUsersRoutes = () => {
    const usersRouter = Router()

    usersRouter.route('/login').post(usersController.login)
    usersRouter.route('/register').post(usersController.register)
    usersRouter.route('/logout').get(authMiddleware, usersController.logout)

    usersRouter.use('/:userId/tasks', authMiddleware, createTasksRouter())

    return usersRouter
}