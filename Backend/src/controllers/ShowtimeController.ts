import type { Request, Response } from 'express'
import type ShowtimeFilter from '../../../shared/types/ShowtimeFilter'
import { showtimeQuerySchema } from '../dto/schemas'
import showtimeService from '../services/ShowtimeService'

class ShowtimeController {
  get = [async (req: Request, res: Response) => {
    try {
      const parsed = showtimeQuerySchema.safeParse(req.query)
      if (!parsed.success) {
        const errors = parsed.error.issues.map((i) => `${i.path.join('.') || 'query'}: ${i.message}`)
        return res.status(400).json({ errors })
      }
      const filters: ShowtimeFilter = parsed.data
      const showtimes = await showtimeService.getShowtimeDTOs(filters)
      return res.status(200).send(showtimes)
    } catch (err) {
      console.error(err)
      return res.status(400).send('Failed to fetch showtimes')
    }
  }]

  getSeats = async (req: Request, res: Response) => {
    try {
      const hallId = Number(req.params.hallId)
      const showtimeId = Number(req.params.showtimeId)
      if (!hallId || !showtimeId) {
        return res.status(400).send(`hallId or showtimeId invalid. ${hallId}, ${showtimeId}`)
      }

      const seats = await showtimeService.getHallSeats(hallId, showtimeId)
      return res.status(200).send(seats)
    } catch (err) {
      console.error(err)
      return res.status(400).send('Failed to get seats')
    }
  }
}

export default ShowtimeController
