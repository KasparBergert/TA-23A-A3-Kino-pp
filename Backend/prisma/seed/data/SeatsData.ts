import { seat, seatType } from '@prisma/client'


export default function createSeatMatrix(
  hallIds: number[],
): Omit<seat, 'id'>[] {
  return hallIds.flatMap(hallId => {
    const rowCount = Math.floor(Math.random() * 24) + 1

    return Array.from({ length: rowCount }, () => {
      const type =
        Math.random() < 0.7 // 70% chance
          ? seatType.Standard
          : Math.random() < 0.5 // 50% chance
            ? seatType.Premium
            : seatType.Double

      return {
        hallId,
        type,
      }
    })
  })
}
