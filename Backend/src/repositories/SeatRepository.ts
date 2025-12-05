import prisma from '../../db'
import { seats, seats_type } from '@prisma/client'

class SeatRepository {
  /**
   * @param hall_id halls id in the database
   * @returns seats with the hall_id
   */
  async getAllByHallId(hall_id: number): Promise<seats[]> {
    return await prisma.seats.findMany({
      where: {
        hall_id: hall_id,
        NOT: {
          type: seats_type.Filler,
        },
      },
    })
  }



  async createMany(seats: Omit<seats, 'id'>[]) {
    await prisma.seats.createMany({
      data: seats,
      skipDuplicates: true,
    })
  }
}

const seatRepository = new SeatRepository()
export default seatRepository
