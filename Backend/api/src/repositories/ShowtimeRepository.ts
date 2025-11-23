import prisma from '../../db'
import type { showtimes } from '@prisma/client'
import ShowtimeFilters from '../../types/ShowtimeFilter'

class ShowtimeRepository {
  /**
   * @returns all theatres
   */
  async getAll(where: ShowtimeFilters): Promise<showtimes[]> {
    return await prisma.showtimes.findMany({ where })
  }

}

const showtimeRepository = new ShowtimeRepository()
export default showtimeRepository
