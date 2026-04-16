import type { NextFunction, Request, Response } from 'express'
import { BadRequestError } from '../errors/HttpError'
import { autoScheduleSchema } from '../dto/schemas'
import adminShowtimeService from '../services/AdminShowtimeService'
import { validateSchema } from './middleware/validateSchema'

class AdminShowtimeController {
  autoSchedule = [validateSchema(autoScheduleSchema), async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(201).json(await adminShowtimeService.autoSchedule(req.body))
    } catch (error) {
      return next(error)
    }
  }]

  delete = async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.showtimeId)
    if (Number.isNaN(id)) return next(new BadRequestError('Invalid id'))

    try {
      await adminShowtimeService.deleteById(id)
      return res.status(204).send()
    } catch (error) {
      return next(error)
    }
  }
}

export default AdminShowtimeController
