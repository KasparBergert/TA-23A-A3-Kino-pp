import { Request, Response } from 'express'
import showtimeService from '../services/ShowtimeService.ts';

//gets all seats available for showtime
export default async function getSeats(req: Request, res: Response) {
  try {
    const hallId: number = Number(req.params.hallId);
    const showtimeId: number = Number(req.params.showtimeId);
    if(!hallId || !showtimeId){
      return res.status(400).send(`hallId or showtimeId invalid. ${hallId}, ${showtimeId}`)
    }

    const seats = await showtimeService.getHallSeats(hallId, showtimeId);
    return res.status(200).send(seats)
  } catch (err) {
    console.error(err)
    return res.status(400).send('Failed to get seats')
  }
}
