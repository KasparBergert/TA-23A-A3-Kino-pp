import filmRepository from "../repositories/FilmRepository";
import type { films } from "@prisma/client";

class FilmService {

  async getById(film_id: number): Promise<films>{
    const film = await filmRepository.getById(film_id);
    if(film === null){
      throw new Error("FILM_NOT_FOUND")
    }
    return film;
  }

}

const filmService = new FilmService();
export default filmService;
