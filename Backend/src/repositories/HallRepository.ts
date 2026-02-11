import prisma from '../../db'
import type { hall } from '@prisma/client'

class HallRepositroy {
  /**
   * @returns all halls
   */
  async getAll(): Promise<hall[]> {
    return await prisma.hall.findMany()
  }

  async getById(hallId: number): Promise<hall | null> {
    return await prisma.hall.findUnique({
      where: { id: hallId },
    })
  }

  async getByTheatreId(theatreId: number): Promise<hall[]> {
    return await prisma.hall.findMany({
      where: { theatreId },
      orderBy: { id: 'asc' },
    })
  }

  async getByIds(hallIds: number[]): Promise<hall[]> {
    return await prisma.hall.findMany({
      where: { id: { in: hallIds } },
    })
  }

  async createMany(hall: Omit<hall, 'id'>[]){
    await prisma.hall.createMany({
      data:hall,
      skipDuplicates: true
    })
  }
}

const hallRepositroy = new HallRepositroy()
export default hallRepositroy
