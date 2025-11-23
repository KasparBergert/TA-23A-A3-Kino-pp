import userManager from '../../repositories/UserRepository.ts'
import { Request, Response } from 'express'
import userService from '../../services/UserService.ts'
import UserRole from '../../../types/UserRole.ts'

export default async function register(req: Request, res: Response) {
  const { email, password } = req.body //validated in middleware
  const found = await userManager.findUserByEmail(email)
  if (found) {
    console.info('account already exists')
    return res.status(401).send('failed to create account')
  }

  const tokens = await userService.createAccount(email, password, UserRole.User)
  if (tokens === null) {
    return res.status(500).send('failed to create account')
  }

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

  res.status(201).send('Account creation successful')
}
