import prisma from '../../../Backend/db'

export async function createHalls(theatres: { id: number }[]) {
  await prisma.halls.createMany({
    data: [
      { name: 'Hall A', theatre_id: theatres[0].id, capacity: 150 },
      { name: 'Hall B', theatre_id: theatres[0].id, capacity: 80 }
    ],
    skipDuplicates: true,
  })
}
