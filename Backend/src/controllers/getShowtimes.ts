import type ShowtimeFilter from '../../../shared/types/ShowtimeFilter'
import showtimeService from '../services/ShowtimeService'
import { Request, Response } from 'express'
import { showtimeQuerySchema } from '../dto/schemas'

export const getShowtimes = [
  async (req: Request, res: Response) => {
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
  },
]
