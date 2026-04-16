import type { Request, Response } from 'express'
import seatService from '../services/SeatService'

class SeatPriceController {
  get = async (req: Request, res: Response) => {
    void req
    try {
      const prices = await seatService.getPrices()
      return res.status(200).send(prices)
    } catch (err) {
      console.log(err)
      return res.status(400).send('error occured fetching prices')
    }
  }
}

export default SeatPriceController
