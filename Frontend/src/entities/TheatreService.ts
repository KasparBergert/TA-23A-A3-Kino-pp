import client from '../utils/api'
import type { theatre } from '@prisma/client'
import { objectToQueryFields } from '../utils/objectToQueryFields'

type TheatreFilters = { city?: string; search?: string; orderBy?: 'name' | 'city' }

async function getAll(filters: TheatreFilters = {}): Promise<theatre[]> {
  const qs = objectToQueryFields(filters)
  const suffix = qs ? `?${qs}` : ''
  return await client.get(`/theatres${suffix}`)
}

async function getDetails(theatre_id: number) {
  return await client.get(`/theatres?theatreId=${theatre_id}`)
}

export const theatreService = {
  getAll,
  getDetails,
}
