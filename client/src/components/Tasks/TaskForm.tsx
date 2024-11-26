import React, { useState } from 'react';
import { TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, Paper, Typography } from '@mui/material';
import { useTask } from '../../context/TaskContext';
import { TaskStatus } from '../../utils/constants';
import { Task } from '../../utils/types';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

interface TaskFormProps {
    editTask?: Task;
    onCancel?: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ editTask, onCancel }) => {
    const [title, setTitle] = useState(editTask?.title || '');
    const [description, setDescription] = useState(editTask?.description || '');
    const [status, setStatus] = useState<TaskStatus>(editTask?.status || TaskStatus.PENDING);
    const [tags, setTags] = useState<string[]>(editTask?.tags?.map(tag => tag.name) || []);
    const [dueDate, setDueDate] = useState<Date | null>(editTask?.dueDate ? new Date(editTask.dueDate) : null);
    const { createTask, updateTask } = useTask();


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const taskData = {
                title,
                description,
                status,
                tags: tags.map(tagName => ({ name: tagName })),
                dueDate,
            };

            if (editTask) {
                await updateTask(editTask.id, taskData);
            } else {
                await createTask(taskData);
            }

            resetForm();
            if (onCancel) onCancel(); // Call onCancel after successful submission
        } catch (error) {
            console.error(`Failed to ${editTask ? 'update' : 'create'} task:`, error);
        }
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setStatus(TaskStatus.PENDING);
        setTags([]);
        setDueDate(null);
    };

    return (
        <Paper
            elevation={2}
            sx={{
                p: 3,
                mb: 3,
                background: 'linear-gradient(to bottom right, #ffffff, #f8f9fa)',
                borderRadius: 3,
            }}
        >
            <Typography
                variant="h6"
                sx={{
                    mb: 2,
                    fontWeight: 600,
                    color: 'primary.main',
                }}
            >
                {editTask ? 'Edit Task' : 'Create New Task'}
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    margin="normal"
                    required
                />
                <TextField
                    fullWidth
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    margin="normal"
                    multiline
                    rows={3}
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as TaskStatus)}
                        label="Status"
                    >
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="In Progress">In Progress</MenuItem>
                        <MenuItem value="Completed">Completed</MenuItem>
                        <MenuItem value="Cancelled">Cancelled</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    fullWidth
                    label="Tags"
                    value={tags.join(', ')}
                    onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()))}
                    margin="normal"
                    helperText="Enter tags separated by commas"
                />
                <DatePicker
                    label="Due Date"
                    value={dueDate ? dayjs(dueDate) : null}
                    onChange={(newValue) => setDueDate(newValue?.toDate() || null)}
                    slotProps={{
                        textField: {
                            fullWidth: true,
                            margin: "normal"
                        }
                    }}
                />
                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{
                            height: 48,
                            background: 'linear-gradient(45deg, #2196f3, #1976d2)',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #1976d2, #1565c0)',
                            }
                        }}
                    >
                        {editTask ? 'Update Task' : 'Create Task'}
                    </Button>
                    {editTask && (
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={onCancel}
                        >
                            Cancel
                        </Button>
                    )}
                </Box>
            </Box>
        </Paper>
    );
};