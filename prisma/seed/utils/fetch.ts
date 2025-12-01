import prisma from '../../../Backend/db'
import type { Prisma } from '@prisma/client'

export async function getUserByEmail(email: string) {
  const user = await prisma.users.findUnique({ where: { email } })
  if (!user) throw Error(`${email} not found after seed`)
  return user
}

export async function getRoleByCode(code: string) {
  const role = await prisma.roles.findUnique({ where: { code } })
  if (!role) throw Error(`${code} not found after seed`)
  return role
}

export async function getFilmByTitle(title: string) {
  const film = await prisma.films.findFirst({ where: { title } })
  if (!film) throw Error(`${title} not found after seed`)
  return film
}

export async function getGenreByName(name: string) {
  const genre = await prisma.genres.findFirst({ where: { name } })
  if (!genre) throw Error(`${name} not found after seed`)
  return genre
}

export async function getTheatreByName(name: string) {
  const theatre = await prisma.theatres.findUnique({ where: { name } })
  if (!theatre) throw Error(`Theatre "${name}" not found after seed`)
  return theatre
}
