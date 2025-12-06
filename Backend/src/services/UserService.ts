import userRepository from '../repositories/UserRepository'
import tokenService from './TokenService'
import type TokenPair from '../../types/TokenPair'
import passwordUtils from '../../utils/passwordUtils'
import { users_role } from '@prisma/client'

class UserService {
  /**
   * @param {string} email user email
   * @param {string} password user password (not hashed)
   * @param {UserRole} role - role of the user
   * @returns
   */
  async createAccount(email: string, password: string, role: users_role): Promise<TokenPair | null> {
    const hashed_password = await passwordUtils.createhash(password)
    await userRepository.create({email, password: hashed_password, role})
    return tokenService.createTokens({ email })
  }

  //gives a TokenPair, otherwise null if unsuccessful
  async userLogin(email: string, password: string): Promise<TokenPair> {
    //get the user from the database
    const user = await userRepository.getByEmail(email)
    if (!user) throw new Error('USER_NOT_FOUND')

    //check if password matches
    const password_hash = await passwordUtils.createhash(password)
    const valid = passwordUtils.verify(password_hash, user.password)
    if (!valid) {
      throw Error('INVALID_PASSWORD')
    }

    return tokenService.createTokens(email)
  }
}

const userService = new UserService()
export default userService
