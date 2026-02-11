import prisma from '../../db.ts'
import type { theatre } from '@prisma/client'

class TheatreRepository {
  /**
   * @returns all theatre
   */
  async getAll(params?: { city?: string; search?: string; orderBy?: 'name' | 'city' }): Promise<theatre[]> {
    const where = {
      ...(params?.city ? { city: params.city } : {}),
      ...(params?.search ? { name: { contains: params.search, mode: 'insensitive' as const } } : {}),
    }

    const orderBy = params?.orderBy ? { [params.orderBy]: 'asc' as const } : { name: 'asc' as const }

    return await prisma.theatre.findMany({ where, orderBy })
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

  async create(data: Omit<theatre, 'id'>): Promise<theatre> {
    return await prisma.theatre.create({ data })
  }

  async update(id: number, data: Partial<Omit<theatre, 'id'>>): Promise<theatre> {
    return await prisma.theatre.update({ where: { id }, data })
  }

  async delete(id: number): Promise<theatre> {
    return await prisma.theatre.delete({ where: { id } })
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
