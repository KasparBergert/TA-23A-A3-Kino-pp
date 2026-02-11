import type { hall } from '@prisma/client'
import client from '../utils/api'
import { objectToQueryFields } from '../utils/objectToQueryFields'

export async function getByTheatre(theatreId: number): Promise<hall[]> {
  const qs = objectToQueryFields({ theatreId })
  return await client.get(`/halls?${qs}`)
}

export const hallService = {
  getByTheatre,
}
