import prisma from '../../db'
import { seat, seatPrices } from '@prisma/client'

class SeatRepository {
  async getAll() {
    return await prisma.seat.findMany()
  }

  async getByHallId(hallId: number): Promise<seat[]> {
    return await prisma.seat.findMany({ where: { hallId } })
  }

  async createMany(seat: Omit<seat, 'id'>[]) {
    await prisma.seat.createMany({
      data: seat,
      skipDuplicates: true,
    })
  }

  async createManySeatPrices(seatPrices: seatPrices[]){
    await prisma.seatPrices.createMany({
      data: seatPrices,
      skipDuplicates: true
    })
  }

  async getSeatPrices(): Promise<seatPrices[]>{
    return await prisma.seatPrices.findMany()
  }

  }

const seatRepository = new SeatRepository()
export default seatRepository
