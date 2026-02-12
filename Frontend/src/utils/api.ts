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

  private async parseResponse(res: Response) {
    const contentType = res.headers.get('content-type') || ''
    if (res.status === 204) return null
    if (!res.ok) {
      const text = await res.text()
      let parsed: any
      try {
        parsed = text ? JSON.parse(text) : null
      } catch {
        parsed = null
      }
      const message = parsed?.message ?? text ?? res.statusText
      throw {
        status: res.status,
        message,
        body: parsed ?? text,
      }
    }
    if (contentType.includes('application/json')) {
      return res.json()
    }
    return res.text()
  }

  async get<T = any>(path: string, options?: Record<string, any>) {
    try {
      const res = await fetch(this.makeURL(path), {
        method: 'GET',
        ...options,
        headers: this.makeDefaultHeaders(),
        credentials: 'include',
      })
      return (await this.parseResponse(res)) as T
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async post(path: string, body: Record<string, any>, options?: Record<string, any>) {
    try {
      const res = await fetch(this.makeURL(path), {
        method: 'POST',
        ...options,
        body: JSON.stringify(body),
        headers: this.makeDefaultHeaders(),
        credentials: 'include',
      })
      return await this.parseResponse(res)
    } catch (err) {
      console.log(err)
      throw err
    }
  }
}

const client = new Api()
export default client
