import { Router } from 'express'

// handlers
import login from './controllers/auth/login.ts'
import register from './controllers/auth/register.ts'
import refresh from './controllers/auth/refresh.ts'
import theatres from './controllers/theatres.ts'
import showtimes from './controllers/showtimes.ts'
import validateEmailAndPassword from './controllers/middleware/validateEmailAndPassword.ts'

export default function ApiRoutes(): Router {
  const routes = Router()

  // AUTH
  routes.post('/auth/users/login', validateEmailAndPassword, login)
  routes.post('/auth/users/register', validateEmailAndPassword, register)
  routes.get('/auth/jwt/refresh', refresh)

  // SERVICES
  routes.get('/theatres', (req, res) => {
    return theatres(req, res)
  })
  routes.get('/showtimes', (req, res) => {
    return showtimes(req, res)
  })

  return routes
}
