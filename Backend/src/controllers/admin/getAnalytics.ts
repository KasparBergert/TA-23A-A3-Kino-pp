import { Request, Response } from 'express'
import prisma from '../../../db'
import seatAvailabilityRepository from '../../repositories/ShowtimeTakenSeat.ts'

type BookingsPerMovie = { filmId: number; filmTitle: string; bookings: number }
type OccupancyRow = {
  showtimeId: number
  filmTitle: string
  hallName: string
  occupancyPercent: number
  availableSeats: number
  totalSeats: number
}

export default async function getAnalytics(_req: Request, res: Response) {
  try {
    const tickets = await prisma.ticket.groupBy({
      by: ['showtimeId'],
      _count: { _all: true },
    })

    const showtimeIds = tickets.map((t) => t.showtimeId)
    const showtimes = await prisma.showtime.findMany({
      where: { id: { in: showtimeIds } },
      select: {
        id: true,
        filmId: true,
        hall: { select: { capacity: true, name: true } },
        film: { select: { title: true } },
      },
    })

    const bookingsPerFilm = showtimes.reduce<Record<number, BookingsPerMovie>>((acc, st) => {
      const count = tickets.find((t) => t.showtimeId === st.id)?._count._all ?? 0
      const existing = acc[st.filmId]
      acc[st.filmId] = {
        filmId: st.filmId,
        filmTitle: st.film.title,
        bookings: (existing?.bookings ?? 0) + count,
      }
      return acc
    }, {})

    const takenCounts = await seatAvailabilityRepository.countByShowtimeIds(showtimeIds)

    const occupancy: OccupancyRow[] = showtimes.map((st) => {
      const totalSeats = st.hall.capacity
      const taken = takenCounts[st.id] ?? 0
      const availableSeats = Math.max(totalSeats - taken, 0)
      const occupancyPercent = totalSeats === 0 ? 0 : Math.round((taken / totalSeats) * 100)
      return {
        showtimeId: st.id,
        filmTitle: st.film.title,
        hallName: st.hall.name,
        occupancyPercent,
        availableSeats,
        totalSeats,
      }
    })

    const totalBookings = tickets.reduce((sum, t) => sum + t._count._all, 0)

    return res.status(200).json({
      totalBookings,
      bookingsPerMovie: Object.values(bookingsPerFilm),
      occupancy,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).send('Failed to load analytics')
  }
}
