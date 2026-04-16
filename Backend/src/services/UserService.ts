import prisma from '../../db'
import tokenService from './TokenService'
import type TokenPair from '../../types/TokenPair'
import passwordUtils from '../../utils/passwordUtils'
import { user, userRole } from '@prisma/client'
import { ConflictError, ForbiddenError, NotFoundError } from '../errors/HttpError'

class UserService {
  /**
   * @param {string} email user email
   * @param {string} password user password (not hashed)
   * @param {UserRole} role - role of the user
   * @returns
   */
  async createAccount(email: string, password: string, role: userRole): Promise<TokenPair | null> {
    const hashed_password = await passwordUtils.createhash(password)
    await prisma.user.create({
      data: { email, password: hashed_password, role },
    })
    return tokenService.createTokens({ email, role })
  }

  //gives a TokenPair, otherwise null if unsuccessful
  async userLogin(email: string, password: string): Promise<TokenPair> {
    const user = await prisma.user.findFirst({
      where: { email },
    })
    if (!user) throw new NotFoundError('User not found')

    const valid = await passwordUtils.verify(user.password, password)
    if (!valid) {
      throw new Error('INVALID_PASSWORD')
    }

    return tokenService.createTokens({ email: user.email, role: user.role })
  }

  async listUsers(): Promise<user[]> {
    return await prisma.user.findMany()
  }

  async getByEmail(email: string): Promise<user> {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) throw new NotFoundError('User not found')
    return user
  }

  async createUser(email: string, password: string, role: userRole) {
    const existing = await prisma.user.findFirst({
      where: { email },
    })
    if (existing) throw new ConflictError('User already exists')

    const hashedPassword = await passwordUtils.createhash(password)
    return await prisma.user.create({
      data: { email, password: hashedPassword, role },
    })
  }

  async updateUserRole(id: number, role: userRole): Promise<user> {
    const existing = await prisma.user.findUnique({
      where: { id },
    })
    if (!existing) throw new NotFoundError('User not found')
    if (existing.email === 'hannes@tamm.com') {
      throw new ForbiddenError('Protected account role cannot be changed')
    }

    return await prisma.user.update({
      where: { id },
      data: { role },
    })
  }

  async deleteUser(id: number): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id },
    })
    if (!user) throw new NotFoundError('User not found')
    if (user.email === 'hannes@tamm.com') {
      throw new ForbiddenError('Protected account cannot be deleted')
    }

    await prisma.user.delete({ where: { id } })
  }
}

const userService = new UserService()
export default userService
