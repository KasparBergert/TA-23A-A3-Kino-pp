import { Request, Response } from 'express'
import { filmCreateSchema, FilmCreateInput } from '../../dto/schemas'
import { validateSchema } from '../middleware/validateSchema'
import filmService from '../../services/FilmService'
import prisma from '../../../db'

async function createFilmHandler(req: Request, res: Response) {
  const { title, posterUrl, description, releaseDate, durationMin, theatreId, genreIds } =
    req.body as FilmCreateInput

  let theatreIdNum: number | null = null
  if (theatreId !== undefined && theatreId !== null) {
    theatreIdNum = Number(theatreId)
    const theatre = await prisma.theatre.findUnique({
      where: { id: theatreIdNum },
    })
    if (!theatre) return res.status(404).send('Theatre not found')
  }

  try {
    const film = await prisma.film.create({
      data: {
        title,
        posterUrl,
        description: description ?? null,
        releaseDate: releaseDate ?? null,
        durationMin: durationMin ?? null,
        theatreId: theatreIdNum,
      },
    })
    await filmService.setFilmGenres(film.id, genreIds ?? [])
    res.status(201).json(film)
  } catch (err) {
    if ((err as Error).message === 'GENRE_NOT_FOUND') return res.status(404).send('Genre not found')
    res.status(400).send('Could not create film')
  }
}

const createFilm = [validateSchema(filmCreateSchema), createFilmHandler]

export default createFilm
