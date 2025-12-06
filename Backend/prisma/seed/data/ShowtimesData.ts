import { showtimes } from '@prisma/client'
import { getRandom } from '../utils/fetch.ts'
import filmRepository from '../../../src/repositories/FilmRepository.ts'
import hallRepository from '../../../src/repositories/HallRepository.ts'

export async function createShowtimeSeed(): Promise<Omit<showtimes, 'id'>[]> {
  const films = await filmRepository.getAll()
  const halls = await hallRepository.getAll()

  if (films.length === 0) throw new Error("No films exist for showtimes")
  if (halls.length === 0) throw new Error("No halls exist for showtimes")

  return [
    {
      film_id: getRandom(films).id,
      hall_id: getRandom(halls).id,
      starts_at: new Date('2025-11-01T18:00:00'),
      ends_at: new Date('2025-11-01T20:00:00'),
      is_canceled: false,
    },
    {
      film_id: getRandom(films).id,
      hall_id: getRandom(halls).id,
      starts_at: new Date('2025-11-01T20:30:00'),
      ends_at: new Date('2025-11-01T22:45:00'),
      is_canceled: false,
    },
  ]
}

