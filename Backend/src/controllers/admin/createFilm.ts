import { Request, Response } from 'express'
import filmRepository from '../../repositories/FilmRepository'
import theatreRepository from '../../repositories/TheatreRepository'

export default async function createFilm(req: Request, res: Response) {
  const { title, posterUrl, description, releaseDate, durationMin, theatreId } = req.body
  if (!title || !posterUrl || !theatreId) return res.status(400).send('Missing fields')
  const theatreIdNum = Number(theatreId)
  if (Number.isNaN(theatreIdNum)) return res.status(400).send('Invalid theatreId')

  const theatre = await theatreRepository.getById(theatreIdNum)
  if (!theatre) return res.status(404).send('Theatre not found')

  try {
    const film = await filmRepository.create({
      title,
      posterUrl,
      description: description ?? null,
      releaseDate: releaseDate ? new Date(releaseDate) : null,
      durationMin: durationMin ?? null,
      theatreId: theatreIdNum,
    })
    res.status(201).json(film)
  } catch (err) {
    res.status(400).send('Could not create film')
  }
}
