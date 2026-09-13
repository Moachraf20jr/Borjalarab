import mongoose from 'mongoose'
import Project from '../models/Project.js'
import Article from '../models/Article.js'
import { sampleProjects, sampleArticles } from './seed.js'
import dotenv from 'dotenv'

dotenv.config()

const ENGLISH_FIELDS_PROJECT = ['titleEn', 'categoryEn', 'descriptionEn', 'fullDescriptionEn', 'locationEn', 'servicesEn']
const ENGLISH_FIELDS_ARTICLE = ['titleEn', 'categoryEn', 'excerptEn', 'contentEn', 'authorEn']

const backfill = async () => {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('Connected to MongoDB')

  let projectsUpdated = 0
  for (const data of sampleProjects) {
    const doc = await Project.findOne({ title: data.title })
    if (!doc) continue
    const patch = {}
    for (const field of ENGLISH_FIELDS_PROJECT) {
      if (data[field] !== undefined && !doc[field]) {
        patch[field] = data[field]
      }
    }
    if (Object.keys(patch).length) {
      await Project.updateOne({ _id: doc._id }, { $set: patch })
      projectsUpdated += 1
      console.log(`Project backfilled: ${data.title}`)
    }
  }

  let articlesUpdated = 0
  for (const data of sampleArticles) {
    const doc = await Article.findOne({ title: data.title })
    if (!doc) continue
    const patch = {}
    for (const field of ENGLISH_FIELDS_ARTICLE) {
      if (data[field] !== undefined && !doc[field]) {
        patch[field] = data[field]
      }
    }
    if (Object.keys(patch).length) {
      await Article.updateOne({ _id: doc._id }, { $set: patch })
      articlesUpdated += 1
      console.log(`Article backfilled: ${data.title}`)
    }
  }

  console.log(`Bilingual backfill complete. Projects: ${projectsUpdated}, Articles: ${articlesUpdated}`)
  process.exit(0)
}

backfill()