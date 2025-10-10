import { Router } from 'express'
import getTheatres from './getTheatres.ts'

export default function ServicesRoutes(): Router {
  const routes = Router()
  routes.get('/theatres', getTheatres)
  return routes
}
