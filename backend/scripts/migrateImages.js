import mongoose from 'mongoose'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import Project from '../models/Project.js'
import Article from '../models/Article.js'
import dotenv from 'dotenv'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const imagesRoot = path.resolve(__dirname, '../../public/images')

const swapExtension = (imagePath) => {
  if (!imagePath || !imagePath.toLowerCase().endsWith('.svg')) return null
  return imagePath.replace(/\.svg$/i, '.jpg')
}

const migrateCollection = async (Model, label, recordImage) => {
  const docs = await Model.find({ image: /\.svg$/i })
  let updated = 0
  for (const doc of docs) {
    const newImage = swapExtension(doc.image)
    if (!newImage) continue
    const rel = newImage.replace(/^\/images\//, '')
    const target = path.join(imagesRoot, rel)
    if (fs.existsSync(target) && fs.statSync(target).size > 0) {
      doc.image = newImage
      await doc.save()
      updated += 1
      console.log(`${label} "${doc.title}": ${doc.image} -> ${newImage}`)
    } else {
      console.log(`${label} "${doc.title}": skipped (${target} missing)`)
    }
  }
  return updated
}

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected to MongoDB')

    const projects = await migrateCollection(Project, 'Project', 'image')
    const articles = await migrateCollection(Article, 'Article', 'image')

    console.log(`Migration complete. Projects updated: ${projects}, Articles updated: ${articles}`)
    process.exit(0)
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

migrate()