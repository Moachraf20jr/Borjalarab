import express from 'express'
import {
  getProjects,
  getProjectBySlug,
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  toggleProjectPublish
} from '../controllers/projectController.js'
import { authenticateUser, requireAdmin, requireEditor } from '../middleware/authMiddleware.js'
import { upload, handleUploadError } from '../middleware/uploadMiddleware.js'
import { projectValidation } from '../middleware/validationMiddleware.js'

const router = express.Router()

router.get('/', getProjects)
router.get('/:slug', getProjectBySlug)

router.use(authenticateUser, requireEditor)

router.post('/', upload.single('projectImage'), handleUploadError, projectValidation, createProject)
router.get('/admin/all', getAllProjects)
router.get('/admin/:id', getProjectById)
router.patch('/:id', upload.single('projectImage'), handleUploadError, updateProject)
router.delete('/:id', deleteProject)
router.patch('/:id/publish', toggleProjectPublish)

export default router