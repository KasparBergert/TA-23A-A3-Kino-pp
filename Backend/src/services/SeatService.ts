import seatRepository from '../repositories/SeatRepository'
import { seat, seatPrices } from '@prisma/client'

class SeatService {
  async getAllByHallId(hallId: number): Promise<seat[]> {
    return await seatRepository.getByHallId(hallId)
  }


  /** @returns generated uuid to get the data afterwards */
  async saveUserChosenSeats(seat_ids: number[]): Promise<string> {
    //create random uid
    const uuid = crypto.randomUUID();
    await seatRepository.setUserChosenSeats(uuid, seat_ids);
    return uuid
  }

  async getUserChosenSeats(id: string){
    return await seatRepository.getUserChosenSeats(id);
  }

  async getPrices(): Promise<seatPrices[]>{
    return await seatRepository.getSeatPrices();
  }
}

const seatService = new SeatService()
export default seatService
