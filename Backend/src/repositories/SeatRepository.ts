import prisma from '../../db'
import { seats } from '@prisma/client'

class SeatRepository {
  async getAll() {
    return await prisma.seats.findMany()
  }

  async getByHallId(hall_id: number) {
    return await prisma.seats.findMany({ where: { hall_id } })
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
