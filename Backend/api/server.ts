import '../env.ts'
import express, { Response } from 'express'
import cookieParser from 'cookie-parser'
import ApiRoutes from './src/routes.ts'
import addMessageField from './src/controllers/middleware/addMessageField.ts'
import chalk from 'chalk'
import cors from 'cors'
import HttpError from './src/types/HttpError.ts'
import { Request, NextFunction } from 'express'
import validateBody from './src/controllers/middleware/validateAuthUsersBody.ts'



//colors the error to red
const origError = console.error
console.error = (error: unknown) => {
  origError(chalk.red(String(error)))
}

//colors the error to blue
const origInfo = console.info
console.info = (error: unknown) => {
  origInfo(chalk.blue(String(error)))
}

const app = express()
const PORT = process.env.VITE_PORT
const URI = process.env.VITE_URI

const middlewares = [addMessageField, validateBody]

//helps add 's' to 'http' protocol when cookies are set to 'secure'.
const secureSuffix = process.env.SecureCookies === 'true' ? 's' : ''
app.use(
  cors({
    origin: `http${secureSuffix}://localhost:5173`,
  }),
)
app.use(cookieParser())
app.use(
  express.json({
    verify: (req, res, buf: Buffer, encoding: BufferEncoding) => {
      const raw = buf.toString(encoding || 'utf-8')
      try {
        JSON.parse(raw)
      } catch {
        throw new HttpError('Invalid Json', 400)
      }
    },
  }),
)

app.use(middlewares)
app.use('/api', ApiRoutes())

// --- ERROR MIDDLEWARE ---
interface ErrorMiddleware {
  (err: HttpError, req: Request, res: Response, next: NextFunction): void
}

const errorMiddleware: ErrorMiddleware = (err, req, res, next) => {
  res.status(err.status || 500).send(err.message || 'Internal server error')
}

app.use(errorMiddleware)

app
  .listen(PORT, () => {
    console.log(`--- ${URI}:${PORT} ---`)
  })
  .on('error', (err) => {
    console.log('Server failed to start')
    console.error(err)
  })
