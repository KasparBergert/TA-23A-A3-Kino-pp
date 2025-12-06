import { halls } from '@prisma/client'
import theatreRepository from '../../../src/repositories/TheatreRepository'
import { getRandom } from '../utils/fetch'

export async function createHallsSeed(): Promise<Omit<halls, 'id'>[]> {
  const theatres = await theatreRepository.getAll()
  return [
    { name: 'Hall A', theatre_id: getRandom(theatres).id, capacity: 150 },
    { name: 'Hall B', theatre_id: getRandom(theatres).id, capacity: 80 },
  ]
}
