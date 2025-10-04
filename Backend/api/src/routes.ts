import { Router } from 'express'
import AuthRoutes from './auth/routes.ts'

export default function ApiRoutes(): Router {
  const routes = Router()
  routes.use('/auth', AuthRoutes())
  return routes
}
