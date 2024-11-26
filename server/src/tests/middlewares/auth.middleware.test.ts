import { Request, Response, NextFunction } from 'express'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { verifyToken } from '../../utils/jwt'

jest.mock('../../utils/jwt')

describe('Auth Middleware', () => {
    let mockRequest: Partial<Request>
    let mockResponse: Partial<Response>
    let nextFunction: NextFunction = jest.fn()

    beforeEach(() => {
        mockRequest = {
            headers: {},
        }
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        }
    })

    test('should authorize valid token', () => {
        mockRequest.headers = { authorization: 'Bearer validtoken' }
        ;(verifyToken as jest.Mock).mockReturnValue({ id: 'user123' })

        authMiddleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        )

        expect(nextFunction).toHaveBeenCalled()
    })

    test('should reject missing token', () => {
        authMiddleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        )

        expect(mockResponse.status).toHaveBeenCalledWith(401)
    })
})