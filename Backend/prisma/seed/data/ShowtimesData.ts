import { showtimes } from '@prisma/client'
import { getRandom } from '../utils/fetch.ts'
import filmRepository from '../../../src/repositories/FilmRepository.ts'
import hallRepository from '../../../src/repositories/HallRepository.ts'

export async function createShowtimeSeed(): Promise<Omit<showtimes, 'id'>[]> {
  const films = await filmRepository.getAll()
  const halls = await hallRepository.getAll()

  if (films.length === 0) throw new Error("No films exist for showtimes")
  if (halls.length === 0) throw new Error("No halls exist for showtimes")

  const future_start_at: Date = new Date('2055-11-01T20:00:00');
  const future_end_at: Date = new Date('2065-11-01T20:00:00');

  return [
    {
      film_id: getRandom(films).id,
      hall_id: getRandom(halls).id,
      starts_at: future_end_at,
      ends_at: future_end_at,
      is_canceled: false,
    },
    {
      film_id: getRandom(films).id,
      hall_id: getRandom(halls).id,
      starts_at: future_start_at,
      ends_at: future_end_at,
      is_canceled: false,
    },
  ]
}

