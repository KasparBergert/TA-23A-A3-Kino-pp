import prisma from "../../../db"

export async function assignRandomGenresToFilms() {
  // get all films + all genres
  const films = await prisma.film.findMany({ select: { id: true } })
  const genres = await prisma.genre.findMany({ select: { id: true } })

  if (films.length === 0 || genres.length === 0) {
    throw new Error('Films or genres missing before assignment')
  }

  // helper for randomness
  const randomGenre = () =>
    genres[Math.floor(Math.random() * genres.length)]

  // build rows
  const rows = films.flatMap(film => {
    const g1 = randomGenre()
    const g2 = randomGenre()

    // ensure not the same genre twice
    const assigned = new Set([g1.id, g2.id])

    return [...assigned].map(genreId => ({
      filmId: film.id,
      genreId
    }))
  })

  // insert
  await prisma.filmGenre.createMany({
    data: rows,
    skipDuplicates: true, // avoids FK collisions
  })

  console.log(`Assigned random genres to ${films.length} films`)
}
