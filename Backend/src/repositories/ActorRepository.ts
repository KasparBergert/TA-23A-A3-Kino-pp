import prisma from '../../db'
import { actor } from '@prisma/client'

class ActorRepository {
  async getByFilmId(filmId: number): Promise<actor[]> {
    return prisma.actor.findMany({
      where: { filmId },
    })
  }

  async getByName(name: string): Promise<actor | null> {
    return prisma.actor.findFirst({
      where: { name },
    })
  }

  async createMany(actor: Omit<actor, 'id'>[]): Promise<void> {
    await prisma.actor.createMany({
      data: actor,
      skipDuplicates: true
    })
  }

}

const actorRepository = new ActorRepository()
export default actorRepository
