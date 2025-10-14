import createAccount from '../../../utils/createAccount.ts'
import findUser from '../../../../database/src/funcs/findUser.ts'
import { Request, Response } from 'express'
import { createRefreshToken, createAccessToken } from '../../../utils/auth/JWT/tokens.ts'

export default async function register(req: Request, res: Response) {
  const body = req.body //already gets validated in validateBody.ts middleware
  //if database cannot find a user with the email then send error
  const found = await findUser(body.email)
  if (found) {
    console.info('account already exists')
    return res.status(400).send({
      code: 'AUTH-0002',
    }) //email already exists
  }

  // all checks passed
  const result = await createAccount(body, 'admin')
  if (!result) {
    return res.status(400).send({
      code: 'AUTH-0002',
    })
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
    code: 'AUTH-0001',
  })
}
