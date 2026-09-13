import User from '../models/User.js'
import { generateToken } from '../utils/generateToken.js'
import { AppError } from '../middleware/errorMiddleware.js'

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return next(new AppError('البريد الإلكتروني وكلمة المرور مطلوبان', 400))
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
    if (!user) {
      return next(new AppError('بيانات الدخول غير صحيحة', 401))
    }

    if (!user.isActive) {
      return next(new AppError('الحساب معطل، يرجى التواصل مع الإدارة', 401))
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return next(new AppError('بيانات الدخول غير صحيحة', 401))
    }

    const token = generateToken(user._id, user.role)

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    next(error)
  }
}

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    next(error)
  }
}

export const logout = async (req, res) => {
  res.json({
    success: true,
    message: 'تم تسجيل الخروج بنجاح'
  })
}