import prisma from '../../db'
import type ActorDTO from '../../../shared/types/ActorDTO'

class ActorRepository {
  async getByFilmId(film_id: number): Promise<ActorDTO[]> {
    return prisma.actors.findMany({
      where: { id: film_id },
    })
  }
}

const actorRepository = new ActorRepository()
export default actorRepository
