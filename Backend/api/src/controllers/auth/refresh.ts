import { Request, Response } from 'express'
import { verifyToken } from '../../../services/tokens.ts'
import { JwtPayload } from 'jsonwebtoken'
import { createRefreshToken, createAccessToken } from '../../../services/tokens.ts'

export default function refresh(req: Request, res: Response) {
  const refreshToken = req.cookies.refreshToken
  const result: string | null | JwtPayload = verifyToken(refreshToken)
  if (!result || typeof result == 'string') {
    return res.status(400).send({ code: 'AUTH-0004' })
  }

  const newaccessToken = createAccessToken({ email: result.email as string })
  const newrefreshToken = createRefreshToken({ email: result.email as string })

  res.cookie('refreshToken', newrefreshToken, {
    httpOnly: true,
    secure: process.env.SecureCookies === 'true',
    sameSite: 'strict',
    path: '/api/auth/jwt/refresh',
  })

  res.cookie('accessToken', newaccessToken, {
    httpOnly: true,
    secure: process.env.SecureCookies === 'true',
    sameSite: 'strict',
    path: '/api',
  })

  return res.status(200).send({ code: 'AUTH-0008' })
}
