import client from '../utils/api'

export async function createFilm(data: Record<string, any>) {
  return await client.post('/admin/films', data)
}

export async function updateFilm(id: number, data: Record<string, any>) {
  return await client.post(`/admin/films/${id}`, data, { method: 'PATCH' })
}

export async function deleteFilm(id: number) {
  return await client.post(`/admin/films/${id}`, {}, { method: 'DELETE' })
}

export async function listUsers() {
  return await client.get('/super/users')
}

export async function updateUserRole(id: number, role: string) {
  return await client.post(`/super/users/${id}/role`, { role }, { method: 'PATCH' })
}

export async function deleteUser(id: number) {
  return await client.post(`/super/users/${id}`, {}, { method: 'DELETE' })
}

export async function createTheatre(data: Record<string, any>) {
  return await client.post('/super/theatres', data)
}

export async function updateTheatre(id: number, data: Record<string, any>) {
  return await client.post(`/super/theatres/${id}`, data, { method: 'PATCH' })
}

export async function deleteTheatre(id: number) {
  return await client.post(`/super/theatres/${id}`, {}, { method: 'DELETE' })
}
