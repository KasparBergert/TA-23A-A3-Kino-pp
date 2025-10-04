import { Router } from 'express'
import JwtRoutes from './JWT/routes.ts'
import userRoutes from './users/routes.ts'

export default function AuthRoutes(): Router {
  const routes = Router()
  routes.use('/users', userRoutes())
  routes.use('/jwt', JwtRoutes())
  return routes
}
