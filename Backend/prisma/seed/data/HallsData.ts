import { hall } from '@prisma/client'
import theatreRepository from '../../../src/repositories/TheatreRepository'
import { getRandom } from '../utils/fetch'

export async function createHallSeed(): Promise<Omit<hall, 'id'>[]> {
  const theatres = await theatreRepository.getAll()
  return [
    { name: 'Hall A', theatreId: getRandom(theatres).id, capacity: 150 },
    { name: 'Hall B', theatreId: getRandom(theatres).id, capacity: 80 },
  ]
}
