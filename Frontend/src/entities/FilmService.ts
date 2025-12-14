import client from '../utils/api'
import { film } from '@prisma/client'

async function getAll(): Promise<film[]> {
  return await client.get('/films')
}

async function getById(film_id: number): Promise<film> {
  return await client.get(`/films?film_id=${film_id}`)
}

export const filmsService = {
  getAll,
  getById,
}
