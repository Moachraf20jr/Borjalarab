import mongoose from 'mongoose'

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'عنوان المقال مطلوب'],
    trim: true,
    maxlength: [200, 'العنوان لا يجب أن يتجاوز 200 حرف']
  },
  slug: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'التصنيف مطلوب'],
    trim: true,
    maxlength: [50, 'التصنيف لا يجب أن يتجاوز 50 حرف']
  },
  excerpt: {
    type: String,
    required: [true, 'الملخص مطلوب'],
    trim: true,
    maxlength: [500, 'الملخص لا يجب أن يتجاوز 500 حرف']
  },
  content: {
    type: String,
    required: [true, 'محتوى المقال مطلوب'],
    trim: true
  },
  titleEn: {
    type: String,
    trim: true,
    maxlength: [200, 'English title cannot exceed 200 characters'],
    default: ''
  },
  categoryEn: {
    type: String,
    trim: true,
    maxlength: [50, 'English category cannot exceed 50 characters'],
    default: ''
  },
  excerptEn: {
    type: String,
    trim: true,
    maxlength: [500, 'English excerpt cannot exceed 500 characters'],
    default: ''
  },
  contentEn: {
    type: String,
    trim: true,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  author: {
    type: String,
    required: [true, 'المؤلف مطلوب'],
    trim: true,
    maxlength: [100, 'المؤلف لا يجب أن يتجاوز 100 حرف'],
    default: 'مكتب برج العرب للاستشارات الهندسية'
  },
  authorEn: {
    type: String,
    trim: true,
    maxlength: [100, 'English author cannot exceed 100 characters'],
    default: ''
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
})

articleSchema.index({ slug: 1 }, { unique: true })
articleSchema.index({ category: 1, createdAt: -1 })
articleSchema.index({ isPublished: 1, createdAt: -1 })

articleSchema.pre('save', function(next) {
  if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date()
  }
  next()
})

export default mongoose.model('Article', articleSchema)