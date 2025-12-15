import type SeatDTO from '../../../shared/types/SeatDTO'
import client from '../utils/api'

async function get(showtimeId: number, hallId: number): Promise<SeatDTO[]> {
  const res = await client.get(`/showtimes/${showtimeId}/${hallId}/seats`)

  if (res.length === 0) {
    throw 'No seats found for this hall'
  }

  return res
}

export const seatService = {
  get,
}
