import type { theatre } from '@prisma/client'
import prisma from '../../db'
import type { TheatreCreateInput } from '../dto/schemas'
import { BadRequestError, NotFoundError } from '../errors/HttpError'


class TheatreService {
  async get(filters?: { city?: string; search?: string; orderBy?: 'name' | 'city' }): Promise<theatre[]> {
    const where = {
      ...(filters?.city ? { city: filters.city } : {}),
      ...(filters?.search ? { name: { contains: filters.search } } : {}),
    }

    const orderBy = filters?.orderBy ? { [filters.orderBy]: 'asc' as const } : { name: 'asc' as const }

    return await prisma.theatre.findMany({ where, orderBy })
  }

  async getById(theatre_id: number): Promise<theatre> {
    const res = await prisma.theatre.findUnique({
      where: { id: theatre_id },
    })
    if (res === null) {
      throw new NotFoundError('Theatre not found')
    }
    return res
  }

  async create(data: TheatreCreateInput): Promise<theatre> {
    try {
      return await prisma.theatre.create({ data })
    } catch {
      throw new BadRequestError('Could not create theatre')
    }
  }

  async edit(id: number, data: TheatreCreateInput): Promise<theatre> {
    try {
      return await prisma.theatre.update({
        where: { id },
        data,
      })
    } catch {
      throw new NotFoundError('Theatre not found')
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await prisma.theatre.delete({ where: { id } })
    } catch {
      throw new NotFoundError('Theatre not found')
    }
  }
}

const theatreService = new TheatreService()
export default theatreService
