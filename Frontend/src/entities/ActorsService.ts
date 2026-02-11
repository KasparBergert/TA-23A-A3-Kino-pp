import client from '../utils/api'
import type { actor } from '@prisma/client'

async function getAll(): Promise<actor[]> {
  return await client.get('/actors')
}

async function getByFilmId(film_id: number): Promise<actor> {
  return await client.get(`/actors?filmId=${film_id}`)
}

export const actorService = {
  getAll,
  getByFilmId,
}
