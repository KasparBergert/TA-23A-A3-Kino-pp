import type { NextFunction, Request, Response } from 'express'
import type { theatre } from '@prisma/client'
import { BadRequestError } from '../errors/HttpError'
import type { TheatreCreateInput } from '../dto/schemas'
import theatreService from '../services/TheatreService'
import ResourceController from './ResourceController'

const theatreResourceController = new ResourceController<theatre, TheatreCreateInput>(theatreService, 'theatreId')

const theatreController = {
  get: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const theatreId = Number(req.query.theatreId)

      if (!Number.isNaN(theatreId)) {
        const theatre = await theatreService.getById(theatreId)
        return res.status(200).send(theatre)
      } else if (req.query.theatreId !== undefined && Number.isNaN(theatreId)) {
        throw new BadRequestError(`Invalid theatreId ${typeof req.query.theatreId} instead of number`)
      }

      const city = typeof req.query.city === 'string' ? req.query.city : undefined
      const search = typeof req.query.search === 'string' ? req.query.search : undefined
      const orderBy =
        req.query.orderBy === 'city' || req.query.orderBy === 'name'
          ? (req.query.orderBy as 'city' | 'name')
          : 'name'

      const theatres = await theatreService.get({ city, search, orderBy })
      return res.status(200).send(theatres)
    } catch (err) {
      return next(err)
    }
  },
  create: theatreResourceController.create,
  edit: theatreResourceController.edit,
  delete: theatreResourceController.delete,
}

export default theatreController
