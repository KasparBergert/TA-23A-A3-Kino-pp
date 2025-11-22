import userRepository from './UserRepository'
import tokenService from '../../api/utils/TokenService'
import type TokenPair from '../types/TokenPair'
import type UserRole from '../types/UserRole'
import passwordUtils from '../../api/utils/passwordUtils'

class UserService {

  /**
   * @param {string} email user email
   * @param {string} password user password (not hashed)
   * @param {UserRole} role - role of the user
   * @returns
   */
  async createAccount(email: string, password: string, role: UserRole): Promise<TokenPair | null> {
    const hashed_password = await passwordUtils.createhash(password)
    await userRepository.createUser(email, hashed_password, role)
    return tokenService.createTokens({email})
  }

  //gives a TokenPair, otherwise null if unsuccessful
  async userLogin(email:string, password:string): Promise<TokenPair>{
    //get the user from the database
    const user = await userRepository.getUserByEmail(email);
    if (!user) throw new Error("USER_NOT_FOUND");

    //check if password matches
    const password_hash = await passwordUtils.createhash(password)
    const valid = passwordUtils.verify(password_hash, user.password);
    if(!valid){ throw Error("INVALID_PASSWORD")}

    return tokenService.createTokens(email);
  }

}

const userService = new UserService()
export default userService
