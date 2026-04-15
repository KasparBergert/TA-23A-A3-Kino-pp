import prisma from '../../db'
import type { film } from '@prisma/client'

class FilmService {
  async getById(film_id: number): Promise<film> {
    const film = await prisma.film.findUnique({
      where: { id: film_id },
    })
    if (film === null) {
      throw new Error('FILM_NOT_FOUND')
    }
    return film
  }

  async getAll(): Promise<film[]> {
    const films = await prisma.film.findMany({
      orderBy: { title: 'asc' },
    })
    return films
  }

  async getWithExtras(filmId: number) {
    const film = await this.getById(filmId)
    const genreIds = await prisma.filmGenre.findMany({
      where: { filmId },
      select: { genreId: true },
    }).then((rows) => rows.map((row) => row.genreId))
    const reviews = await prisma.review.findMany({
      where: { filmId },
      orderBy: { createdAt: 'desc' },
    })
    return { film, genreIds, reviews }
  }

  async getByTheatreId(theatreId: number): Promise<film[]> {
    return await prisma.film.findMany({
      where: { theatreId },
      orderBy: { title: 'asc' },
    })
  }

  async validateGenreIds(genreIds: number[]): Promise<void> {
    if (!genreIds.length) return
    const genres = await prisma.genre.findMany({
      where: { id: { in: genreIds } },
    })
    if (genres.length !== genreIds.length) {
      throw new Error('GENRE_NOT_FOUND')
    }
  }

  async setFilmGenres(filmId: number, genreIds: number[]): Promise<void> {
    await this.validateGenreIds(genreIds)
    await prisma.$transaction(async (tx) => {
      await tx.filmGenre.deleteMany({ where: { filmId } })
      if (genreIds.length === 0) return
      await tx.filmGenre.createMany({
        data: genreIds.map((genreId) => ({ filmId, genreId })),
        skipDuplicates: true,
      })
    })
  }
}

const filmService = new FilmService()
export default filmService
