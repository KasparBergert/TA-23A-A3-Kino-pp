import client from '../utils/api'
import { films } from '@prisma/client'

async function getAllFilms(): Promise<films[]> {
  return await client.get('/films')
}

async function getFilmById(id: number): Promise<films> {
  return await client.get(`/films/${id}`)
}

export const filmsService = {
  getAllFilms,
  getFilmById,
}
