import type { NextFunction, Request, Response } from 'express'
import { BadRequestError } from '../errors/HttpError'
import type { CRUDService } from '../services/interface/CRUDService'

type ResourceControllerOptions = {
  deleteReturnsBody?: boolean
}

class ResourceController<TEntity, TCreate, TEdit = TCreate> {
  constructor(
    private readonly service: CRUDService<TEntity, TCreate, TEdit>,
    private readonly idParam: string,
    private readonly options: ResourceControllerOptions = {},
  ) {}

  get = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(200).json(await this.service.get())
    } catch (error) {
      return next(error)
    }
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(201).json(await this.service.create(req.body as TCreate))
    } catch (error) {
      return next(error)
    }
  }

  edit = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.json(await this.service.edit(this.parseId(req), req.body as TEdit))
    } catch (error) {
      return next(error)
    }
  }

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deleted = await this.service.delete(this.parseId(req))
      if (this.options.deleteReturnsBody) {
        return res.json(deleted)
      }
      return res.status(204).send()
    } catch (error) {
      return next(error)
    }
  }

  private parseId(req: Request): number {
    const id = Number(req.params[this.idParam])
    if (Number.isNaN(id)) {
      throw new BadRequestError('Invalid id')
    }
    return id
  }
}

export default ResourceController
