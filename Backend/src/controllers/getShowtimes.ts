import type ShowtimeFilter from '../../../shared/types/ShowtimeFilter'
import showtimeService from '../services/ShowtimeService'
import { Request, Response } from 'express'

//gets all available theatres
export default async function getShowtimes(req: Request, res: Response) {
  try {
    const filters: ShowtimeFilter = req.query
    const showtimes = await showtimeService.getList(filters)
    return res.status(200).send(showtimes)
  } catch (err) {
    console.error(err)
    return res.status(400).send('Failed to fetch showtimes')
  }
}
