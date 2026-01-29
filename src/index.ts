import route from '@/routers/index'
import compression from 'compression'
import dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'
import instanceMongoDB from './db/init.mongodb'
import { errorHandler, notFound } from './middleware/catchError'
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

app.use(notFound)
app.use(errorHandler)

process.on('SIGINT', () => {
  console.log('Bye bye!')
  server.close(() => {
    console.log('Server closed')
  })
})
