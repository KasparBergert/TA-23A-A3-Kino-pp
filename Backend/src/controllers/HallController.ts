import type { Request, Response } from 'express'
import prisma from '../../db'

class HallController {
  get = async (req: Request, res: Response) => {
    try {
      const theatreId = req.query.theatreId ? Number(req.query.theatreId) : null
      if (theatreId !== null && Number.isNaN(theatreId)) {
        return res.status(400).send('Invalid theatreId')
      }

      const halls = theatreId
        ? await prisma.hall.findMany({
            where: { theatreId },
            orderBy: { id: 'asc' },
          })
        : await prisma.hall.findMany()

      return res.status(200).send(halls)
    } catch (err) {
      console.error(err)
      return res.status(400).send('Failed to fetch halls')
    }
  }
}

export default HallController
