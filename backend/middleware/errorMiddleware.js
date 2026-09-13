export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err)

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }))
    return res.status(400).json({
      success: false,
      message: 'يرجى التحقق من البيانات المدخلة',
      errors
    })
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    const messages = {
      email: 'البريد الإلكتروني مستخدم بالفعل',
      slug: 'هذا المعرف مستخدم بالفعل',
      phone: 'رقم الجوال مستخدم بالفعل'
    }
    return res.status(400).json({
      success: false,
      message: messages[field] || 'القيمة مدخلة بالفعل'
    })
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'معرف غير صحيح'
    })
  }

  const statusCode = err.statusCode || 500
  const message = err.message || 'حدث خطأ غير متوقع'

  res.status(statusCode).json({
    success: false,
    message
  })
}

export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: 'المسار غير موجود'
  })
}

export class AppError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true
    Error.captureStackTrace(this, this.constructor)
  }
}