import '../../env.ts'
import express from 'express'
import cookieParser from 'cookie-parser'
import ApiRoutes from './routes.ts'
import addMessageField from './middleware/addMessageField.ts'
import chalk from 'chalk'
import cors from 'cors'

//colors the error to red
const origError = console.error
console.error = (error: unknown) => {
  origError(chalk.red(String(error)))
}

const app = express()
const PORT = process.env.PORT
const URI = process.env.URI

const middlewares = [addMessageField]

//helps add 's' to 'http' protocol when cookies are set to 'secure'.
const secureSuffix = process.env.SecureCookies === 'true' ? 's' : ''
app.use(
  cors({
    origin: `http${secureSuffix}://localhost:5173`,
  }),
)
app.use(cookieParser())
app.use(express.json())

app.use(middlewares)
app.use('/api', ApiRoutes())

app
  .listen(PORT, () => {
    console.log(`server running ${URI}:${PORT}`)
  })
  .on('error', () => {
    console.log('Server failed to launch')
  })
