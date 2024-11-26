import React from 'react';
import { Box, Chip, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useTask } from '../../context/TaskContext';
import { TaskStatus, STATUS_STYLES } from '../../utils/constants';


export const StatusFilter: React.FC = () => {
    const { selectedStatus, selectedTags, filterTasks } = useTask();

    const handleStatusChange = (
        _event: React.MouseEvent<HTMLElement>,
        newStatus: TaskStatus | null
    ) => {
        filterTasks({
            tags: selectedTags,
            status: newStatus || undefined
        });
    };

    const clearFilters = () => {
        filterTasks({
            tags: selectedTags,
            status: undefined
        });
    };

    return (
        <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Filter by status:
                </Typography>
                {selectedStatus && (
                    <Chip
                        label="Clear filters"
                        size="small"
                        onClick={clearFilters}
                        sx={{ ml: 1 }}
                    />
                )}
            </Box>
            <ToggleButtonGroup
                value={selectedStatus}
                exclusive
                onChange={handleStatusChange}
                size="small"
            >
                {Object.values(TaskStatus).map((status) => (
                    <ToggleButton
                        key={status}
                        value={status}
                        sx={{
                            '&.Mui-selected': STATUS_STYLES[status],
                            '&.Mui-selected:hover': STATUS_STYLES[status]
                        }}
                    >
                        {status}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>
        </Box>
    );
};