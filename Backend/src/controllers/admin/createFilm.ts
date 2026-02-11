import { Request, Response } from 'express'
import filmRepository from '../../repositories/FilmRepository'

export default async function createFilm(req: Request, res: Response) {
  const { title, posterUrl, description, releaseDate, durationMin } = req.body
  if (!title || !posterUrl) return res.status(400).send('Missing fields')

  try {
    const film = await filmRepository.create({
      title,
      posterUrl,
      description: description ?? null,
      releaseDate: releaseDate ? new Date(releaseDate) : null,
      durationMin: durationMin ?? null,
    })
    res.status(201).json(film)
  } catch (err) {
    res.status(400).send('Could not create film')
  }
}
