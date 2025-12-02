import { Request, Response } from 'express'
import filmService from '../services/FilmService'
import actorService from '../services/ActorService'

export default async function getFilmById(req: Request, res: Response) {
  try {
    const film_id = Number(req.params.id)
    if (Number.isNaN(film_id)) {
      return res.status(400).send({ message: 'Invalid film id' })
    }

    const [film, actors] = await Promise.all([
      filmService.getById(film_id),
      actorService.getByFilmId(film_id),
    ])

    return res.status(200).send({ film, actors })
  } catch (err) {
    console.error(err)
    return res.status(404).send({ message: 'Failed to fetch film' })
  }
}
