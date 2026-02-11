import { hall } from '@prisma/client'
import theatreRepository from '../../../src/repositories/TheatreRepository'

const baseNames = ['Orion', 'Nova', 'Cosmos', 'Aurora', 'Velvet', 'Lumen', 'Galaxy', 'Oasis', 'Eclipse', 'Horizon']
const capacities = [80, 120, 160, 200, 100]

export async function createHallSeed(): Promise<Omit<hall, 'id'>[]> {
  const theatres = await theatreRepository.getAll()
  const halls: Omit<hall, 'id'>[] = []

  const hallsPerTheatre = 5

  theatres.forEach((theatre, idx) => {
    for (let j = 0; j < hallsPerTheatre; j++) {
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
