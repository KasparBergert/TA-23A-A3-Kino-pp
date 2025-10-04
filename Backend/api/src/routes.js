import { Router } from 'express'
import AuthRoutes from './auth/routes.js'

export default function ApiRoutes() {
  const routes = Router()
  routes.use('/auth', AuthRoutes())

  return routes
}
