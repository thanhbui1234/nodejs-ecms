// Use singleton design pattern to ensure only one instance is created

import { checkOverload, countConnect } from '@/helpers/connect'
import mongoose from 'mongoose'

const connectStr = process.env.MONGODB_URI || 'mongodb://localhost:27017/shopDev'
const development = process.env.NODE_ENV !== 'production'

interface IDatabase {
  connect: (type?: string) => void
}

class Database implements IDatabase {
  private static instance: Database

  private constructor() {
    this.connect()
  }

  connect(type: string = 'mongodb'): void {
    if (development) {
      console.log('Development mode')
    }
    if (type === 'mongodb') {
      mongoose
        .connect(connectStr)
        .then(() => {
          countConnect()
          checkOverload()
          console.log('MongoDB connected')
        })
        .catch((error) => {
          console.error('MongoDB connection error:', error)
        })
    }
  }

  static getInstance(): Database {
    if (!this.instance) {
      this.instance = new Database()
    }
    return this.instance
  }
}

const instanceMongoDB = Database.getInstance()

export default instanceMongoDB
