import { Request, Response } from 'express'
import { JwtPayload } from 'jsonwebtoken'
import tokenService from '../../../utils/TokenService'

export default function refresh(req: Request, res: Response) {
  const refreshToken = req.cookies.refreshToken
  const result: JwtPayload = tokenService.verifyToken(refreshToken)

  const tokens = tokenService.createTokens(result.email as string)

  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.SecureCookies === 'true',
    sameSite: 'strict',
    path: '/api/auth/jwt/refresh',
  })

  res.cookie('accessToken', tokens.accessToken, {
    httpOnly: true,
    secure: process.env.SecureCookies === 'true',
    sameSite: 'strict',
    path: '/api',
  })

  return res.status(200).send({ code: 'AUTH-0008' })
}
