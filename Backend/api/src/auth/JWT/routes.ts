import { Router } from 'express'
import refresh from './refresh.ts'

/**
 * /jwt/refresh
 */
export default function JwtRoutes() {
  const routes = Router()
  routes.get('/refresh', refresh)
  return routes
}
