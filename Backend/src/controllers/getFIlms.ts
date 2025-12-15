import { Request, Response } from 'express'
import filmService from '../services/FilmService'

//gets all available theatres
export default async function getFilms(req: Request, res: Response) {
  try {
    const filmId = Number(req.query.filmId)

    if (Number.isNaN(filmId)) {
      const films = await filmService.getAll()
      return res.status(200).send(films)
    } else {
      const film = await filmService.getById(filmId)
      return res.status(200).send(film)
    }
  } catch (err) {
    console.error(err)
    return res.status(400).send('Failed to fetch films')
  }
}
