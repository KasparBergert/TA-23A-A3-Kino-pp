import client from '../utils/api'

async function getAllFilms(): Promise<any> {
  return await client.get('/films')
}

async function getFilmById(id: number): Promise<any> {
  return await client.get(`/films/${id}`)
}

export const filmsService = {
  getAllFilms,
  getFilmById,
}
