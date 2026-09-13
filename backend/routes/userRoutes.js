import express from 'express'
import { getUsers, createUser, updateUser, changePassword, deleteUser } from '../controllers/userController.js'
import { authenticateUser, requireAdmin } from '../middleware/authMiddleware.js'
import { userValidation } from '../middleware/validationMiddleware.js'

const router = express.Router()

router.use(authenticateUser, requireAdmin)

router.get('/', getUsers)
router.post('/', userValidation, createUser)
router.patch('/:id', updateUser)
router.patch('/:id/password', changePassword)
router.delete('/:id', deleteUser)

export default router