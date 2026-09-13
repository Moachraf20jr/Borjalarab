import express from 'express'
import { login, getMe, logout } from '../controllers/authController.js'
import { authenticateUser } from '../middleware/authMiddleware.js'
import { loginValidation } from '../middleware/validationMiddleware.js'

const router = express.Router()

router.post('/login', loginValidation, login)
router.get('/me', authenticateUser, getMe)
router.post('/logout', authenticateUser, logout)

export default router