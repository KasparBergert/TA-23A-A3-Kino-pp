import prisma from '../../db'
import { actors } from '@prisma/client'

class ActorRepository {
  async getByFilmId(film_id: number): Promise<actors[]> {
    return prisma.actors.findMany({
      where: { film_id },
    })
  }

  async getByName(name: string): Promise<actors | null> {
    return prisma.actors.findFirst({
      where: { name },
    })
  }

  async createMany(actors: Omit<actors, 'id'>[]): Promise<void> {
    await prisma.actors.createMany({
      data: actors,
      skipDuplicates: true
    })
  }

}

const actorRepository = new ActorRepository()
export default actorRepository
