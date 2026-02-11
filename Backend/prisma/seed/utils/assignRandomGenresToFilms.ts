import prisma from "../../../db"

const genreMap: Record<string, string[]> = {
  "The Dark Knight": ["Märul", "Draama", "Põnevik"],
  "Inception": ["Ulme", "Põnevik"],
  "Interstellar": ["Ulme", "Draama", "Seiklus"],
  "The Matrix": ["Ulme", "Märul"],
  "Gladiator": ["Märul", "Draama", "Seiklus"],
  "The Shawshank Redemption": ["Draama"],
  "Fight Club": ["Draama", "Põnevik"],
  "Pulp Fiction": ["Draama", "Põnevik"],
  "The Lord of the Rings: The Fellowship of the Ring": ["Seiklus", "Märul", "Draama"],
  "The Lord of the Rings: The Return of the King": ["Seiklus", "Märul", "Draama"],
  "The Social Network": ["Draama"],
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
