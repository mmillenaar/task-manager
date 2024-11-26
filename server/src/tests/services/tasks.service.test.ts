import * as taskService from '../../services/tasks.service'
import { TaskStatus } from '../../utils/constants'
import { prismaMock } from '../setup'

describe('Tasks Service', () => {
    const mockUserId = 'user123'
    const mockTaskId = 'task123'

    test('should create new task', async () => {
        const mockTask = {
            id: mockTaskId,
            title: 'New Task',
            userId: mockUserId,
            status: TaskStatus.PENDING,
            description: null,
            dueDate: null,
            tags: [],
        }

        prismaMock.task.create.mockResolvedValue(mockTask)

        const result = await taskService.createTask({
            title: 'New Task',
            userId: mockUserId,
        })

        expect(result).toEqual(mockTask)
    })

    test('should get user tasks with filters', async () => {
        const mockTasks = [
            {
                id: '1',
                title: 'Task 1',
                status: TaskStatus.PENDING,
                description: null,
                dueDate: null,
                userId: mockUserId
            },
        ]

        prismaMock.task.findMany.mockResolvedValue(mockTasks)

        const result = await taskService.getAllTasks(mockUserId, {
            status: TaskStatus.PENDING,
        })
        expect(result).toEqual(mockTasks)
    })

    test('should update task', async () => {
        const mockTask = {
            id: mockTaskId,
            title: 'Updated Task',
            userId: mockUserId,
            status: TaskStatus.PENDING,
            description: null,
            dueDate: null,
            tags: [],
        }

        prismaMock.task.findUnique.mockResolvedValue(mockTask)
        prismaMock.task.update.mockResolvedValue(mockTask)

        const result = await taskService.updateTask(mockTaskId, {
            title: 'Updated Task',
            userId: mockUserId,
        })

        expect(result).toEqual(mockTask)
    })
})