declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: string
            DATABASE_URL: string
            JWT_SECRET: string
        }
    }
    namespace Express {
        interface Request {
            user?: {
                id: string
            }
        }
    }
}

export {}