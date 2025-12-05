import prisma from '../../db'
import type { films } from '@prisma/client'

class FilmRepository {
  /**
   * @returns all films
   */
  async getAll(): Promise<films[]> {
    return await prisma.films.findMany()
  }

  async getById(film_id: number): Promise<films | null> {
    return await prisma.films.findUnique({
      where: { id: film_id },
    })
  }

  async getByIds(film_ids: number[]): Promise<films[] | null> {
    return await prisma.films.findMany({
      where: { id: { in: film_ids } },
    })
  }

  async getFilmsByTitle(title: string): Promise<films[]> {
    return await prisma.films.findMany({
      where: { title },
    })
  }

  async createMany(films: Omit<films, 'id'>[]){
    await prisma.films.createMany({
      data: films,
      skipDuplicates: true
    })
  }

}

const filmRepository = new FilmRepository()
export default filmRepository
