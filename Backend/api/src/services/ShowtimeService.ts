import type { films, halls, seats, showtimes } from '@prisma/client'
import showtimeRepository from './ShowtimeRepository.ts'
import hallRepositroy from './HallRepository.ts'
import filmRepository from './FilmRepository.ts'
import seatRepository from './SeatRepository.ts'

type NonEmptyArray<T> = [T, ...T[]]

class ShowtimeService {
  private async loadMany<T>(
    ids: number[],
    loader: (id: number) => Promise<T | null>,
    notFound: string,
  ): Promise<T[]> {
    return Promise.all(
      ids.map(async (id) => {
        const result = await loader(id)
        if (result === null || (Array.isArray(result) && result.length === 0)) { //throws when seat's array is empty (holds DB integrity)
          throw new Error(notFound)
        }

        return result
      }),
    )
  }

  private async getShowtimeFilms(film_ids: number[]): Promise<films[]> {
    return await this.loadMany(film_ids, filmRepository.getById, 'FILM_NOT_FOUND')
  }

  private async getShowtimeHalls(hall_ids: number[]): Promise<halls[]> {
    return await this.loadMany(hall_ids, hallRepositroy.getById, 'HALL_NOT_FOUND')
  }

  private async getShowtimeSeats(hall_ids: number[]): Promise<seats[][]> {
    const seats = await this.loadMany(
      hall_ids,
      seatRepository.getSeatsByHallId,
      'SEATS_NOT_FOUND',
    )

    return seats as NonEmptyArray<seats>[]
  }

  /**
   * @returns all theatres
   */
  async getAll(): Promise<showtimes[]> {
    return await showtimeRepository.getAll()
  }

  async getList() {
    //creates the desired look for the showtime object
    const showtimes = await this.getAll()
    const film_ids = showtimes.map((st) => st.film_id)
    const hall_ids = showtimes.map((st) => st.hall_id)

    //gets all films of the showtimes.
    const films = await this.getShowtimeFilms(film_ids)
    const halls = await this.getShowtimeHalls(hall_ids)

    //create the output
    return showtimes.map((st) => {
      const film = films.find((f) => st.film_id === f.id)
      const hall = halls.find((h) => st.hall_id === h.id)

      return {
        ends_at: st.ends_at,
        is_canceled: st.is_canceled,
        price: st.price,
        starts_at: st.starts_at,
        film: {
          id: film?.id,
          title: film?.title,
          description: film?.description,
          duration_min: film?.duration_min,
          poster_url: film?.poster_url,
          release_date: film?.release_date,
        },
        hall: {
          id: hall?.id,
          name: hall?.name,
          capacity: hall?.capacity,
          theatre_id: hall?.theatre_id,
        },
      }
    })
  }
}

const showtimeService = new ShowtimeService()
export default showtimeService
