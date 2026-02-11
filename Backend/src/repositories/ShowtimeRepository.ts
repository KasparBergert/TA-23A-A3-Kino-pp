import prisma from '../../db'
import type { Prisma, showtime } from '@prisma/client'

class ShowtimeRepository {
  async getAll(where: Prisma.showtimeWhereInput): Promise<showtime[]> {
    const startsAtFilter =
      typeof where.startsAt === 'object' && where.startsAt !== null
        ? { ...(where.startsAt as Prisma.DateTimeFilter), gt: new Date() }
        : { gt: new Date() }

    return await prisma.showtime.findMany({
      where: { ...where, startsAt: startsAtFilter },
      orderBy: { startsAt: 'asc' },
    })
  }

  async createMany(showtime: Omit<showtime, 'id'>[]) {
    await prisma.showtime.createMany({
      data: showtime,
      skipDuplicates: true,
    })
  }

}

const showtimeRepository = new ShowtimeRepository()
export default showtimeRepository
