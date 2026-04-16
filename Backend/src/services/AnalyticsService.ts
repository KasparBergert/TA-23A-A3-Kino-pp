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
    const tickets = await this.getTicketCountsByShowtime()
    const showtimeIds = tickets.map((ticket) => ticket.showtimeId)
    const showtimes = await this.getShowtimeAnalyticsData(showtimeIds)
    const bookingsPerFilm = this.buildBookingsPerMovie(showtimes, tickets)
    const takenCounts = await this.countByShowtimeIds(showtimeIds)
    const occupancy = this.buildOccupancyRows(showtimes, takenCounts)
    const totalBookings = this.calculateTotalBookings(tickets)

    return {
      totalBookings,
      bookingsPerMovie: Object.values(bookingsPerFilm),
      occupancy,
    }
  }

  private async getTicketCountsByShowtime() {
    return await prisma.ticket.groupBy({
      by: ['showtimeId'],
      _count: { _all: true },
    })
  }

  private async getShowtimeAnalyticsData(showtimeIds: number[]) {
    return await prisma.showtime.findMany({
      where: { id: { in: showtimeIds } },
      select: {
        id: true,
        filmId: true,
        hall: { select: { capacity: true, name: true } },
        film: { select: { title: true } },
      },
    })
  }

  private buildBookingsPerMovie(
    showtimes: Array<{
      id: number
      filmId: number
      film: { title: string }
    }>,
    tickets: Array<{
      showtimeId: number
      _count: { _all: number }
    }>,
  ): Record<number, BookingsPerMovie> {
    return showtimes.reduce<Record<number, BookingsPerMovie>>((acc, showtime) => {
      const count = tickets.find((ticket) => ticket.showtimeId === showtime.id)?._count._all ?? 0
      const existing = acc[showtime.filmId]
      acc[showtime.filmId] = {
        filmId: showtime.filmId,
        filmTitle: showtime.film.title,
        bookings: (existing?.bookings ?? 0) + count,
      }
      return acc
    }, {})
  }

  private buildOccupancyRows(
    showtimes: Array<{
      id: number
      hall: { capacity: number; name: string }
      film: { title: string }
    }>,
    takenCounts: Record<number, number>,
  ): OccupancyRow[] {
    return showtimes.map((showtime) => {
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
  }

  private calculateTotalBookings(
    tickets: Array<{
      _count: { _all: number }
    }>,
  ): number {
    return tickets.reduce((sum, ticket) => sum + ticket._count._all, 0)
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
