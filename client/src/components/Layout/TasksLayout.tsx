import { useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import { Fab } from "@mui/material";
import { Box } from "@mui/material";
import { TaskList } from "../Tasks/TaskList";
import { TaskForm } from "../Tasks/TaskForm";
import { useAuth } from '../../context/AuthContext';
import { IconButton, Tooltip } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';

const TasksLayout: React.FC = () => {
    const [isCreating, setIsCreating] = useState(false);
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <Box>
            <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                <Tooltip title="Logout">
                    <IconButton
                        onClick={handleLogout}
                        sx={{ color: '#1976d2' }}
                    >
                        <LogoutIcon />
                    </IconButton>
                </Tooltip>
            </Box>
            <TaskList />
            {isCreating ? (
                <Box sx={{ mt: 3 }}>
                    <TaskForm onCancel={() => setIsCreating(false)} />
                </Box>
            ) : (
                <Fab
                    color="primary"
                    aria-label="add"
                    sx={{
                        position: 'fixed',
                        bottom: 32,
                        right: 32,
                        background: 'linear-gradient(45deg, #2196f3, #1976d2)',
                        '&:hover': {
                            background: 'linear-gradient(45deg, #1976d2, #1565c0)',
                        }
                    }}
                    onClick={() => setIsCreating(true)}
                >
                    <AddIcon />
                </Fab>
            )}
        </Box>
    );
};

export default TasksLayout;