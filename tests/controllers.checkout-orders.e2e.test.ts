// @vitest-environment node
import '../Backend/env.ts'

import { afterAll, afterEach, describe, expect, it } from 'vitest'
import { orderStatus, seatType, ticketStatus, userRole } from '@prisma/client'
import prisma from '../Backend/db.ts'
import passwordUtils from '../Backend/utils/passwordUtils.ts'

const BASE_URL = 'http://127.0.0.1:3000'
const JSON_HEADERS = { 'content-type': 'application/json' }
const TEST_PREFIX = 'checkout-e2e-'
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

async function createUser(email: string, role: userRole = userRole.user, password: string = TEST_PASSWORD) {
  const hashedPassword = await passwordUtils.createhash(password)

  return await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role,
    },
  })
}

async function loginAsUser(email: string = testEmail('login-user')): Promise<{ email: string; cookies: string[] }> {
  await createUser(email)

  const response = await postJson('/api/auth/users/login', {
    email,
    password: TEST_PASSWORD,
  })

  expect(response.status).toBe(200)
  return { email, cookies: cookiePairs(getSetCookies(response)) }
}

async function createCheckoutFixtureBundle() {
  const theatre = await prisma.theatre.create({
    data: {
      name: uniqueName('theatre'),
      city: uniqueName('city'),
    },
  })

  const hall = await prisma.hall.create({
    data: {
      theatreId: theatre.id,
      name: uniqueName('hall'),
      capacity: 12,
    },
  })

  const otherHall = await prisma.hall.create({
    data: {
      theatreId: theatre.id,
      name: uniqueName('other-hall'),
      capacity: 4,
    },
  })

  const film = await prisma.film.create({
    data: {
      title: uniqueName('film'),
      description: 'Checkout e2e film',
      releaseDate: new Date('2024-01-01T00:00:00.000Z'),
      durationMin: 120,
      posterUrl: 'https://example.com/poster-checkout.jpg',
      theatreId: theatre.id,
      director: 'Director Checkout',
      language: 'EN',
      rating: 'PG-13',
      trailerUrl: 'https://example.com/trailer-checkout',
    },
  })

  const start = new Date(Date.now() + 24 * 60 * 60 * 1000)
  start.setHours(18, 0, 0, 0)
  const end = new Date(start.getTime() + 120 * 60 * 1000)

  const showtime = await prisma.showtime.create({
    data: {
      filmId: film.id,
      hallId: hall.id,
      startsAt: start,
      endsAt: end,
      isCanceled: false,
    },
  })

  const seats = await Promise.all([
    prisma.seat.create({
      data: { hallId: hall.id, row: 'A', column: 1, type: seatType.Standard },
    }),
    prisma.seat.create({
      data: { hallId: hall.id, row: 'A', column: 2, type: seatType.Premium },
    }),
    prisma.seat.create({
      data: { hallId: hall.id, row: 'A', column: 3, type: seatType.Double },
    }),
    prisma.seat.create({
      data: { hallId: hall.id, row: 'A', column: 4, type: seatType.Standard },
    }),
    prisma.seat.create({
      data: { hallId: hall.id, row: 'A', column: 5, type: seatType.Standard },
    }),
    prisma.seat.create({
      data: { hallId: hall.id, row: 'A', column: 6, type: seatType.Standard },
    }),
    prisma.seat.create({
      data: { hallId: hall.id, row: 'A', column: 7, type: seatType.Standard },
    }),
    prisma.seat.create({
      data: { hallId: hall.id, row: 'A', column: 8, type: seatType.Standard },
    }),
    prisma.seat.create({
      data: { hallId: hall.id, row: 'A', column: 9, type: seatType.Standard },
    }),
    prisma.seat.create({
      data: { hallId: hall.id, row: 'A', column: 10, type: seatType.Standard },
    }),
    prisma.seat.create({
      data: { hallId: hall.id, row: 'A', column: 11, type: seatType.Standard },
    }),
  ])

  const foreignSeat = await prisma.seat.create({
    data: { hallId: otherHall.id, row: 'B', column: 1, type: seatType.Standard },
  })

  return {
    theatre,
    hall,
    otherHall,
    film,
    showtime,
    seats,
    foreignSeat,
  }
}

async function createPendingOrder(params: {
  userId: number
  showtimeId: number
  seatIds: number[]
  expiresAt?: Date | null
}) {
  const reservedAt = new Date()
  const order = await prisma.order.create({
    data: {
      userId: params.userId,
      status: orderStatus.pending,
      expiresAt: params.expiresAt ?? new Date(Date.now() + 15 * 60 * 1000),
    },
  })

  await prisma.ticket.createMany({
    data: params.seatIds.map((seatId) => ({
      orderId: order.id,
      showtimeId: params.showtimeId,
      seatId,
      status: ticketStatus.reserved,
      unitPrice: 12,
      reservedAt,
    })),
  })

  await prisma.showtimeTakenSeat.createMany({
    data: params.seatIds.map((seatId) => ({
      showtimeId: params.showtimeId,
      seatId,
    })),
    skipDuplicates: true,
  })

  return order
}

async function createPaidOrder(params: { userId: number; showtimeId: number; seatIds: number[] }) {
  const now = new Date()
  const order = await prisma.order.create({
    data: {
      userId: params.userId,
      status: orderStatus.paid,
      expiresAt: null,
    },
  })

  await prisma.ticket.createMany({
    data: params.seatIds.map((seatId) => ({
      orderId: order.id,
      showtimeId: params.showtimeId,
      seatId,
      status: ticketStatus.paid,
      unitPrice: 12,
      reservedAt: now,
      paidAt: now,
    })),
  })

  await prisma.showtimeTakenSeat.createMany({
    data: params.seatIds.map((seatId) => ({
      showtimeId: params.showtimeId,
      seatId,
    })),
    skipDuplicates: true,
  })

  return order
}

async function reserveSeats(showtimeId: number, seatIds: number[], email: string) {
  const response = await postJson('/api/checkout/mock', { showtimeId, seatIds, email })
  const body = await response.json()
  return { response, body }
}

async function cleanupCheckoutFixtures() {
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

  await prisma.seat.deleteMany({
    where: {
      hall: { name: { startsWith: TEST_PREFIX } },
    },
  })

  await prisma.showtime.deleteMany({
    where: {
      film: { title: { startsWith: TEST_PREFIX } },
    },
  })

  await prisma.film.deleteMany({
    where: {
      title: { startsWith: TEST_PREFIX },
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
  await cleanupCheckoutFixtures()
})

afterAll(async () => {
  await prisma.$disconnect()
})

describe('Checkout and orders controllers e2e', () => {
  describe('POST /api/checkout/mock', () => {
    it('creates a pending reservation for valid showtimeId, seatIds, and email and the client receives 201 with orderId, reservedSeats, expiresAt, total, and notice', async () => {
      const fixtures = await createCheckoutFixtureBundle()
      const email = testEmail('mock-reservation')

      const { response, body } = await reserveSeats(
        fixtures.showtime.id,
        [fixtures.seats[0].id, fixtures.seats[1].id, fixtures.seats[2].id],
        email,
      )

      const user = await prisma.user.findUnique({ where: { email } })
      const order = await prisma.order.findFirst({
        where: { userId: user?.id },
        include: { tickets: true },
      })
      const takenSeats = await prisma.showtimeTakenSeat.findMany({
        where: { showtimeId: fixtures.showtime.id },
        orderBy: { seatId: 'asc' },
      })

      expect(response.status).toBe(201)
      expect(body).toMatchObject({
        orderId: expect.any(String),
        reservedSeats: [fixtures.seats[0].id, fixtures.seats[1].id, fixtures.seats[2].id],
        email,
        total: 44,
        notice: 'Broneering loodud. Hoidke kinnitamiseks 15 minuti jooksul.',
      })
      expect(new Date(body.expiresAt).getTime()).toBeGreaterThan(Date.now())
      expect(user).toBeTruthy()
      expect(order?.status).toBe(orderStatus.pending)
      expect(order?.tickets).toHaveLength(3)
      expect(takenSeats.map((seat) => seat.seatId)).toEqual([fixtures.seats[0].id, fixtures.seats[1].id, fixtures.seats[2].id])
    })

    it('creates a temporary user automatically when the provided email does not belong to an existing account', async () => {
      const fixtures = await createCheckoutFixtureBundle()
      const rawEmail = `  ${testEmail('mock-temp-user')}  `
      const trimmedEmail = rawEmail.trim()

      const { response, body } = await reserveSeats(fixtures.showtime.id, [fixtures.seats[0].id], rawEmail)
      const created = await prisma.user.findUnique({ where: { email: trimmedEmail } })
      const order = await prisma.order.findFirst({
        where: { userId: created?.id },
      })

      expect(response.status).toBe(201)
      expect(created).toBeTruthy()
      expect(created?.role).toBe(userRole.user)
      expect(body.email).toBe(trimmedEmail)
      expect(order).toBeTruthy()
      expect(order?.userId).toBe(created?.id)
    })

    it('rejects a missing showtimeId or empty seatIds array and the client receives 400', async () => {
      const email = testEmail('mock-missing-fields')

      const missingShowtime = await postJson('/api/checkout/mock', {
        seatIds: [1],
        email,
      })
      const emptySeats = await postJson('/api/checkout/mock', {
        showtimeId: 1,
        seatIds: [],
        email,
      })

      expect(missingShowtime.status).toBe(400)
      expect(await missingShowtime.text()).toBe('showtimeId and seatIds are required')
      expect(emptySeats.status).toBe(400)
      expect(await emptySeats.text()).toBe('showtimeId and seatIds are required')
    })

    it('rejects more than 10 selected seats and the client receives 400', async () => {
      const fixtures = await createCheckoutFixtureBundle()
      const email = testEmail('mock-too-many-seats')

      const response = await postJson('/api/checkout/mock', {
        showtimeId: fixtures.showtime.id,
        seatIds: fixtures.seats.map((seat) => seat.id),
        email,
      })

      expect(response.status).toBe(400)
      expect(await response.text()).toBe('Maksimaalselt 10 kohta korraga')
    })

    it('rejects an invalid or empty email and the client receives 400', async () => {
      const fixtures = await createCheckoutFixtureBundle()

      const emptyEmail = await postJson('/api/checkout/mock', {
        showtimeId: fixtures.showtime.id,
        seatIds: [fixtures.seats[0].id],
        email: '  ',
      })
      const shortEmail = await postJson('/api/checkout/mock', {
        showtimeId: fixtures.showtime.id,
        seatIds: [fixtures.seats[0].id],
        email: 'ab',
      })

      expect(emptyEmail.status).toBe(400)
      expect(await emptyEmail.text()).toBe('valid email required')
      expect(shortEmail.status).toBe(400)
      expect(await shortEmail.text()).toBe('valid email required')
    })

    it('rejects a missing showtime and the client receives 404', async () => {
      const response = await postJson('/api/checkout/mock', {
        showtimeId: 999999999,
        seatIds: [1],
        email: testEmail('missing-showtime'),
      })

      expect(response.status).toBe(404)
      expect(await response.text()).toBe('Showtime not found')
    })

    it('rejects seats that do not belong to the selected hall and the client receives 400', async () => {
      const fixtures = await createCheckoutFixtureBundle()

      const response = await postJson('/api/checkout/mock', {
        showtimeId: fixtures.showtime.id,
        seatIds: [fixtures.foreignSeat.id],
        email: testEmail('wrong-hall-seat'),
      })

      expect(response.status).toBe(400)
      expect(await response.text()).toBe('Some seats do not belong to this hall')
    })

    it('rejects seats that are already booked or currently held and the client receives 409', async () => {
      const fixtures = await createCheckoutFixtureBundle()
      const customer = await createUser(testEmail('booked-seat-user'))
      await createPendingOrder({
        userId: customer.id,
        showtimeId: fixtures.showtime.id,
        seatIds: [fixtures.seats[0].id],
      })

      const response = await postJson('/api/checkout/mock', {
        showtimeId: fixtures.showtime.id,
        seatIds: [fixtures.seats[0].id],
        email: testEmail('conflict-requester'),
      })

      expect(response.status).toBe(409)
      expect(await response.text()).toBe('Some seats already booked')
    })

    it('releases expired pending holds before creating a new reservation so the client can successfully reserve newly freed seats', async () => {
      const fixtures = await createCheckoutFixtureBundle()
      const originalUser = await createUser(testEmail('expired-hold-user'))
      const expiredOrder = await createPendingOrder({
        userId: originalUser.id,
        showtimeId: fixtures.showtime.id,
        seatIds: [fixtures.seats[0].id],
        expiresAt: new Date(Date.now() - 60 * 1000),
      })

      const { response, body } = await reserveSeats(fixtures.showtime.id, [fixtures.seats[0].id], testEmail('new-holder'))
      const updatedExpiredOrder = await prisma.order.findUnique({ where: { id: expiredOrder.id } })
      const activeTickets = await prisma.ticket.findMany({
        where: { showtimeId: fixtures.showtime.id, seatId: fixtures.seats[0].id },
      })

      expect(response.status).toBe(201)
      expect(body.reservedSeats).toEqual([fixtures.seats[0].id])
      expect(updatedExpiredOrder?.status).toBe(orderStatus.expired)
      expect(activeTickets).toHaveLength(1)
      expect(activeTickets[0]?.orderId.toString()).toBe(body.orderId)
    })

    it('reuses an existing user account for a reservation instead of creating a duplicate user', async () => {
      const fixtures = await createCheckoutFixtureBundle()
      const email = testEmail('existing-user-reservation')
      const existingUser = await createUser(email)
      const response = await postJson('/api/checkout/mock', {
        showtimeId: fixtures.showtime.id,
        seatIds: [fixtures.seats[0].id],
        email,
      })
      const body = await response.json()
      const users = await prisma.user.findMany({ where: { email } })
      const order = await prisma.order.findFirst({ where: { userId: existingUser.id } })

      expect(response.status).toBe(201)
      expect(body).toMatchObject({
        reservedSeats: [fixtures.seats[0].id],
        total: 12,
      })
      expect(users).toHaveLength(1)
      expect(order?.userId).toBe(existingUser.id)
    })
  })

  describe('POST /api/checkout/cancel', () => {
    it('cancels a pending reservation by orderId and the client receives 200 with canceled=true', async () => {
      const fixtures = await createCheckoutFixtureBundle()
      const user = await createUser(testEmail('cancel-order-user'))
      const order = await createPendingOrder({
        userId: user.id,
        showtimeId: fixtures.showtime.id,
        seatIds: [fixtures.seats[0].id, fixtures.seats[1].id],
      })

      const response = await postJson('/api/checkout/cancel', { orderId: order.id.toString() })
      const body = await response.json()
      const updated = await prisma.order.findUnique({ where: { id: order.id } })

      expect(response.status).toBe(200)
      expect(body).toEqual({ canceled: true })
      expect(updated?.status).toBe(orderStatus.expired)
    })

    it('removes held tickets and taken-seat locks so the seats become available to the client again', async () => {
      const fixtures = await createCheckoutFixtureBundle()
      const user = await createUser(testEmail('cancel-clears-seat-user'))
      const order = await createPendingOrder({
        userId: user.id,
        showtimeId: fixtures.showtime.id,
        seatIds: [fixtures.seats[0].id],
      })

      const response = await postJson('/api/checkout/cancel', { orderId: order.id.toString() })
      const tickets = await prisma.ticket.findMany({
        where: { orderId: order.id },
      })
      const taken = await prisma.showtimeTakenSeat.findMany({
        where: { showtimeId: fixtures.showtime.id, seatId: fixtures.seats[0].id },
      })

      expect(response.status).toBe(200)
      expect(tickets).toHaveLength(0)
      expect(taken).toHaveLength(0)
    })

    it('rejects a missing orderId and the client receives 400', async () => {
      const response = await postJson('/api/checkout/cancel', {})

      expect(response.status).toBe(400)
      expect(await response.text()).toBe('orderId required')
    })

    it('rejects an unknown orderId and the client receives 404', async () => {
      const response = await postJson('/api/checkout/cancel', { orderId: '999999999' })

      expect(response.status).toBe(404)
      expect(await response.text()).toBe('Order not found')
    })

    it('rejects canceling an already paid order and the client receives 400', async () => {
      const fixtures = await createCheckoutFixtureBundle()
      const user = await createUser(testEmail('cancel-paid-user'))
      const order = await createPaidOrder({
        userId: user.id,
        showtimeId: fixtures.showtime.id,
        seatIds: [fixtures.seats[0].id],
      })

      const response = await postJson('/api/checkout/cancel', { orderId: order.id.toString() })

      expect(response.status).toBe(400)
      expect(await response.text()).toBe('Order already paid')
    })
  })

  describe('POST /api/checkout/pay', () => {
    it('marks the authenticated users pending order as paid and the client receives 200 with ok=true', async () => {
      const fixtures = await createCheckoutFixtureBundle()
      const { email, cookies } = await loginAsUser(testEmail('pay-success'))
      const user = await prisma.user.findUniqueOrThrow({ where: { email } })
      const order = await createPendingOrder({
        userId: user.id,
        showtimeId: fixtures.showtime.id,
        seatIds: [fixtures.seats[0].id, fixtures.seats[1].id],
      })

      const response = await postJson('/api/checkout/pay', { orderId: order.id.toString() }, { cookies })
      const body = await response.json()
      const updatedOrder = await prisma.order.findUnique({ where: { id: order.id } })
      const tickets = await prisma.ticket.findMany({ where: { orderId: order.id } })

      expect(response.status).toBe(200)
      expect(body).toEqual({ ok: true })
      expect(updatedOrder?.status).toBe(orderStatus.paid)
      expect(updatedOrder?.expiresAt).toBeNull()
      expect(tickets.every((ticket) => ticket.status === ticketStatus.paid && ticket.paidAt)).toBe(true)
    })

    it('rejects the request when the client is not authenticated and receives 401 Unauthorized', async () => {
      const response = await postJson('/api/checkout/pay', { orderId: '1' })

      expect(response.status).toBe(401)
      expect(await response.text()).toBe('Unauthorized')
    })

    it('rejects a missing orderId and the client receives 400', async () => {
      const { cookies } = await loginAsUser(testEmail('pay-missing-orderid'))

      const response = await postJson('/api/checkout/pay', {}, { cookies })

      expect(response.status).toBe(400)
      expect(await response.text()).toBe('orderId required')
    })

    it('rejects a valid orderId that does not belong to the authenticated user or is not pending and the client receives 404', async () => {
      const fixtures = await createCheckoutFixtureBundle()
      const { cookies } = await loginAsUser(testEmail('pay-request-user'))
      const owner = await createUser(testEmail('pay-owner'))
      const order = await createPendingOrder({
        userId: owner.id,
        showtimeId: fixtures.showtime.id,
        seatIds: [fixtures.seats[0].id],
      })

      const wrongOwnerResponse = await postJson('/api/checkout/pay', { orderId: order.id.toString() }, { cookies })
      expect(wrongOwnerResponse.status).toBe(404)
      expect(await wrongOwnerResponse.text()).toBe('Order not found or not pending')

      const { email: ownerEmail, cookies: ownerCookies } = await loginAsUser(testEmail('pay-pending-owner'))
      const sameUser = await prisma.user.findUniqueOrThrow({ where: { email: ownerEmail } })
      const paidOrder = await createPaidOrder({
        userId: sameUser.id,
        showtimeId: fixtures.showtime.id,
        seatIds: [fixtures.seats[1].id],
      })

      const notPendingResponse = await postJson('/api/checkout/pay', { orderId: paidOrder.id.toString() }, { cookies: ownerCookies })
      expect(notPendingResponse.status).toBe(404)
      expect(await notPendingResponse.text()).toBe('Order not found or not pending')
    })

    it('returns 404 when the authenticated user no longer exists', async () => {
      const { email, cookies } = await loginAsUser(testEmail('pay-missing-user'))
      const user = await prisma.user.findUniqueOrThrow({ where: { email } })
      await prisma.user.delete({ where: { id: user.id } })

      const response = await postJson('/api/checkout/pay', { orderId: '1' }, { cookies })

      expect(response.status).toBe(404)
      expect(await response.text()).toBe('User not found')
    })

    it('keeps purchased seats unavailable after payment so another reservation cannot take them', async () => {
      const fixtures = await createCheckoutFixtureBundle()
      const { email, cookies } = await loginAsUser(testEmail('pay-best-effort'))
      const user = await prisma.user.findUniqueOrThrow({ where: { email } })
      const order = await createPendingOrder({
        userId: user.id,
        showtimeId: fixtures.showtime.id,
        seatIds: [fixtures.seats[0].id],
      })

      const response = await postJson('/api/checkout/pay', { orderId: order.id.toString() }, { cookies })
      const body = await response.json()
      const conflictingReservation = await postJson('/api/checkout/mock', {
        showtimeId: fixtures.showtime.id,
        seatIds: [fixtures.seats[0].id],
        email: testEmail('post-pay-conflict'),
      })

      expect(response.status).toBe(200)
      expect(body).toEqual({ ok: true })
      expect(conflictingReservation.status).toBe(409)
      expect(await conflictingReservation.text()).toBe('Some seats already booked')
    })
  })

  describe('GET /api/orders/me', () => {
    it('returns the authenticated users pending and paid orders and the client receives 200 with normalized order cards', async () => {
      const fixtures = await createCheckoutFixtureBundle()
      const { email, cookies } = await loginAsUser(testEmail('orders-me'))
      const user = await prisma.user.findUniqueOrThrow({ where: { email } })
      const pendingOrder = await createPendingOrder({
        userId: user.id,
        showtimeId: fixtures.showtime.id,
        seatIds: [fixtures.seats[0].id, fixtures.seats[1].id],
      })
      const paidOrder = await createPaidOrder({
        userId: user.id,
        showtimeId: fixtures.showtime.id,
        seatIds: [fixtures.seats[2].id],
      })

      const { response, body } = await getJson<
        Array<{
          id: string
          status: string
          showtimeId: number
          film: { id: number; title: string } | null
          theatre: { id: number; name: string } | null
          hall: { id: number; name: string } | null
          seats: number[]
          total: number
        }>
      >('/api/orders/me', { cookies })

      const pendingCard = body.find((order) => order.id === pendingOrder.id.toString())
      const paidCard = body.find((order) => order.id === paidOrder.id.toString())

      expect(response.status).toBe(200)
      expect(body).toHaveLength(2)
      expect(pendingCard).toMatchObject({
        id: pendingOrder.id.toString(),
        status: orderStatus.pending,
        showtimeId: fixtures.showtime.id,
        film: { id: fixtures.film.id, title: fixtures.film.title },
        theatre: { id: fixtures.theatre.id, name: fixtures.theatre.name },
        hall: { id: fixtures.hall.id, name: fixtures.hall.name },
        seats: [fixtures.seats[0].id, fixtures.seats[1].id],
        total: 24,
      })
      expect(paidCard).toMatchObject({
        id: paidOrder.id.toString(),
        status: orderStatus.paid,
        seats: [fixtures.seats[2].id],
        total: 12,
      })
    })

    it('orders returned orders by newest first so the client sees the latest order on top', async () => {
      const fixtures = await createCheckoutFixtureBundle()
      const { email, cookies } = await loginAsUser(testEmail('orders-sorted'))
      const user = await prisma.user.findUniqueOrThrow({ where: { email } })
      const older = await prisma.order.create({
        data: {
          userId: user.id,
          status: orderStatus.pending,
          createdAt: new Date('2024-01-01T10:00:00.000Z'),
          expiresAt: new Date('2024-01-01T10:15:00.000Z'),
        },
      })
      await prisma.ticket.create({
        data: {
          orderId: older.id,
          showtimeId: fixtures.showtime.id,
          seatId: fixtures.seats[0].id,
          status: ticketStatus.reserved,
          unitPrice: 12,
        },
      })
      const newer = await prisma.order.create({
        data: {
          userId: user.id,
          status: orderStatus.paid,
          createdAt: new Date('2024-01-02T10:00:00.000Z'),
          expiresAt: null,
        },
      })
      await prisma.ticket.create({
        data: {
          orderId: newer.id,
          showtimeId: fixtures.showtime.id,
          seatId: fixtures.seats[1].id,
          status: ticketStatus.paid,
          unitPrice: 12,
          paidAt: new Date('2024-01-02T10:05:00.000Z'),
        },
      })

      const { response, body } = await getJson<Array<{ id: string }>>('/api/orders/me', { cookies })

      expect(response.status).toBe(200)
      expect(body.map((order) => order.id)).toEqual([newer.id.toString(), older.id.toString()])
    })

    it('rejects the request when the client is not authenticated and receives 401 Unauthorized', async () => {
      const response = await apiRequest('/api/orders/me')

      expect(response.status).toBe(401)
      expect(await response.text()).toBe('Unauthorized')
    })

    it('returns 404 when the authenticated user no longer exists', async () => {
      const { email, cookies } = await loginAsUser(testEmail('orders-missing-user'))
      const user = await prisma.user.findUniqueOrThrow({ where: { email } })
      await prisma.user.delete({ where: { id: user.id } })

      const response = await apiRequest('/api/orders/me', { cookies })

      expect(response.status).toBe(404)
      expect(await response.text()).toBe('User not found')
    })
  })
})
