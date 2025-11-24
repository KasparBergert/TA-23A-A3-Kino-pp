import prisma from '../../../Backend/db'

export async function createFilms() {
  await prisma.films.createMany({
    data: [
      { title: 'The Dark Knight', description: 'An epic beginning.', release_date: new Date('2020-01-01'), duration_min: 120, poster_url: '...' },
      { title: 'Inception',      description: 'Sequel.',             release_date: new Date('2021-06-15'), duration_min: 135, poster_url: '...' },
      { title: 'Interstellar',   description: 'Low budget.',          release_date: new Date('2019-11-02'), duration_min: 95,  poster_url: '...' }
    ],
    skipDuplicates: true,
  })
}
