import seatRepository from '../repositories/SeatRepository'
import { seat } from '@prisma/client'

class SeatService {
  async getAllByHallId(hallId: number): Promise<seat[]> {
    return await seatRepository.getByHallId(hallId)
  }
}

const seatService = new SeatService()
export default seatService
