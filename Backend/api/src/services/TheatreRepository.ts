import prisma from '../../../database/db.ts'
import type { theatres } from '@prisma/client'

class TheatreRepository {
  /**
   * @returns all theatres
   */
  async getAll(): Promise<theatres[]> {
    return await prisma.theatres.findMany()
  }
}

const theatreRepository = new TheatreRepository()
export default theatreRepository
