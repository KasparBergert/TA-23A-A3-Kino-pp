import type { NextFunction, Request, Response } from 'express'
import { BadRequestError, UnauthorizedError } from '../errors/HttpError'
import checkoutService from '../services/CheckoutService'

class CheckoutController {
  mockPay = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(201).json(await checkoutService.createReservation(req.body))
    } catch (error) {
      return next(error)
    }
  }

  cancelReservation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId } = req.body as { orderId?: string | number }
      if (!orderId) return next(new BadRequestError('orderId required'))
      return res.status(200).json(await checkoutService.cancelReservation(orderId))
    } catch (error) {
      return next(error)
    }
  }

  payOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const auth = (req as any).auth as { email?: string }
      if (!auth?.email) return next(new UnauthorizedError('Unauthorized'))

      const { orderId } = req.body as { orderId?: string | number }
      if (!orderId) return next(new BadRequestError('orderId required'))
      return res.json(await checkoutService.payOrder(auth.email, orderId))
    } catch (error) {
      return next(error)
    }
  }
}

export default CheckoutController
