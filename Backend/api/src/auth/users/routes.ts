import { Router } from 'express'
import login from './login.ts'
import register from './register.ts'

/**
 * /users/login
 * /users/register
 */
export default function userRoutes(): Router {
  const routes = Router()
  routes.post('/login', login)
  routes.post('/register', register)
  return routes
}
