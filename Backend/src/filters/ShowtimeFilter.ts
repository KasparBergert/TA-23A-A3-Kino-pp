import type ShowtimeFilters from '../../../shared/types/ShowtimeFilter.ts'
import type { Prisma } from '@prisma/client'

class ShowtimeFilter {
  private parseLocalDate(date: string): Date {
    const [year, month, day] = date.split('-').map(Number)
    return new Date(year, month - 1, day)
  }

  /**
   * @param filters - object of filters
   * @returns prisma where object with filters inside it.
   */
  async build(filters: ShowtimeFilters): Promise<Prisma.showtimeWhereInput> {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const startsAt = filters.date
      ? (() => {
          const start = this.parseLocalDate(filters.date!)
          start.setHours(0, 0, 0, 0)

          const end = this.parseLocalDate(filters.date!)
          end.setHours(23, 59, 59, 999)

          return { gte: start, lte: end }
        })()
      : { gte: today }

    const hall =
      filters.hallId || filters.theatreId
        ? {
            ...(filters.hallId ? { id: Number(filters.hallId) } : {}),
            ...(filters.theatreId ? { theatreId: Number(filters.theatreId) } : {}),
          }
        : undefined

    const film =
      filters.genreId || filters.filmTitle
        ? {
            ...(filters.filmTitle ? { title: { contains: filters.filmTitle } } : {}),
            ...(filters.genreId
              ? {
                  filmGenres: {
                    some: { genreId: Number(filters.genreId) },
                  },
                }
              : {}),
          }
        : undefined

    return {
      ...(filters.showtimeId ? { id: Number(filters.showtimeId) } : {}),
      ...(filters.filmId ? { filmId: Number(filters.filmId) } : {}),
      ...(hall ? { hall } : {}),
      ...(film ? { film } : {}),
      startsAt,
    }
  }
}

const showtimeFilter = new ShowtimeFilter()
export default showtimeFilter
