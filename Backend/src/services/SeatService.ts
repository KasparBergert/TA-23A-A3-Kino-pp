import seatRepository from '../repositories/SeatRepository'
import SeatDTO from '../../../shared/types/SeatDTO'

class SeatService {
  async getAllByHallId(hall_id: number): Promise<SeatDTO[]> {
    return await seatRepository.getAllByHallId(hall_id)
  }
}

const seatService = new SeatService()
export default seatService
