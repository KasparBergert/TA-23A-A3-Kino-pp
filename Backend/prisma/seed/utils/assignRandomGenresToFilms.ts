import prisma from "../../../db"

const genreMap: Record<string, string[]> = {
  "The Dark Knight": ["Action", "Drama"],
  "Inception": ["Sci-Fi", "Action"],
  "Interstellar": ["Sci-Fi", "Drama"],
  "The Matrix": ["Sci-Fi", "Action"],
  "Gladiator": ["Action", "Drama"],
  "The Shawshank Redemption": ["Drama"],
  "Fight Club": ["Drama"],
  "Pulp Fiction": ["Drama"],
  "The Lord of the Rings: The Fellowship of the Ring": ["Action", "Drama"],
  "The Lord of the Rings: The Return of the King": ["Action", "Drama"],
  "The Social Network": ["Drama"],
}

export async function assignRandomGenresToFilms() {
  const films = await prisma.film.findMany({ select: { id: true, title: true } })
  const genres = await prisma.genre.findMany({ select: { id: true, name: true } })

  if (films.length === 0 || genres.length === 0) {
    throw new Error('Films or genres missing before assignment')
  }

  const genreIdByName = new Map(genres.map((g) => [g.name, g.id]))

  const rows = films.flatMap((film) => {
    const names = genreMap[film.title] ?? ["Drama"]
    const ids = names
      .map((name) => genreIdByName.get(name))
      .filter((id): id is number => Boolean(id))
    const unique = [...new Set(ids)]
    return unique.map((genreId) => ({ filmId: film.id, genreId }))
  })

  // reset and insert deterministic mapping
  await prisma.filmGenre.deleteMany({})
  await prisma.filmGenre.createMany({
    data: rows,
    skipDuplicates: true,
  })

  console.log(`Assigned deterministic genres to ${films.length} films`)
}
