import { Request, Response } from 'express'
import filmRepository from '../../repositories/FilmRepository'
import theatreRepository from '../../repositories/TheatreRepository'
import { filmCreateSchema, FilmCreateInput } from '../../dto/schemas'
import { validateSchema } from '../middleware/validateSchema'

async function createFilmHandler(req: Request, res: Response) {
  const { title, posterUrl, description, releaseDate, durationMin, theatreId } = req.body as FilmCreateInput

  let theatreIdNum: number | null = null
  if (theatreId !== undefined && theatreId !== null) {
    theatreIdNum = Number(theatreId)
    const theatre = await theatreRepository.getById(theatreIdNum)
    if (!theatre) return res.status(404).send('Theatre not found')
  }

  try {
    const film = await filmRepository.create({
      title,
      posterUrl,
      description: description ?? null,
      releaseDate: releaseDate ?? null,
      durationMin: durationMin ?? null,
      theatreId: theatreIdNum,
    })
    res.status(201).json(film)
  } catch (err) {
    res.status(400).send('Could not create film')
  }
}

const createFilm = [validateSchema(filmCreateSchema), createFilmHandler]

export default createFilm
