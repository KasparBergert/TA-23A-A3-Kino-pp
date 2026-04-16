import type { NextFunction, Request, Response } from 'express'
import type { JwtPayload } from 'jsonwebtoken'
import prisma from '../../db'
import { AppError, InternalServerError, UnauthorizedError } from '../errors/HttpError'
import tokenService from '../services/TokenService'
import userService from '../services/UserService'
import { userRole } from '@prisma/client'

class AuthController {
  login = async (req: Request, res: Response, next: NextFunction) => {
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
      return next(new InternalServerError('Login failed (server side)'))
    }
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body
    const found = await prisma.user.findFirst({
      where: { email },
    })
    if (found) {
      console.info('account already exists')
      return next(new AppError('failed to create account', 401))
    }

    const tokens = await userService.createAccount(email, password, userRole.user)
    if (tokens === null) {
      return next(new InternalServerError('failed to create account'))
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

    return res.status(201).json({ message: 'Account creation successful' })
  }

  refresh = (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies.refreshToken
      const result: JwtPayload = tokenService.verifyToken(refreshToken)

      const tokens = tokenService.createTokens({ email: result.email, role: result.role })

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
    } catch (error) {
      return next(error)
    }
  }

  me = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken
    if (!token) return next(new UnauthorizedError('Unauthorized'))
    try {
      const payload = tokenService.verifyToken(token)
      return res.json({ email: payload.email, role: payload.role })
    } catch {
      return next(new UnauthorizedError('Unauthorized'))
    }
  }

  logout = (req: Request, res: Response) => {
    void req
    res.clearCookie('accessToken', { path: '/api' })
    res.clearCookie('refreshToken', { path: '/api/auth/jwt/refresh' })
    return res.status(200).send('Logged out')
  }
}

export default AuthController
