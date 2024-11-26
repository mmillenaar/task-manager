import { Task, AuthResponse, ApiError, TaskResponse } from "./types";

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

        register: (email: string, username: string, password: string): Promise<AuthResponse> =>
            api.request('/users/register', {
                method: 'POST',
                body: JSON.stringify({ email, username, password }),
            }),

        logout: (): Promise<void> =>
            api.request('/users/logout', {
                method: 'GET',
            }),
    },

    // Tasks endpoints
    tasks: {
        getAll: (userId: string, filters?: { tags?: string[], status?: string }): Promise<Task[]> => {
            const queryParams = new URLSearchParams();

            // Add tags to query params
            filters?.tags?.forEach(tag => {
                queryParams.append('tags', tag);
            });

            // Add status to query params
            if (filters?.status) {
                queryParams.append('status', filters.status);
            }

            const queryString = queryParams.toString();
            return api.request(`/users/${userId}/tasks${queryString ? `?${queryString}` : ''}`);
        },

        create: (userId: string, task: Omit<Task, 'id' | 'userId'>): Promise<TaskResponse> =>
            api.request(`/users/${userId}/tasks`, {
                method: 'POST',
                body: JSON.stringify(task),
            }),

        update: (userId: string, taskId: string, task: Partial<Task>): Promise<TaskResponse> =>
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