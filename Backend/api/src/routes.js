import { Router } from 'express'
import login from './auth/users/login.js'
import register from './auth/users/register.js'
import access from './auth/JWT/refresh.js'

export default function CreateRoutes() {
  const router = Router()
  router.post('/auth/users/login', login)
  router.post('/auth/users/register', register)
  router.get('/auth/JWT', access)
  return router
}
