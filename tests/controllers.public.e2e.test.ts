// @vitest-environment node
import '../Backend/env.ts'

import { afterAll, afterEach, describe, expect, it } from 'vitest'
import { seatType } from '@prisma/client'
import prisma from '../Backend/db.ts'

const BASE_URL = 'http://127.0.0.1:3000'
const TEST_PREFIX = 'public-e2e-'

type QueryValue = string | number | undefined

function uniqueName(suffix: string): string {
  return `${TEST_PREFIX}${suffix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function localDateOnly(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function buildUrl(path: string, query?: Record<string, QueryValue>): string {
  const url = new URL(`${BASE_URL}${path}`)

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.set(key, String(value))
    }
  })

  return url.toString()
}

async function apiGet(path: string, query?: Record<string, QueryValue>): Promise<globalThis.Response> {
  return await fetch(buildUrl(path, query))
}

async function getJson<T>(path: string, query?: Record<string, QueryValue>) {
  const response = await apiGet(path, query)
  const body = (await response.json()) as T
  return { response, body }
}

async function createPublicFixtureBundle() {
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
      description: 'Public e2e film alpha',
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
      description: 'Public e2e film beta',
      releaseDate: new Date('2024-02-01T00:00:00.000Z'),
      durationMin: 110,
      posterUrl: 'https://example.com/poster-beta.jpg',
      theatreId: theatreB.id,
      director: 'Director Beta',
      language: 'EN',
      rating: 'R',
      trailerUrl: 'https://example.com/trailer-beta',
    },
  })

  await prisma.filmGenre.createMany({
    data: [
      { filmId: filmA.id, genreId: genreA.id },
      { filmId: filmB.id, genreId: genreB.id },
    ],
  })

  const actorA = await prisma.actor.create({
    data: {
      name: uniqueName('actor-alpha'),
      filmId: filmA.id,
      imageUrl: 'https://example.com/actor-alpha.jpg',
      link: 'https://example.com/actor-alpha',
      character: 'Hero Alpha',
    },
  })

  const reviewA = await prisma.review.create({
    data: {
      filmId: filmA.id,
      author: uniqueName('reviewer-alpha'),
      rating: 5,
      comment: 'Excellent',
    },
  })

  const now = new Date()
  const futureStart = new Date(now)
  futureStart.setMinutes(futureStart.getMinutes() + 30, 0, 0)
  const futureEnd = new Date(futureStart.getTime() + 120 * 60 * 1000)
  const todayPastStart = new Date(now)
  todayPastStart.setMinutes(Math.max(now.getMinutes() - 30, 0), 0, 0)
  if (todayPastStart >= now) {
    todayPastStart.setTime(now.getTime() - 60 * 1000)
  }
  const todayPastEnd = new Date(todayPastStart.getTime() + 90 * 60 * 1000)
  const tomorrowStart = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  const tomorrowEnd = new Date(tomorrowStart.getTime() + 110 * 60 * 1000)

  const showtimeFuture = await prisma.showtime.create({
    data: {
      filmId: filmA.id,
      hallId: hallA.id,
      startsAt: futureStart,
      endsAt: futureEnd,
      isCanceled: false,
    },
  })

  const showtimePastToday = await prisma.showtime.create({
    data: {
      filmId: filmB.id,
      hallId: hallB.id,
      startsAt: todayPastStart,
      endsAt: todayPastEnd,
      isCanceled: false,
    },
  })

  const showtimeTomorrow = await prisma.showtime.create({
    data: {
      filmId: filmB.id,
      hallId: hallB.id,
      startsAt: tomorrowStart,
      endsAt: tomorrowEnd,
      isCanceled: false,
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

  const seats = [seatA, seatB, seatC]

  const takenSeat = await prisma.showtimeTakenSeat.create({
    data: {
      showtimeId: showtimeFuture.id,
      seatId: seats[1].id,
    },
  })

  return {
    theatreA,
    theatreB,
    hallA,
    hallB,
    genreA,
    genreB,
    filmA,
    filmB,
    actorA,
    reviewA,
    showtimeFuture,
    showtimePastToday,
    showtimeTomorrow,
    seats,
    takenSeat,
  }
}

async function cleanupPublicFixtures() {
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
      ],
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
}

afterEach(async () => {
  await cleanupPublicFixtures()
})

afterAll(async () => {
  await prisma.$disconnect()
})

describe('Public data controllers e2e', () => {
  describe('GET /api/theatres', () => {
    it('returns all theatres when no filters are provided and the client receives 200 with an array', async () => {
      const fixtures = await createPublicFixtureBundle()
      const { response, body } = await getJson<Array<{ id: number; name: string; city: string }>>('/api/theatres')

      expect(response.status).toBe(200)
      expect(Array.isArray(body)).toBe(true)
      expect(body.some((theatre) => theatre.id === fixtures.theatreA.id)).toBe(true)
      expect(body.some((theatre) => theatre.id === fixtures.theatreB.id)).toBe(true)
    })

    it('returns one theatre when a valid theatreId query is provided and the client receives 200 with a single theatre object', async () => {
      const fixtures = await createPublicFixtureBundle()
      const { response, body } = await getJson<{ id: number; name: string; city: string }>('/api/theatres', {
        theatreId: fixtures.theatreA.id,
      })

      expect(response.status).toBe(200)
      expect(body).toMatchObject({
        id: fixtures.theatreA.id,
        name: fixtures.theatreA.name,
        city: fixtures.theatreA.city,
      })
    })

    it('filters theatres by city and the client receives only matching theatres', async () => {
      const fixtures = await createPublicFixtureBundle()
      const { response, body } = await getJson<Array<{ id: number; city: string }>>('/api/theatres', {
        city: fixtures.theatreA.city,
      })

      expect(response.status).toBe(200)
      expect(body.length).toBeGreaterThan(0)
      expect(body.every((theatre) => theatre.city === fixtures.theatreA.city)).toBe(true)
      expect(body.some((theatre) => theatre.id === fixtures.theatreA.id)).toBe(true)
      expect(body.some((theatre) => theatre.id === fixtures.theatreB.id)).toBe(false)
    })

    it('filters theatres by search text and the client receives only matching theatres', async () => {
      const fixtures = await createPublicFixtureBundle()
      const search = fixtures.theatreA.name.slice(-8)
      const { response, body } = await getJson<Array<{ id: number; name: string }>>('/api/theatres', {
        search,
      })

      expect(response.status).toBe(200)
      expect(body.length).toBeGreaterThan(0)
      expect(body.every((theatre) => theatre.name.toLowerCase().includes(search.toLowerCase()))).toBe(true)
      expect(body.some((theatre) => theatre.id === fixtures.theatreA.id)).toBe(true)
    })

    it('orders theatres by name when no orderBy is given and the client receives a name-sorted list', async () => {
      await createPublicFixtureBundle()
      const { response, body } = await getJson<Array<{ name: string }>>('/api/theatres')
      const names = body.map((theatre) => theatre.name)
      const sorted = [...names].sort((a, b) => a.localeCompare(b))

      expect(response.status).toBe(200)
      expect(names).toEqual(sorted)
    })

    it('orders theatres by city when orderBy=city and the client receives a city-sorted list', async () => {
      await createPublicFixtureBundle()
      const { response, body } = await getJson<Array<{ city: string }>>('/api/theatres', { orderBy: 'city' })
      const cities = body.map((theatre) => theatre.city)
      const sorted = [...cities].sort((a, b) => a.localeCompare(b))

      expect(response.status).toBe(200)
      expect(cities).toEqual(sorted)
    })

    it('rejects an invalid theatreId query and the client receives 400', async () => {
      const response = await apiGet('/api/theatres', { theatreId: 'abc' })

      expect(response.status).toBe(400)
      expect(await response.text()).toContain('Invalid theatreId')
    })
  })

  describe('GET /api/halls', () => {
    it('returns all halls when no theatreId query is provided and the client receives 200 with an array', async () => {
      const fixtures = await createPublicFixtureBundle()
      const { response, body } = await getJson<Array<{ id: number; theatreId: number; name: string }>>('/api/halls')

      expect(response.status).toBe(200)
      expect(Array.isArray(body)).toBe(true)
      expect(body.some((hall) => hall.id === fixtures.hallA.id)).toBe(true)
      expect(body.some((hall) => hall.id === fixtures.hallB.id)).toBe(true)
    })

    it('returns only halls for the requested theatre when a valid theatreId query is provided', async () => {
      const fixtures = await createPublicFixtureBundle()
      const { response, body } = await getJson<Array<{ id: number; theatreId: number }>>('/api/halls', {
        theatreId: fixtures.theatreA.id,
      })

      expect(response.status).toBe(200)
      expect(body.length).toBeGreaterThan(0)
      expect(body.every((hall) => hall.theatreId === fixtures.theatreA.id)).toBe(true)
      expect(body.some((hall) => hall.id === fixtures.hallA.id)).toBe(true)
      expect(body.some((hall) => hall.id === fixtures.hallB.id)).toBe(false)
    })

    it('rejects an invalid theatreId query and the client receives 400', async () => {
      const response = await apiGet('/api/halls', { theatreId: 'abc' })

      expect(response.status).toBe(400)
      expect(await response.text()).toBe('Invalid theatreId')
    })
  })

  describe('GET /api/showtimes', () => {
    it('returns showtime DTOs for a valid filter set and the client receives 200 with showtime, film, hall, theatre, and stats fields', async () => {
      const fixtures = await createPublicFixtureBundle()
      const { response, body } = await getJson<
        Array<{
          id: number
          film: { id: number; title: string }
          hall: { id: number; name: string; capacity: number }
          theatre: { id: number; name: string }
          stats: { totalSeats: number; availableSeats: number; occupancyPercent: number }
        }>
      >('/api/showtimes', {
        showtimeId: fixtures.showtimeFuture.id,
      })

      expect(response.status).toBe(200)
      expect(body).toHaveLength(1)
      expect(body[0]).toMatchObject({
        id: fixtures.showtimeFuture.id,
        film: { id: fixtures.filmA.id, title: fixtures.filmA.title },
        hall: { id: fixtures.hallA.id, name: fixtures.hallA.name, capacity: fixtures.hallA.capacity },
        theatre: { id: fixtures.theatreA.id, name: fixtures.theatreA.name },
        stats: { totalSeats: fixtures.hallA.capacity, availableSeats: fixtures.hallA.capacity - 1, occupancyPercent: 33 },
      })
    })

    it('returns showtimes filtered by theatreId, filmId, hallId, date, genreId, filmTitle, or showtimeId when those queries are provided', async () => {
      const fixtures = await createPublicFixtureBundle()
      const futureDate = localDateOnly(fixtures.showtimeFuture.startsAt)

      const theatreResult = await getJson<Array<{ id: number }>>('/api/showtimes', {
        theatreId: fixtures.theatreA.id,
      })
      const filmResult = await getJson<Array<{ id: number }>>('/api/showtimes', {
        filmId: fixtures.filmA.id,
      })
      const hallResult = await getJson<Array<{ id: number }>>('/api/showtimes', {
        hallId: fixtures.hallA.id,
      })
      const dateResult = await getJson<Array<{ id: number }>>('/api/showtimes', {
        date: futureDate,
      })
      const genreResult = await getJson<Array<{ id: number }>>('/api/showtimes', {
        genreId: fixtures.genreA.id,
      })
      const titleResult = await getJson<Array<{ id: number }>>('/api/showtimes', {
        filmTitle: fixtures.filmA.title.slice(-10),
      })
      const idResult = await getJson<Array<{ id: number }>>('/api/showtimes', {
        showtimeId: fixtures.showtimeFuture.id,
      })

      expect(theatreResult.body.some((showtime) => showtime.id === fixtures.showtimeFuture.id)).toBe(true)
      expect(filmResult.body.some((showtime) => showtime.id === fixtures.showtimeFuture.id)).toBe(true)
      expect(hallResult.body.some((showtime) => showtime.id === fixtures.showtimeFuture.id)).toBe(true)
      expect(dateResult.body.some((showtime) => showtime.id === fixtures.showtimeFuture.id)).toBe(true)
      expect(genreResult.body.some((showtime) => showtime.id === fixtures.showtimeFuture.id)).toBe(true)
      expect(titleResult.body.some((showtime) => showtime.id === fixtures.showtimeFuture.id)).toBe(true)
      expect(idResult.body).toHaveLength(1)
      expect(idResult.body[0]?.id).toBe(fixtures.showtimeFuture.id)
    })

    it('rejects an invalid query shape through schema validation and the client receives 400 with validation errors', async () => {
      const { response, body } = await getJson<{ errors: string[] }>('/api/showtimes', {
        filmId: 'not-a-number',
      })

      expect(response.status).toBe(400)
      expect(Array.isArray(body.errors)).toBe(true)
      expect(body.errors.some((error) => error.includes('filmId'))).toBe(true)
    })

    it('does not return already-started showtimes for the current day when the client requests today', async () => {
      const fixtures = await createPublicFixtureBundle()
      const today = localDateOnly(new Date())
      const { response, body } = await getJson<Array<{ id: number }>>('/api/showtimes', { date: today })

      expect(response.status).toBe(200)
      expect(body.some((showtime) => showtime.id === fixtures.showtimePastToday.id)).toBe(false)

      if (localDateOnly(fixtures.showtimeFuture.startsAt) === today) {
        expect(body.some((showtime) => showtime.id === fixtures.showtimeFuture.id)).toBe(true)
      }
    })
  })

  describe('GET /api/showtimes/:showtimeId/:hallId/seats', () => {
    it('returns the hall seat map for a valid showtime and hall and the client receives 200 with row, column, type, and isTaken fields', async () => {
      const fixtures = await createPublicFixtureBundle()
      const { response, body } = await getJson<
        Array<{ id: number; row: string; column: number; type: seatType; isTaken: boolean }>
      >(`/api/showtimes/${fixtures.showtimeFuture.id}/${fixtures.hallA.id}/seats`)

      expect(response.status).toBe(200)
      expect(body).toHaveLength(3)
      expect(body[0]).toMatchObject({
        row: 'A',
        column: 1,
      })
      expect(body.every((seat) => 'type' in seat && 'isTaken' in seat)).toBe(true)
    })

    it('marks already taken seats with isTaken=true so the client can disable them in the seat picker', async () => {
      const fixtures = await createPublicFixtureBundle()
      const { response, body } = await getJson<Array<{ id: number; isTaken: boolean }>>(
        `/api/showtimes/${fixtures.showtimeFuture.id}/${fixtures.hallA.id}/seats`,
      )

      expect(response.status).toBe(200)
      expect(body.find((seat) => seat.id === fixtures.seats[1].id)?.isTaken).toBe(true)
      expect(body.find((seat) => seat.id === fixtures.seats[0].id)?.isTaken).toBe(false)
    })

    it('rejects invalid route params and the client receives 400', async () => {
      const response = await apiGet('/api/showtimes/not-a-showtime/not-a-hall/seats')

      expect(response.status).toBe(400)
      expect(await response.text()).toContain('hallId or showtimeId invalid')
    })

    it('rejects a hall-showtime combination that does not exist and the client receives a failure response', async () => {
      const fixtures = await createPublicFixtureBundle()
      const response = await apiGet(`/api/showtimes/${fixtures.showtimeFuture.id}/${fixtures.hallB.id}/seats`)

      expect(response.status).toBe(400)
      expect(await response.text()).toBe('Failed to get seats')
    })
  })

  describe('GET /api/films', () => {
    it('returns all films when no query is provided and the client receives 200 with an array', async () => {
      const fixtures = await createPublicFixtureBundle()
      const { response, body } = await getJson<Array<{ id: number; title: string }>>('/api/films')

      expect(response.status).toBe(200)
      expect(Array.isArray(body)).toBe(true)
      expect(body.some((film) => film.id === fixtures.filmA.id)).toBe(true)
      expect(body.some((film) => film.id === fixtures.filmB.id)).toBe(true)
    })

    it('returns one film with extras when filmId is provided and the client receives film, genreIds, and reviews', async () => {
      const fixtures = await createPublicFixtureBundle()
      const { response, body } = await getJson<{
        film: { id: number; title: string }
        genreIds: number[]
        reviews: Array<{ id: number; author: string }>
      }>('/api/films', {
        filmId: fixtures.filmA.id,
      })

      expect(response.status).toBe(200)
      expect(body.film).toMatchObject({
        id: fixtures.filmA.id,
        title: fixtures.filmA.title,
      })
      expect(body.genreIds).toContain(fixtures.genreA.id)
      expect(body.reviews.some((review) => review.id === fixtures.reviewA.id)).toBe(true)
    })

    it('returns films for one theatre when theatreId is provided and the client receives only matching films', async () => {
      const fixtures = await createPublicFixtureBundle()
      const { response, body } = await getJson<Array<{ id: number; theatreId: number | null }>>('/api/films', {
        theatreId: fixtures.theatreA.id,
      })

      expect(response.status).toBe(200)
      expect(body.length).toBeGreaterThan(0)
      expect(body.every((film) => film.theatreId === fixtures.theatreA.id)).toBe(true)
      expect(body.some((film) => film.id === fixtures.filmA.id)).toBe(true)
      expect(body.some((film) => film.id === fixtures.filmB.id)).toBe(false)
    })

    it('returns a failure response when filmId points to a missing film', async () => {
      const response = await apiGet('/api/films', { filmId: 999999999 })

      expect(response.status).toBe(400)
      expect(await response.text()).toBe('Failed to fetch films')
    })
  })

  describe('GET /api/actors', () => {
    it('returns all actors when no filmId query is provided and the client receives 200 with an array', async () => {
      const fixtures = await createPublicFixtureBundle()
      const { response, body } = await getJson<Array<{ id: number; filmId: number; name: string }>>('/api/actors')

      expect(response.status).toBe(200)
      expect(Array.isArray(body)).toBe(true)
      expect(body.some((actor) => actor.id === fixtures.actorA.id)).toBe(true)
    })

    it('returns actors for one film when a valid filmId query is provided', async () => {
      const fixtures = await createPublicFixtureBundle()
      const { response, body } = await getJson<Array<{ id: number; filmId: number }>>('/api/actors', {
        filmId: fixtures.filmA.id,
      })

      expect(response.status).toBe(200)
      expect(body.length).toBeGreaterThan(0)
      expect(body.every((actor) => actor.filmId === fixtures.filmA.id)).toBe(true)
      expect(body.some((actor) => actor.id === fixtures.actorA.id)).toBe(true)
    })

    it('rejects an invalid filmId query and the client receives 400', async () => {
      const response = await apiGet('/api/actors', { filmId: 'abc' })

      expect(response.status).toBe(400)
      expect(await response.text()).toBe('Invalid film id')
    })
  })

  describe('GET /api/genres', () => {
    it('returns all genres and the client receives 200 with an array', async () => {
      const fixtures = await createPublicFixtureBundle()
      const { response, body } = await getJson<Array<{ id: number; name: string }>>('/api/genres')

      expect(response.status).toBe(200)
      expect(Array.isArray(body)).toBe(true)
      expect(body.some((genre) => genre.id === fixtures.genreA.id)).toBe(true)
      expect(body.some((genre) => genre.id === fixtures.genreB.id)).toBe(true)
    })
  })

  describe('GET /api/seat-prices', () => {
    it('returns configured seat prices and the client receives 200 with type-price pairs', async () => {
      const { response, body } = await getJson<Array<{ type: seatType; price: number }>>('/api/seat-prices')

      expect(response.status).toBe(200)
      expect(Array.isArray(body)).toBe(true)
      expect(body.length).toBeGreaterThan(0)
      expect(body.every((price) => typeof price.price === 'number')).toBe(true)
      expect(body.some((price) => price.type === seatType.Standard)).toBe(true)
    })

    it.skip('returns a failure response if seat prices cannot be loaded', () => {
      // This needs a controlled DB fault or a test-only seam in the endpoint.
    })
  })
})
