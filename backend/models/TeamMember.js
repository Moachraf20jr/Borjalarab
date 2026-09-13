import mongoose from 'mongoose'

const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'الاسم مطلوب'],
    trim: true,
    maxlength: [100, 'الاسم لا يجب أن يتجاوز 100 حرف']
  },
  nameEn: {
    type: String,
    trim: true,
    maxlength: [100, 'English name cannot exceed 100 characters'],
    default: ''
  },
  role: {
    type: String,
    required: [true, 'المسمى الوظيفي مطلوب'],
    trim: true,
    maxlength: [100, 'المسمى الوظيفي لا يجب أن يتجاوز 100 حرف']
  },
  roleEn: {
    type: String,
    trim: true,
    maxlength: [100, 'English role cannot exceed 100 characters'],
    default: ''
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [1000, 'السيرة الذاتية لا يجب أن تتجاوز 1000 حرف'],
    default: ''
  },
  bioEn: {
    type: String,
    trim: true,
    maxlength: [1000, 'English bio cannot exceed 1000 characters'],
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'البريد الإلكتروني غير صحيح'],
    default: ''
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPublished: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

teamMemberSchema.index({ isActive: 1, isPublished: 1, sortOrder: 1 })

export default mongoose.model('TeamMember', teamMemberSchema)