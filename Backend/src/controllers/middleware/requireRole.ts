import { NextFunction, Request, Response } from 'express'
import { userRole } from '@prisma/client'
import tokenService from '../../services/TokenService'

export default function requireRole(...roles: userRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken
    if (!token) return res.status(401).send('Unauthorized')

    try {
      const payload = tokenService.verifyToken(token)
      const role = payload.role as userRole
      if (!roles.includes(role)) return res.status(403).send('Forbidden')
      ;(req as any).auth = { email: payload.email, role }
      next()
    } catch {
      return res.status(401).send('Unauthorized')
    }
  }
}
