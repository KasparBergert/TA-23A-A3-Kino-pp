import prisma from '../../db'
import type { film, hall, showtime, theatre } from '@prisma/client'
import type ShowtimeFilters from '../../../shared/types/ShowtimeFilter.ts'
import type ShowtimeDTO from '../../../shared/types/ShowtimeDTO.ts'
import type SeatDTO from '../../../shared/types/SeatDTO.ts'
import showtimeFilter from '../filters/ShowtimeFilter.ts'
import { NotFoundError } from '../errors/HttpError'

class ShowtimeService {
  private localDateOnly(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  private async loadEntities<T>(
    ids: number[],
    loader: (id: number[]) => Promise<T[]>,
    notFound: string,
  ): Promise<T[]> {
    if (ids.length === 0) {
      return []
    }

    const result = await loader(ids)
    if (result.length === 0) {
      throw new Error(notFound)
    }
    return result
  }

  private async getShowtimeFilms(filmIds: number[]): Promise<film[]> {
    return await this.loadEntities(
      filmIds,
      async (ids) =>
        await prisma.film.findMany({
          where: { id: { in: ids } },
        }),
      'FILM_NOT_FOUND',
    )
  }

  private async getShowtimeHalls(hallIds: number[]): Promise<hall[]> {
    return await this.loadEntities(
      hallIds,
      async (ids) =>
        await prisma.hall.findMany({
          where: { id: { in: ids } },
        }),
      'HALL_NOT_FOUND',
    )
  }

  private async getShowtimeTheatres(hallIds: number[]): Promise<theatre[]> {
    return await this.loadEntities(
      hallIds,
      async (ids) =>
        await prisma.theatre.findMany({
          where: { id: { in: ids } },
        }),
      'THEATRE_NOT_FOUND',
    )
  }

  async exists(filter: ShowtimeFilters): Promise<boolean> {
    const showtimeFilters = await showtimeFilter.build(filter)
    const showtime = await prisma.showtime.findMany({
      where: showtimeFilters,
      orderBy: { startsAt: 'asc' },
    })
    return showtime.length !== 0
  }

  async getHallSeats(hallId: number, showtimeId: number): Promise<SeatDTO[]> {
    //much more efficient way of this algorithim would work with sets, but this works too.

    //hallSeats for showtime don't exist when showtime itself with the id's doesn't exist
    if (!(await this.exists({ hallId, showtimeId }))) {
      throw new Error("Cannot get seat's for a showtime that doesn't exist")
    }

    const seats = await prisma.seat.findMany({
      where: { hallId },
      orderBy: [{ row: 'asc' }, { column: 'asc' }],
    })
    const taken_seats = await prisma.showtimeTakenSeat.findMany({
      where: { showtimeId },
      select: { seatId: true },
    })
    const takenSeatIds = new Set(taken_seats.map((seat) => seat.seatId))

    return seats.map((seat) => {
      return {
        id: seat.id,
        hallId: seat.hallId,
        type: seat.type,
        row: seat.row,
        column: seat.column,
        isTaken: takenSeatIds.has(seat.id),
      }
    })
  }

  async getAll(filters: ShowtimeFilters): Promise<showtime[]> {
    const builtFilters = await showtimeFilter.build(filters)
    return await prisma.showtime.findMany({
      where: builtFilters,
      orderBy: { startsAt: 'asc' },
    })
  }

  async getById(showtimeId: number) {
    const showtime = await prisma.showtime.findUnique({
      where: { id: showtimeId },
      include: { film: true, hall: { include: { theatre: true } } },
    })

    if (!showtime) {
      throw new NotFoundError('Showtime not found')
    }

    return showtime
  }

  async getShowtimeDTOs(filters: ShowtimeFilters): Promise<ShowtimeDTO[]> {
    //creates the desired look for the showtime object
    const showtimes = await this.getAll(filters)
    // drop past showtimes for today
    if (filters.date) {
      const now = new Date()
      const today = this.localDateOnly(now)
      if (filters.date === today) {
        const nowTs = now.getTime()
        for (let i = showtimes.length - 1; i >= 0; i--) {
          if (new Date(showtimes[i].startsAt).getTime() < nowTs) {
            showtimes.splice(i, 1)
          }
        }
      }
    }

    if (showtimes.length === 0) {
      return []
    }

    const filmIds = showtimes.map((st) => st.filmId)
    const hallIds = showtimes.map((st) => st.hallId)

    const films = await this.getShowtimeFilms(filmIds)
    const halls = await this.getShowtimeHalls(hallIds)

    const showtimeIds = showtimes.map((st) => st.id)
    const takenSeatCounts = await this.countTakenSeatByShowtimeIds(showtimeIds)

    const theatreIds = halls.map((h) => h.theatreId)

    const theatres = await this.getShowtimeTheatres(theatreIds)

    //create the output
    return showtimes.map((st) => {
      const film = films.find((f) => st.filmId === f.id)!
      const hall = halls.find((h) => st.hallId === h.id)!
      const theatre = theatres.find((t) => t.id === hall.theatreId)!

      const taken = takenSeatCounts[st.id] ?? 0
      const totalSeats = hall.capacity
      const availableSeats = Math.max(totalSeats - taken, 0)
      const occupancyPercent = totalSeats === 0 ? 0 : Math.round((taken / totalSeats) * 100)

      return {
        id: st.id,
        endsAt: st.endsAt,
        isCanceled: st.isCanceled,
        startsAt: st.startsAt,
        film: {
          id: film.id,
          title: film.title,
          description: film.description,
          durationMin: film.durationMin,
          posterUrl: film.posterUrl,
          releaseDate: film.releaseDate,
          theatreId: film.theatreId,
          director: film.director,
          language: film.language,
          rating: film.rating,
          trailerUrl: film.trailerUrl,
        },
        hall: {
          id: hall.id,
          name: hall.name,
          capacity: hall.capacity,
        },
        theatre: {
          id: theatre.id,
          name: theatre.name,
          city: theatre.city,
        },
        stats: {
          totalSeats,
          availableSeats,
          occupancyPercent,
        },
      }
    })
  }

  private async countTakenSeatByShowtimeIds(showtimeIds: number[]): Promise<Record<number, number>> {
    if (showtimeIds.length === 0) return {}

    const grouped = await prisma.showtimeTakenSeat.groupBy({
      by: ['showtimeId'],
      _count: { _all: true },
      where: { showtimeId: { in: showtimeIds } },
    })

    return grouped.reduce<Record<number, number>>((acc, row) => {
      acc[row.showtimeId] = row._count._all
      return acc
    }, {})
  }
}

const showtimeService = new ShowtimeService()
export default showtimeService
