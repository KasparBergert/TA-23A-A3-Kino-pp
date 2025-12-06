import { seatLocation } from '@prisma/client'
import prisma from '../../db'

class SeatLocationsRepository {
  async getByHallId(seat_id: number): Promise<seatLocation[]> {
    return await prisma.seatLocation.findMany({ where: { seat_id } })
  }

  async getbySeatId(seat_id: number): Promise<number[]> {
    const result = await prisma.seatLocation.findMany({ where: { seat_id }, select: { id: true } })
    return result.map((obj) => obj.id)
  }

  async createMany(locations: Omit<seatLocation, 'id'>[]) {
    await prisma.seatLocation.createMany({
      data: locations,
      skipDuplicates: true,
    })
  }
}

const seatLocationsRepository = new SeatLocationsRepository()
export default seatLocationsRepository
