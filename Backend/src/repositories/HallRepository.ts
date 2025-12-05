import prisma from '../../db'
import type { halls } from '@prisma/client'

class HallRepositroy {
  /**
   * @returns all halls
   */
  async getAll(): Promise<halls[]> {
    return await prisma.halls.findMany()
  }

  async getById(hall_id: number): Promise<halls | null> {
    return await prisma.halls.findUnique({
      where: { id: hall_id },
    })
  }

  async getByIds(hall_ids: number[]): Promise<halls[] | null> {
    return await prisma.halls.findMany({
      where: { id: { in: hall_ids } },
    })
  }

  async createMany(halls: Omit<halls, 'id'>[]){
    await prisma.halls.createMany({
      data:halls,
      skipDuplicates: true
    })
  }
}

const hallRepositroy = new HallRepositroy()
export default hallRepositroy
