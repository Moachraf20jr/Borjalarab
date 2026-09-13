import User from '../models/User.js'
import { AppError } from '../middleware/errorMiddleware.js'
import bcrypt from 'bcryptjs'

export const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const [users, total] = await Promise.all([
      User.find().sort({ createdAt: -1 }).skip(skip).limit(limit).select('-password'),
      User.countDocuments()
    ])

    res.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    next(error)
  }
}

export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body

    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return next(new AppError('البريد الإلكتروني مستخدم بالفعل', 400))
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'editor'
    })

    res.status(201).json({
      success: true,
      message: 'تم إنشاء المستخدم بنجاح',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt
      }
    })
  } catch (error) {
    next(error)
  }
}

export const updateUser = async (req, res, next) => {
  try {
    const { name, email, role, isActive } = req.body

    const updateData = {}
    if (name) updateData.name = name
    if (email) updateData.email = email
    if (role) updateData.role = role
    if (isActive !== undefined) updateData.isActive = isActive

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password')

    if (!user) {
      return next(new AppError('المستخدم غير موجود', 404))
    }

    res.json({
      success: true,
      message: 'تم تحديث المستخدم بنجاح',
      data: user
    })
  } catch (error) {
    next(error)
  }
}

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body

    const user = await User.findById(req.params.id).select('+password')
    if (!user) {
      return next(new AppError('المستخدم غير موجود', 404))
    }

    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) {
      return next(new AppError('كلمة المرور الحالية غير صحيحة', 400))
    }

    user.password = newPassword
    await user.save()

    res.json({
      success: true,
      message: 'تم تغيير كلمة المرور بنجاح'
    })
  } catch (error) {
    next(error)
  }
}

export const deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user.id.toString()) {
      return next(new AppError('لا يمكنك حذف حسابك الخاص', 400))
    }

    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) {
      return next(new AppError('المستخدم غير موجود', 404))
    }

    res.json({
      success: true,
      message: 'تم حذف المستخدم بنجاح'
    })
  } catch (error) {
    next(error)
  }
}