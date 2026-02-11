import { Request, Response } from 'express'

export default function logout(req: Request, res: Response) {
  res.clearCookie('accessToken', { path: '/api' })
  res.clearCookie('refreshToken', { path: '/api/auth/jwt/refresh' })
  return res.status(200).send('Logged out')
}
