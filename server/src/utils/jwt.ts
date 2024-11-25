import dotenv from 'dotenv'
import jwt, { JwtPayload } from 'jsonwebtoken'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret'

export interface TokenPayload extends JwtPayload {
    id: string;
}

export const generateToken = (userId: string): string => {
    // Do not set token expiration => handle logout from the client
    // TODO: implement refresh token
    return jwt.sign({ id: userId }, JWT_SECRET, {})
}

export const verifyToken = (token: string): TokenPayload => {
    try {
        return jwt.verify(token, JWT_SECRET) as TokenPayload
    } catch (error) {
        throw new Error('Invalid token')
    }
}