import { Request, Response } from 'express'
import actorService from '../services/ActorService'

export default async function getActors(req: Request, res: Response) {
  try {
    const film_id = Number(req.query.film_id)
    if (Number.isNaN(film_id)) {
      return res.status(400).send('Invalid film id')
    }

    const actors = await actorService.getByFilmId(film_id)

    return res.status(200).send(actors)
  } catch (err) {
    console.error(err)
    return res.status(404).send('Failed to fetch film')
  }
}
