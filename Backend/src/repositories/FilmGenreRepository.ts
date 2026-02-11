import prisma from '../../db'

class FilmGenreRepository {
  async setGenresForFilm(filmId: number, genreIds: number[]): Promise<void> {
    await prisma.$transaction(async (tx) => {
      await tx.filmGenre.deleteMany({ where: { filmId } })
      if (genreIds.length === 0) return
      const records = genreIds.map((genreId) => ({ filmId, genreId }))
      await tx.filmGenre.createMany({ data: records, skipDuplicates: true })
    })
  }
}

const filmGenreRepository = new FilmGenreRepository()
export default filmGenreRepository
