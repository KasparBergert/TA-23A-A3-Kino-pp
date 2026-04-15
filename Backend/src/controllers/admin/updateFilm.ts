import { Request, Response } from 'express'
import { filmUpdateSchema, FilmUpdateInput } from '../../dto/schemas'
import { validateSchema } from '../middleware/validateSchema'
import filmService from '../../services/FilmService'
import prisma from '../../../db'

async function updateFilmHandler(req: Request, res: Response) {
  const id = Number(req.params.filmId)
  if (Number.isNaN(id)) return res.status(400).send('Invalid id')

  const body = req.body as FilmUpdateInput

  let theatreId: number | null | undefined
  if (body.theatreId !== undefined) {
    if (body.theatreId === null) {
      theatreId = null
    } else {
      theatreId = Number(body.theatreId)
      const theatre = await prisma.theatre.findUnique({
        where: { id: theatreId },
      })
      if (!theatre) return res.status(404).send('Theatre not found')
    }
  }

  try {
    const film = await prisma.film.update({
      where: { id },
      data: {
        title: body.title,
        posterUrl: body.posterUrl,
        description: body.description,
        releaseDate: body.releaseDate ?? undefined,
        durationMin: body.durationMin,
        theatreId,
      },
    })
    if (body.genreIds) {
      await filmService.setFilmGenres(film.id, body.genreIds)
    }
    res.status(200).json(film)
  } catch {
    res.status(404).send('Film not found')
  }
}

const updateFilm = [validateSchema(filmUpdateSchema), updateFilmHandler]

export default updateFilm
