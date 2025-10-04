import createAccount from '../../../../database/src/funcs/createAccount.ts'
import findUser from '../../../../database/src/funcs/findUser.ts'
import userSchema from '../../../../models/userSchema.ts'
import { Request, Response } from 'express'
import { createRefreshToken, createAccessToken } from '../../../utils/JWT/tokens.ts'

export default async function register(req: Request, res: Response) {
  const body = req.body
  if (typeof body != 'object') {
    console.log(body)
    console.log(typeof body)
    return res.status(400).send({ code: 'VAL-0001' })
  }

  //type check the values
  const { error } = userSchema.validate(body)
  if (error) {
    return res.status(400).send({ code: 'AUTH-0002', message: error.details[0]?.message })
  }

  //if database cannot find a user with the email then send error
  const found = await findUser(body.email)
  if (found > 0) {
    return res.status(400).send({ code: 'AUTH-0002' }) //email already exists
  }

  const result = await createAccount(body)
  if (!result) {
    return res.status(400).send({ code: 'AUTH-0002' })
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

  res.status(201).send({ code: 'AUTH-0001' })
}
