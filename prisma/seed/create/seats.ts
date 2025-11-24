import prisma from '../../../Backend/db'

interface SeatCreate {
  hall_id: number
  row_label: string
  seat_number: number
  is_available: number
}

export async function createSeats() {
  const makeMatrix = (hall_id: number, rows: string[], columns: number): SeatCreate[] =>
    rows.flatMap(row =>
      Array.from({ length: columns }, (_, i) => ({
        hall_id,
        row_label: row,
        seat_number: i + 1,
        is_available: 1,
      }))
    )

  const rows = ['A', 'B', 'C', 'D', 'E']

  await prisma.seats.createMany({
    data: makeMatrix(1, rows, rows.length),
    skipDuplicates: true,
  })

  await prisma.seats.createMany({
    data: makeMatrix(2, rows, rows.length),
    skipDuplicates: true,
  })
}
