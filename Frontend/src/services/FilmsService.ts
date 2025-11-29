import client from '../utils/api'

async function getAllFilms(): Promise<any> {
  return await client.get('/films')
}

export const filmsService = {
  getAllFilms
}

