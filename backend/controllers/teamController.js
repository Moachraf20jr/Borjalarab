import TeamMember from '../models/TeamMember.js'
import { AppError } from '../middleware/errorMiddleware.js'
import { normalizePhone } from '../utils/phone.js'

export const getPublicTeam = async (req, res, next) => {
  try {
    const members = await TeamMember.find({ isActive: true, isPublished: { $ne: false } })
      .sort({ sortOrder: 1, createdAt: -1 })
      .select('name nameEn role roleEn bio bioEn image email phone sortOrder')
    res.json({
      success: true,
      data: members
    })
  } catch (error) {
    next(error)
  }
}

export const getAllTeam = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit
    const search = req.query.search
    const isActive = req.query.isActive
    const isPublished = req.query.isPublished

    const query = {}
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } }
      ]
    }
    if (isActive !== undefined && isActive !== '') query.isActive = isActive === 'true'
    if (isPublished !== undefined && isPublished !== '') query.isPublished = isPublished === 'true'

    const [members, total] = await Promise.all([
      TeamMember.find(query).sort({ sortOrder: 1, createdAt: -1 }).skip(skip).limit(limit),
      TeamMember.countDocuments(query)
    ])

    res.json({
      success: true,
      data: members,
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

export const getTeamMemberById = async (req, res, next) => {
  try {
    const member = await TeamMember.findById(req.params.id)
    if (!member) {
      return next(new AppError('العضو غير موجود', 404))
    }
    res.json({
      success: true,
      data: member
    })
  } catch (error) {
    next(error)
  }
}

export const createTeamMember = async (req, res, next) => {
  try {
    const { name, nameEn, role, roleEn, bio, bioEn, email, phone, sortOrder, isActive, isPublished } = req.body

    const member = await TeamMember.create({
      name,
      nameEn: nameEn || '',
      role,
      roleEn: roleEn || '',
      bio: bio || '',
      bioEn: bioEn || '',
      image: req.file ? `/uploads/team/${req.file.filename}` : '',
      email: email || '',
      phone: normalizePhone(phone || ''),
      sortOrder: sortOrder !== undefined && sortOrder !== '' ? parseInt(sortOrder) : 0,
      isActive: isActive === 'true' || isActive === true || isActive === undefined,
      isPublished: isPublished === 'true' || isPublished === true || isPublished === undefined
    })

    res.status(201).json({
      success: true,
      message: 'تم إنشاء العضو بنجاح',
      data: member
    })
  } catch (error) {
    next(error)
  }
}

export const updateTeamMember = async (req, res, next) => {
  try {
    const { name, nameEn, role, roleEn, bio, bioEn, email, phone, sortOrder, isActive, isPublished } = req.body

    const updateData = {}
    if (name !== undefined) updateData.name = name
    if (nameEn !== undefined) updateData.nameEn = nameEn
    if (role !== undefined) updateData.role = role
    if (roleEn !== undefined) updateData.roleEn = roleEn
    if (bio !== undefined) updateData.bio = bio
    if (bioEn !== undefined) updateData.bioEn = bioEn
    if (email !== undefined) updateData.email = email
    if (phone !== undefined) updateData.phone = normalizePhone(phone)
    if (sortOrder !== undefined && sortOrder !== '') updateData.sortOrder = parseInt(sortOrder)
    if (isActive !== undefined) updateData.isActive = isActive === 'true' || isActive === true
    if (isPublished !== undefined) updateData.isPublished = isPublished === 'true' || isPublished === true
    if (req.file) updateData.image = `/uploads/team/${req.file.filename}`

    const member = await TeamMember.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )

    if (!member) {
      return next(new AppError('العضو غير موجود', 404))
    }

    res.json({
      success: true,
      message: 'تم تحديث العضو بنجاح',
      data: member
    })
  } catch (error) {
    next(error)
  }
}

export const deleteTeamMember = async (req, res, next) => {
  try {
    const member = await TeamMember.findByIdAndDelete(req.params.id)
    if (!member) {
      return next(new AppError('العضو غير موجود', 404))
    }
    res.json({
      success: true,
      message: 'تم حذف العضو بنجاح'
    })
  } catch (error) {
    next(error)
  }
}

export const toggleTeamMemberActive = async (req, res, next) => {
  try {
    const member = await TeamMember.findById(req.params.id)
    if (!member) {
      return next(new AppError('العضو غير موجود', 404))
    }

    member.isActive = !member.isActive
    await member.save()

    res.json({
      success: true,
      message: member.isActive ? 'تم تفعيل العضو بنجاح' : 'تم إلغاء تفعيل العضو بنجاح',
      data: member
    })
  } catch (error) {
    next(error)
  }
}

export const toggleTeamMemberPublish = async (req, res, next) => {
  try {
    const member = await TeamMember.findById(req.params.id)
    if (!member) {
      return next(new AppError('العضو غير موجود', 404))
    }

    member.isPublished = !member.isPublished
    await member.save()

    res.json({
      success: true,
      message: member.isPublished ? 'تم نشر العضو بنجاح' : 'تم إلغاء نشر العضو بنجاح',
      data: member
    })
  } catch (error) {
    next(error)
  }
}