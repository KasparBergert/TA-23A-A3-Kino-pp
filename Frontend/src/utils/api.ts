import axios from 'axios'

const { VITE_URI, VITE_PORT } = import.meta.env

if (!VITE_URI || !VITE_PORT) {
  throw new Error('Frontend: environment variables missing for api.ts')
}

const client = axios.create({
  baseURL: `${VITE_URI}:${VITE_PORT}/api`,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default client
