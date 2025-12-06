const VITE_URI = import.meta.env.VITE_URI
const VITE_PORT = import.meta.env.VITE_PORT
//sends to and receives json from the api
class Api {
  private makeDefaultHeaders() {
    return {
      'Content-Type': 'application/json',
    }
  }

  private makeURL(path: string) {
    return `${VITE_URI}:${VITE_PORT}/api${path}`
  }

  async get<T>(path: string, options?: Record<string, any>) {
    try {
      const res = await fetch(this.makeURL(path), {
        method: 'GET',
        ...options,
        headers: this.makeDefaultHeaders(),
      })
      return await res.json()
    } catch (err) {
      console.log(err)
    }
  }

  async post(path: string, body: Record<string, any>, options?: Record<string, any>) {
    try {
      const res = await fetch(this.makeURL(path), {
        method: 'POST',
        ...options,
        body: JSON.stringify(body),
        headers: this.makeDefaultHeaders(),
      })
      return await res.json()
    } catch (err) {
      console.log(err)
    }
  }
}

const client = new Api()
export default client
