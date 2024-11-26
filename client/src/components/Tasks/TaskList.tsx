import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, IconButton, Chip, Box, Typography, Paper } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useTask } from '../../context/TaskContext';
import { TaskForm } from './TaskForm';
import { Task } from '../../utils/types';

export const TaskList: React.FC = () => {
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const { tasks, loading, error, fetchTasks, deleteTask } = useTask();

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleCancelEdit = () => {
        setEditingTask(null);
    };

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box>
            <Typography
                variant="h4"
                sx={{
                    mb: 3,
                    fontWeight: 700,
                    background: 'linear-gradient(45deg, #2196f3, #1976d2)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                }}
            >
                My Tasks
            </Typography>

            {editingTask ? (
                <TaskForm
                    editTask={editingTask}
                    onCancel={handleCancelEdit}
                />
            ) : (
                <Paper
                    elevation={2}
                    sx={{
                        background: 'linear-gradient(to bottom right, #ffffff, #f8f9fa)',
                        borderRadius: 3,
                        overflow: 'hidden',
                    }}
                >
                    {tasks.length === 0 ? (
                        <Box sx={{ p: 3, textAlign: 'center' }}>
                            <Typography color="text.secondary">
                                No tasks yet. Create one above!
                            </Typography>
                        </Box>
                    ) : (
                        <List sx={{ p: 0 }}>
                            {tasks.map((task) => (
                                <ListItem
                                    key={task.id}
                                    sx={{
                                        borderBottom: '1px solid #e0e0e0',
                                        '&:hover': {
                                            backgroundColor: 'rgba(33, 150, 243, 0.04)',
                                        },
                                        transition: 'background-color 0.2s',
                                    }}
                                    secondaryAction={
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <IconButton
                                                sx={{
                                                    color: 'primary.main',
                                                    '&:hover': { backgroundColor: 'rgba(33, 150, 243, 0.1)' },
                                                }}
                                                onClick={() => setEditingTask(task)}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                sx={{
                                                    color: 'error.main',
                                                    '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.1)' },
                                                }}
                                                onClick={() => deleteTask(task.id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    }
                                >
                                    <ListItemText
                                        primary={task.title}
                                        secondary={
                                            <React.Fragment>
                                                <Typography variant="body2">{task.description}</Typography>
                                                {task.dueDate && (
                                                    <Typography variant="body2" color="text.secondary">
                                                        Due: {new Date(task.dueDate).toLocaleDateString()}
                                                    </Typography>
                                                )}
                                                <Box sx={{ mt: 1 }}>
                                                    <Chip
                                                        label={task.status}
                                                        size="small"
                                                        color={
                                                            task.status === 'Completed'
                                                                ? 'success'
                                                                : task.status === 'In Progress'
                                                                    ? 'primary'
                                                                    : 'default'
                                                        }
                                                    />
                                                    {task.tags?.map((tag, index) => (
                                                        <Chip
                                                            key={tag.id || index}
                                                            label={tag.name}
                                                            size="small"
                                                            sx={{ ml: 1 }}
                                                        />
                                                    ))}
                                                </Box>
                                            </React.Fragment>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Paper>
            )}
        </Box>
    );
};