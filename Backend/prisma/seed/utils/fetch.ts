import { theatres, users, films, halls } from '@prisma/client'
import filmRepository from '../../../src/repositories/FilmRepository'
import theatreRepository from '../../../src/repositories/TheatreRepository'
import userRepository from '../../../src/repositories/UserRepository'
import hallRepositroy from '../../../src/repositories/HallRepository'

export const allTheatres = await theatreRepository.getAll()
export const allUsers = await userRepository.getAll()
export const allFilms = await filmRepository.getAll()
export const allHalls = await hallRepositroy.getAll()

//gets the first film_id that has the same title.
export async function getExistingFilmIdByTitle(title: string): Promise<number> {
  const films = await filmRepository.getFilmsByTitle(title)
  if (!films || films.length === 0) {
    throw new Error(`Film with title '${title}' doesn't exst in database. cannot get id`)
  }
  return films[0].id
}

export function getRandomTheatre(): theatres {
  const randomIndex = Math.floor(Math.random() * allTheatres.length)
  return allTheatres[randomIndex]
}

export function getRandomUser(): users {
  const randomIndex = Math.floor(Math.random() * allUsers.length)
  return allUsers[randomIndex]
}

export function getRandomFilm(): films {
  const randomIndex = Math.floor(Math.random() * allFilms.length)
  return allFilms[randomIndex]
}

export function getRandomHall(): halls {
  const randomIndex = Math.floor(Math.random() * allHalls.length)
  return allHalls[randomIndex]
}
