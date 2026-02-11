import client from '../utils/api'
import type { film, user } from '@prisma/client'

type FilmPayload = Partial<
  Pick<film, 'title' | 'posterUrl' | 'description' | 'releaseDate' | 'durationMin' | 'theatreId'>
>

type TheatrePayload = { name: string }

type CreateUserPayload = { email: string; password: string; role: user['role'] }

export async function createFilm(data: FilmPayload) {
  return await client.post('/admin/films', data)
}

export async function updateFilm(id: number, data: FilmPayload) {
  return await client.post(`/admin/films/${id}`, data, { method: 'PATCH' })
}

export async function deleteFilm(id: number) {
  return await client.post(`/admin/films/${id}`, {}, { method: 'DELETE' })
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
