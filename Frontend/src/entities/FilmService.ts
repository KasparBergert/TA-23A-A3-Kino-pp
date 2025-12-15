import client from '../utils/api'
import { film } from '@prisma/client'

async function getAll(): Promise<film[]> {
  return await client.get('/films')
}

async function getById(filmId: number): Promise<film> {
  return await client.get(`/films?filmId=${filmId}`)
}

export const filmsService = {
  getAll,
  getById,
}
