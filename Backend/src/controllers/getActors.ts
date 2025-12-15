import { Request, Response } from 'express'
import actorService from '../services/ActorService'

export default async function getActors(req: Request, res: Response) {
  try {
    const filmId = Number(req.query.filmId)
    if (Number.isNaN(filmId)) {
      return res.status(400).send('Invalid film id')
    }

    const actors = await actorService.getByFilmId(filmId)

    return res.status(200).send(actors)
  } catch (err) {
    console.error(err)
    return res.status(404).send('Failed to fetch film')
  }
}
