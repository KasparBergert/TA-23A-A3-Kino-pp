import prisma from '../../db.ts'
import type { theatre } from '@prisma/client'

class TheatreRepository {
  /**
   * @returns all theatre
   */
  async getAll(): Promise<theatre[]> {
    return await prisma.theatre.findMany()
  }

  async getById(theatreId: number): Promise<theatre | null> {
    return await prisma.theatre.findUnique({
      where: { id: theatreId },
    })
  }

  async getByIds(theatreIds: number[]): Promise<theatre[]> {
    return await prisma.theatre.findMany({
      where: { id: {in: theatreIds} },
    })
  }

  async createMany(theatre: Omit<theatre, 'id'>[]){
    await prisma.theatre.createMany({
      data: theatre,
      skipDuplicates: true
    })
  }

}

const theatreRepository = new TheatreRepository()
export default theatreRepository
