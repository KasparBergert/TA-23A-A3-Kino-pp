import prisma from '../../db'
import type { showtime } from '@prisma/client'
import ShowtimeFilters from '../../../shared/types/ShowtimeFilter'

class ShowtimeRepository {
  /**
   * @returns all theatres
   */
  async getAll(where: ShowtimeFilters): Promise<showtime[]> {
    return await prisma.showtime.findMany({
      where: {
        ...where,
        startsAt: {
          gt: new Date(), // computers time
        },
      },
    })
  }

  async createMany(showtime: Omit<showtime, 'id'>[]){
    await prisma.showtime.createMany({
      data: showtime,
      skipDuplicates: true
    })
  }

}

const showtimeRepository = new ShowtimeRepository()
export default showtimeRepository
