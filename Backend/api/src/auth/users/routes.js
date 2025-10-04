import { Router } from 'express'
import login from './login.js'
import register from './register.js'

/**
 * /users/login
 * /users/register
 */
export default function userRoutes() {
  const routes = Router()
  routes.post('/login', login)
  routes.post('/register', register)
  return routes
}
