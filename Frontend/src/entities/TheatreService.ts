import client from '../utils/api'

async function getAll(): Promise<any> {
  return await client.get('/theatres')
}

async function getDetails(theatre_id: number) {
  return await client.get(`/theatres?theatre_id=${theatre_id}`)
}

export const theatreService = {
  getAll,
  getDetails,
}
