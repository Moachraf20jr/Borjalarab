import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import mongoose from 'mongoose'

import { errorHandler, notFound } from './middleware/errorMiddleware.js'

import authRoutes from './routes/authRoutes.js'
import consultationRoutes from './routes/consultationRoutes.js'
import projectRoutes from './routes/projectRoutes.js'
import articleRoutes from './routes/articleRoutes.js'
import userRoutes from './routes/userRoutes.js'
import teamRoutes from './routes/teamRoutes.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}))

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      /^https?:\/\/[\w-]+\.vercel\.app$/.test(origin)
    ) {
      return callback(null, true)
    }
    return callback(null, false)
  },
  credentials: true
}))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: parseInt(process.env.API_RATE_MAX) || 100,
  message: {
    success: false,
    message: 'كثير من الطلبات، يرجى المحاولة لاحقاً'
  },
  standardHeaders: true,
  legacyHeaders: false
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: parseInt(process.env.AUTH_RATE_MAX) || 10,
  message: {
    success: false,
    message: 'كثير من محاولات تسجيل الدخول، يرجى المحاولة بعد 15 دقيقة'
  },
  standardHeaders: true,
  legacyHeaders: false
})

const consultationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: parseInt(process.env.CONSULT_RATE_MAX) || 5,
  skip: (req) => req.method !== 'POST',
  message: {
    success: false,
    message: 'لقد وصلت للحد الأقصى من طلبات الاستشارة، يرجى المحاولة بعد ساعة'
  },
  standardHeaders: true,
  legacyHeaders: false
})

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

app.use(limiter)

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState
  const dbStatus = dbState === 1 ? 'connected' : dbState === 2 ? 'connecting' : dbState === 3 ? 'disconnecting' : 'disconnected'
  res.json({
    success: true,
    message: 'API is running',
    database: dbStatus
  })
})

app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/consultations', consultationLimiter, consultationRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/articles', articleRoutes)
app.use('/api/users', userRoutes)
app.use('/api/team', teamRoutes)

app.use(notFound)
app.use(errorHandler)

export default app