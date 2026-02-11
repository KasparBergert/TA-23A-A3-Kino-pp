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

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (filters.date) {
      const start = new Date(filters.date)
      start.setHours(0, 0, 0, 0)
      const end = new Date(filters.date)
      end.setHours(23, 59, 59, 999)
      where.startsAt = { gte: start, lte: end }
    } else {
      where.startsAt = {
        ...(where.startsAt as Prisma.DateTimeFilter | undefined),
        gte: today,
      }
    }

    if (filters.filmTitle) {
      const filmIds = await prisma.film
        .findMany({
          where: { title: { contains: filters.filmTitle, mode: 'insensitive' } },
          select: { id: true },
        })
        .then((rows) => rows.map((row) => row.id))
      where.filmId = where.filmId
        ? { in: filmIds.filter((id) => (where.filmId as Prisma.IntFilter).in?.includes(id) ?? true) }
        : { in: filmIds }
    }

    return where
  }
}

const showtimeFilter = new ShowtimeFilter()
export default showtimeFilter
