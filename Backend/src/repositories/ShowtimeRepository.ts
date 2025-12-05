import prisma from '../../db'
import type { showtimes } from '@prisma/client'
import ShowtimeFilters from '../../../shared/types/ShowtimeFilter'

class ShowtimeRepository {
  /**
   * @returns all theatres
   */
  async getAll(where: ShowtimeFilters): Promise<showtimes[]> {
    return await prisma.showtimes.findMany({
      where: {
        ...where,
        starts_at: {
          gt: new Date(), // computers time
        },
      },
    })
  }

  async createMany(showtimes: Omit<showtimes, 'id'>[]){
    await prisma.showtimes.createMany({
      data: showtimes,
      skipDuplicates: true
    })
  }

}

const showtimeRepository = new ShowtimeRepository()
export default showtimeRepository
