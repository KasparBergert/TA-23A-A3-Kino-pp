import showtimeService from '../services/ShowtimeService'
import { Request, Response } from 'express'

interface Filters {
  film_id: undefined | number
  theatre_id: undefined | number
}

//gets all available theatres
export default async function showtimes(req: Request, res: Response) {
  try {

    const showtimes = await showtimeService.getList();

    console.log(showtimes);

    res.status(200).send({ code: 'VAL-0000', showtimes: showtimes })
  } catch (err) {
    console.error(err)
    res.status(400).send({ code: 'VAL-0002', message: 'Failed to fetch showtimes' })
  }
}
