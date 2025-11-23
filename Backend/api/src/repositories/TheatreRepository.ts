import prisma from '../../db.ts'
import type { theatres } from '@prisma/client'

class TheatreRepository {
  /**
   * @returns all theatres
   */
  async getAll(): Promise<theatres[]> {
    return await prisma.theatres.findMany()
  }

  async getById(theatre_id: number): Promise<theatres | null> {
    return await prisma.theatres.findUnique({
      where: { id: theatre_id },
    })
  }

  async getByIds(theatre_ids: number[]): Promise<theatres[] | null> {
    return await prisma.theatres.findMany({
      where: { id: {in: theatre_ids} },
    })
  }
}

const theatreRepository = new TheatreRepository()
export default theatreRepository
