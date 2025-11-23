import theatreService from '../services/TheatreRepository'
import { Request, Response } from 'express'

//gets all available theatres
export default async function getTheatres(req: Request, res: Response) {
  try {
    const theatres = await theatreService.getAll()
    return res.status(200).send({ theatres })
  } catch (err) {
    console.error(err)
    return res.status(400).send('Error occured fetching theatres')
  }
}
