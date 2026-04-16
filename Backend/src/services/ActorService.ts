import prisma from '../../db'
import type ActorDTO from '../../../shared/types/ActorDTO'

class ActorService {
  async getAll(): Promise<ActorDTO[]> {
    return await prisma.actor.findMany({
      orderBy: { id: 'asc' },
    })
  }

  async getByFilmId(film_id: number): Promise<ActorDTO[]> {
    return await prisma.actor.findMany({
      where: { filmId: film_id },
    })
  }
}

const actorService = new ActorService()
export default actorService
