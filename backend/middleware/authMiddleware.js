import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'غير مصرح، يرجى تسجيل الدخول'
      })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decoded.userId).select('-password')
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'المستخدم غير موجود أو غير نشط'
      })
    }

    req.user = user
    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'رمز الدخول غير صحيح'
      })
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى'
      })
    }
    next(error)
  }
}

export const requireAdmin = (req, res, next) => {
  if (!req.user || !['admin', 'manager'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'غير مصرح، صلاحيات إدارية مطلوبة'
    })
  }
  next()
}

export const requireEditor = (req, res, next) => {
  if (!req.user || !['admin', 'manager', 'editor'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'غير مصرح، صلاحيات محرر مطلوبة'
    })
  }
  next()
}