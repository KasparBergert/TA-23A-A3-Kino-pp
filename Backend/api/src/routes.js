import { Router } from 'express'
import login from './auth/users/login'
import register from './auth/users/register'
import access from './auth/JWT/access'

export default function CreateRoutes() {
  const router = Router()
  router.post('/auth/users', login)
  router.post('/auth/users', register)
  router.get('/auth/JWT', access)
  return router
}
