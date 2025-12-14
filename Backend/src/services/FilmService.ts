import filmRepository from '../repositories/FilmRepository'
import type { film } from '@prisma/client'

class FilmService {
  async getById(film_id: number): Promise<film> {
    const film = await filmRepository.getById(film_id)
    if (film === null) {
      throw new Error('FILM_NOT_FOUND')
    }
    return film
  }

  async getAll(): Promise<film[]> {
    const films = await filmRepository.getAll()
    return films
  }
}

const filmService = new FilmService()
export default filmService
