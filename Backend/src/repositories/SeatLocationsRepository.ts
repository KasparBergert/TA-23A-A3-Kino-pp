import { seatlocation } from '@prisma/client'
import prisma from '../../db'

class SeatLocationsRepository {
  async getManylocations(seat_ids: number[]) {
    return await prisma.seatlocation.findMany({
      where: { seat_id: { in: seat_ids } },
    })
  }

  async createMany(locations: Omit<seatlocation, 'id'>[]) {
    await prisma.seatlocation.createMany({
      data: locations,
      skipDuplicates: true,
    })
  }
}

const seatLocationsRepository = new SeatLocationsRepository()
export default seatLocationsRepository
