import express from 'express'
import {
  getPublicTeam,
  getAllTeam,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  toggleTeamMemberActive,
  toggleTeamMemberPublish
} from '../controllers/teamController.js'
import { authenticateUser, requireEditor } from '../middleware/authMiddleware.js'
import { upload, handleUploadError } from '../middleware/uploadMiddleware.js'
import { teamValidation } from '../middleware/validationMiddleware.js'

const router = express.Router()

router.get('/', getPublicTeam)

router.use(authenticateUser, requireEditor)

router.post('/', upload.single('teamImage'), handleUploadError, teamValidation, createTeamMember)
router.get('/admin/all', getAllTeam)
router.get('/admin/:id', getTeamMemberById)
router.patch('/:id', upload.single('teamImage'), handleUploadError, updateTeamMember)
router.delete('/:id', deleteTeamMember)
router.patch('/:id/active', toggleTeamMemberActive)
router.patch('/:id/publish', toggleTeamMemberPublish)

export default router