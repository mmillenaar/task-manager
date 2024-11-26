import { Tag, User } from "@prisma/client"
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
    tags?: TagData[]
}

export interface TagData {
    name: string
    id?: string
}

export interface AuthResponse {
    token: string
    user: User
}