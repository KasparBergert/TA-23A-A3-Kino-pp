import { seat, seatType } from '@prisma/client'


export default function createSeatMatrix(
  hallIds: number[],
): Omit<seat, 'id'>[] {
  return hallIds.flatMap(hallId => {
    const rowCount = Math.floor(Math.random() * 12) + 1
    const colCount = Math.floor(Math.random() * 12) + 1

    const rows = Array.from({ length: rowCount }, (_, i) =>
      String.fromCharCode('A'.charCodeAt(0) + i)
    )

    return rows.flatMap(row =>
      Array.from({ length: colCount }, (_, colIndex) => {
        const type =
          Math.random() < 0.7
            ? seatType.Standard
            : Math.random() < 0.5
              ? seatType.Premium
              : seatType.Double

        return {
          hallId,
          type,
          row,
          column: colIndex + 1,
        }
      })
    )
  })
}

