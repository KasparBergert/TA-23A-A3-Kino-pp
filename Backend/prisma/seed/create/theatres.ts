import prisma from '../../../Backend/db'

export async function createTheatres() {
  await prisma.theatres.createMany({
    data: [
      { name: 'Downtown Cinema' },
      { name: 'Suburbia Screens' },
    ],
    skipDuplicates: true,
  })
}
