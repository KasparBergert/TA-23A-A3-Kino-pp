import { NextFunction, Request, Response } from 'express'
import { UnauthorizedError } from '../../errors/HttpError.ts'
import tokenService from '../../services/TokenService.ts'

export default function requireAuth(req: Request, res: Response, next: NextFunction) {
  void res
  const token = req.cookies.accessToken
  if (!token) return next(new UnauthorizedError('Unauthorized'))

  try {
    const payload = tokenService.verifyToken(token)
    ;(req as any).auth = { email: payload.email, role: payload.role }
    return next()
  } catch {
    return next(new UnauthorizedError('Unauthorized'))
  }
}
