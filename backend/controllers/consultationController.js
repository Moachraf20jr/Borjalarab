import Consultation from '../models/Consultation.js'
import { AppError } from '../middleware/errorMiddleware.js'
import { normalizePhone } from '../utils/phone.js'

export const createConsultation = async (req, res, next) => {
  try {
    const { name, phone, email, projectType, details } = req.body

    const consultation = await Consultation.create({
      name,
      phone: normalizePhone(phone),
      email,
      projectType,
      details
    })

    res.status(201).json({
      success: true,
      message: 'تم إرسال طلب الاستشارة بنجاح',
      data: consultation
    })
  } catch (error) {
    next(error)
  }
}

export const getConsultations = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit
    const status = req.query.status
    const search = req.query.search

    const query = {}
    if (status) query.status = status
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ]
    }

    const [consultations, total] = await Promise.all([
      Consultation.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Consultation.countDocuments(query)
    ])

    res.json({
      success: true,
      data: consultations,
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

export const getConsultationById = async (req, res, next) => {
  try {
    const consultation = await Consultation.findById(req.params.id)
    if (!consultation) {
      return next(new AppError('طلب الاستشارة غير موجود', 404))
    }
    res.json({
      success: true,
      data: consultation
    })
  } catch (error) {
    next(error)
  }
}

export const updateConsultationStatus = async (req, res, next) => {
  try {
    const { status } = req.body
    const validStatuses = ['new', 'contacted', 'in_progress', 'completed', 'cancelled']

    if (!validStatuses.includes(status)) {
      return next(new AppError('حالة غير صحيحة', 400))
    }

    const consultation = await Consultation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )

    if (!consultation) {
      return next(new AppError('طلب الاستشارة غير موجود', 404))
    }

    res.json({
      success: true,
      message: 'تم تحديث الحالة بنجاح',
      data: consultation
    })
  } catch (error) {
    next(error)
  }
}

export const updateConsultationNotes = async (req, res, next) => {
  try {
    const { adminNotes } = req.body

    const consultation = await Consultation.findByIdAndUpdate(
      req.params.id,
      { adminNotes },
      { new: true, runValidators: true }
    )

    if (!consultation) {
      return next(new AppError('طلب الاستشارة غير موجود', 404))
    }

    res.json({
      success: true,
      message: 'تم إضافة الملاحظات بنجاح',
      data: consultation
    })
  } catch (error) {
    next(error)
  }
}

export const deleteConsultation = async (req, res, next) => {
  try {
    const consultation = await Consultation.findByIdAndDelete(req.params.id)
    if (!consultation) {
      return next(new AppError('طلب الاستشارة غير موجود', 404))
    }
    res.json({
      success: true,
      message: 'تم حذف طلب الاستشارة بنجاح'
    })
  } catch (error) {
    next(error)
  }
}