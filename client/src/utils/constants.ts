export enum TaskStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
}

export const STATUS_STYLES = {
    [TaskStatus.PENDING]: {
        color: '#ed6c02',
        bgcolor: '#fff7ed',
        borderColor: '#ed6c02'
    },
    [TaskStatus.IN_PROGRESS]: {
        color: '#0288d1',
        bgcolor: '#e6f4ff',
        borderColor: '#0288d1'
    },
    [TaskStatus.COMPLETED]: {
        color: '#2e7d32',
        bgcolor: '#f0fdf4',
        borderColor: '#2e7d32'
    },
    [TaskStatus.CANCELLED]: {
        color: '#d32f2f',
        bgcolor: '#fff1f1',
        borderColor: '#d32f2f'
    }
} as const;