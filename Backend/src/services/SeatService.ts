import seatRepository from '../repositories/SeatRepository'
import SeatDTO from '../../../shared/types/SeatDTO'
import seatLocationsRepository from '../repositories/SeatLocationsRepository'


class SeatService {
  async getAllByHallId(hall_id: number): Promise<SeatDTO[]> {
    const seats = await seatRepository.getByHallId(hall_id)
    const seat_ids = seats.map((seat) => seat.id)
    const seatLocations = await seatLocationsRepository.getMany(seat_ids)

    //link seat locations with seats
    //not removing duplicate seats, because coulumn and row values are needed in the frontend (even for double seats)
    return seats.flatMap((seat) => {
      const seats: SeatDTO[] = []
      for (let i = 0; i < seatLocations.length; i++) {
        const location = seatLocations[i]
        if (seat.id === location.seat_id) {
          seats.push({
            id: seat.id,
            type: seat.type,
            status: seat.status,
            price: seat.price,
            row_label: location.row_label,
            column: location.column,
          })
        }
      }
      return seats
    })
  }



}

const seatService = new SeatService()
export default seatService
