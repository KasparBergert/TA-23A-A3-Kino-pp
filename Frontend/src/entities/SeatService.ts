import type SeatDTO from '../../../shared/types/SeatDTO'
import client from '../utils/api'

async function get(hall_id: number): Promise<SeatDTO[]> {
  const res = await client.get(`/showtimes/${hall_id}/seats`)

  if (res.length === 0) {
    throw 'No seats found for this hall'
  }

  return res
}

export const seatService = {
  get,
}
