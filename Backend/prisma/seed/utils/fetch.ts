import { theatres, users, films, halls } from '@prisma/client'
import filmRepository from '../../../src/repositories/FilmRepository'

//gets the first film_id that has the same title.
export async function getExistingFilmIdByTitle(title: string): Promise<number> {
  const films = await filmRepository.getFilmsByTitle(title)
  if (!films || films.length === 0) {
    throw new Error(`Film with title '${title}' doesn't exst in database. cannot get id`)
  }
  return films[0].id
}

export function getRandom(arr: any[]): any {
  console.log(arr)
  const randomIndex = Math.floor(Math.random() * arr.length)
  return arr[randomIndex]
}

