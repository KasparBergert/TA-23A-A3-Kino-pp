import client from '../utils/api'
import { actors } from '@prisma/client'

async function getAll(): Promise<actors[]> {
  return await client.get('/actors')
}

async function getByFilmId(film_id: number): Promise<actors> {
  return await client.get(`/actors?film_id=${film_id}`)
}

export const actorService = {
  getAll,
  getByFilmId,
}
