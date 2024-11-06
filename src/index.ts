import express from 'express'
import compression from 'compression'
import helmet from 'helmet'
import instanceMongoDB from './db/init.mongodb'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

app.use(compression()) // Compress all requests
app.use(helmet()) // Protect from well-known web vulnerabilities

const port = process.env.PORT || 3005
const status = 200

instanceMongoDB.connect()

app.get('/', (req, res: any) => {
  const strCpm = 'Hello World'
  return res.status(status).json({
    message: strCpm,
    compressed: strCpm.length,
    time: Date.now(),
    metaData: strCpm.repeat(1000)
  })
})

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})

process.on('SIGINT', () => {
  console.log('Bye bye!')
  server.close(() => {
    console.log('Server closed')
  })
})
