import Article from '../models/Article.js'
import { generateUniqueSlug } from '../utils/slugify.js'
import { AppError } from '../middleware/errorMiddleware.js'

export const getArticles = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 6
    const skip = (page - 1) * limit
    const category = req.query.category

    const query = { isPublished: true }
    if (category) query.category = category

    const [articles, total] = await Promise.all([
      Article.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('title slug category excerpt content image author authorEn createdAt publishedAt titleEn categoryEn excerptEn contentEn'),
      Article.countDocuments(query)
    ])

    res.json({
      success: true,
      data: articles,
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

export const getArticleBySlug = async (req, res, next) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug, isPublished: true })
    if (!article) {
      return next(new AppError('المقال غير موجود', 404))
    }
    res.json({
      success: true,
      data: article
    })
  } catch (error) {
    next(error)
  }
}

export const createArticle = async (req, res, next) => {
  try {
    const { title, category, excerpt, content, author, isPublished, titleEn, categoryEn, excerptEn, contentEn, authorEn } = req.body

    const slug = await generateUniqueSlug(Article, title)

    const image = req.file ? `/uploads/articles/${req.file.filename}` : ''

    const article = await Article.create({
      title,
      slug,
      category,
      excerpt,
      content,
      image,
      author: author || 'مكتب برج العرب للاستشارات الهندسية',
      isPublished: isPublished === 'true' || isPublished === true,
      publishedAt: (isPublished === 'true' || isPublished === true) ? new Date() : null,
      titleEn: titleEn || '',
      categoryEn: categoryEn || '',
      excerptEn: excerptEn || '',
      contentEn: contentEn || '',
      authorEn: authorEn || ''
    })

    res.status(201).json({
      success: true,
      message: 'تم إنشاء المقال بنجاح',
      data: article
    })
  } catch (error) {
    next(error)
  }
}

export const getAllArticles = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit
    const category = req.query.category
    const search = req.query.search
    const isPublished = req.query.isPublished

    const query = {}
    if (category) query.category = category
    if (search) query.title = { $regex: search, $options: 'i' }
    if (isPublished !== undefined && isPublished !== '') query.isPublished = isPublished === 'true'

    const [articles, total] = await Promise.all([
      Article.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Article.countDocuments(query)
    ])

    res.json({
      success: true,
      data: articles,
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

export const getArticleById = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id)
    if (!article) {
      return next(new AppError('المقال غير موجود', 404))
    }
    res.json({
      success: true,
      data: article
    })
  } catch (error) {
    next(error)
  }
}

export const updateArticle = async (req, res, next) => {
  try {
    const { title, category, excerpt, content, author, isPublished, titleEn, categoryEn, excerptEn, contentEn, authorEn } = req.body

    const updateData = {}
    if (title) {
      updateData.title = title
      updateData.slug = await generateUniqueSlug(Article, title, req.params.id)
    }
    if (category) updateData.category = category
    if (excerpt) updateData.excerpt = excerpt
    if (content) updateData.content = content
    if (author !== undefined) updateData.author = author
    if (isPublished !== undefined) {
      updateData.isPublished = isPublished === 'true' || isPublished === true
      updateData.publishedAt = (isPublished === 'true' || isPublished === true) ? new Date() : null
    }
    if (titleEn !== undefined) updateData.titleEn = titleEn
    if (categoryEn !== undefined) updateData.categoryEn = categoryEn
    if (excerptEn !== undefined) updateData.excerptEn = excerptEn
    if (contentEn !== undefined) updateData.contentEn = contentEn
    if (authorEn !== undefined) updateData.authorEn = authorEn
    if (req.file) updateData.image = `/uploads/articles/${req.file.filename}`

    const article = await Article.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )

    if (!article) {
      return next(new AppError('المقال غير موجود', 404))
    }

    res.json({
      success: true,
      message: 'تم تحديث المقال بنجاح',
      data: article
    })
  } catch (error) {
    next(error)
  }
}

export const deleteArticle = async (req, res, next) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id)
    if (!article) {
      return next(new AppError('المقال غير موجود', 404))
    }
    res.json({
      success: true,
      message: 'تم حذف المقال بنجاح'
    })
  } catch (error) {
    next(error)
  }
}

export const toggleArticlePublish = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id)
    if (!article) {
      return next(new AppError('المقال غير موجود', 404))
    }

    article.isPublished = !article.isPublished
    article.publishedAt = article.isPublished ? new Date() : null
    await article.save()

    res.json({
      success: true,
      message: article.isPublished ? 'تم نشر المقال بنجاح' : 'تم إلغاء نشر المقال بنجاح',
      data: article
    })
  } catch (error) {
    next(error)
  }
}