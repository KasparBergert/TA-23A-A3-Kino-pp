import { Request, Response } from 'express'
import seatService from '../services/SeatService'

export async function getSeatPrices(req: Request, res: Response) {
  try {
    const prices = await seatService.getPrices()
    console.log(prices)
    res.status(200).send(prices)
  } catch (err) {
    console.log(err)
    return res.status(400).send('error occured fetching prices')
  }
}
