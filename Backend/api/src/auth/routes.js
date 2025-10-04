import { Router } from 'express'
import JwtRoutes from './JWT/routes.js'
import userRoutes from './users/routes.js'

export default function AuthRoutes() {
  const routes = Router()
  routes.use('/users', userRoutes())
  routes.use('/jwt', JwtRoutes())
  return routes
}
