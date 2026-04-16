import { NextFunction, Request, Response } from 'express'
import { userRole } from '@prisma/client'
import { ForbiddenError, UnauthorizedError } from '../../errors/HttpError.ts'
import tokenService from '../../services/TokenService.ts'

export default function requireRole(...roles: userRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    void res
    const token = req.cookies.accessToken
    if (!token) return next(new UnauthorizedError('Unauthorized'))

    try {
      const payload = tokenService.verifyToken(token)
      const role = payload.role as userRole
      if (!roles.includes(role)) return next(new ForbiddenError('Forbidden'))
      ;(req as any).auth = { email: payload.email, role }
      return next()
    } catch {
      return next(new UnauthorizedError('Unauthorized'))
    }
  }
}
