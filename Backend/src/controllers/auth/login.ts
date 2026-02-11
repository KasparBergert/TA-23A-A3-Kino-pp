import { Request, Response } from 'express'
import userService from '../../services/UserService.ts'

export default async function login(req: Request, res: Response) {
  const { email, password } = req.body

  try {
    const tokens = await userService.userLogin(email, password)
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

    return res.status(200).json({ message: 'Login successful' })
  } catch {
    return res.status(500).send('Login failed (server side)')
  }
}
