// @vitest-environment node
import '../Backend/env.ts'

import { afterAll, afterEach, describe, expect, it } from 'vitest'
import { seatType, ticketStatus, userRole } from '@prisma/client'
import prisma from '../Backend/db.ts'
import passwordUtils from '../Backend/utils/passwordUtils.ts'

const BASE_URL = 'http://127.0.0.1:3000'
const JSON_HEADERS = { 'content-type': 'application/json' }
const TEST_PREFIX = 'admin-e2e-'
const TEST_PASSWORD = 'test-password'

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

function localDateOnly(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
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

async function createAdminFixtureBundle() {
  const theatreA = await prisma.theatre.create({
    data: {
      name: uniqueName('theatre-alpha'),
      city: uniqueName('city-alpha'),
    },
  })

  const theatreB = await prisma.theatre.create({
    data: {
      name: uniqueName('theatre-beta'),
      city: uniqueName('city-beta'),
    },
  })

  const hallA = await prisma.hall.create({
    data: {
      theatreId: theatreA.id,
      name: uniqueName('hall-alpha'),
      capacity: 3,
    },
  })

  const hallAAlt = await prisma.hall.create({
    data: {
      theatreId: theatreA.id,
      name: uniqueName('hall-alpha-alt'),
      capacity: 4,
    },
  })

  const hallB = await prisma.hall.create({
    data: {
      theatreId: theatreB.id,
      name: uniqueName('hall-beta'),
      capacity: 2,
    },
  })

  const genreA = await prisma.genre.create({
    data: { name: uniqueName('genre-alpha') },
  })

  const genreB = await prisma.genre.create({
    data: { name: uniqueName('genre-beta') },
  })

  const filmA = await prisma.film.create({
    data: {
      title: uniqueName('film-alpha'),
      description: 'Admin e2e film alpha',
      releaseDate: new Date('2024-01-01T00:00:00.000Z'),
      durationMin: 120,
      posterUrl: 'https://example.com/poster-alpha.jpg',
      theatreId: theatreA.id,
      director: 'Director Alpha',
      language: 'EN',
      rating: 'PG-13',
      trailerUrl: 'https://example.com/trailer-alpha',
    },
  })

  const filmB = await prisma.film.create({
    data: {
      title: uniqueName('film-beta'),
      description: 'Admin e2e film beta',
      releaseDate: new Date('2024-02-01T00:00:00.000Z'),
      durationMin: 110,
      posterUrl: 'https://example.com/poster-beta.jpg',
      theatreId: theatreA.id,
      director: 'Director Beta',
      language: 'EN',
      rating: 'R',
      trailerUrl: 'https://example.com/trailer-beta',
    },
  })

  await prisma.filmGenre.create({
    data: {
      filmId: filmA.id,
      genreId: genreA.id,
    },
  })

  const seatA = await prisma.seat.create({
    data: { hallId: hallA.id, row: 'A', column: 1, type: seatType.Standard },
  })

  const seatB = await prisma.seat.create({
    data: { hallId: hallA.id, row: 'A', column: 2, type: seatType.Premium },
  })

  const seatC = await prisma.seat.create({
    data: { hallId: hallA.id, row: 'A', column: 3, type: seatType.Double },
  })

  return {
    theatreA,
    theatreB,
    hallA,
    hallAAlt,
    hallB,
    genreA,
    genreB,
    filmA,
    filmB,
    seats: [seatA, seatB, seatC],
  }
}

async function createShowtime(filmId: number, hallId: number, startsAt: Date, endsAt: Date) {
  return await prisma.showtime.create({
    data: {
      filmId,
      hallId,
      startsAt,
      endsAt,
      isCanceled: false,
    },
  })
}

async function cleanupAdminFixtures() {
  await prisma.showtimeTakenSeat.deleteMany({
    where: {
      OR: [
        { showtime: { film: { title: { startsWith: TEST_PREFIX } } } },
        { seat: { hall: { name: { startsWith: TEST_PREFIX } } } },
      ],
    },
  })

  await prisma.ticket.deleteMany({
    where: {
      OR: [
        { showtime: { film: { title: { startsWith: TEST_PREFIX } } } },
        { seat: { hall: { name: { startsWith: TEST_PREFIX } } } },
        { order: { user: { email: { startsWith: TEST_PREFIX } } } },
      ],
    },
  })

  await prisma.order.deleteMany({
    where: {
      user: { email: { startsWith: TEST_PREFIX } },
    },
  })

  await prisma.review.deleteMany({
    where: {
      OR: [
        { author: { startsWith: TEST_PREFIX } },
        { film: { title: { startsWith: TEST_PREFIX } } },
      ],
    },
  })

  await prisma.actor.deleteMany({
    where: {
      OR: [
        { name: { startsWith: TEST_PREFIX } },
        { film: { title: { startsWith: TEST_PREFIX } } },
      ],
    },
  })

  await prisma.filmGenre.deleteMany({
    where: {
      OR: [
        { film: { title: { startsWith: TEST_PREFIX } } },
        { genre: { name: { startsWith: TEST_PREFIX } } },
      ],
    },
  })

  await prisma.showtime.deleteMany({
    where: {
      film: { title: { startsWith: TEST_PREFIX } },
    },
  })

  await prisma.seat.deleteMany({
    where: {
      hall: { name: { startsWith: TEST_PREFIX } },
    },
  })

  await prisma.film.deleteMany({
    where: {
      title: { startsWith: TEST_PREFIX },
    },
  })

  await prisma.genre.deleteMany({
    where: {
      name: { startsWith: TEST_PREFIX },
    },
  })

  await prisma.hall.deleteMany({
    where: {
      name: { startsWith: TEST_PREFIX },
    },
  })

  await prisma.theatre.deleteMany({
    where: {
      name: { startsWith: TEST_PREFIX },
    },
  })

  await prisma.user.deleteMany({
    where: {
      email: { startsWith: TEST_PREFIX },
    },
  })
}

afterEach(async () => {
  await cleanupAdminFixtures()
})

afterAll(async () => {
  await prisma.$disconnect()
})

describe('Admin controllers e2e', () => {
  describe('authorization', () => {
    it('rejects every admin route when the client is unauthenticated and returns 401 Unauthorized', async () => {
      const requests = [
        () => postJson('/api/admin/films', { title: 'x', posterUrl: 'https://example.com/poster.jpg' }),
        () => patchJson('/api/admin/films/1', {}),
        () => apiRequest('/api/admin/films/1', { method: 'DELETE' }),
        () => apiRequest('/api/admin/films/1/genres', { method: 'GET' }),
        () => apiRequest('/api/admin/analytics', { method: 'GET' }),
        () => postJson('/api/admin/genres', { name: 'x' }),
        () => patchJson('/api/admin/genres/1', { name: 'x' }),
        () => apiRequest('/api/admin/genres/1', { method: 'DELETE' }),
        () =>
          postJson('/api/admin/showtimes/auto', {
            theatreId: 1,
            filmIds: [1],
            startDate: '2026-01-01',
            endDate: '2026-01-01',
          }),
        () => apiRequest('/api/admin/showtimes/1', { method: 'DELETE' }),
      ]

      for (const request of requests) {
        const response = await request()
        expect(response.status).toBe(401)
        expect(await response.text()).toBe('Unauthorized')
      }
    })

    it('rejects every admin route when the authenticated client does not have admin or super_admin role and returns 403 Forbidden', async () => {
      const userCookies = await loginAsRole(userRole.user)
      const requests = [
        () => postJson('/api/admin/films', { title: 'x', posterUrl: 'https://example.com/poster.jpg' }, { cookies: userCookies }),
        () => patchJson('/api/admin/films/1', {}, { cookies: userCookies }),
        () => apiRequest('/api/admin/films/1', { method: 'DELETE', cookies: userCookies }),
        () => apiRequest('/api/admin/films/1/genres', { method: 'GET', cookies: userCookies }),
        () => apiRequest('/api/admin/analytics', { method: 'GET', cookies: userCookies }),
        () => postJson('/api/admin/genres', { name: 'x' }, { cookies: userCookies }),
        () => patchJson('/api/admin/genres/1', { name: 'x' }, { cookies: userCookies }),
        () => apiRequest('/api/admin/genres/1', { method: 'DELETE', cookies: userCookies }),
        () =>
          postJson(
            '/api/admin/showtimes/auto',
            {
              theatreId: 1,
              filmIds: [1],
              startDate: '2026-01-01',
              endDate: '2026-01-01',
            },
            { cookies: userCookies },
          ),
        () => apiRequest('/api/admin/showtimes/1', { method: 'DELETE', cookies: userCookies }),
      ]

      for (const request of requests) {
        const response = await request()
        expect(response.status).toBe(403)
        expect(await response.text()).toBe('Forbidden')
      }
    })
  })

  describe('POST /api/admin/films', () => {
    it('creates a film with valid payload and the client receives 201 with the created film', async () => {
      const adminCookies = await loginAsRole(userRole.admin)
      const fixtures = await createAdminFixtureBundle()
      const title = uniqueName('film-create')
      const payload = {
        title,
        posterUrl: 'https://example.com/poster-create.jpg',
        description: 'Created through admin endpoint',
        releaseDate: '2024-03-01',
        durationMin: 135,
        theatreId: fixtures.theatreA.id,
        genreIds: [fixtures.genreA.id, fixtures.genreB.id],
      }

      const response = await postJson('/api/admin/films', payload, { cookies: adminCookies })
      const body = await response.json()
      const createdGenres = await prisma.filmGenre.findMany({
        where: { filmId: body.id },
        select: { genreId: true },
        orderBy: { genreId: 'asc' },
      })

      expect(response.status).toBe(201)
      expect(body).toMatchObject({
        title,
        posterUrl: payload.posterUrl,
        description: payload.description,
        durationMin: payload.durationMin,
        theatreId: fixtures.theatreA.id,
      })
      expect(createdGenres.map((row) => row.genreId)).toEqual([fixtures.genreA.id, fixtures.genreB.id].sort((a, b) => a - b))
    })

    it('creates a film without theatreId when theatre is optional and the client still receives 201', async () => {
      const adminCookies = await loginAsRole(userRole.admin)
      const title = uniqueName('film-without-theatre')

      const response = await postJson(
        '/api/admin/films',
        {
          title,
          posterUrl: 'https://example.com/poster-no-theatre.jpg',
        },
        { cookies: adminCookies },
      )

      const body = await response.json()

      expect(response.status).toBe(201)
      expect(body).toMatchObject({
        title,
        theatreId: null,
      })
    })

    it('rejects an unknown theatreId and the client receives 404', async () => {
      const adminCookies = await loginAsRole(userRole.admin)

      const response = await postJson(
        '/api/admin/films',
        {
          title: uniqueName('film-bad-theatre'),
          posterUrl: 'https://example.com/poster-bad-theatre.jpg',
          theatreId: 999999999,
        },
        { cookies: adminCookies },
      )

      expect(response.status).toBe(404)
      expect(await response.text()).toBe('Theatre not found')
    })

    it('rejects unknown genreIds and the client receives 404', async () => {
      const adminCookies = await loginAsRole(userRole.admin)

      const response = await postJson(
        '/api/admin/films',
        {
          title: uniqueName('film-bad-genre'),
          posterUrl: 'https://example.com/poster-bad-genre.jpg',
          genreIds: [999999999],
        },
        { cookies: adminCookies },
      )

      expect(response.status).toBe(404)
      expect(await response.text()).toBe('Genre not found')
    })

    it('rejects an invalid payload through schema validation and the client receives 400', async () => {
      const adminCookies = await loginAsRole(userRole.admin)

      const response = await postJson(
        '/api/admin/films',
        {
          title: '',
          posterUrl: 'not-a-url',
          genreIds: [1, 1],
        },
        { cookies: adminCookies },
      )

      expect(response.status).toBe(400)
    })
  })

  describe('PATCH /api/admin/films/:filmId', () => {
    it('updates a film with valid payload and the client receives 200 with the updated film', async () => {
      const adminCookies = await loginAsRole(userRole.admin)
      const fixtures = await createAdminFixtureBundle()
      const payload = {
        title: uniqueName('film-updated'),
        posterUrl: 'https://example.com/poster-updated.jpg',
        description: 'Updated through admin endpoint',
        releaseDate: '2024-05-01',
        durationMin: 145,
        theatreId: fixtures.theatreB.id,
      }

      const response = await patchJson(`/api/admin/films/${fixtures.filmA.id}`, payload, { cookies: adminCookies })
      const body = await response.json()

      expect(response.status).toBe(200)
      expect(body).toMatchObject({
        id: fixtures.filmA.id,
        title: payload.title,
        posterUrl: payload.posterUrl,
        description: payload.description,
        durationMin: payload.durationMin,
        theatreId: fixtures.theatreB.id,
      })
    })

    it('allows clearing theatreId by sending null and the client receives the updated film with no theatre', async () => {
      const adminCookies = await loginAsRole(userRole.admin)
      const fixtures = await createAdminFixtureBundle()

      const response = await patchJson(
        `/api/admin/films/${fixtures.filmA.id}`,
        { theatreId: null },
        { cookies: adminCookies },
      )

      const body = await response.json()
      const updated = await prisma.film.findUnique({ where: { id: fixtures.filmA.id } })

      expect(response.status).toBe(200)
      expect(body.theatreId).toBeNull()
      expect(updated?.theatreId).toBeNull()
    })

    it('updates the films genre list when genreIds are included in the payload', async () => {
      const adminCookies = await loginAsRole(userRole.admin)
      const fixtures = await createAdminFixtureBundle()

      const response = await patchJson(
        `/api/admin/films/${fixtures.filmA.id}`,
        { genreIds: [fixtures.genreB.id] },
        { cookies: adminCookies },
      )

      const body = await response.json()
      const genreIds = await prisma.filmGenre.findMany({
        where: { filmId: fixtures.filmA.id },
        select: { genreId: true },
      })

      expect(response.status).toBe(200)
      expect(body.id).toBe(fixtures.filmA.id)
      expect(genreIds.map((row) => row.genreId)).toEqual([fixtures.genreB.id])
    })

    it('rejects an invalid filmId route param and the client receives 400', async () => {
      const adminCookies = await loginAsRole(userRole.admin)

      const response = await patchJson('/api/admin/films/not-a-film', {}, { cookies: adminCookies })

      expect(response.status).toBe(400)
      expect(await response.text()).toBe('Invalid id')
    })

    it('rejects an unknown theatreId and the client receives 404', async () => {
      const adminCookies = await loginAsRole(userRole.admin)
      const fixtures = await createAdminFixtureBundle()

      const response = await patchJson(
        `/api/admin/films/${fixtures.filmA.id}`,
        { theatreId: 999999999 },
        { cookies: adminCookies },
      )

      expect(response.status).toBe(404)
      expect(await response.text()).toBe('Theatre not found')
    })

    it('rejects a missing film and the client receives 404', async () => {
      const adminCookies = await loginAsRole(userRole.admin)

      const response = await patchJson(
        '/api/admin/films/999999999',
        { title: uniqueName('missing-film') },
        { cookies: adminCookies },
      )

      expect(response.status).toBe(404)
      expect(await response.text()).toBe('Film not found')
    })

    it('rejects an invalid payload through schema validation and the client receives 400', async () => {
      const adminCookies = await loginAsRole(userRole.admin)
      const fixtures = await createAdminFixtureBundle()

      const response = await patchJson(
        `/api/admin/films/${fixtures.filmA.id}`,
        { posterUrl: 'not-a-url' },
        { cookies: adminCookies },
      )

      expect(response.status).toBe(400)
    })
  })

  describe('DELETE /api/admin/films/:filmId', () => {
    it('deletes an existing film and the client receives 204 with no content', async () => {
      const adminCookies = await loginAsRole(userRole.admin)
      const fixtures = await createAdminFixtureBundle()

      const response = await apiRequest(`/api/admin/films/${fixtures.filmB.id}`, {
        method: 'DELETE',
        cookies: adminCookies,
      })

      const deleted = await prisma.film.findUnique({ where: { id: fixtures.filmB.id } })

      expect(response.status).toBe(204)
      expect(deleted).toBeNull()
    })

    it('rejects an invalid filmId route param and the client receives 400', async () => {
      const adminCookies = await loginAsRole(userRole.admin)

      const response = await apiRequest('/api/admin/films/not-a-film', {
        method: 'DELETE',
        cookies: adminCookies,
      })

      expect(response.status).toBe(400)
      expect(await response.text()).toBe('Invalid id')
    })

    it('rejects a missing film and the client receives 404', async () => {
      const adminCookies = await loginAsRole(userRole.admin)

      const response = await apiRequest('/api/admin/films/999999999', {
        method: 'DELETE',
        cookies: adminCookies,
      })

      expect(response.status).toBe(404)
      expect(await response.text()).toBe('Film not found')
    })
  })

  describe('GET /api/admin/films/:filmId/genres', () => {
    it('returns the selected genreIds for a film and the client receives 200 with { genreIds }', async () => {
      const adminCookies = await loginAsRole(userRole.admin)
      const fixtures = await createAdminFixtureBundle()

      const { response, body } = await getJson<{ genreIds: number[] }>(`/api/admin/films/${fixtures.filmA.id}/genres`, {
        cookies: adminCookies,
      })

      expect(response.status).toBe(200)
      expect(body.genreIds).toEqual([fixtures.genreA.id])
    })

    it('rejects an invalid filmId route param and the client receives 400', async () => {
      const adminCookies = await loginAsRole(userRole.admin)
      const response = await apiRequest('/api/admin/films/not-a-film/genres', {
        method: 'GET',
        cookies: adminCookies,
      })

      expect(response.status).toBe(400)
      expect(await response.text()).toBe('Invalid film id')
    })
  })

  describe('GET /api/admin/analytics', () => {
    it('returns analytics summary data and the client receives totalBookings, bookingsPerMovie, and occupancy arrays', async () => {
      const adminCookies = await loginAsRole(userRole.admin)
      const fixtures = await createAdminFixtureBundle()
      const customer = await createUser(testEmail('analytics-customer'), userRole.user)
      const showtime = await createShowtime(
        fixtures.filmA.id,
        fixtures.hallA.id,
        new Date('2026-05-10T10:00:00.000Z'),
        new Date('2026-05-10T12:00:00.000Z'),
      )
      const order = await prisma.order.create({
        data: {
          userId: customer.id,
        },
      })

      await prisma.showtimeTakenSeat.createMany({
        data: [
          { showtimeId: showtime.id, seatId: fixtures.seats[0].id },
          { showtimeId: showtime.id, seatId: fixtures.seats[1].id },
        ],
      })

      await prisma.ticket.createMany({
        data: [
          {
            orderId: order.id,
            showtimeId: showtime.id,
            seatId: fixtures.seats[0].id,
            status: ticketStatus.reserved,
            unitPrice: 10,
          },
          {
            orderId: order.id,
            showtimeId: showtime.id,
            seatId: fixtures.seats[1].id,
            status: ticketStatus.paid,
            unitPrice: 15,
          },
        ],
      })

      const { response, body } = await getJson<{
        totalBookings: number
        bookingsPerMovie: Array<{ filmId: number; filmTitle: string; bookings: number }>
        occupancy: Array<{
          showtimeId: number
          filmTitle: string
          hallName: string
          occupancyPercent: number
          availableSeats: number
          totalSeats: number
        }>
      }>('/api/admin/analytics', {
        cookies: adminCookies,
      })

      expect(response.status).toBe(200)
      expect(body.totalBookings).toBe(2)
      expect(Array.isArray(body.bookingsPerMovie)).toBe(true)
      expect(Array.isArray(body.occupancy)).toBe(true)
      expect(body.bookingsPerMovie).toContainEqual({
        filmId: fixtures.filmA.id,
        filmTitle: fixtures.filmA.title,
        bookings: 2,
      })
    })

    it('returns occupancy values with showtimeId, filmTitle, hallName, occupancyPercent, availableSeats, and totalSeats', async () => {
      const adminCookies = await loginAsRole(userRole.admin)
      const fixtures = await createAdminFixtureBundle()
      const customer = await createUser(testEmail('analytics-occupancy'), userRole.user)
      const showtime = await createShowtime(
        fixtures.filmA.id,
        fixtures.hallA.id,
        new Date('2026-05-11T10:00:00.000Z'),
        new Date('2026-05-11T12:00:00.000Z'),
      )
      const order = await prisma.order.create({
        data: {
          userId: customer.id,
        },
      })

      await prisma.showtimeTakenSeat.createMany({
        data: [
          { showtimeId: showtime.id, seatId: fixtures.seats[0].id },
          { showtimeId: showtime.id, seatId: fixtures.seats[1].id },
        ],
      })

      await prisma.ticket.createMany({
        data: [
          {
            orderId: order.id,
            showtimeId: showtime.id,
            seatId: fixtures.seats[0].id,
            status: ticketStatus.reserved,
            unitPrice: 10,
          },
          {
            orderId: order.id,
            showtimeId: showtime.id,
            seatId: fixtures.seats[1].id,
            status: ticketStatus.reserved,
            unitPrice: 10,
          },
        ],
      })

      const { response, body } = await getJson<{
        occupancy: Array<{
          showtimeId: number
          filmTitle: string
          hallName: string
          occupancyPercent: number
          availableSeats: number
          totalSeats: number
        }>
      }>('/api/admin/analytics', {
        cookies: adminCookies,
      })

      const occupancyRow = body.occupancy.find((row) => row.showtimeId === showtime.id)

      expect(response.status).toBe(200)
      expect(occupancyRow).toEqual({
        showtimeId: showtime.id,
        filmTitle: fixtures.filmA.title,
        hallName: fixtures.hallA.name,
        occupancyPercent: 67,
        availableSeats: 1,
        totalSeats: fixtures.hallA.capacity,
      })
    })
  })

  describe('POST /api/admin/genres', () => {
    it('creates a genre with valid payload and the client receives 201 with the created genre', async () => {
      const adminCookies = await loginAsRole(userRole.admin)
      const name = uniqueName('genre-create')

      const response = await postJson('/api/admin/genres', { name }, { cookies: adminCookies })
      const body = await response.json()

      expect(response.status).toBe(201)
      expect(body).toMatchObject({ name })
    })

    it('rejects invalid payload through schema validation and the client receives 400', async () => {
      const adminCookies = await loginAsRole(userRole.admin)
      const response = await postJson('/api/admin/genres', { name: '' }, { cookies: adminCookies })

      expect(response.status).toBe(400)
    })

    it('rejects duplicate genre names and the client receives a failure response', async () => {
      const adminCookies = await loginAsRole(userRole.admin)
      const fixtures = await createAdminFixtureBundle()

      const response = await postJson('/api/admin/genres', { name: fixtures.genreA.name }, { cookies: adminCookies })

      expect(response.status).toBe(400)
      expect(await response.text()).toBe('Could not create genre')
    })
  })

  describe('PATCH /api/admin/genres/:genreId', () => {
    it('updates an existing genre and the client receives 200 with the updated genre', async () => {
      const adminCookies = await loginAsRole(userRole.admin)
      const fixtures = await createAdminFixtureBundle()
      const name = uniqueName('genre-updated')

      const response = await patchJson(`/api/admin/genres/${fixtures.genreA.id}`, { name }, { cookies: adminCookies })
      const body = await response.json()

      expect(response.status).toBe(200)
      expect(body).toMatchObject({
        id: fixtures.genreA.id,
        name,
      })
    })

    it('rejects an invalid genreId route param and the client receives 400', async () => {
      const adminCookies = await loginAsRole(userRole.admin)
      const response = await patchJson('/api/admin/genres/not-a-genre', { name: 'x' }, { cookies: adminCookies })

      expect(response.status).toBe(400)
      expect(await response.text()).toBe('Invalid id')
    })

    it('rejects a missing genre and the client receives 404', async () => {
      const adminCookies = await loginAsRole(userRole.admin)
      const response = await patchJson('/api/admin/genres/999999999', { name: 'x' }, { cookies: adminCookies })

      expect(response.status).toBe(404)
      expect(await response.text()).toBe('Genre not found')
    })

    it('rejects invalid payload through schema validation and the client receives 400', async () => {
      const adminCookies = await loginAsRole(userRole.admin)
      const fixtures = await createAdminFixtureBundle()
      const response = await patchJson(`/api/admin/genres/${fixtures.genreA.id}`, { name: '' }, { cookies: adminCookies })

      expect(response.status).toBe(400)
    })
  })

  describe('DELETE /api/admin/genres/:genreId', () => {
    it('deletes an existing genre and the client receives the deleted genre payload', async () => {
      const adminCookies = await loginAsRole(userRole.admin)
      const name = uniqueName('genre-delete')
      const genre = await prisma.genre.create({
        data: { name },
      })

      const response = await apiRequest(`/api/admin/genres/${genre.id}`, {
        method: 'DELETE',
        cookies: adminCookies,
      })

      const body = await response.json()
      const deleted = await prisma.genre.findUnique({ where: { id: genre.id } })

      expect(response.status).toBe(200)
      expect(body).toMatchObject({
        id: genre.id,
        name,
      })
      expect(deleted).toBeNull()
    })

    it('rejects an invalid genreId route param and the client receives 400', async () => {
      const adminCookies = await loginAsRole(userRole.admin)
      const response = await apiRequest('/api/admin/genres/not-a-genre', {
        method: 'DELETE',
        cookies: adminCookies,
      })

      expect(response.status).toBe(400)
      expect(await response.text()).toBe('Invalid id')
    })

    it('rejects a missing genre and the client receives 404', async () => {
      const adminCookies = await loginAsRole(userRole.admin)
      const response = await apiRequest('/api/admin/genres/999999999', {
        method: 'DELETE',
        cookies: adminCookies,
      })

      expect(response.status).toBe(404)
      expect(await response.text()).toBe('Genre not found')
    })
  })

  describe('POST /api/admin/showtimes/auto', () => {
    it('auto-generates showtimes for valid input and the client receives 201 with the number of created showtimes', async () => {
      const adminCookies = await loginAsRole(userRole.admin)
      const fixtures = await createAdminFixtureBundle()
      const startDate = localDateOnly(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000))
      const endDate = startDate

      const response = await postJson(
        '/api/admin/showtimes/auto',
        {
          theatreId: fixtures.theatreA.id,
          filmIds: [fixtures.filmA.id, fixtures.filmB.id],
          startDate,
          endDate,
          hallId: fixtures.hallA.id,
        },
        { cookies: adminCookies },
      )

      const body = await response.json()
      const createdShowtimes = await prisma.showtime.findMany({
        where: {
          hallId: fixtures.hallA.id,
          filmId: { in: [fixtures.filmA.id, fixtures.filmB.id] },
          startsAt: {
            gte: new Date(`${startDate}T00:00:00.000Z`),
            lte: new Date(`${endDate}T23:59:59.999Z`),
          },
        },
      })

      expect(response.status).toBe(201)
      expect(body.created).toBeGreaterThan(0)
      expect(createdShowtimes).toHaveLength(body.created)
    })

    it('uses the requested hallId when it belongs to the selected theatre', async () => {
      const adminCookies = await loginAsRole(userRole.admin)
      const fixtures = await createAdminFixtureBundle()
      const startDate = localDateOnly(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000))

      const response = await postJson(
        '/api/admin/showtimes/auto',
        {
          theatreId: fixtures.theatreA.id,
          filmIds: [fixtures.filmA.id],
          startDate,
          endDate: startDate,
          hallId: fixtures.hallAAlt.id,
        },
        { cookies: adminCookies },
      )

      const createdShowtimes = await prisma.showtime.findMany({
        where: {
          filmId: fixtures.filmA.id,
          startsAt: {
            gte: new Date(`${startDate}T00:00:00.000Z`),
            lte: new Date(`${startDate}T23:59:59.999Z`),
          },
        },
      })

      expect(response.status).toBe(201)
      expect(createdShowtimes.length).toBeGreaterThan(0)
      expect(createdShowtimes.every((showtime) => showtime.hallId === fixtures.hallAAlt.id)).toBe(true)
    })

    it('falls back to the first hall of the theatre when hallId is omitted', async () => {
      const adminCookies = await loginAsRole(userRole.admin)
      const fixtures = await createAdminFixtureBundle()
      const startDate = localDateOnly(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))

      const response = await postJson(
        '/api/admin/showtimes/auto',
        {
          theatreId: fixtures.theatreA.id,
          filmIds: [fixtures.filmA.id],
          startDate,
          endDate: startDate,
        },
        { cookies: adminCookies },
      )

      const createdShowtimes = await prisma.showtime.findMany({
        where: {
          filmId: fixtures.filmA.id,
          startsAt: {
            gte: new Date(`${startDate}T00:00:00.000Z`),
            lte: new Date(`${startDate}T23:59:59.999Z`),
          },
        },
      })

      expect(response.status).toBe(201)
      expect(createdShowtimes.length).toBeGreaterThan(0)
      expect(createdShowtimes.every((showtime) => showtime.hallId === fixtures.hallA.id)).toBe(true)
    })

    it('rejects a startDate that is after endDate and the client receives 400', async () => {
      const adminCookies = await loginAsRole(userRole.admin)
      const fixtures = await createAdminFixtureBundle()

      const response = await postJson(
        '/api/admin/showtimes/auto',
        {
          theatreId: fixtures.theatreA.id,
          filmIds: [fixtures.filmA.id],
          startDate: '2026-05-12',
          endDate: '2026-05-11',
        },
        { cookies: adminCookies },
      )

      expect(response.status).toBe(400)
      expect(await response.text()).toBe('startDate must be before endDate')
    })

    it('rejects a theatre with no halls and the client receives 400', async () => {
      const adminCookies = await loginAsRole(userRole.admin)
      const fixtures = await createAdminFixtureBundle()
      const theatre = await prisma.theatre.create({
        data: {
          name: uniqueName('theatre-without-halls'),
          city: uniqueName('city-without-halls'),
        },
      })

      const response = await postJson(
        '/api/admin/showtimes/auto',
        {
          theatreId: theatre.id,
          filmIds: [fixtures.filmA.id],
          startDate: '2026-05-11',
          endDate: '2026-05-11',
        },
        { cookies: adminCookies },
      )

      expect(response.status).toBe(400)
      expect(await response.text()).toBe('Selected cinema has no halls')
    })

    it('rejects a hallId that does not belong to the selected theatre and the client receives 400', async () => {
      const adminCookies = await loginAsRole(userRole.admin)
      const fixtures = await createAdminFixtureBundle()

      const response = await postJson(
        '/api/admin/showtimes/auto',
        {
          theatreId: fixtures.theatreA.id,
          filmIds: [fixtures.filmA.id],
          startDate: '2026-05-11',
          endDate: '2026-05-11',
          hallId: fixtures.hallB.id,
        },
        { cookies: adminCookies },
      )

      expect(response.status).toBe(400)
      expect(await response.text()).toBe('Hall does not belong to selected cinema')
    })

    it('rejects an input set where no films are found and the client receives 400', async () => {
      const adminCookies = await loginAsRole(userRole.admin)
      const fixtures = await createAdminFixtureBundle()

      const response = await postJson(
        '/api/admin/showtimes/auto',
        {
          theatreId: fixtures.theatreA.id,
          filmIds: [999999999],
          startDate: '2026-05-11',
          endDate: '2026-05-11',
        },
        { cookies: adminCookies },
      )

      expect(response.status).toBe(400)
      expect(await response.text()).toBe('No films found for the provided ids')
    })

    it('rejects a date range that cannot produce any showtimes and the client receives 400', async () => {
      const adminCookies = await loginAsRole(userRole.admin)
      const fixtures = await createAdminFixtureBundle()
      const longFilm = await prisma.film.create({
        data: {
          title: uniqueName('film-too-long'),
          posterUrl: 'https://example.com/poster-too-long.jpg',
          durationMin: 1000,
          theatreId: fixtures.theatreA.id,
        },
      })

      const response = await postJson(
        '/api/admin/showtimes/auto',
        {
          theatreId: fixtures.theatreA.id,
          filmIds: [longFilm.id],
          startDate: '2026-05-11',
          endDate: '2026-05-11',
          hallId: fixtures.hallA.id,
        },
        { cookies: adminCookies },
      )

      expect(response.status).toBe(400)
      expect(await response.text()).toBe('No showtimes could be generated with given range')
    })

    it('rejects invalid payload through schema validation and the client receives 400', async () => {
      const adminCookies = await loginAsRole(userRole.admin)

      const response = await postJson(
        '/api/admin/showtimes/auto',
        {
          theatreId: 'not-a-number',
          filmIds: [],
          startDate: 'not-a-date',
          endDate: 'not-a-date',
        },
        { cookies: adminCookies },
      )

      expect(response.status).toBe(400)
    })
  })

  describe('DELETE /api/admin/showtimes/:showtimeId', () => {
    it('deletes an existing showtime and the client receives 204 with no content', async () => {
      const adminCookies = await loginAsRole(userRole.admin)
      const fixtures = await createAdminFixtureBundle()
      const showtime = await createShowtime(
        fixtures.filmA.id,
        fixtures.hallA.id,
        new Date('2026-05-15T10:00:00.000Z'),
        new Date('2026-05-15T12:00:00.000Z'),
      )

      const response = await apiRequest(`/api/admin/showtimes/${showtime.id}`, {
        method: 'DELETE',
        cookies: adminCookies,
      })

      const deleted = await prisma.showtime.findUnique({ where: { id: showtime.id } })

      expect(response.status).toBe(204)
      expect(deleted).toBeNull()
    })

    it('rejects an invalid showtimeId route param and the client receives 400', async () => {
      const adminCookies = await loginAsRole(userRole.admin)
      const response = await apiRequest('/api/admin/showtimes/not-a-showtime', {
        method: 'DELETE',
        cookies: adminCookies,
      })

      expect(response.status).toBe(400)
      expect(await response.text()).toBe('Invalid id')
    })

    it('rejects a missing showtime and the client receives 404', async () => {
      const adminCookies = await loginAsRole(userRole.admin)
      const response = await apiRequest('/api/admin/showtimes/999999999', {
        method: 'DELETE',
        cookies: adminCookies,
      })

      expect(response.status).toBe(404)
      expect(await response.text()).toBe('Showtime not found')
    })
  })
})
