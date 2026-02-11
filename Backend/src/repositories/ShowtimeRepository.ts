import prisma from '../../db'
import type { Prisma, showtime } from '@prisma/client'

class ShowtimeRepository {
  async getAll(where: Prisma.showtimeWhereInput): Promise<showtime[]> {
    return await prisma.showtime.findMany({
      where,
      orderBy: { startsAt: 'asc' },
    })
  }

  async createMany(showtime: Omit<showtime, 'id'>[]) {
    await prisma.showtime.createMany({
      data: showtime,
      skipDuplicates: true,
    })
  }

  async delete(id: number) {
    await prisma.showtime.delete({ where: { id } })
  }

}

const showtimeRepository = new ShowtimeRepository()
export default showtimeRepository
