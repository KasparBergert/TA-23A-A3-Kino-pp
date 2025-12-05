import { seats_type } from '@prisma/client'
import prisma from '../../../Backend/db'

interface SeatCreate {
  hall_id: number
  row_label: string
  seat_number: number
  is_available: number
  type: seats_type
  price: number
}

export async function createSeats() {
  const generateSeatType = (): seats_type => {
    const types = [seats_type.Double, seats_type.Premium, seats_type.Standard];
    return types[Math.floor(Math.random() * types.length)];
  }

  const makeMatrix = (hall_id: number, rows: string[], columns: number): SeatCreate[] =>
    rows.flatMap((row) =>
      Array.from({ length: columns }, (_, i) => ({
        hall_id,
        row_label: row,
        seat_number: i + 1,
        is_available: Math.floor(Math.random() * 2), // 0 availalbe - 1 unavailable
        price: 20,
        type: generateSeatType(),
      })),
    )

  const rows = ['A', 'B', 'C', 'D', 'E']

  await prisma.seats.createMany({
    data: makeMatrix(1, rows, rows.length + 4),
    skipDuplicates: true,
  })

  await prisma.seats.createMany({
    data: makeMatrix(2, rows, rows.length),
    skipDuplicates: true,
  })
}
