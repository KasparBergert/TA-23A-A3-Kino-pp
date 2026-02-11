import theatreService from '../services/TheatreService'
import { Request, Response } from 'express'

//gets all available theatres
export default async function getTheatres(req: Request, res: Response) {
  try {
    const theatreId = Number(req.query.theatreId)

    if (!Number.isNaN(theatreId)) {
      const theatre = await theatreService.getById(theatreId)
      return res.status(200).send(theatre)
    } else if (req.query.theatreId !== undefined && Number.isNaN(theatreId)) {
      return res.status(400).send(`Invalid theatreId ${typeof req.query.theatreId} instead of number`)
    }

    const city = typeof req.query.city === 'string' ? req.query.city : undefined
    const search = typeof req.query.search === 'string' ? req.query.search : undefined
    const orderBy =
      req.query.orderBy === 'city' || req.query.orderBy === 'name' ? (req.query.orderBy as 'city' | 'name') : 'name'

    const theatres = await theatreService.getAll({ city, search, orderBy })
    return res.status(200).send(theatres)
  } catch (err) {
    console.error(err)
    return res.status(400).send(`Error occured fetching theatres. \n${err}`)
  }
}
