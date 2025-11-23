import prisma from '../../../database/db'
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
      where: { id: hall_id }
    })
  }
}

const hallRepositroy = new HallRepositroy()
export default hallRepositroy
