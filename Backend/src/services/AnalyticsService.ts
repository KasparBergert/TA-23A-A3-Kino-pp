import prisma from '../../db'

export type BookingsPerMovie = { filmId: number; filmTitle: string; bookings: number }
export type OccupancyRow = {
  showtimeId: number
  filmTitle: string
  hallName: string
  occupancyPercent: number
  availableSeats: number
  totalSeats: number
}

class AnalyticsService {
  async getSummary() {
    const tickets = await prisma.ticket.groupBy({
      by: ['showtimeId'],
      _count: { _all: true },
    })

    const showtimeIds = tickets.map((ticket) => ticket.showtimeId)
    const showtimes = await prisma.showtime.findMany({
      where: { id: { in: showtimeIds } },
      select: {
        id: true,
        filmId: true,
        hall: { select: { capacity: true, name: true } },
        film: { select: { title: true } },
      },
    })

    const bookingsPerFilm = showtimes.reduce<Record<number, BookingsPerMovie>>((acc, showtime) => {
      const count = tickets.find((ticket) => ticket.showtimeId === showtime.id)?._count._all ?? 0
      const existing = acc[showtime.filmId]
      acc[showtime.filmId] = {
        filmId: showtime.filmId,
        filmTitle: showtime.film.title,
        bookings: (existing?.bookings ?? 0) + count,
      }
      return acc
    }, {})

    const takenCounts = await this.countByShowtimeIds(showtimeIds)

    const occupancy: OccupancyRow[] = showtimes.map((showtime) => {
      const totalSeats = showtime.hall.capacity
      const taken = takenCounts[showtime.id] ?? 0
      const availableSeats = Math.max(totalSeats - taken, 0)
      const occupancyPercent = totalSeats === 0 ? 0 : Math.round((taken / totalSeats) * 100)

      return {
        showtimeId: showtime.id,
        filmTitle: showtime.film.title,
        hallName: showtime.hall.name,
        occupancyPercent,
        availableSeats,
        totalSeats,
      }
    })

    const totalBookings = tickets.reduce((sum, ticket) => sum + ticket._count._all, 0)

    return {
      totalBookings,
      bookingsPerMovie: Object.values(bookingsPerFilm),
      occupancy,
    }
  }

  private async countByShowtimeIds(showtimeIds: number[]): Promise<Record<number, number>> {
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

const analyticsService = new AnalyticsService()
export default analyticsService
