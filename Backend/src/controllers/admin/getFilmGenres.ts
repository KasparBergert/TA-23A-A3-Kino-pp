import { Request, Response } from 'express'
import filmRepository from '../../repositories/FilmRepository'

export default async function getFilmGenres(req: Request, res: Response) {
  const id = Number(req.params.filmId)
  if (Number.isNaN(id)) return res.status(400).send('Invalid film id')

  try {
    const genreIds = await filmRepository.getGenreIdsByFilmId(id)
    return res.json({ genreIds })
  } catch (error) {
    console.error(error)
    return res.status(404).send('Film not found')
  }
}
