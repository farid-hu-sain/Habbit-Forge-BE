// app.ts - WITH YOUR UPLOAD MIDDLEWARE
import express, { type Application, type NextFunction, type Request, type Response } from "express";
import { upload } from './middleware/upload.middleware'; 
import morgan from "morgan";
import helmet from "helmet";
import cors from 'cors'
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
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('query parser', 'extended')
app.use(express.static("public"))
app.use('/uploads', express.static('public/uploads'))

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

app.use ((req: Request, _res: Response, next: NextFunction) => {
    console.log(`${req.method}: ${req.path}`);
    req.startTime = Date.now()
    next()
})

app.get('/', (_req: Request, res: Response) => {
    res.json({ 
        status: 'OK', 
        message: 'Habit Tracker API',
        timestamp: new Date().toISOString()
    })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/checkIn', checkInRoutes)
app.use('/api/habit', habitRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/stat', statRoutes)

app.use('*', (req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    })
})

import { errorHandler } from './middleware/error.handler'
app.use(errorHandler)

export default app