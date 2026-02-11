import prisma from '../../db'
import type { film } from '@prisma/client'

class FilmRepository {
  /**
   * @returns all films
   */
  async getAll(): Promise<film[]> {
    return await prisma.film.findMany()
  }

  async getById(filmId: number): Promise<film| null> {
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

  async create(film: Omit<film, 'id'>): Promise<film> {
    return await prisma.film.create({ data: film })
  }

  async update(id: number, film: Partial<Omit<film, 'id'>>): Promise<film> {
    return await prisma.film.update({ where: { id }, data: film })
  }

  async delete(id: number): Promise<film> {
    return await prisma.film.delete({ where: { id } })
  }

  async createMany(film: Omit<film, 'id'>[]){
    await prisma.film.createMany({
      data: film,
      skipDuplicates: true
    })
  }

}

const filmRepository = new FilmRepository()
export default filmRepository
