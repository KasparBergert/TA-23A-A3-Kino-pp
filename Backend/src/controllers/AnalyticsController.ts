import type { NextFunction, Request, Response } from 'express'
import analyticsService from '../services/AnalyticsService'

class AnalyticsController {
  get = async (req: Request, res: Response, next: NextFunction) => {
    void req
    try {
      return res.status(200).json(await analyticsService.getSummary())
    } catch (error) {
      return next(error)
    }
  }
}

export default AnalyticsController
