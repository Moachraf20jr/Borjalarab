import mongoose from 'mongoose'

const consultationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'الاسم مطلوب'],
    trim: true,
    maxlength: [100, 'الاسم لا يجب أن يتجاوز 100 حرف']
  },
  phone: {
    type: String,
    required: [true, 'رقم الجوال مطلوب'],
    trim: true,
    match: [/^\+?[0-9\s\-()]{7,18}$/, 'رقم الجوال غير صحيح']
  },
  email: {
    type: String,
    required: [true, 'البريد الإلكتروني مطلوب'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'البريد الإلكتروني غير صحيح']
  },
  projectType: {
    type: String,
    required: [true, 'نوع المشروع مطلوب'],
    enum: {
      values: ['residential', 'commercial', 'administrative', 'engineering', 'other'],
      message: 'نوع المشروع غير صحيح'
    }
  },
  details: {
    type: String,
    required: [true, 'تفاصيل المشروع مطلوبة'],
    trim: true,
    minlength: [10, 'تفاصيل المشروع يجب أن تكون 10 أحرف على الأقل'],
    maxlength: [2000, 'تفاصيل المشروع لا يجب أن تتجاوز 2000 حرف']
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'in_progress', 'completed', 'cancelled'],
    default: 'new'
  },
  adminNotes: {
    type: String,
    trim: true,
    maxlength: [1000, 'الملاحظات لا يجب أن تتجاوز 1000 حرف'],
    default: ''
  }
}, {
  timestamps: true
})

consultationSchema.index({ status: 1, createdAt: -1 })
consultationSchema.index({ email: 1 })
consultationSchema.index({ phone: 1 })

export default mongoose.model('Consultation', consultationSchema)