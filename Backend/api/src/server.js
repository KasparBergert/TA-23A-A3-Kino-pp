import '../../env.js'
import express from 'express'
import cookieParser from 'cookie-parser'
import CreateRoutes from './routes.js'
import addMessageField from './middleware/addMessageField.js'
import chalk from 'chalk'

//colors the error to red
const origError = console.error
console.error = (error) => {
  origError(chalk.red(error))
}

const app = express()
const PORT = process.env.PORT
const URI = process.env.URI

const middlewares = [addMessageField]

app.use(cookieParser())
app.use(express.json())

app.use(middlewares)
app.use('/api', CreateRoutes())

app
  .listen(PORT, () => {
    console.log(`server running ${URI}:${PORT}`)
  })
  .on('error', () => {
    console.log('Server failed to launch')
  })
