// Use singleton design pattern to ensure only one instance is created
import config from '@/configs/config.mongodb'
import { checkOverload, countConnect } from '@/helpers/connect'
import mongoose from 'mongoose'

const {
  db: { host, port, name }
} = config
const connectStr = process.env.MONGODB_URI || `mongodb://${host}:${port}/${name}`
const development = process.env.NODE_ENV !== 'production'

interface IDatabase {
  connect: (type?: string) => void
}

class Database implements IDatabase {
  private static instance: Database

  private constructor() {
    this.connect()
    console.log('config', process.env.NODE_ENV)
  }

  connect(type: string = 'mongodb'): void {
    // if (development) {
    //   console.log('Development mode')
    // }
    if (type === 'mongodb') {
      mongoose
        .connect(connectStr, {
          // nếu vượt quá 50 nó sẽ xếp hàng , đợi các yêu cầu xử lý xong , và nếu có kết nối nào free thì  nó sẽ cho phép xử lý
          // kích thước của poollsize thưởng dựa vào cpu và ram của máy
          maxPoolSize: 50
        })
        .then(() => {
          // countConnect()
          // checkOverload()ss
          console.log(`MongoDB connected ${name}`)
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
