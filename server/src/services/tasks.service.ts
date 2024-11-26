import { Task } from "@prisma/client";
import { TagData, TaskData } from "../utils/types";
import prisma from "../config/db.config";

export const getAllTasks = async (userId: string): Promise<Task[]> => {
    return prisma.task.findMany({
        where: { userId },
        include: {
            tags: true
        }
    })
}

export const getTask = async (taskId: string): Promise<Task> => {
    const task = await prisma.task.findUnique({
        where: { id: taskId },
        include: {
            tags: true
        }
    })

    if (!task) {
        throw new Error('Task not found')
    }

    return task
}

// Helper function for handling tags
const getOrCreateTags = async (tags: TagData[]): Promise<{ id: string }[]> => {
    const tagConnections = await Promise.all(
        tags.map(async (tag) => {
            const existingTag = await prisma.tag.findUnique({
                where: { name: tag.name }
            });

            if (existingTag) {
                return { id: existingTag.id }
            }

            const newTag = await prisma.tag.create({
                data: { name: tag.name }
            });

            return { id: newTag.id }
        })
    );

    return tagConnections
}

export const createTask = async (data: TaskData): Promise<Task> => {
    if (!data.title) {
        throw new Error('Title is required')
    }

    const tagConnections = data.tags ? await getOrCreateTags(data.tags) : []

    return prisma.task.create({
        data: {
            title: data.title,
            description: data.description,
            status: data.status || 'pending',
            dueDate: data.dueDate,
            userId: data.userId,
            tags: {
                connect: tagConnections
            }
        },
        include: {
            tags: true
        }
    })
}

export const updateTask = async (
    taskId: string,
    data: TaskData
): Promise<Task> => {
    const existingTask = await prisma.task.findUnique({
        where: { id: taskId }
    })

    if (!existingTask) {
        throw new Error('Task not found')
    }

    const tagConnections = data.tags ? await getOrCreateTags(data.tags) : []

    return prisma.task.update({
        where: { id: taskId },
        data: {
            ...(data.title && { title: data.title }),
            ...(data.description !== undefined && { description: data.description }),
            ...(data.status && { status: data.status }),
            ...(data.dueDate && { dueDate: data.dueDate }),
            tags: {
                set: tagConnections
            }
        },
        include: {
            tags: true
        }
    })
}

export const deleteTask = async (taskId: string): Promise<void> => {
    const existingTask = await prisma.task.findUnique({
        where: { id: taskId }
    })

    if (!existingTask) {
        throw new Error('Task not found')
    }

    await prisma.task.delete({
        where: { id: taskId }
    })
}
