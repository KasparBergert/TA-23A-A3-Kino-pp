import type { NextFunction, Request, Response } from 'express'
import { BadRequestError } from '../errors/HttpError'
import { FilmCreateInput, FilmUpdateInput, filmCreateSchema, filmUpdateSchema } from '../dto/schemas'
import filmService from '../services/FilmService'
import { validateSchema } from './middleware/validateSchema'

class FilmController {
  get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filmId = Number(req.query.filmId)
      const theatreId = Number(req.query.theatreId)

      if (!Number.isNaN(filmId)) {
        const film = await filmService.getWithExtras(filmId)
        return res.status(200).send(film)
      }

      if (!Number.isNaN(theatreId)) {
        const films = await filmService.getByTheatreId(theatreId)
        return res.status(200).send(films)
      }

      const films = await filmService.get()
      return res.status(200).send(films)
    } catch (err) {
      return next(new BadRequestError('Failed to fetch films'))
    }
  }

  create = [validateSchema(filmCreateSchema), async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(201).json(await filmService.create(req.body as FilmCreateInput))
    } catch (error) {
      return next(error)
    }
  }]

  update = [validateSchema(filmUpdateSchema), async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.filmId)
    if (Number.isNaN(id)) return next(new BadRequestError('Invalid id'))

    try {
      return res.status(200).json(await filmService.edit(id, req.body as FilmUpdateInput))
    } catch (error) {
      return next(error)
    }
  }]

  delete = async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.filmId)
    if (Number.isNaN(id)) return next(new BadRequestError('Invalid id'))

    try {
      await filmService.delete(id)
      return res.status(204).send()
    } catch (error) {
      return next(error)
    }
  }

  getGenres = async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.filmId)
    if (Number.isNaN(id)) return next(new BadRequestError('Invalid film id'))

    try {
      return res.json({ genreIds: await filmService.getGenreIds(id) })
    } catch (error) {
      return next(error)
    }
  }
}

export default FilmController
