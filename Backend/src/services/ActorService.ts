import actorRepository from '../repositories/ActorRepository'
import type ActorDTO from '../../../shared/types/ActorDTO'

class ActorService {
  async getByFilmId(film_id: number): Promise<ActorDTO[]> {
    return actorRepository.getByFilmId(film_id)
  }
}

const actorService = new ActorService()
export default actorService
