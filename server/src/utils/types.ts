import { TaskStatus } from "./constants"

export interface UserValidationData {
    email: string
    password: string
}

export interface TaskData {
    title: string
    userId: string
    description?: string
    dueDate?: Date
    status?: TaskStatus
    tags?: string[]
}