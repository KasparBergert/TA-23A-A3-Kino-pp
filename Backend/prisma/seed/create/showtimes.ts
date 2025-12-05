import prisma from '../../../Backend/db'

export async function createShowtimes() {
  await prisma.showtimes.createMany({
    data: [
      {
        film_id: 1, hall_id: 1,
        starts_at: new Date('2025-11-01T18:00:00'),
        ends_at:   new Date('2025-11-01T20:00:00'),
        price: 12.5
      },
      {
        film_id: 2, hall_id: 2,
        starts_at: new Date('2025-11-01T20:30:00'),
        ends_at:   new Date('2025-11-01T22:45:00'),
        price: 10.0
      }
    ],
    skipDuplicates: true
  })
}
