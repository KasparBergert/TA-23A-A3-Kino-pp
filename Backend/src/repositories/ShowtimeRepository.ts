import prisma from '../../db'
import type { showtime } from '@prisma/client'

class ShowtimeRepository {
  async getAll(where: { where: Object }): Promise<showtime[]> {
    return await prisma.showtime.findMany({
      where: {
        ...where,
        startsAt: {
          gt: new Date(), // computers time
        },
      },
    })
  }

  async createMany(showtime: Omit<showtime, 'id'>[]) {
    await prisma.showtime.createMany({
      data: showtime,
      skipDuplicates: true,
    })
  }

}

const showtimeRepository = new ShowtimeRepository()
export default showtimeRepository
