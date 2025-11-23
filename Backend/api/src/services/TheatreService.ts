import type { theatres } from '@prisma/client'
import theatreRepository from './TheatreRepository.ts'

class TheatreService {
  /**
   * @returns all theatres
   */
  async getAll(): Promise<theatres[]> {
    return await theatreRepository.getAll()
  }
}

const theatreService = new TheatreService()
export default theatreService
