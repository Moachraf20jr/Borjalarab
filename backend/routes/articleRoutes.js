import express from 'express'
import {
  getArticles,
  getArticleBySlug,
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  toggleArticlePublish
} from '../controllers/articleController.js'
import { authenticateUser, requireAdmin, requireEditor } from '../middleware/authMiddleware.js'
import { upload, handleUploadError } from '../middleware/uploadMiddleware.js'
import { articleValidation } from '../middleware/validationMiddleware.js'

const router = express.Router()

router.get('/', getArticles)
router.get('/:slug', getArticleBySlug)

router.use(authenticateUser, requireEditor)

router.post('/', upload.single('articleImage'), handleUploadError, articleValidation, createArticle)
router.get('/admin/all', getAllArticles)
router.get('/admin/:id', getArticleById)
router.patch('/:id', upload.single('articleImage'), handleUploadError, updateArticle)
router.delete('/:id', deleteArticle)
router.patch('/:id/publish', toggleArticlePublish)

export default router