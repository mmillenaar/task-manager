import React, { createContext, useContext, useState } from 'react';
import { api } from '../utils/api';
import { AuthContextType, User } from '../utils/types';
import { useNavigate } from 'react-router';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const navigate = useNavigate();

    const login = async (email: string, password: string): Promise<void> => {
        try {
            const response = await api.auth.login(email, password);
            const { token, user } = response;
            localStorage.setItem('token', token);
            setUser(user);
            setIsAuthenticated(true);
            navigate('/');
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'Login failed');
        }
    };

    const register = async (email: string, password: string): Promise<void> => {
        try {
            const response = await api.auth.register(email, password);
            const { token, user } = response;
            localStorage.setItem('token', token);
            setUser(user);
            setIsAuthenticated(true);
            navigate('/');
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'Registration failed');
        }
    };

    const logout = async () => {
        try {
            await api.auth.logout();
            localStorage.removeItem('token');
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};