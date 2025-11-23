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
}

const filmRepository = new FilmRepository()
export default filmRepository
