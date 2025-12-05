import { seats, seats_type } from '@prisma/client'
import { allHalls } from '../utils/fetch'

const generateRandomSeatType = (): seats_type => {
  const types = [seats_type.Double, seats_type.Premium, seats_type.Standard]
  return types[Math.floor(Math.random() * types.length)]
}

function createSeatMatrix(
  rows: string[],
  columns: number,
  rows_seat_types: seats_type[],
): Omit<seats, 'id'>[] {

  const seatMatrix: Omit<seats, 'id'>[] = [];

  allHalls.forEach((hall) => {
    for (let row = 0; row < rows.length; row++) {
      const seatTypes = rows_seat_types[row]
      for (let column = 0; column < columns; column++) {
        const seat: Omit<seats, 'id'> = {
          hall_id: hall.id,
          row_label: rows[row],
          seat_number: row,
          is_available: Math.floor(Math.random() * 2),
          price: 20,
          type: seatTypes,
        }
        seatMatrix.push(seat);
      }
    }
  })

  return seatMatrix;
}
const rows = ['A', 'B', 'C', 'D', 'E']

createSeatMatrix(rows, rows.length, rows.map(row => {
  return
}))

//makes a seat map for each hall
return allHalls.flatMap((hall) => {
  return createSeatMatrix(hall.id, rows, rows.length)
})

export const seatsSeed: Omit<seats, 'id'>[] = createSeatMatrix()
