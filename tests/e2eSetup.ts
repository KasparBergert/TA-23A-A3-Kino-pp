import { spawn, type ChildProcess } from 'node:child_process'

const SERVER_URL = 'http://127.0.0.1:3000'
const STARTUP_TIMEOUT_MS = 30_000

let server: ChildProcess

export async function setup() {
  server = spawn('bun', ['run', './Backend/server.ts'], {
    env: {
      ...process.env,
      DISABLE_RATE_LIMITING: 'true',
    },
  })

  await waitForServer()
}

async function waitForServer() {
  const startedAt = Date.now()
  let stderr = ''

  server.stderr?.on('data', (data: Buffer) => {
    stderr += data.toString()
  })

  while (Date.now() - startedAt < STARTUP_TIMEOUT_MS) {
    if (server.exitCode !== null) {
      throw new Error(`E2E server exited early.\n${stderr}`.trim())
    }

    try {
      const response = await fetch(`${SERVER_URL}/api/auth/me`, {
        headers: { cookie: 'accessToken=invalid' },
      })

      if (response.status === 401) {
        return
      }
    } catch {
      // server not ready yet
    }

    await new Promise((resolve) => setTimeout(resolve, 250))
  }

  throw new Error(`Timed out waiting for server at ${SERVER_URL}.\n${stderr}`.trim())
}

export async function teardown() {
  if (server.exitCode === null) {
    server.kill()
  }
}
