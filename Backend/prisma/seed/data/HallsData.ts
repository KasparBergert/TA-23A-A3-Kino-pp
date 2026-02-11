import { hall } from '@prisma/client'
import theatreRepository from '../../../src/repositories/TheatreRepository'

const baseNames = ['Orion', 'Nova', 'Cosmos', 'Aurora', 'Velvet', 'Lumen', 'Galaxy', 'Oasis']
const capacities = [80, 120, 160]

export async function createHallSeed(): Promise<Omit<hall, 'id'>[]> {
  const theatres = await theatreRepository.getAll()
  const halls: Omit<hall, 'id'>[] = []

  theatres.forEach((theatre, idx) => {
    for (let j = 0; j < 3; j++) {
      const name = `${theatre.name} - ${baseNames[(idx + j) % baseNames.length]}`
      halls.push({
        name,
        theatreId: theatre.id,
        capacity: capacities[j % capacities.length],
      })
    }
  })

  return halls
}
