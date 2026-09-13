import express from 'express'
import {
  createConsultation,
  getConsultations,
  getConsultationById,
  updateConsultationStatus,
  updateConsultationNotes,
  deleteConsultation
} from '../controllers/consultationController.js'
import { authenticateUser, requireAdmin } from '../middleware/authMiddleware.js'
import { consultationValidation } from '../middleware/validationMiddleware.js'

const router = express.Router()

router.post('/', consultationValidation, createConsultation)

router.use(authenticateUser, requireAdmin)

router.get('/', getConsultations)
router.get('/:id', getConsultationById)
router.patch('/:id/status', updateConsultationStatus)
router.patch('/:id/notes', updateConsultationNotes)
router.delete('/:id', deleteConsultation)

export default router