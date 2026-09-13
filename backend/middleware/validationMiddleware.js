import { body, validationResult } from 'express-validator'
import { isPhoneValid } from '../utils/phone.js'

export const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array().map(e => ({ field: e.path, message: e.msg }))
    })
  }
  next()
}

export const loginValidation = [
  body('email').isEmail().withMessage('البريد الإلكتروني غير صحيح'),
  body('password').notEmpty().withMessage('كلمة المرور مطلوبة'),
  validate
]

export const consultationValidation = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('الاسم يجب أن يكون حرفين على الأقل'),
  body('phone').trim().custom(isPhoneValid).withMessage('رقم الجوال غير صحيح، يرجى إدخال رقم دولي صحيح'),
  body('email').isEmail().withMessage('البريد الإلكتروني غير صحيح'),
  body('projectType')
    .isIn(['residential', 'commercial', 'administrative', 'engineering', 'other'])
    .withMessage('نوع المشروع غير صحيح'),
  body('details').trim().isLength({ min: 10, max: 2000 }).withMessage('تفاصيل المشروع يجب أن تكون 10 أحرف على الأقل'),
  validate
]

export const projectValidation = [
  body('title').trim().isLength({ min: 3, max: 150 }).withMessage('عنوان المشروع مطلوب'),
  body('category').trim().notEmpty().withMessage('التصنيف مطلوب'),
  body('description').trim().isLength({ min: 3, max: 500 }).withMessage('الوصف مطلوب'),
  validate
]

export const articleValidation = [
  body('title').trim().isLength({ min: 3, max: 200 }).withMessage('عنوان المقال مطلوب'),
  body('category').trim().notEmpty().withMessage('التصنيف مطلوب'),
  body('excerpt').trim().isLength({ min: 3, max: 500 }).withMessage('الملخص مطلوب'),
  body('content').trim().notEmpty().withMessage('محتوى المقال مطلوب'),
  validate
]

export const userValidation = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('الاسم مطلوب'),
  body('email').isEmail().withMessage('البريد الإلكتروني غير صحيح'),
  body('password').isLength({ min: 6 }).withMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  validate
]

export const teamValidation = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('الاسم مطلوب'),
  body('role').trim().notEmpty().withMessage('المسمى الوظيفي مطلوب'),
  validate
]