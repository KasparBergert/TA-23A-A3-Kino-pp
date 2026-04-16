import type { Request, Response } from 'express'
import actorService from '../services/ActorService'

class ActorController {
  get = async (req: Request, res: Response) => {
    try {
      const filmId = Number(req.query.filmId)
      if (req.query.filmId !== undefined) {
        if (Number.isNaN(filmId)) return res.status(400).send('Invalid film id')
        const actors = await actorService.getByFilmId(filmId)
        return res.status(200).send(actors)
      }

      const actors = await actorService.getAll()
      return res.status(200).send(actors)
    } catch (err) {
      console.error(err)
      return res.status(404).send('Failed to fetch film')
    }
  }
}

export default ActorController
