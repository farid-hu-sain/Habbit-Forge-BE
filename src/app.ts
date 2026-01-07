import express, { type Application, type NextFunction, type Request, type Response } from "express";
import { upload } from './middleware/upload.middleware';
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

const app: Application = express()

app.use(helmet())
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())
app.set("query parser", "extended")
app.use(express.static("public"))

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use((req: Request, res: Response, next: NextFunction) => {
  const contentType = req.headers['content-type'] || '';
  
  if (contentType.includes('multipart/form-data')) {
    upload.none()(req, res, (err) => {
      if (err) {
        console.error('Multer error:', err);
        return res.status(400).json({
          success: false,
          message: 'Error parsing form data'
        });
      }
      next();
    });
  } else {
    next();
  }
})

app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`${req.method}: ${req.path}`);
  req.startTime = Date.now()
  next()
})

app.get('/', (_req: Request, res: Response) => {
  successResponse(res, "selamat datang di API Habit Forge", {
    status: 'server Hidup',
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/checkIn', checkInRoutes)
app.use('/api/habit', habitRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/stat', statRoutes)

app.get(/.*/, (req: Request, _res: Response) => {
  throw new Error(`Route ${req.originalUrl} tidak ada di API e-commerce`)
})

app.use(errorHandler)

export default app