import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import CreateRoutes from './routes.js'

const app = express()
const PORT = process.env.PORT
const URI = process.env.URI

app.use('/api', CreateRoutes())

app
  .listen(PORT, () => {
    console.log(`server running ${URI}:${PORT}`)
  })
  .on('error', () => {
    console.log('Server failed to launch')
  })
