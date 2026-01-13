import express, { type Application, type NextFunction, type Request, type Response } from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from 'cors'
import { errorHandler } from "./middleware/error.handler";
import { successResponse } from "./utils/response";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./utils/swagger";
import authRoutes from './routes/auth.route'
import categoryRoutes from './routes/category.route'
import checkInRoutes from './routes/checkIn.route'
import habitRoutes from './routes/habit.route'
import profileRoutes from './routes/profile.route'
import dashboardRoutes from './routes/dashboard.route'
import statRoutes from './routes/stat.route'
import userRoutes from './routes/user.route'
import testRoutes from './routes/test.route'

const app: Application = express()

const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com'] 
    : '*', 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
};

app.use(helmet())
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use(cors(corsOptions));

app.get('/', (_req: Request, res: Response) => {
  successResponse(res, "Selamat datang di API Habit Forge", {
    name: "Habit Tracker API",
    version: "1.0.0",
    status: 'Server berjalan',
    documentation: '/api-docs',
    test_endpoint: '/api/test/connection',
    endpoints: {
      test: '/api/test',
      auth: '/api/auth',
      user: '/api/user',
      habits: '/api/habit',
      checkins: '/api/checkIn',
      categories: '/api/category',
      profile: '/api/profile',
      dashboard: '/api/dashboard',
      statistics: '/api/stat'
    }
  })
})

app.use('/api/test', testRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/checkIn', checkInRoutes)
app.use('/api/habit', habitRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/stat', statRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/category', categoryRoutes)

app.use((req: Request, _res: Response, next: NextFunction) => {
  const error = new Error(`Route ${req.originalUrl} tidak ditemukan di API Habit Tracker`);
  (error as any).status = 404;
  next(error);
})

app.use(errorHandler)

export default app