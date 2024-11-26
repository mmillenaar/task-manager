import React, { createContext, useContext, useState } from 'react';
import { api } from '../utils/api';
import { useAuth } from './AuthContext';
import { Task, TaskContextType, TaskQueryParams } from '../utils/types';
import { TaskStatus } from '../utils/constants';

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<TaskStatus | null>(null);
    const { user } = useAuth();

    const fetchTasks = async (filters?: TaskQueryParams) => {
        if (!user) return;
        setLoading(true);
        try {
            const tasksData = await api.tasks.getAll(user.id, filters);
            setTasks(tasksData);
            setError(null);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to fetch tasks');
        } finally {
            setLoading(false);
        }
    };

    const filterTasks = async (filters: TaskQueryParams) => {
        setSelectedTags(filters.tags || []);
        setSelectedStatus(filters.status || null);
        await fetchTasks(filters);
    };

    const createTask = async (task: Omit<Task, 'id' | 'userId'>) => {
        if (!user) return;
        try {
            const response = await api.tasks.create(user.id, task);
            if (response.success && response.task) {
                setTasks([...tasks, response.task]);
                setError(null);
            } else {
                throw new Error(response.message || 'Failed to create task');
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to create task');
            throw error;
        }
    };

    const updateTask = async (id: string, task: Partial<Task>) => {
        if (!user) return;
        try {
            const response = await api.tasks.update(user.id, id, task);
            if (response.success && response.task) {
                setTasks(tasks.map(t => t.id === id ? response.task! : t));
                setError(null);
            } else {
                throw new Error(response.message || 'Failed to update task');
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to update task');
            throw error;
        }
    };

    const deleteTask = async (id: string) => {
        if (!user) return;
        try {
            await api.tasks.delete(user.id, id);
            setTasks(tasks.filter(t => t.id !== id));
            setError(null);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to delete task');
            throw error;
        }
    };

    return (
        <TaskContext.Provider value={{
            tasks,
            loading,
            error,
            createTask,
            updateTask,
            deleteTask,
            fetchTasks,
            filterTasks,
            selectedTags,
            selectedStatus,
            setSelectedStatus
        }}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTask = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTask must be used within a TaskProvider');
    }
    return context;
};