import { Request, Response } from 'express'
import userRepository from '../../../../database/src/UserRepository.ts'
import userService from '../../../../database/src/UserService.ts'
import passwordUtils from '../../../utils/passwordUtils.ts'

export default async function login(req: Request, res: Response) {
  const { email, password } = req.body //already gets validated in validateBody.ts middleware

  //if database cannot find a user with the email then send error
  const found = await userRepository.getUserByEmail(email)
  if (!found) {
    console.info("account doesn't exist")
    return res.status(401).send('Login failed') //account doesn't exist
  }

  const isSamePassword = await passwordUtils.verify(found.password, password)
  if (!isSamePassword) {
    console.info('passwords to not match')
    return res.status(401).send('Login failed') //passwords to not match
  }

  try {
    const tokens = await userService.userLogin(email, password)
    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.SecureCookies === 'true',
      sameSite: 'strict',
      path: '/api',
    })

    return res.status(201).send('Login successful')
  } catch {
    return res.status(500).send('Login failed (server side)')
  }
}
