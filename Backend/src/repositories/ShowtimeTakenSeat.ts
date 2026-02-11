import { showtimeTakenSeat } from '@prisma/client'
import prisma from '../../db'

class SeatAvailabilityRepository {
  async isTaken(showtimeId: number, seatId: number) {
    return await prisma.showtimeTakenSeat.findFirst({
      where: { showtimeId, seatId },
    })
  }

  async getTakenSeats(showtimeId: number): Promise<showtimeTakenSeat[]> {
    return await prisma.showtimeTakenSeat.findMany({ where: { showtimeId } })
  }

  async countByShowtimeIds(showtimeIds: number[]): Promise<Record<number, number>> {
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

const seatAvailabilityRepository = new SeatAvailabilityRepository()
export default seatAvailabilityRepository
