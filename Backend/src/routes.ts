import { Router } from 'express'
import login from './controllers/auth/login.ts'
import register from './controllers/auth/register.ts'
import refresh from './controllers/auth/refresh.ts'
import { getShowtimes } from './controllers/getShowtimes.ts'
import validateEmailAndPassword from './controllers/middleware/validateEmailAndPassword.ts'
import getTheatres from './controllers/getTheatres.ts'
import getHalls from './controllers/getHalls.ts'
import getSeats from './controllers/getSeats.ts'
import getActors from './controllers/getActors.ts'
import getFilms from './controllers/getFilms.ts'
import getGenres from './controllers/getGenres.ts'
import requireRole from './controllers/middleware/requireRole.ts'
import { userRole } from '@prisma/client'
import createFilm from './controllers/admin/createFilm.ts'
import updateFilm from './controllers/admin/updateFilm.ts'
import deleteFilm from './controllers/admin/deleteFilm.ts'
import getAnalytics from './controllers/admin/getAnalytics.ts'
import createGenre from './controllers/admin/createGenre.ts'
import updateGenre from './controllers/admin/updateGenre.ts'
import deleteGenre from './controllers/admin/deleteGenre.ts'
import getFilmGenres from './controllers/admin/getFilmGenres.ts'
import listUsers from './controllers/super/listUsers.ts'
import updateUserRole from './controllers/super/updateUserRole.ts'
import deleteUser from './controllers/super/deleteUser.ts'
import autoScheduleShowtimes from './controllers/admin/autoScheduleShowtimes.ts'
import deleteShowtime from './controllers/admin/deleteShowtime.ts'
import createTheatre from './controllers/super/createTheatre.ts'
import updateTheatre from './controllers/super/updateTheatre.ts'
import deleteTheatre from './controllers/super/deleteTheatre.ts'
import createUser from './controllers/super/createUser.ts'
import me from './controllers/auth/me.ts'
import logout from './controllers/auth/logout.ts'
import { getSeatPrices } from './controllers/getSeatPrices.ts'
import mockPay from './controllers/checkout/mockPay.ts'
import cancelReservation from './controllers/checkout/cancelReservation.ts'

export default function ApiRoutes(): Router {
  const routes = Router()

  // AUTH
  routes.post('/auth/users/login', validateEmailAndPassword, login)
  routes.post('/auth/users/register', validateEmailAndPassword, register)
  routes.get('/auth/jwt/refresh', refresh)
  routes.get('/auth/me', me)
  routes.post('/auth/logout', logout)

  // SERVICES
  routes.get('/theatres', getTheatres)
  routes.get('/halls', getHalls)
  routes.get('/showtimes', ...getShowtimes)
  routes.get('/showtimes/:showtimeId/:hallId/seats', getSeats)
  routes.get('/films', getFilms)
  routes.get('/actors', getActors)
  routes.get('/genres', getGenres)
  routes.get('/seat-prices', getSeatPrices)
  routes.post('/checkout/mock', mockPay)
  routes.post('/checkout/cancel', cancelReservation)

  // ADMIN
  routes.post('/admin/films', requireRole(userRole.admin, userRole.super_admin), ...createFilm)
  routes.patch('/admin/films/:filmId', requireRole(userRole.admin, userRole.super_admin), ...updateFilm)
  routes.delete('/admin/films/:filmId', requireRole(userRole.admin, userRole.super_admin), deleteFilm)
  routes.get('/admin/films/:filmId/genres', requireRole(userRole.admin, userRole.super_admin), getFilmGenres)
  routes.get('/admin/analytics', requireRole(userRole.admin, userRole.super_admin), getAnalytics)
  routes.post('/admin/genres', requireRole(userRole.admin, userRole.super_admin), ...createGenre)
  routes.patch('/admin/genres/:genreId', requireRole(userRole.admin, userRole.super_admin), ...updateGenre)
  routes.delete('/admin/genres/:genreId', requireRole(userRole.admin, userRole.super_admin), deleteGenre)
  routes.post('/admin/showtimes/auto', requireRole(userRole.admin, userRole.super_admin), ...autoScheduleShowtimes)
  routes.delete('/admin/showtimes/:showtimeId', requireRole(userRole.admin, userRole.super_admin), deleteShowtime)

  // SUPER ADMIN
  routes.get('/super/users', requireRole(userRole.super_admin), listUsers)
  routes.post(
    '/super/users',
    requireRole(userRole.super_admin),
    validateEmailAndPassword,
    ...createUser,
  )
  routes.patch('/super/users/:userId/role', requireRole(userRole.super_admin), ...updateUserRole)
  routes.delete('/super/users/:userId', requireRole(userRole.super_admin), deleteUser)
  routes.post('/super/theatres', requireRole(userRole.super_admin), ...createTheatre)
  routes.patch('/super/theatres/:theatreId', requireRole(userRole.super_admin), ...updateTheatre)
  routes.delete('/super/theatres/:theatreId', requireRole(userRole.super_admin), deleteTheatre)

  return routes
}
