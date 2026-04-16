import prisma from '../../db'
import { seat, seatPrices } from '@prisma/client'

class SeatService {
  async getAllByHallId(hallId: number): Promise<seat[]> {
    return await prisma.seat.findMany({
      where: { hallId },
      orderBy: [{ row: 'asc' }, { column: 'asc' }],
    })
  }


  /** @returns generated uuid to get the data afterwards */
  async saveUserChosenSeats(seat_ids: number[]): Promise<string> {
    void seat_ids
    throw new Error('USER_CHOSEN_SEATS_NOT_SUPPORTED')
  }

  async getUserChosenSeats(id: string){
    void id
    throw new Error('USER_CHOSEN_SEATS_NOT_SUPPORTED')
  }

  async getPrices(): Promise<seatPrices[]>{
    return await prisma.seatPrices.findMany();
  }
}

const seatService = new SeatService()
export default seatService
