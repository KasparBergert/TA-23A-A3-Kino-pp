import validateEmailAndPassword from './controllers/middleware/validateEmailAndPassword.ts'
import AuthController from './controllers/AuthController.ts'
import FilmController from './controllers/FilmController.ts'
import genreController from './controllers/GenreController.ts'
import theatreController from './controllers/TheatreController.ts'
import ShowtimeController from './controllers/ShowtimeController.ts'
import AdminShowtimeController from './controllers/AdminShowtimeController.ts'
import ActorController from './controllers/ActorController.ts'
import HallController from './controllers/HallController.ts'
import SeatPriceController from './controllers/SeatPriceController.ts'
import CheckoutController from './controllers/CheckoutController.ts'
import OrderController from './controllers/OrderController.ts'
import UserController from './controllers/UserController.ts'
import AnalyticsController from './controllers/AnalyticsController.ts'
import { genreCreateSchema, genreUpdateSchema, theatreCreateSchema } from './dto/schemas.ts'
import requireRole from './controllers/middleware/requireRole.ts'
import { userRole } from '@prisma/client'
import requireAuth from './controllers/middleware/requireAuth.ts'
import { Router } from 'express'
import { validateSchema } from './controllers/middleware/validateSchema.ts'

export default function ApiRoutes(): Router {
  const routes = Router()
  const authController = new AuthController()
  const filmController = new FilmController()
  const showtimeController = new ShowtimeController()
  const adminShowtimeController = new AdminShowtimeController()
  const actorController = new ActorController()
  const hallController = new HallController()
  const seatPriceController = new SeatPriceController()
  const checkoutController = new CheckoutController()
  const orderController = new OrderController()
  const userController = new UserController()
  const analyticsController = new AnalyticsController()
  
  // AUTH
  routes.post('/auth/users/login', validateEmailAndPassword, authController.login)
  routes.post('/auth/users/register', validateEmailAndPassword, authController.register)
  routes.get('/auth/jwt/refresh', authController.refresh)
  routes.get('/auth/me', authController.me)
  routes.post('/auth/logout', authController.logout)

  // SERVICES
  routes.get('/theatres', theatreController.get)
  routes.get('/halls', hallController.get)
  routes.get('/showtimes', ...showtimeController.get)
  routes.get('/showtimes/:showtimeId/:hallId/seats', showtimeController.getSeats)
  routes.get('/films', filmController.get)
  routes.get('/actors', actorController.get)
  routes.get('/genres', genreController.get)
  routes.get('/seat-prices', seatPriceController.get)
  routes.post('/checkout/mock', checkoutController.mockPay)
  routes.post('/checkout/cancel', checkoutController.cancelReservation)
  routes.post('/checkout/pay', requireAuth, checkoutController.payOrder)
  routes.get('/orders/me', requireAuth, orderController.getMyOrders)

  // ADMIN
  routes.post('/admin/films', requireRole(userRole.admin, userRole.super_admin), ...filmController.create)
  routes.patch('/admin/films/:filmId', requireRole(userRole.admin, userRole.super_admin), ...filmController.update)
  routes.delete('/admin/films/:filmId', requireRole(userRole.admin, userRole.super_admin), filmController.delete)
  routes.get('/admin/films/:filmId/genres', requireRole(userRole.admin, userRole.super_admin), filmController.getGenres)
  routes.get('/admin/analytics', requireRole(userRole.admin, userRole.super_admin), analyticsController.get)
  routes.post('/admin/genres', requireRole(userRole.admin, userRole.super_admin), validateSchema(genreCreateSchema), genreController.create)
  routes.patch('/admin/genres/:genreId', requireRole(userRole.admin, userRole.super_admin), validateSchema(genreUpdateSchema), genreController.edit)
  routes.delete('/admin/genres/:genreId', requireRole(userRole.admin, userRole.super_admin), genreController.delete)
  routes.post('/admin/showtimes/auto', requireRole(userRole.admin, userRole.super_admin), ...adminShowtimeController.autoSchedule)
  routes.delete('/admin/showtimes/:showtimeId', requireRole(userRole.admin, userRole.super_admin), adminShowtimeController.delete)

  // SUPER ADMIN
  routes.get('/super/users', requireRole(userRole.super_admin), userController.list)
  routes.post(
    '/super/users',
    requireRole(userRole.super_admin),
    validateEmailAndPassword,
    ...userController.create,
  )
  routes.patch('/super/users/:userId/role', requireRole(userRole.super_admin), ...userController.updateRole)
  routes.delete('/super/users/:userId', requireRole(userRole.super_admin), userController.delete)
  routes.post('/super/theatres', requireRole(userRole.super_admin), validateSchema(theatreCreateSchema), theatreController.create)
  routes.patch('/super/theatres/:theatreId', requireRole(userRole.super_admin), validateSchema(theatreCreateSchema), theatreController.edit)
  routes.delete('/super/theatres/:theatreId', requireRole(userRole.super_admin), theatreController.delete)

  return routes
}
