import mongoose from 'mongoose'
import User from '../models/User.js'
import dotenv from 'dotenv'

dotenv.config()

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected to MongoDB')

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
    const existingAdmin = await User.findOne({ email: adminEmail })

    if (existingAdmin) {
      console.log('Admin user already exists')
      process.exit(0)
    }

    const admin = await User.create({
      name: process.env.ADMIN_NAME || 'Admin',
      email: adminEmail,
      password: process.env.ADMIN_PASSWORD || 'Admin@123456',
      role: 'admin',
      isActive: true
    })

    console.log('Admin user created successfully:')
    console.log(`Email: ${admin.email}`)
    console.log(`Name: ${admin.name}`)
    console.log(`Role: ${admin.role}`)

    process.exit(0)
  } catch (error) {
    console.error('Error seeding admin:', error)
    process.exit(1)
  }
}

seedAdmin()