import type { films, halls, seats, showtimes, theatres } from '@prisma/client'
import type ShowtimeFilters from '../../types/ShowtimeFilter.ts'
import showtimeFilter from './ShowtimeFilter.ts'
import showtimeRepository from './ShowtimeRepository.ts'
import hallRepositroy from './HallRepository.ts'
import filmRepository from './FilmRepository.ts'
import seatRepository from './SeatRepository.ts'
import theatreRepository from './TheatreRepository.ts'

type NonEmptyArray<T> = [T, ...T[]]

class ShowtimeService {
  private async loadEntityArrays<T>(
    ids: number[],
    loader: (id: number) => Promise<T[] | null>,
    notFound: string,
  ): Promise<T[][]> {
    return await Promise.all(
      ids.map(async (id) => {
        const result = await loader(id)
        if (result === null) {
          throw new Error(notFound)
        }
        return result
      }),
    )
  }

  private async loadEntities<T>(
    ids: number[],
    loader: (id: number[]) => Promise<T[] | null>,
    notFound: string,
  ): Promise<T[]> {
    const result = await loader(ids)
    if (result === null) {
      throw new Error(notFound)
    }
    return result
  }

  private async getShowtimeFilms(film_ids: number[]): Promise<films[]> {
    return await this.loadEntities(film_ids, filmRepository.getByIds, 'FILM_NOT_FOUND')
  }

  private async getShowtimeHalls(hall_ids: number[]): Promise<halls[]> {
    return await this.loadEntities(hall_ids, hallRepositroy.getByIds, 'HALL_NOT_FOUND')
  }

  private async getShowtimeSeats(hall_ids: number[]): Promise<seats[][]> {
    const seats = await this.loadEntityArrays(
      hall_ids,
      seatRepository.getByHallId,
      'SEATS_NOT_FOUND',
    )
    return seats as NonEmptyArray<seats>[]
  }

  private async getShowtimeTheatres(hall_ids: number[]): Promise<theatres[]> {
    return await this.loadEntities(hall_ids, theatreRepository.getByIds, 'THEATRE_NOT_FOUND')
  }

  /**
   * @returns all theatres
   */
  async getAll(filters: ShowtimeFilters): Promise<showtimes[]> {
    const builtFilters = await showtimeFilter.build(filters)
    return await showtimeRepository.getAll(builtFilters)
  }

  async getList(filters: ShowtimeFilters) {
    //creates the desired look for the showtime object
    const showtimes = await this.getAll(filters)

    const film_ids = showtimes.map((st) => st.film_id)
    const hall_ids = showtimes.map((st) => st.hall_id)

    const films = await this.getShowtimeFilms(film_ids)
    const halls = await this.getShowtimeHalls(hall_ids)

    const theatre_ids = halls.map((h) => h.theatre_id)

    const theatres = await this.getShowtimeTheatres(theatre_ids)

    //create the output
    return showtimes.map((st) => {
      const film = films.find((f) => st.film_id === f.id)!
      const hall = halls.find((h) => st.hall_id === h.id)!
      const theatre = theatres.find((t) => t.id === hall.theatre_id)!

      return {
        ends_at: st.ends_at,
        is_canceled: st.is_canceled,
        price: st.price,
        starts_at: st.starts_at,
        film: {
          id: film.id,
          title: film.title,
          description: film.description,
          duration_min: film.duration_min,
          poster_url: film.poster_url,
          release_date: film.release_date,
        },
        hall: {
          id: hall.id,
          name: hall.name,
          capacity: hall.capacity,
        },
        theatre: {
          id: theatre.id,
          name: theatre.name,
        },
      }
    })
  }
}

const showtimeService = new ShowtimeService()
export default showtimeService
