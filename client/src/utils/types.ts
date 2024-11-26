import { TaskStatus } from "./constants";

export interface User {
    id: string;
    username: string;
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    dueDate?: Date | null;
    userId: string;
    tags?: Tag[];
}

export interface Tag {
    id?: string;
    name: string;
}

export interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
}

export interface TaskContextType {
    tasks: Task[];
    loading: boolean;
    error: string | null;
    createTask: (task: Omit<Task, 'id' | 'userId'>) => Promise<void>;
    updateTask: (id: string, task: Partial<Task>) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    fetchTasks: () => Promise<void>;
}

export interface ApiError {
    message: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        username: string;
    };
}
