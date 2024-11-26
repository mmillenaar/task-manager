import React from 'react';
import { Box, Chip, Typography } from '@mui/material';
import { useTask } from '../../context/TaskContext';

export const TagFilter: React.FC = () => {
    const { tasks, selectedTags, selectedStatus, filterTasks } = useTask();

    const uniqueTags = Array.from(
        new Set(
            tasks
                .flatMap(task => task.tags || [])
                .filter(tag => tag && tag.name && typeof tag.name === 'string' && tag.name.trim() !== '')
                .map(tag => tag.name)
        )
    ).sort();

    const handleTagClick = (tagName: string) => {
        const newTags = selectedTags.includes(tagName)
            ? selectedTags.filter(tag => tag !== tagName)
            : [...selectedTags, tagName];

        filterTasks({
            tags: newTags,
            status: selectedStatus ?? undefined
        });
    };

    const clearFilters = () => {
        filterTasks({
            tags: [],
            status: selectedStatus ?? undefined
        });
    };

    if (uniqueTags.length === 0) return null;

    return (
        <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle1" sx={{ mr: 1 }}>
                    Filter by tags:
                </Typography>
                {selectedTags && (
                    <Chip
                        label="Clear filters"
                        size="small"
                        onClick={clearFilters}
                        sx={{ ml: 1 }}
                    />
                )}
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {uniqueTags.map((tag) => (
                    <Chip
                        key={tag}
                        label={tag}
                        onClick={() => handleTagClick(tag)}
                        color={selectedTags.includes(tag) ? 'primary' : 'default'}
                        sx={{
                            '&:hover': {
                                backgroundColor: selectedTags.includes(tag)
                                    ? 'primary.dark'
                                    : 'action.hover'
                            }
                        }}
                    />
                ))}
            </Box>
        </Box>
    );
};