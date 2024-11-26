import { Task } from "@prisma/client";
import { TagData, TaskData, TaskQueryParams } from "../utils/types";
import prisma from "../config/db.config";
import { TaskStatus } from "../utils/constants";

export const getAllTasks = async (userId: string, filters?: TaskQueryParams): Promise<Task[]> => {
    return prisma.task.findMany({
        where: {
            userId,
            ...(filters?.status && {
                status: filters.status
            }),
            ...(filters?.tags && filters.tags.length > 0 && {
                AND: filters.tags.map(tag => ({
                    tags: {
                        some: {
                            name: tag
                        }
                    }
                }))
            })
        },
        include: {
            tags: true
        }
    })
}

export const getTask = async (taskId: string): Promise<Task | null> => {
    const task = await prisma.task.findUnique({
        where: { id: taskId },
        include: {
            tags: true
        }
    })
    return task;
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

export const createTask = async (data: TaskData): Promise<Task | null> => {
    if (!data.title) {
        return null;
    }

    try {
        const tagConnections = data.tags ? await getOrCreateTags(data.tags) : []
        return prisma.task.create({
            data: {
                title: data.title,
                description: data.description,
                status: data.status || TaskStatus.PENDING,
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
    } catch (error) {
        return null;
    }
}

export const updateTask = async (taskId: string, data: TaskData): Promise<Task | null> => {
    try {
        const existingTask = await prisma.task.findUnique({
            where: { id: taskId },
            include: { tags: true }
        });

        if (!existingTask) {
            return null;
        }

        // Filter out any invalid tags
        const validTags = data.tags?.filter(tag =>
            tag && typeof tag.name === 'string' && tag.name.trim() !== ''
        ) || [];

        // Get or create valid tags
        const tagConnections = validTags.length > 0
            ? await getOrCreateTags(validTags)
            : [];

        // Update task with new tag connections
        const updatedTask = await prisma.task.update({
            where: { id: taskId },
            data: {
                ...(data.title && { title: data.title }),
                ...(data.description !== undefined && { description: data.description }),
                ...(data.status && { status: data.status }),
                ...(data.dueDate && { dueDate: data.dueDate }),
                tags: {
                    set: tagConnections // This will remove any old tags not in the new set
                }
            },
            include: {
                tags: true
            }
        });

        // Clean up orphaned tags (tags not used by any tasks)
        await prisma.tag.deleteMany({
            where: {
                tasks: {
                    none: {}  // Tags that aren't connected to any tasks
                }
            }
        });

        return updatedTask;
    } catch (error) {
        return null;
    }
}

export const deleteTask = async (taskId: string): Promise<boolean> => {
    try {
        const existingTask = await prisma.task.findUnique({
            where: { id: taskId }
        })

        if (!existingTask) {
            return false;
        }

        await prisma.task.delete({
            where: { id: taskId }
        })
        return true;
    } catch (error) {
        return false;
    }
}
