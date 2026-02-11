import client from '../utils/api'
import type { film } from '@prisma/client'

async function getAll(): Promise<film[]> {
  return await client.get('/films')
}

async function getById(filmId: number): Promise<film> {
  return await client.get(`/films?filmId=${filmId}`)
}

async function getByTheatre(theatreId: number): Promise<film[]> {
  return await client.get(`/films?theatreId=${theatreId}`)
}

export const filmsService = {
  getAll,
  getById,
  getByTheatre,
}
