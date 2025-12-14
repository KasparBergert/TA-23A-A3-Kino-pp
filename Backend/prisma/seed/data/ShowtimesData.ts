import { showtime } from '@prisma/client'
import { getRandom } from '../utils/fetch.ts'
import filmRepository from '../../../src/repositories/FilmRepository.ts'
import hallRepository from '../../../src/repositories/HallRepository.ts'

export async function createShowtimeSeed(): Promise<Omit<showtime, 'id'>[]> {
  const films = await filmRepository.getAll()
  const halls = await hallRepository.getAll()

  if (films.length === 0) throw new Error("No films exist for showtimes")
  if (halls.length === 0) throw new Error("No halls exist for showtimes")

  const future_start_at: Date = new Date('2055-11-01T20:00:00');
  const future_end_at: Date = new Date('2065-11-01T20:00:00');

  return [
    {
      filmId: getRandom(films).id,
      hallId: getRandom(halls).id,
      startsAt: future_end_at,
      endsAt: future_end_at,
      isCanceled: false,
    },
    {
      filmId: getRandom(films).id,
      hallId: getRandom(halls).id,
      startsAt: future_start_at,
      endsAt: future_end_at,
      isCanceled: false,
    },
  ]
}

