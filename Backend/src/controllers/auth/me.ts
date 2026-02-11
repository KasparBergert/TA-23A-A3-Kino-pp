import { Request, Response } from 'express'
import tokenService from '../../services/TokenService'

export default function me(req: Request, res: Response) {
  const token = req.cookies.accessToken
  if (!token) return res.status(401).send('Unauthorized')
  try {
    const payload = tokenService.verifyToken(token)
    return res.json({ email: payload.email, role: payload.role })
  } catch {
    return res.status(401).send('Unauthorized')
  }
}
