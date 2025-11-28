import { Request, Response } from 'express'
import seatService from '../services/SeatService.ts';

//gets all available theatres
export default async function getSeats(req: Request, res: Response) {
  try {
    const hall_id: number = Number(req.params.hall_id);
    const seats = await seatService.getAllByHallId(hall_id);
    return res.status(200).send(seats)
  } catch (err) {
    console.error(err)
    return res.status(400).send('Failed to get seats films')
  }
}
