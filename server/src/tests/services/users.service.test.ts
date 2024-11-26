
import * as userService from '../../services/users.service'
import { hashPassword, comparePasswords } from '../../utils/password'
import { prismaMock } from '../setup'

jest.mock('../../utils/password')

describe('User Service', () => {
    const mockUser = {
        id: '1',
        email: 'test@test.com',
        username: 'testuser',
        password: 'hashedpassword',
    }

    test('should register new user successfully', async () => {
        const userData = {
            email: 'test@test.com',
            username: 'testuser',
            password: 'password123',
        }

        ;(hashPassword as jest.Mock).mockResolvedValue('hashedpassword')
        prismaMock.user.findUnique.mockResolvedValue(null)
        prismaMock.user.create.mockResolvedValue(mockUser)

        const result = await userService.register(userData)
        expect(result).toBeDefined()
        expect(result?.email).toBe(userData.email)
    })

    test('should login user with valid credentials', async () => {
        const credentials = {
            email: 'test@test.com',
            username: 'testuser',
            password: 'password123',
        }

        prismaMock.user.findUnique.mockResolvedValue(mockUser)
        ;(comparePasswords as jest.Mock).mockResolvedValue(true)

        const result = await userService.login(credentials)
        expect(result).toBeDefined()
    })
})