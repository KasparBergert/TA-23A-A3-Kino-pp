import type { theatre } from '@prisma/client'
import theatreRepository from '../repositories/TheatreRepository.ts'

class TheatreService {
  async getAll(): Promise<theatre[]> {
    return await theatreRepository.getAll()
  }

  async getById(theatre_id: number): Promise<theatre> {
    const res = await theatreRepository.getById(theatre_id);
    if(res === null){
      throw new Error("THEATRE_NOT_FOUND")
    }
    return res;
  }

}

const theatreService = new TheatreService()
export default theatreService
