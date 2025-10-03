import createAccount from '../../../../database/src/funcs/createAccount.js'
import findUser from '../../../../database/src/funcs/findUser.js'
import userSchema from '../../../../models/userSchema.js'
import { createAccessToken, createRefreshToken } from '../../../utils/JWT/tokens.js'

export default async function register(req, res) {
  const body = req.body
  if (typeof body != 'object') {
    console.log(body)
    console.log(typeof body)
    return res.status(400).send({ code: 'VAL-0001' })
  }

  //type check the values
  const { error } = userSchema.validate(body)
  if (error) {
    return res.status(400).send({ code: 'AUTH-0002', message: error.details[0].message })
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
    SameSite: 'lax', // only allow with GET requests
    path: '/',
  })

  res.status(201).send({ code: 'AUTH-0001', accessToken })
}
