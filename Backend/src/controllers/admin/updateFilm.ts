import { Request, Response } from 'express'
import filmRepository from '../../repositories/FilmRepository'
import theatreRepository from '../../repositories/TheatreRepository'

export default async function updateFilm(req: Request, res: Response) {
  const id = Number(req.params.filmId)
  if (Number.isNaN(id)) return res.status(400).send('Invalid id')

  let theatreId: number | undefined
  if (req.body.theatreId !== undefined) {
    theatreId = Number(req.body.theatreId)
    if (Number.isNaN(theatreId)) return res.status(400).send('Invalid theatreId')
    const theatre = await theatreRepository.getById(theatreId)
    if (!theatre) return res.status(404).send('Theatre not found')
  }

  try {
    const film = await filmRepository.update(id, {
      title: req.body.title,
      posterUrl: req.body.posterUrl,
      description: req.body.description,
      releaseDate: req.body.releaseDate ? new Date(req.body.releaseDate) : undefined,
      durationMin: req.body.durationMin,
      theatreId,
    })
    res.status(200).json(film)
  } catch {
    res.status(404).send('Film not found')
  }
}
