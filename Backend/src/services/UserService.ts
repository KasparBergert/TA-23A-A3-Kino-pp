import prisma from '../../db'
import tokenService from './TokenService'
import type TokenPair from '../../types/TokenPair'
import passwordUtils from '../../utils/passwordUtils'
import { userRole } from '@prisma/client'

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
    if (!user) throw new Error('USER_NOT_FOUND')

    const valid = await passwordUtils.verify(user.password, password)
    if (!valid) {
      throw Error('INVALID_PASSWORD')
    }

    return tokenService.createTokens({ email: user.email, role: user.role })
  }
}

const userService = new UserService()
export default userService
