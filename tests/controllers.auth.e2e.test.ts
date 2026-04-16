// @vitest-environment node
import '../Backend/env.ts'

import { afterAll, afterEach, describe, expect, it } from 'vitest'
import { userRole } from '@prisma/client'
import prisma from '../Backend/db.ts'
import passwordUtils from '../Backend/utils/passwordUtils.ts'

const BASE_URL = 'http://127.0.0.1:3000'
const JSON_HEADERS = { 'content-type': 'application/json' }
const TEST_EMAIL_PREFIX = 'auth-e2e-'
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

function getSetCookies(response: globalThis.Response): string[] {
  const headers = response.headers as Headers & { getSetCookie?: () => string[] }

  if (typeof headers.getSetCookie === 'function') {
    return headers.getSetCookie()
  }

  const combined = response.headers.get('set-cookie')
  return combined ? [combined] : []
}

function findCookie(cookies: string[], name: string): string | undefined {
  return cookies.find((cookie) => cookie.startsWith(`${name}=`))
}

function requireCookie(cookies: string[], name: string): string {
  const cookie = findCookie(cookies, name)
  expect(cookie).toBeTruthy()
  return cookie ?? ''
}

function extractCookiePair(cookie: string): string {
  return cookie.split(';', 1)[0] ?? ''
}

function expectAuthCookies(cookies: string[]) {
  expect(findCookie(cookies, 'accessToken')).toBeTruthy()
  expect(findCookie(cookies, 'refreshToken')).toBeTruthy()
}

async function createUser(email: string, password: string = TEST_PASSWORD) {
  const hashedPassword = await passwordUtils.createhash(password)

  return await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: userRole.user,
    },
  })
}

function testEmail(suffix: string): string {
  return `${TEST_EMAIL_PREFIX}${suffix}-${Date.now()}@example.com`
}

async function registerUser(email: string, password: string = TEST_PASSWORD) {
  const response = await postJson('/api/auth/users/register', { email, password })
  return { response, cookies: getSetCookies(response) }
}

afterEach(async () => {
  await prisma.user.deleteMany({
    where: {
      email: { startsWith: TEST_EMAIL_PREFIX },
    },
  })
})

afterAll(async () => {
  await prisma.$disconnect()
})

describe('Auth controllers e2e', () => {
  describe('POST /api/auth/users/login', () => {
    it('logs in with valid credentials and returns auth cookies', async () => {
      const email = testEmail('login-success')
      await createUser(email)

      const response = await postJson('/api/auth/users/login', {
        email,
        password: TEST_PASSWORD,
      })

      const body = await response.json()
      const cookies = getSetCookies(response)

      expect(response.status).toBe(200)
      expect(body).toEqual({ message: 'Login successful' })
      expectAuthCookies(cookies)
    })

    it('returns a failed login response for invalid credentials', async () => {
      const email = testEmail('login-fail')
      await createUser(email)

      const response = await postJson('/api/auth/users/login', {
        email,
        password: 'wrong-password',
      })

      expect(response.status).toBe(500)
      expect(await response.text()).toBe('Login failed (server side)')
    })

    it('rejects invalid email/password payload through validation middleware', async () => {
      const response = await postJson('/api/auth/users/login', {
        email: 'not-an-email',
        password: TEST_PASSWORD,
      })

      expect(response.status).toBe(400)
      expect(await response.text()).toBe('Email is not valid')
    })
  })

  describe('POST /api/auth/users/register', () => {
    it('registers a new user and returns auth cookies', async () => {
      const email = testEmail('register-success')
      const { response, cookies } = await registerUser(email)
      const body = await response.json()
      const created = await prisma.user.findFirst({ where: { email } })

      expect(response.status).toBe(201)
      expect(body).toEqual({ message: 'Account creation successful' })
      expect(created).toBeTruthy()
      expectAuthCookies(cookies)
    })

    it('rejects an email that already exists', async () => {
      const email = testEmail('register-duplicate')
      await createUser(email)

      const response = await postJson('/api/auth/users/register', {
        email,
        password: TEST_PASSWORD,
      })

      expect(response.status).toBe(401)
      expect(await response.text()).toBe('failed to create account')
    })

    it('rejects invalid email/password payload through validation middleware', async () => {
      const response = await postJson('/api/auth/users/register', {
        email: 'not-an-email',
        password: TEST_PASSWORD,
      })

      expect(response.status).toBe(400)
      expect(await response.text()).toBe('Email is not valid')
    })
  })

  describe('GET /api/auth/jwt/refresh', () => {
    it('refreshes tokens with a valid refreshToken cookie', async () => {
      const email = testEmail('refresh-success')
      const { cookies: registerCookies } = await registerUser(email)
      const refreshCookie = requireCookie(registerCookies, 'refreshToken')

      const response = await apiRequest('/api/auth/jwt/refresh', {
        method: 'GET',
        cookies: [extractCookiePair(refreshCookie)],
      })

      const body = await response.json()
      const cookies = getSetCookies(response)

      expect(response.status).toBe(200)
      expect(body).toEqual({ code: 'AUTH-0008' })
      expectAuthCookies(cookies)
    })

    it('rejects a missing refreshToken cookie', async () => {
      const response = await apiRequest('/api/auth/jwt/refresh')
      const body = await response.json()

      expect(response.status).toBe(500)
      expect(body).toHaveProperty('error')
    })

    it('rejects an invalid refreshToken cookie', async () => {
      const response = await apiRequest('/api/auth/jwt/refresh', {
        cookies: ['refreshToken=definitely-invalid'],
      })
      const body = await response.json()

      expect(response.status).toBe(500)
      expect(body).toHaveProperty('error')
    })
  })

  describe('GET /api/auth/me', () => {
    it('returns the authenticated user identity from a valid accessToken cookie', async () => {
      const email = testEmail('me-success')
      const { cookies: registerCookies } = await registerUser(email)
      const accessCookie = requireCookie(registerCookies, 'accessToken')

      const response = await apiRequest('/api/auth/me', {
        cookies: [extractCookiePair(accessCookie)],
      })

      const body = await response.json()

      expect(response.status).toBe(200)
      expect(body).toEqual({ email, role: userRole.user })
    })

    it('rejects a missing accessToken cookie', async () => {
      const response = await apiRequest('/api/auth/me')

      expect(response.status).toBe(401)
      expect(await response.text()).toBe('Unauthorized')
    })

    it('rejects an invalid accessToken cookie', async () => {
      const response = await apiRequest('/api/auth/me', {
        cookies: ['accessToken=definitely-invalid'],
      })

      expect(response.status).toBe(401)
      expect(await response.text()).toBe('Unauthorized')
    })
  })

  describe('POST /api/auth/logout', () => {
    it('clears the auth cookies and returns Logged out', async () => {
      const response = await apiRequest('/api/auth/logout', {
        method: 'POST',
      })

      const cookies = getSetCookies(response)

      expect(response.status).toBe(200)
      expect(await response.text()).toBe('Logged out')
      expectAuthCookies(cookies)
    })

    it('still returns a successful logout response even without auth cookies', async () => {
      const response = await apiRequest('/api/auth/logout', {
        method: 'POST',
      })

      expect(response.status).toBe(200)
      expect(await response.text()).toBe('Logged out')
    })
  })
})
