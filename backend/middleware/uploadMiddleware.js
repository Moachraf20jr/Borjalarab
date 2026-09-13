import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const uploadDir = path.join(__dirname, '../uploads')
const teamDir = path.join(uploadDir, 'team')
fs.mkdirSync(path.join(uploadDir, 'projects'), { recursive: true })
fs.mkdirSync(path.join(uploadDir, 'articles'), { recursive: true })
fs.mkdirSync(teamDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = file.fieldname === 'projectImage'
      ? path.join(__dirname, '../uploads/projects')
      : file.fieldname === 'teamImage'
        ? teamDir
        : path.join(__dirname, '../uploads/articles')
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`)
  }
})

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('نوع الملف غير مدعوم. الرجاء رفع صور JPEG أو PNG أو WEBP فقط'), false)
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
})

export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'حجم الملف كبير جداً. الحد الأقصى 5 ميجابايت'
      })
    }
    return res.status(400).json({
      success: false,
      message: `خطأ في رفع الملف: ${err.message}`
    })
  }
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    })
  }
  next()
}