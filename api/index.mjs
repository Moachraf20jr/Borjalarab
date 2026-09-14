import mongoose from 'mongoose'
import app from '../backend/app.js'

let connecting = null

const connect = () => {
  if (!connecting) {
    connecting = mongoose
      .connect(process.env.MONGO_URI)
      .catch((err) => {
        console.error('MongoDB connection error:', err && err.message)
        connecting = null
      })
  }
  return connecting
}

export default async function handler(req, res) {
  if (mongoose.connection.readyState !== 1) {
    await connect()
  }
  return app(req, res)
}