import prisma from '../../../database/db'
import type { showtimes } from '@prisma/client'

class ShowtimeRepository {
  /**
   * @returns all theatres
   */
  async getAll(): Promise<showtimes[]> {
    return await prisma.showtimes.findMany()
  }
}

const showtimeRepository = new ShowtimeRepository()
export default showtimeRepository
