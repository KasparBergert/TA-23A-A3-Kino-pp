import client from '../utils/api'
import type { film, user } from '@prisma/client'

type FilmPayload = Partial<
  Pick<film, 'title' | 'posterUrl' | 'description' | 'releaseDate' | 'durationMin' | 'theatreId'>
> & { genreIds?: number[] }

type TheatrePayload = { name: string; city: string }

type CreateUserPayload = { email: string; password: string; role: user['role'] }
type GenrePayload = { name: string }

export async function createFilm(data: FilmPayload) {
  return await client.post('/admin/films', data)
}

export async function updateFilm(id: number, data: FilmPayload) {
  return await client.post(`/admin/films/${id}`, data, { method: 'PATCH' })
}

export async function deleteFilm(id: number) {
  return await client.post(`/admin/films/${id}`, {}, { method: 'DELETE' })
}

export async function getFilmGenres(filmId: number): Promise<{ genreIds: number[] }> {
  return await client.get(`/admin/films/${filmId}/genres`)
}

export async function listUsers() {
  return await client.get('/super/users')
}

export async function createUser(data: CreateUserPayload) {
  return await client.post('/super/users', data)
}

export async function updateUserRole(id: number, role: string) {
  return await client.post(`/super/users/${id}/role`, { role }, { method: 'PATCH' })
}

export async function deleteUser(id: number) {
  return await client.post(`/super/users/${id}`, {}, { method: 'DELETE' })
}

export async function createTheatre(data: TheatrePayload) {
  return await client.post('/super/theatres', data)
}

export async function updateTheatre(id: number, data: TheatrePayload) {
  return await client.post(`/super/theatres/${id}`, data, { method: 'PATCH' })
}

export async function deleteTheatre(id: number) {
  return await client.post(`/super/theatres/${id}`, {}, { method: 'DELETE' })
}

export async function createGenre(data: GenrePayload) {
  return await client.post('/admin/genres', data)
}

export async function updateGenre(id: number, data: GenrePayload) {
  return await client.post(`/admin/genres/${id}`, data, { method: 'PATCH' })
}

export async function deleteGenre(id: number) {
  return await client.post(`/admin/genres/${id}`, {}, { method: 'DELETE' })
}
