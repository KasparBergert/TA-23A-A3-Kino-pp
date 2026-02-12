import { Request, Response, NextFunction } from 'express'
import tokenService from '../../services/TokenService'

export default function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.accessToken
  if (!token) return res.status(401).send('Unauthorized')
  try {
    const payload = tokenService.verifyToken(token)
    // attach minimal user info for downstream handlers
    ;(req as any).auth = { email: payload.email, role: payload.role }
    return next()
  } catch {
    return res.status(401).send('Unauthorized')
  }
}
