import prisma from '../../../database/db'
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
      select: {
        id: true,
        title: true,
        description: true,
        duration_min: true,
        poster_url: true,
        release_date: true
      },
    })
  }
}

const filmRepository = new FilmRepository()
export default filmRepository
