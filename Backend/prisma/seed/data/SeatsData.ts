import { seats, seats_type, seatlocation, halls, seats_status } from '@prisma/client'
import seatRepository from '../../../src/repositories/SeatRepository'
import seatLocationsRepository from '../../../src/repositories/SeatLocationsRepository'

function letterForRow(r: number): string {
  return String.fromCharCode('A'.charCodeAt(0) + r)
}

//creates location
function location(row: string, col: number, seat: seats): Omit<seatlocation, 'id'> {
  return {
    seat_id: seat.id,
    row_label: row,
    column: col,
  }
}

function createSeatMatrix(hall_id: number, rows_types: seats_type[]): Omit<seats, 'id'>[] {
  return rows_types.flatMap((type) => ({
    type,
    price: 20,
    status: Math.floor(Math.random() * 2) === 0 ? seats_status.available : seats_status.taken,
    hall_id,
  }))
}

function createSeatLocationsMatrix(
  seats: seats[],
  rowCount: number,
  colCount: number,
): Omit<seatlocation, 'id'>[] {
  const out: Omit<seatlocation, 'id'>[] = []
  let seatIndex = 0

  for (let r = 0; r < rowCount; r++) {
    const rowLabel = letterForRow(r)

    for (let col = 1; col <= colCount; col++) {
      const seat = seats[seatIndex]
      if (!seat) break

      if (seat.type === seats_type.Double) {
        out.push(location(rowLabel, col, seat))
        out.push(location(rowLabel, col + 1, seat))
        col++
      } else {
        out.push(location(rowLabel, col, seat))
      }

      seatIndex++
    }
  }

  return out
}

export default async function genereateHallSeating(halls: halls[]) {
  const rows = [
    seats_type.Standard,
    seats_type.Standard,
    seats_type.Standard,
    seats_type.Standard,
    seats_type.Standard,
    seats_type.Standard,
    seats_type.Standard,
    seats_type.Double,
    seats_type.Double,
    seats_type.Premium,
    seats_type.Premium,
  ]

  const columns: number = 20

  //is is a flat map, but when ordered or put in a grid, it would fit like a rectangle
  const seatMatrix = halls.flatMap((hall) => {
    for (let i = 0; i < columns; i++) {
      return createSeatMatrix(hall.id, Object.values(rows))
    }
    return [] // only returned when columns is 0
  })

  await seatRepository.createMany(seatMatrix)
  const allSeats = await seatRepository.getAll()

  const locationMatrix = createSeatLocationsMatrix(allSeats, rows.length, columns)
  await seatLocationsRepository.createMany(locationMatrix)
}
