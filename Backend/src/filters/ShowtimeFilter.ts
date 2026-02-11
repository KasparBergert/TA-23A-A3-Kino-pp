import type ShowtimeFilters from '../../../shared/types/ShowtimeFilter.ts'
import prisma from '../../db.ts'
import type { Prisma } from '@prisma/client'

//filter layer
class ShowtimeFilter {
  /**
   * @param filters - object of filters
   * @returns prisma where object with filters inside it.
   */
  async build(filters: ShowtimeFilters): Promise<Prisma.showtimeWhereInput> {
    const where: Prisma.showtimeWhereInput = {}

    if (filters.filmId) {
      where.filmId = Number(filters.filmId)
    }

    if (filters.theatreId) {
      const hallIds = await prisma.hall
        .findMany({
          where: { theatreId: Number(filters.theatreId) },
          select: { id: true },
        })
        .then((halls) => halls.map((h) => h.id))

      where.hallId = { in: hallIds }
    }

    if (filters.hallId) {
      const existing = where.hallId as Prisma.IntFilter | undefined
      const existingIds = existing?.in ?? []
      where.hallId = { in: [...existingIds, Number(filters.hallId)] }
    }

    if (filters.showtimeId) {
      where.id = Number(filters.showtimeId)
    }

    if (filters.genreId) {
      const filmIds = await prisma.filmGenre
        .findMany({
          where: { genreId: Number(filters.genreId) },
          select: { filmId: true },
        })
        .then((rows) => rows.map((row) => row.filmId))
      where.filmId = { in: filmIds }
    }

    if (filters.date) {
      const start = new Date(filters.date)
      start.setUTCHours(0, 0, 0, 0)
      const end = new Date(filters.date)
      end.setUTCHours(23, 59, 59, 999)
      where.startsAt = { gte: start, lte: end }
    }

    return where
  }
}

const showtimeFilter = new ShowtimeFilter()
export default showtimeFilter
