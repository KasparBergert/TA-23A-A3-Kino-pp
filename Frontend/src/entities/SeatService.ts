import type SeatDTO from '../../../shared/types/SeatDTO'
import client from '../utils/api'

async function get(showtimeId: number, hallId: number): Promise<SeatDTO[]> {
  const res = await client.get(`/showtimes/${showtimeId}/${hallId}/seats`)

  if (res.length === 0) {
    throw 'No seats found for this hall'
  }

  return res
}

/** sends the selected seat data to the server */
async function sendSeats(seat_ids: number[]){
  await client.post('/selected-seats/', { seat_ids })
}

async function getPrices(): Promise<{type: string, price: number}[]>{
  const res = await client.get(`/seat-prices`)

  if (res.length === 0) {
    throw 'no seat prices set'
  }

  return res
}


export const seatService = {
  get,
  getPrices,
  sendSeats
}
