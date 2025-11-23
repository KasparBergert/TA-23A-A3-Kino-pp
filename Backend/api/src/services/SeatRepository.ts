import prisma from '../../../database/db'
import type { seats } from '@prisma/client'

class SeatRepository {
  /**
   * @param hall_id halls id in the database
   * @returns seats with the hall_id
   */
  async getByHallId(hall_id: number): Promise<seats[]> {
    const seats = await prisma.seats.findMany({
      where: { hall_id: hall_id },
    })
    return seats
  }
}

const seatRepository = new SeatRepository()
export default seatRepository
