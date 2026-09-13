import Project from '../models/Project.js'
import { generateUniqueSlug } from '../utils/slugify.js'
import { AppError } from '../middleware/errorMiddleware.js'

export const getProjects = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 9
    const skip = (page - 1) * limit
    const category = req.query.category
    const featured = req.query.featured

    const query = { isPublished: true }
    if (category) query.category = category
    if (featured === 'true') query.featured = true

    const [projects, total] = await Promise.all([
      Project.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('title slug category description fullDescription location year services featured image titleEn categoryEn descriptionEn fullDescriptionEn locationEn servicesEn'),
      Project.countDocuments(query)
    ])

    res.json({
      success: true,
      data: projects,
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

export const getProjectBySlug = async (req, res, next) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug, isPublished: true })
    if (!project) {
      return next(new AppError('المشروع غير موجود', 404))
    }
    res.json({
      success: true,
      data: project
    })
  } catch (error) {
    next(error)
  }
}

export const createProject = async (req, res, next) => {
  try {
    const { title, category, description, fullDescription, location, year, services, featured, isPublished, titleEn, categoryEn, descriptionEn, fullDescriptionEn, locationEn, servicesEn } = req.body

    const slug = await generateUniqueSlug(Project, title)

    const image = req.file ? `/uploads/projects/${req.file.filename}` : ''

    const project = await Project.create({
      title,
      slug,
      category,
      description,
      fullDescription: fullDescription || '',
      image,
      location: location || '',
      year: year ? parseInt(year) : new Date().getFullYear(),
      services: services ? (Array.isArray(services) ? services : services.split(',').map(s => s.trim())) : [],
      featured: featured === 'true' || featured === true,
      isPublished: isPublished === 'true' || isPublished === true,
      titleEn: titleEn || '',
      categoryEn: categoryEn || '',
      descriptionEn: descriptionEn || '',
      fullDescriptionEn: fullDescriptionEn || '',
      locationEn: locationEn || '',
      servicesEn: servicesEn ? (Array.isArray(servicesEn) ? servicesEn : servicesEn.split(',').map(s => s.trim())) : []
    })

    res.status(201).json({
      success: true,
      message: 'تم إنشاء المشروع بنجاح',
      data: project
    })
  } catch (error) {
    next(error)
  }
}

export const getAllProjects = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit
    const category = req.query.category
    const search = req.query.search
    const isPublished = req.query.isPublished
    const featured = req.query.featured

    const query = {}
    if (category) query.category = category
    if (search) query.title = { $regex: search, $options: 'i' }
    if (isPublished !== undefined && isPublished !== '') query.isPublished = isPublished === 'true'
    if (featured !== undefined && featured !== '') query.featured = featured === 'true'

    const [projects, total] = await Promise.all([
      Project.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Project.countDocuments(query)
    ])

    res.json({
      success: true,
      data: projects,
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

export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) {
      return next(new AppError('المشروع غير موجود', 404))
    }
    res.json({
      success: true,
      data: project
    })
  } catch (error) {
    next(error)
  }
}

export const updateProject = async (req, res, next) => {
  try {
    const { title, category, description, fullDescription, location, year, services, featured, isPublished, titleEn, categoryEn, descriptionEn, fullDescriptionEn, locationEn, servicesEn } = req.body

    const updateData = {}
    if (title) {
      updateData.title = title
      updateData.slug = await generateUniqueSlug(Project, title, req.params.id)
    }
    if (category) updateData.category = category
    if (description) updateData.description = description
    if (fullDescription !== undefined) updateData.fullDescription = fullDescription
    if (location !== undefined) updateData.location = location
    if (year) updateData.year = parseInt(year)
    if (services !== undefined) updateData.services = Array.isArray(services) ? services : services.split(',').map(s => s.trim())
    if (featured !== undefined) updateData.featured = featured === 'true' || featured === true
    if (isPublished !== undefined) updateData.isPublished = isPublished === 'true' || isPublished === true
    if (titleEn !== undefined) updateData.titleEn = titleEn
    if (categoryEn !== undefined) updateData.categoryEn = categoryEn
    if (descriptionEn !== undefined) updateData.descriptionEn = descriptionEn
    if (fullDescriptionEn !== undefined) updateData.fullDescriptionEn = fullDescriptionEn
    if (locationEn !== undefined) updateData.locationEn = locationEn
    if (servicesEn !== undefined) updateData.servicesEn = Array.isArray(servicesEn) ? servicesEn : servicesEn.split(',').map(s => s.trim())
    if (req.file) updateData.image = `/uploads/projects/${req.file.filename}`

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )

    if (!project) {
      return next(new AppError('المشروع غير موجود', 404))
    }

    res.json({
      success: true,
      message: 'تم تحديث المشروع بنجاح',
      data: project
    })
  } catch (error) {
    next(error)
  }
}

export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id)
    if (!project) {
      return next(new AppError('المشروع غير موجود', 404))
    }
    res.json({
      success: true,
      message: 'تم حذف المشروع بنجاح'
    })
  } catch (error) {
    next(error)
  }
}

export const toggleProjectPublish = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) {
      return next(new AppError('المشروع غير موجود', 404))
    }

    project.isPublished = !project.isPublished
    await project.save()

    res.json({
      success: true,
      message: project.isPublished ? 'تم نشر المشروع بنجاح' : 'تم إلغاء نشر المشروع بنجاح',
      data: project
    })
  } catch (error) {
    next(error)
  }
}