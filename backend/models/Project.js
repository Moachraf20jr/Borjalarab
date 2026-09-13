import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'عنوان المشروع مطلوب'],
    trim: true,
    maxlength: [150, 'العنوان لا يجب أن يتجاوز 150 حرف']
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
  description: {
    type: String,
    required: [true, 'الوصف مطلوب'],
    trim: true,
    maxlength: [500, 'الوصف لا يجب أن يتجاوز 500 حرف']
  },
  fullDescription: {
    type: String,
    trim: true,
    maxlength: [5000, 'الوصف الكامل لا يجب أن يتجاوز 5000 حرف'],
    default: ''
  },
  titleEn: {
    type: String,
    trim: true,
    maxlength: [150, 'English title cannot exceed 150 characters'],
    default: ''
  },
  categoryEn: {
    type: String,
    trim: true,
    maxlength: [50, 'English category cannot exceed 50 characters'],
    default: ''
  },
  descriptionEn: {
    type: String,
    trim: true,
    maxlength: [500, 'English description cannot exceed 500 characters'],
    default: ''
  },
  fullDescriptionEn: {
    type: String,
    trim: true,
    maxlength: [5000, 'English full description cannot exceed 5000 characters'],
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    trim: true,
    maxlength: [100, 'الموقع لا يجب أن يتجاوز 100 حرف'],
    default: ''
  },
  locationEn: {
    type: String,
    trim: true,
    maxlength: [100, 'English location cannot exceed 100 characters'],
    default: ''
  },
  year: {
    type: Number,
    min: [2000, 'السنة غير صحيحة'],
    max: [new Date().getFullYear() + 1, 'السنة غير صحيحة'],
    default: () => new Date().getFullYear()
  },
  services: [{
    type: String,
    trim: true,
    maxlength: [100, 'الخدمة لا يجب أن تتجاوز 100 حرف']
  }],
  servicesEn: [{
    type: String,
    trim: true,
    maxlength: [100, 'English service cannot exceed 100 characters']
  }],
  featured: {
    type: Boolean,
    default: false
  },
  isPublished: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

projectSchema.index({ slug: 1 }, { unique: true })
projectSchema.index({ category: 1, createdAt: -1 })
projectSchema.index({ isPublished: 1, createdAt: -1 })
projectSchema.index({ featured: 1, createdAt: -1 })

export default mongoose.model('Project', projectSchema)