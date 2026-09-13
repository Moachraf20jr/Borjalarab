import slugify from 'slugify'

export const generateSlug = (text) => {
  return slugify(text, {
    lower: true,
    strict: true,
    locale: 'ar',
    trim: true
  })
}

export const generateUniqueSlug = async (Model, text, excludeId = null) => {
  let slug = generateSlug(text)
  let uniqueSlug = slug
  let counter = 1

  while (true) {
    const query = { slug: uniqueSlug }
    if (excludeId) query._id = { $ne: excludeId }
    const existing = await Model.findOne(query)
    if (!existing) break
    uniqueSlug = `${slug}-${counter}`
    counter++
  }

  return uniqueSlug
}