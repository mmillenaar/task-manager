import { TaskStatus } from "./constants";

export interface User {
    id: string;
    username: string;
    email: string;
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
    register: (email: string, username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
}

export interface TaskQueryParams {
    tags?: string[];
    status?: TaskStatus;
}

export interface TaskContextType {
    tasks: Task[];
    loading: boolean;
    error: string | null;
    createTask: (task: Omit<Task, 'id' | 'userId'>) => Promise<void>;
    updateTask: (id: string, task: Partial<Task>) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    fetchTasks: (filters?: TaskQueryParams) => Promise<void>;
    filterTasks: (filters: TaskQueryParams) => Promise<void>;
    selectedTags: string[];
    selectedStatus: TaskStatus | null;
    setSelectedStatus: (status: TaskStatus | null) => void;
}

export interface ApiError {
    message: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        username: string;
        email: string;
    };
}

export interface TaskResponse {
    success: boolean;
    task?: Task;
    message?: string;
}

export interface TasksResponse {
    tasks: Task[];
}

export interface ApiResponse {
    success: boolean;
    message: string;
}
