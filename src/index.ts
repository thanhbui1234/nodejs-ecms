import route from '@/routers/index'
import compression from 'compression'
import dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'
import instanceMongoDB from './db/init.mongodb'
dotenv.config()

const app = express()

app.use(compression()) // Compress all requests
app.use(express.json()) // Parse JSON bodies
app.use(helmet()) // Protect from well-known web vulnerabilities
app.use(express.urlencoded({ extended: true })) // Parse URL-encoded bodies
app.use(route)

const port = process.env.PORT || 3005

instanceMongoDB.connect()
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})

app.use((req: any, res: any, next: any) => {
  const error: any = new Error('Not found')
  error.status = 404
  next(error)
})
app.use((error: any, req: any, res: any, next: any) => {
  res.status(+error.status || 500)
  res.json({
    error: {
      status: error.status || 500,
      message: error.message || 'Internal Server Error'
    }
  })
})

process.on('SIGINT', () => {
  console.log('Bye bye!')
  server.close(() => {
    console.log('Server closed')
  })
})
