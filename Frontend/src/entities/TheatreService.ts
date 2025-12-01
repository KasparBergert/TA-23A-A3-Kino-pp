import client from '../utils/api'

async function getAllTheatres(): Promise<any> {
  return await client.get('/theatres')
}

async function getTheatreDetails(theatre_id: number) {
  return await client.get(`/theatres?theatre_id=${theatre_id}`)
}

export const theatreService = {
  getAllTheatres,
  getTheatreDetails,
}
