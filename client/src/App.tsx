import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { CssBaseline, Container, Box } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import { theme } from './utils/theme';
import TasksLayout from './components/Layout/TasksLayout';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
    return (
        <div className="app">
            <BrowserRouter>
                <AuthProvider>
                    <TaskProvider>
                        <ThemeProvider theme={theme}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <CssBaseline />
                                <Container component="main" maxWidth="md">
                                    <Box sx={{ mt: 4, mb: 8 }}>
                                        <Routes>
                                            <Route path="/login" element={<LoginForm />} />
                                            <Route path="/register" element={<RegisterForm />} />
                                            <Route
                                                path="/"
                                                element={
                                                    <PrivateRoute>
                                                        <TasksLayout />
                                                    </PrivateRoute>
                                                }
                                            />
                                        </Routes>
                                    </Box>
                                </Container>
                            </LocalizationProvider>
                        </ThemeProvider>
                    </TaskProvider>
                </AuthProvider>
            </BrowserRouter>
        </div>
    );
};

export default App;