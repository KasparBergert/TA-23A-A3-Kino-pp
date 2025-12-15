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
}

const seatAvailabilityRepository = new SeatAvailabilityRepository()
export default seatAvailabilityRepository
