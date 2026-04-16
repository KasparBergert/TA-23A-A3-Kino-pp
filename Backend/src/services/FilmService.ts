import prisma from '../../db'
import type { film } from '@prisma/client'
import type { FilmCreateInput, FilmUpdateInput } from '../dto/schemas'
import { NotFoundError } from '../errors/HttpError'

class FilmService {
  async getById(film_id: number): Promise<film> {
    const film = await prisma.film.findUnique({
      where: { id: film_id },
    })
    if (film === null) {
      throw new NotFoundError('Film not found')
    }
    return film
  }

  async get(): Promise<film[]> {
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

  async create(data: FilmCreateInput): Promise<film> {
    const film = await prisma.film.create({
      data: {
        title: data.title,
        posterUrl: data.posterUrl,
        description: data.description ?? null,
        releaseDate: data.releaseDate ?? null,
        durationMin: data.durationMin ?? null,
        theatreId: await this.resolveTheatreId(data.theatreId),
      },
    })

    await this.setFilmGenres(film.id, data.genreIds ?? [])
    return film
  }

  async edit(id: number, data: FilmUpdateInput): Promise<film> {
    try {
      const film = await prisma.film.update({
        where: { id },
        data: {
          title: data.title,
          posterUrl: data.posterUrl,
          description: data.description,
          releaseDate: data.releaseDate ?? undefined,
          durationMin: data.durationMin,
          theatreId: await this.resolveTheatreId(data.theatreId),
        },
      })

      if (data.genreIds) {
        await this.setFilmGenres(film.id, data.genreIds)
      }

      return film
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }
      throw new NotFoundError('Film not found')
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await prisma.film.delete({ where: { id } })
    } catch {
      throw new NotFoundError('Film not found')
    }
  }

  async getGenreIds(filmId: number): Promise<number[]> {
    return await prisma.filmGenre
      .findMany({
        where: { filmId },
        select: { genreId: true },
      })
      .then((rows) => rows.map((row) => row.genreId))
  }

  async validateGenreIds(genreIds: number[]): Promise<void> {
    if (!genreIds.length) return
    const genres = await prisma.genre.findMany({
      where: { id: { in: genreIds } },
    })
    if (genres.length !== genreIds.length) {
      throw new NotFoundError('Genre not found')
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

  private async resolveTheatreId(theatreId: number | null | undefined): Promise<number | null | undefined> {
    if (theatreId === undefined) return undefined
    if (theatreId === null) return null

    const theatre = await prisma.theatre.findUnique({
      where: { id: Number(theatreId) },
    })

    if (!theatre) {
      throw new NotFoundError('Theatre not found')
    }

    return theatre.id
  }
}

const filmService = new FilmService()
export default filmService
