import theatreService from '../services/TheatreService'
import { Request, Response } from 'express'

//gets all available theatres
export default async function getTheatres(req: Request, res: Response) {
  try {
    const theatreId = Number(req.query.theatreId)

    if (!Number.isNaN(theatreId)) {
      const theatre = await theatreService.getById(theatreId)
      return res.status(200).send(theatre)
    } else if (theatreId) {
      return res.status(400).send(`Invalid theatreId ${typeof theatreId} instead of number`)
    }

    const theatres = await theatreService.getAll()
    return res.status(200).send(theatres)
  } catch (err) {
    console.error(err)
    return res.status(400).send(`Error occured fetching theatres. \n${err}`)
  }
}
