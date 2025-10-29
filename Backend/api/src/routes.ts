import { Router } from 'express'

// handlers
import login from './controllers/auth/login.ts'
import register from './controllers/auth/register.ts'
import refresh from './controllers/auth/refresh.ts'
import theatres from './controllers/services/theatres.ts'
import showtimes from './controllers/services/showtimes.ts'

export default function ApiRoutes(): Router {
  const routes = Router()

  // AUTH
  routes.post('/auth/users/login', login)
  routes.post('/auth/users/register', register)
  routes.get('/auth/jwt/refresh', refresh)

  // SERVICES
  routes.get('/services/theatres', theatres)
  routes.post('/services/showtimes', showtimes)

  return routes
}
