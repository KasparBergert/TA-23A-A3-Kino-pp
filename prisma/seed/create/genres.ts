import prisma from '../../../Backend/db'
export async function createGenres() {
  await prisma.genres.createMany({
    data: [
      { name: 'Action' },
      { name: 'Drama' },
      { name: 'Comedy' },
      { name: 'Sci-Fi' },
    ],
    skipDuplicates: true,
  })
}
