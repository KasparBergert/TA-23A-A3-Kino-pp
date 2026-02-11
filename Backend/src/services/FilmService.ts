import filmRepository from '../repositories/FilmRepository'
import type { film } from '@prisma/client'
import genreRepository from '../repositories/GenreRepositroy'
import filmGenreRepository from '../repositories/FilmGenreRepository'

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

  async getByTheatreId(theatreId: number): Promise<film[]> {
    return await filmRepository.getByTheatreId(theatreId)
  }

  async validateGenreIds(genreIds: number[]): Promise<void> {
    if (!genreIds.length) return
    const genres = await genreRepository.getByIds(genreIds)
    if (genres.length !== genreIds.length) {
      throw new Error('GENRE_NOT_FOUND')
    }
  }

  async setFilmGenres(filmId: number, genreIds: number[]): Promise<void> {
    await this.validateGenreIds(genreIds)
    await filmGenreRepository.setGenresForFilm(filmId, genreIds)
  }
}

const filmService = new FilmService()
export default filmService
