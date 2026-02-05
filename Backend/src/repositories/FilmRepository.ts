import prisma from '../../db'
import type { film } from '@prisma/client'

class FilmRepository {
  async getAll(): Promise<film[]> {
    return await prisma.film.findMany()
  }

  async getById(filmId: number): Promise<film | null> {
    return await prisma.film.findUnique({
      where: { id: filmId },
    })
  }

  async getByIds(filmIds: number[]): Promise<film[]> {
    return await prisma.film.findMany({
      where: { id: { in: filmIds } },
    })
  }

  async getFilmsByTitle(title: string): Promise<film[]> {
    return await prisma.film.findMany({
      where: { title },
    })
  }

  async createMany(film: Omit<film, 'id'>[]) {
    await prisma.film.createMany({
      data: film,
      skipDuplicates: true,
    })
  }
}

const filmRepository = new FilmRepository()
export default filmRepository
