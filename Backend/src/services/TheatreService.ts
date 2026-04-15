import type { theatre } from '@prisma/client'
import prisma from '../../db.ts'

class TheatreService {
  async getAll(filters?: { city?: string; search?: string; orderBy?: 'name' | 'city' }): Promise<theatre[]> {
    const where = {
      ...(filters?.city ? { city: filters.city } : {}),
      ...(filters?.search ? { name: { contains: filters.search, mode: 'insensitive' as const } } : {}),
    }

    const orderBy = filters?.orderBy ? { [filters.orderBy]: 'asc' as const } : { name: 'asc' as const }

    return await prisma.theatre.findMany({ where, orderBy })
  }

  async getById(theatre_id: number): Promise<theatre> {
    const res = await prisma.theatre.findUnique({
      where: { id: theatre_id },
    });
    if(res === null){
      throw new Error("THEATRE_NOT_FOUND")
    }
    return res;
  }

}

const theatreService = new TheatreService()
export default theatreService
