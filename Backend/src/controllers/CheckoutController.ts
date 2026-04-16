import type { NextFunction, Request, Response } from 'express'
import { BadRequestError, UnauthorizedError } from '../errors/HttpError'
import checkoutService from '../services/Checkout/CheckoutService'

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
      const orderId = this.getOrderIdOrThrow(req)
      return res.status(200).json(await checkoutService.cancelReservation(orderId))
    } catch (error) {
      return next(error)
    }
  }

  payOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authEmail = this.getAuthEmailOrThrow(req)
      const orderId = this.getOrderIdOrThrow(req)
      return res.json(await checkoutService.payOrder(authEmail, orderId))
    } catch (error) {
      return next(error)
    }
  }

  private getOrderIdOrThrow(req: Request): string | number {
    const { orderId } = req.body as { orderId?: string | number }
    if (!orderId) {
      throw new BadRequestError('orderId required')
    }
    return orderId
  }

  private getAuthEmailOrThrow(req: Request): string {
    const auth = (req as any).auth as { email?: string }
    if (!auth?.email) {
      throw new UnauthorizedError('Unauthorized')
    }
    return auth.email
  }
}

export default CheckoutController
