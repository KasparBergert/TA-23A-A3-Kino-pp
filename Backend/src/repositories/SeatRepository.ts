import prisma from '../../db'
import SeatDTO from '../../../shared/types/SeatDTO'

class SeatRepository {
  /**
   * @param hall_id halls id in the database
   * @returns seats with the hall_id
   */
  async getAllByHallId(hall_id: number): Promise<SeatDTO> {
    return await prisma.seats.findMany({
      where: { hall_id: hall_id },
      omit:{
        id: true
      }
    })
  }
}

const seatRepository = new SeatRepository()
export default seatRepository
