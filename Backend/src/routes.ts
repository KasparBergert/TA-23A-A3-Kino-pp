import { Router } from 'express'
import login from './controllers/auth/login.ts'
import register from './controllers/auth/register.ts'
import refresh from './controllers/auth/refresh.ts'
import getShowtimes from './controllers/getShowtimes.ts'
import validateEmailAndPassword from './controllers/middleware/validateEmailAndPassword.ts'
import getTheatres from './controllers/getTheatres.ts'
import getFilms from './controllers/getFIlms.ts'
import getFilmById from './controllers/getFilmById.ts'
import getSeats from './controllers/getSeats.ts'

export default function ApiRoutes(): Router {
  const routes = Router()

  // AUTH
  routes.post('/auth/users/login', validateEmailAndPassword, login)
  routes.post('/auth/users/register', validateEmailAndPassword, register)
  routes.get('/auth/jwt/refresh', refresh)

  // SERVICES
  routes.get('/theatres', getTheatres)
  routes.get('/showtimes', getShowtimes)
  routes.get('/showtimes/:hall_id/seats', getSeats)
  routes.get('/films/:id', getFilmById)
  routes.get('/films', getFilms)

  return routes
}
