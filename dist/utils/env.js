import dotenv from 'dotenv';
dotenv.config();
export default {
    HOST: process.env.HOST || 'localhost',
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET || 'buat_test_aja',
};
//# sourceMappingURL=env.js.map