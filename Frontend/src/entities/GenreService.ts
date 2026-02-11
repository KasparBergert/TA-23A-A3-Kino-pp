import client from '../utils/api'
import type { genre } from '@prisma/client'

async function getAll(): Promise<genre[]> {
  return await client.get('/genres')
}

export const genreService = { getAll }
