import client from '../utils/api'
import { films } from '@prisma/client'

async function getAll(): Promise<films[]> {
  return await client.get('/films')
}

async function getById(film_id: number): Promise<films> {
  return await client.get(`/films?film_id=${film_id}`)
}

export const filmsService = {
  getAll,
  getById,
}
