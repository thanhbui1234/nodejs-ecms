import express from 'express'
import compression from 'compression'
import helmet from 'helmet'
import instanceMongoDB from './db/init.mongodb'
import dotenv from 'dotenv'
import route from '@/routers/index'
dotenv.config()

const app = express()

app.use(compression()) // Compress all requests
app.use(express.json()) // Parse JSON bodies
app.use(helmet()) // Protect from well-known web vulnerabilities
app.use(route)

const port = process.env.PORT || 3005

instanceMongoDB.connect()
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})

process.on('SIGINT', () => {
  console.log('Bye bye!')
  server.close(() => {
    console.log('Server closed')
  })
})
