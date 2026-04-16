// @vitest-environment node
import '../Backend/env.ts'

import { afterAll, afterEach, describe, expect, it } from 'vitest'
import { userRole } from '@prisma/client'
import prisma from '../Backend/db.ts'
import passwordUtils from '../Backend/utils/passwordUtils.ts'

const BASE_URL = 'http://127.0.0.1:3000'
const JSON_HEADERS = { 'content-type': 'application/json' }
const TEST_PREFIX = 'super-e2e-'
const TEST_PASSWORD = 'test-password'
const PROTECTED_EMAIL = 'hannes@tamm.com'

type TestRequestInit = RequestInit & { cookies?: string[] }

async function apiRequest(path: string, init: TestRequestInit = {}): Promise<globalThis.Response> {
  const headers = new Headers(init.headers)

  if (init.cookies?.length) {
    headers.set('cookie', init.cookies.join('; '))
  }

  return await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers,
  })
}

async function postJson(
  path: string,
  body: unknown,
  init: Omit<TestRequestInit, 'body' | 'headers'> = {},
): Promise<globalThis.Response> {
  return await apiRequest(path, {
    ...init,
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  })
}

async function patchJson(
  path: string,
  body: unknown,
  init: Omit<TestRequestInit, 'body' | 'headers'> = {},
): Promise<globalThis.Response> {
  return await apiRequest(path, {
    ...init,
    method: 'PATCH',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  })
}

async function getJson<T>(path: string, init: Omit<TestRequestInit, 'method'> = {}) {
  const response = await apiRequest(path, { ...init, method: 'GET' })
  const body = (await response.json()) as T
  return { response, body }
}

function getSetCookies(response: globalThis.Response): string[] {
  const headers = response.headers as Headers & { getSetCookie?: () => string[] }

  if (typeof headers.getSetCookie === 'function') {
    return headers.getSetCookie()
  }

  const combined = response.headers.get('set-cookie')
  return combined ? [combined] : []
}

function extractCookiePair(cookie: string): string {
  return cookie.split(';', 1)[0] ?? ''
}

function cookiePairs(cookies: string[]): string[] {
  return cookies.map(extractCookiePair)
}

function uniqueName(suffix: string): string {
  return `${TEST_PREFIX}${suffix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function testEmail(suffix: string): string {
  return `${uniqueName(suffix)}@example.com`
}

async function createUser(email: string, role: userRole, password: string = TEST_PASSWORD) {
  const hashedPassword = await passwordUtils.createhash(password)

  return await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role,
    },
  })
}

async function loginAsRole(role: userRole): Promise<string[]> {
  const email = testEmail(`role-${role}`)
  await createUser(email, role)

  const response = await postJson('/api/auth/users/login', {
    email,
    password: TEST_PASSWORD,
  })

  expect(response.status).toBe(200)
  return cookiePairs(getSetCookies(response))
}

async function ensureProtectedSuperAdmin() {
  const existing = await prisma.user.findUnique({
    where: { email: PROTECTED_EMAIL },
  })

  if (existing) return existing

  const hashedPassword = await passwordUtils.createhash('passw0rd')
  return await prisma.user.create({
    data: {
      email: PROTECTED_EMAIL,
      password: hashedPassword,
      role: userRole.super_admin,
    },
  })
}

async function cleanupSuperFixtures() {
  await prisma.user.deleteMany({
    where: {
      email: { startsWith: TEST_PREFIX },
    },
  })

  await prisma.theatre.deleteMany({
    where: {
      name: { startsWith: TEST_PREFIX },
    },
  })
}

afterEach(async () => {
  await cleanupSuperFixtures()
})

afterAll(async () => {
  await prisma.$disconnect()
})

describe('Super admin controllers e2e', () => {
  describe('authorization', () => {
    it('rejects every super-admin route when the client is unauthenticated and returns 401 Unauthorized', async () => {
      const requests = [
        () => apiRequest('/api/super/users', { method: 'GET' }),
        () => postJson('/api/super/users', { email: 'x@example.com', password: TEST_PASSWORD, role: userRole.user }),
        () => patchJson('/api/super/users/1/role', { role: userRole.admin }),
        () => apiRequest('/api/super/users/1', { method: 'DELETE' }),
        () => postJson('/api/super/theatres', { name: 'x', city: 'y' }),
        () => patchJson('/api/super/theatres/1', { name: 'x', city: 'y' }),
        () => apiRequest('/api/super/theatres/1', { method: 'DELETE' }),
      ]

      for (const request of requests) {
        const response = await request()
        expect(response.status).toBe(401)
        expect(await response.text()).toBe('Unauthorized')
      }
    })

    it('rejects every super-admin route when the authenticated client is admin but not super_admin and returns 403 Forbidden', async () => {
      const adminCookies = await loginAsRole(userRole.admin)
      const requests = [
        () => apiRequest('/api/super/users', { method: 'GET', cookies: adminCookies }),
        () =>
          postJson(
            '/api/super/users',
            { email: 'x@example.com', password: TEST_PASSWORD, role: userRole.user },
            { cookies: adminCookies },
          ),
        () => patchJson('/api/super/users/1/role', { role: userRole.admin }, { cookies: adminCookies }),
        () => apiRequest('/api/super/users/1', { method: 'DELETE', cookies: adminCookies }),
        () => postJson('/api/super/theatres', { name: 'x', city: 'y' }, { cookies: adminCookies }),
        () => patchJson('/api/super/theatres/1', { name: 'x', city: 'y' }, { cookies: adminCookies }),
        () => apiRequest('/api/super/theatres/1', { method: 'DELETE', cookies: adminCookies }),
      ]

      for (const request of requests) {
        const response = await request()
        expect(response.status).toBe(403)
        expect(await response.text()).toBe('Forbidden')
      }
    })
  })

  describe('GET /api/super/users', () => {
    it('returns all users and the client receives 200 with an array', async () => {
      const superCookies = await loginAsRole(userRole.super_admin)
      const createdUser = await createUser(testEmail('list-user'), userRole.user)

      const { response, body } = await getJson<Array<{ id: number; email: string; role: userRole }>>('/api/super/users', {
        cookies: superCookies,
      })

      expect(response.status).toBe(200)
      expect(Array.isArray(body)).toBe(true)
      expect(body.some((user) => user.id === createdUser.id && user.email === createdUser.email)).toBe(true)
    })
  })

  describe('POST /api/super/users', () => {
    it('creates a user with valid payload and the client receives 201 with id, email, and role', async () => {
      const superCookies = await loginAsRole(userRole.super_admin)
      const email = testEmail('create-user')

      const response = await postJson(
        '/api/super/users',
        { email, password: TEST_PASSWORD, role: userRole.admin },
        { cookies: superCookies },
      )
      const body = await response.json()
      const created = await prisma.user.findUnique({ where: { email } })
      const loginResponse = await postJson('/api/auth/users/login', {
        email,
        password: TEST_PASSWORD,
      })

      expect(response.status).toBe(201)
      expect(body).toMatchObject({
        id: expect.any(Number),
        email,
        role: userRole.admin,
      })
      expect(created).toBeTruthy()
      expect(created?.role).toBe(userRole.admin)
      expect(loginResponse.status).toBe(200)
    })

    it('rejects a duplicate email and the client receives 409', async () => {
      const superCookies = await loginAsRole(userRole.super_admin)
      const email = testEmail('duplicate-user')
      await createUser(email, userRole.user)

      const response = await postJson(
        '/api/super/users',
        { email, password: TEST_PASSWORD, role: userRole.admin },
        { cookies: superCookies },
      )

      expect(response.status).toBe(409)
      expect(await response.text()).toBe('User already exists')
    })

    it('rejects an invalid role and the client receives 400', async () => {
      const superCookies = await loginAsRole(userRole.super_admin)

      const response = await postJson(
        '/api/super/users',
        { email: testEmail('bad-role-user'), password: TEST_PASSWORD, role: 'invalid-role' },
        { cookies: superCookies },
      )

      expect(response.status).toBe(400)
    })

    it('rejects invalid email/password payload through validation middleware and the client receives 400', async () => {
      const superCookies = await loginAsRole(userRole.super_admin)

      const response = await postJson(
        '/api/super/users',
        { email: 'not-an-email', password: TEST_PASSWORD, role: userRole.user },
        { cookies: superCookies },
      )

      expect(response.status).toBe(400)
      expect(await response.text()).toBe('Email is not valid')
    })
  })

  describe('PATCH /api/super/users/:userId/role', () => {
    it('updates a users role and the client receives 200 with the updated user', async () => {
      const superCookies = await loginAsRole(userRole.super_admin)
      const user = await createUser(testEmail('update-role-user'), userRole.user)

      const response = await patchJson(
        `/api/super/users/${user.id}/role`,
        { role: userRole.admin },
        { cookies: superCookies },
      )
      const body = await response.json()
      const updated = await prisma.user.findUnique({ where: { id: user.id } })

      expect(response.status).toBe(200)
      expect(body).toMatchObject({
        id: user.id,
        email: user.email,
        role: userRole.admin,
      })
      expect(updated?.role).toBe(userRole.admin)
    })

    it('rejects an invalid userId route param and the client receives 400', async () => {
      const superCookies = await loginAsRole(userRole.super_admin)

      const response = await patchJson(
        '/api/super/users/not-a-user/role',
        { role: userRole.admin },
        { cookies: superCookies },
      )

      expect(response.status).toBe(400)
      expect(await response.text()).toBe('Invalid id')
    })

    it('rejects an invalid role and the client receives 400', async () => {
      const superCookies = await loginAsRole(userRole.super_admin)
      const user = await createUser(testEmail('invalid-role-user'), userRole.user)

      const response = await patchJson(
        `/api/super/users/${user.id}/role`,
        { role: 'invalid-role' },
        { cookies: superCookies },
      )

      expect(response.status).toBe(400)
    })

    it('rejects a missing user and the client receives 404', async () => {
      const superCookies = await loginAsRole(userRole.super_admin)

      const response = await patchJson(
        '/api/super/users/999999999/role',
        { role: userRole.admin },
        { cookies: superCookies },
      )

      expect(response.status).toBe(404)
      expect(await response.text()).toBe('User not found')
    })

    it('rejects changing the protected hannes@tamm.com account and the client receives 403', async () => {
      const superCookies = await loginAsRole(userRole.super_admin)
      const protectedUser = await ensureProtectedSuperAdmin()

      const response = await patchJson(
        `/api/super/users/${protectedUser.id}/role`,
        { role: userRole.admin },
        { cookies: superCookies },
      )

      expect(response.status).toBe(403)
      expect(await response.text()).toBe('Protected account role cannot be changed')
    })

    it('rejects invalid payload through schema validation and the client receives 400', async () => {
      const superCookies = await loginAsRole(userRole.super_admin)
      const user = await createUser(testEmail('schema-role-user'), userRole.user)

      const response = await patchJson(
        `/api/super/users/${user.id}/role`,
        {},
        { cookies: superCookies },
      )

      expect(response.status).toBe(400)
    })
  })

  describe('DELETE /api/super/users/:userId', () => {
    it('deletes an existing user and the client receives 204 with no content', async () => {
      const superCookies = await loginAsRole(userRole.super_admin)
      const user = await createUser(testEmail('delete-user'), userRole.user)

      const response = await apiRequest(`/api/super/users/${user.id}`, {
        method: 'DELETE',
        cookies: superCookies,
      })
      const deleted = await prisma.user.findUnique({ where: { id: user.id } })

      expect(response.status).toBe(204)
      expect(deleted).toBeNull()
    })

    it('rejects an invalid userId route param and the client receives 400', async () => {
      const superCookies = await loginAsRole(userRole.super_admin)

      const response = await apiRequest('/api/super/users/not-a-user', {
        method: 'DELETE',
        cookies: superCookies,
      })

      expect(response.status).toBe(400)
      expect(await response.text()).toBe('Invalid id')
    })

    it('rejects a missing user and the client receives 404', async () => {
      const superCookies = await loginAsRole(userRole.super_admin)

      const response = await apiRequest('/api/super/users/999999999', {
        method: 'DELETE',
        cookies: superCookies,
      })

      expect(response.status).toBe(404)
      expect(await response.text()).toBe('User not found')
    })

    it('rejects deleting the protected hannes@tamm.com account and the client receives 403', async () => {
      const superCookies = await loginAsRole(userRole.super_admin)
      const protectedUser = await ensureProtectedSuperAdmin()

      const response = await apiRequest(`/api/super/users/${protectedUser.id}`, {
        method: 'DELETE',
        cookies: superCookies,
      })

      expect(response.status).toBe(403)
      expect(await response.text()).toBe('Protected account cannot be deleted')
    })
  })

  describe('POST /api/super/theatres', () => {
    it('creates a theatre with valid payload and the client receives 201 with the created theatre', async () => {
      const superCookies = await loginAsRole(userRole.super_admin)
      const name = uniqueName('theatre-create')
      const city = uniqueName('city-create')

      const response = await postJson(
        '/api/super/theatres',
        { name, city },
        { cookies: superCookies },
      )
      const body = await response.json()

      expect(response.status).toBe(201)
      expect(body).toMatchObject({
        id: expect.any(Number),
        name,
        city,
      })
    })

    it('rejects invalid payload through schema validation and the client receives 400', async () => {
      const superCookies = await loginAsRole(userRole.super_admin)

      const response = await postJson(
        '/api/super/theatres',
        { name: '', city: '' },
        { cookies: superCookies },
      )

      expect(response.status).toBe(400)
    })

    it('rejects duplicate theatre names and the client receives a failure response', async () => {
      const superCookies = await loginAsRole(userRole.super_admin)
      const name = uniqueName('duplicate-theatre')
      await prisma.theatre.create({
        data: {
          name,
          city: uniqueName('duplicate-city'),
        },
      })

      const response = await postJson(
        '/api/super/theatres',
        { name, city: uniqueName('second-city') },
        { cookies: superCookies },
      )

      expect(response.status).toBe(400)
      expect(await response.text()).toBe('Could not create theatre')
    })
  })

  describe('PATCH /api/super/theatres/:theatreId', () => {
    it('updates an existing theatre and the client receives 200 with the updated theatre', async () => {
      const superCookies = await loginAsRole(userRole.super_admin)
      const theatre = await prisma.theatre.create({
        data: {
          name: uniqueName('theatre-update'),
          city: uniqueName('city-update'),
        },
      })
      const nextName = uniqueName('theatre-updated')
      const nextCity = uniqueName('city-updated')

      const response = await patchJson(
        `/api/super/theatres/${theatre.id}`,
        { name: nextName, city: nextCity },
        { cookies: superCookies },
      )
      const body = await response.json()

      expect(response.status).toBe(200)
      expect(body).toMatchObject({
        id: theatre.id,
        name: nextName,
        city: nextCity,
      })
    })

    it('rejects an invalid theatreId route param and the client receives 400', async () => {
      const superCookies = await loginAsRole(userRole.super_admin)

      const response = await patchJson(
        '/api/super/theatres/not-a-theatre',
        { name: 'x', city: 'y' },
        { cookies: superCookies },
      )

      expect(response.status).toBe(400)
      expect(await response.text()).toBe('Invalid id')
    })

    it('rejects a missing theatre and the client receives 404', async () => {
      const superCookies = await loginAsRole(userRole.super_admin)

      const response = await patchJson(
        '/api/super/theatres/999999999',
        { name: 'x', city: 'y' },
        { cookies: superCookies },
      )

      expect(response.status).toBe(404)
      expect(await response.text()).toBe('Theatre not found')
    })

    it('rejects invalid payload through schema validation and the client receives 400', async () => {
      const superCookies = await loginAsRole(userRole.super_admin)
      const theatre = await prisma.theatre.create({
        data: {
          name: uniqueName('schema-theatre'),
          city: uniqueName('schema-city'),
        },
      })

      const response = await patchJson(
        `/api/super/theatres/${theatre.id}`,
        { name: '', city: '' },
        { cookies: superCookies },
      )

      expect(response.status).toBe(400)
    })
  })

  describe('DELETE /api/super/theatres/:theatreId', () => {
    it('deletes an existing theatre and the client receives 204 with no content', async () => {
      const superCookies = await loginAsRole(userRole.super_admin)
      const theatre = await prisma.theatre.create({
        data: {
          name: uniqueName('theatre-delete'),
          city: uniqueName('city-delete'),
        },
      })

      const response = await apiRequest(`/api/super/theatres/${theatre.id}`, {
        method: 'DELETE',
        cookies: superCookies,
      })
      const deleted = await prisma.theatre.findUnique({ where: { id: theatre.id } })

      expect(response.status).toBe(204)
      expect(deleted).toBeNull()
    })

    it('rejects an invalid theatreId route param and the client receives 400', async () => {
      const superCookies = await loginAsRole(userRole.super_admin)

      const response = await apiRequest('/api/super/theatres/not-a-theatre', {
        method: 'DELETE',
        cookies: superCookies,
      })

      expect(response.status).toBe(400)
      expect(await response.text()).toBe('Invalid id')
    })

    it('rejects a missing theatre and the client receives 404', async () => {
      const superCookies = await loginAsRole(userRole.super_admin)

      const response = await apiRequest('/api/super/theatres/999999999', {
        method: 'DELETE',
        cookies: superCookies,
      })

      expect(response.status).toBe(404)
      expect(await response.text()).toBe('Theatre not found')
    })
  })
})
