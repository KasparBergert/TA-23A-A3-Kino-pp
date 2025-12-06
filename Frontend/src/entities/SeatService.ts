import type SeatDTO from '../../../shared/types/SeatDTO'
import client from '../utils/api'

async function fetchSeats(hall_id: number): Promise<SeatDTO[]> {
  const res = await client.get(`/showtimes/${hall_id}/seats`)

  if (res.length === 0) {
    throw 'No seats found for this hall'
  }

  return res
}

async function getByRow(hall_id: number): Promise<SeatDTO[][]> {
  const seats = await fetchSeats(hall_id)

  const seatRows: SeatDTO[][] = []

  //get all the unique rows
  const rows = new Set<string>()
  seats.forEach((seat) => {
    rows.add(seat.row_label)
  })

  rows.forEach((row) => {
    seatRows.push(seats.filter((seat) => seat.row_label === row))
  })

  return seatRows
}

export const seatService = {
  fetchSeats,
  getByRow,
}
