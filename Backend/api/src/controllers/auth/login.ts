import { Request, Response } from 'express'
import getUser from '../../../../database/src/utils/getUser.ts'
import { verifyPassword } from '../../../services/hash.ts'
import { createRefreshToken, createAccessToken } from '../../../services/tokens.ts'

export default async function login(req: Request, res: Response) {
  const body = req.body //already gets validated in validateBody.ts middleware

  //if database cannot find a user with the email then send error
  const found = await getUser(body.email)
  if (!found) {
    console.info("account doesn't exist")
    return res.status(401).send({
      code: 'AUTH-0006',
    }) //account doesn't exist
  }

  const isSamePassword = await verifyPassword(found.hashed_password, body.password)
  if (!isSamePassword) {
    console.info('passwords to not match')
    return res.status(401).send({
      code: 'AUTH-0006',
    }) //passwords to not match
  }

  const accessToken = createAccessToken({ email: body.email })
  const refreshToken = createRefreshToken({ email: body.email })

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.SecureCookies === 'true',
    sameSite: 'strict',
    path: '/api/auth/jwt/refresh',
  })

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.SecureCookies === 'true',
    sameSite: 'strict',
    path: '/api',
  })

  res.status(201).send({
    code: 'AUTH-0005',
  })
}
