import './env.ts'
import './utils/setupConsoleColors.ts'
import express, { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import cookieParser from 'cookie-parser'
import ApiRoutes from './src/routes.ts'
import chalk from 'chalk'
import cors from 'cors'
import { getErrorMessage } from './utils/getErrorMessage.ts'

const app = express()
const PORT = process.env.VITE_PORT
const URI = process.env.VITE_URI

//helps add 's' to 'http' protocol when cookies are set to 'secure'.
const secureSuffix = process.env.SecureCookies === 'true' ? 's' : ''
const allowedOrigins = [
  `http${secureSuffix}://localhost:5173`,
  `http${secureSuffix}://localhost:5174`,
]
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
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
        throw new Error('Invalid Json')
      }
    },
  }),
)

app.use('/api', ApiRoutes())

// --- ERROR MIDDLEWARE ---

const errorMiddleware = (
  err: ErrorRequestHandler,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.status(500).json({ error: getErrorMessage(err) })
}

app.use(errorMiddleware)

app
  .listen(PORT, () => {
    console.log(`\n\n--- STARTED DEV SERVER ---\n`)
    console.log(`--- ${URI}:${PORT} ---\n`)
  })
  .on('error', (err) => {
    console.log('Server failed to start')
    console.error(err)
  })
