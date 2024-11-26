import { Task, AuthResponse, ApiError } from "./types";

export const api = {
    baseUrl: 'http://localhost:3030/api',

    async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const token = localStorage.getItem('token');

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        };

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const error: ApiError = await response.json();
            throw new Error(error.message || 'Something went wrong');
        }

        // Handle no content responses (204)
        if (response.status === 204) {
            return {} as T;
        }

        return response.json();
    },

    // Auth endpoints
    auth: {
        login: (email: string, password: string): Promise<AuthResponse> =>
            api.request('/users/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            }),

        register: (email: string, password: string): Promise<AuthResponse> =>
            api.request('/users/register', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            }),

        logout: (): Promise<void> =>
            api.request('/users/logout', {
                method: 'GET',
            }),
    },

    // Tasks endpoints
    tasks: {
        getAll: (userId: string): Promise<Task[]> =>
            api.request(`/users/${userId}/tasks`),

        create: (userId: string, task: Omit<Task, 'id' | 'userId'>): Promise<Task> =>
            api.request(`/users/${userId}/tasks`, {
                method: 'POST',
                body: JSON.stringify(task),
            }),

        update: (userId: string, taskId: string, task: Partial<Task>): Promise<Task> =>
            api.request(`/users/${userId}/tasks/${taskId}`, {
                method: 'PUT',
                body: JSON.stringify(task),
            }),

        delete: (userId: string, taskId: string): Promise<void> =>
            api.request(`/users/${userId}/tasks/${taskId}`, {
                method: 'DELETE',
            }),
    }
};