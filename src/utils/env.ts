import dotenv from 'dotenv'

dotenv.config()

export default {
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET || 'fallback-secret-for-dev-only',
    PORT: process.env.PORT || 5000,
    HOST: process.env.NODE_ENV === 'production' 
        ? '0.0.0.0' 
        : process.env.HOST || 'localhost'
} as const