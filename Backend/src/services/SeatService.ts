import seatRepository from '../repositories/SeatRepository'
import SeatDTO from '../../../shared/types/SeatDTO'
import seatLocationsRepository from '../repositories/SeatLocationsRepository'

class SeatService {
  async getAllByHallId(hall_id: number): Promise<SeatDTO[]> {
    const seats = await seatRepository.getByHallId(hall_id)
    const seat_ids = seats.map((seat) => seat.id)
    const seatLocations = await seatLocationsRepository.getManylocations(seat_ids)

    //link seat locations with seats
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
          continue // already found the seat location, so move on to the next one
        }
      }
      return seats
    })
  }
}

const seatService = new SeatService()
export default seatService
