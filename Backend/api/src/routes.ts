import { Router } from 'express'
import AuthRoutes from './auth/routes.ts'
import ServicesRoutes from './services/routes.ts'

export default function ApiRoutes(): Router {
  const routes = Router()
  routes.use('/auth', AuthRoutes())
  routes.use('/services', ServicesRoutes())
  return routes
}
