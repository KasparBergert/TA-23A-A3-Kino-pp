import prisma from '../db.ts'
import type { users } from '@prisma/client'
import UserRole from '../types/UserRole.ts'

class UserRepository {
  private async getRoleId(role: UserRole): Promise<number | null> {
    const result = await prisma.roles.findFirst({
      where: { code: role },
      select: { id: true },
    })
    if(!result){ return null}
    return result.id;
  }

  async findUserByEmail(email: string) {
    const user = await this.getUserByEmail(email)
    return user ? true : false
  }

  /**
   * get 1 user based on email
   * @param {string} email the users email
   * @returns {Promise<users | null>} returns user if successful, null otherwise
   */
  async getUserByEmail(email: string): Promise<users | null> {
    return await prisma.users.findFirst({
      where: {
        email: email,
      },
    })
  }

  /**
   * @param {string} email the users email
   * @param {string} hashed_password users password but hashed
   * @param {UserRole} role role to attach to the user
   * @returns returns user if successful, null otherwise
   */
  async createUser(email: string, hashed_password: string, role: UserRole): Promise<users | null> {

    const role_id = await this.getRoleId(role);
    if(role_id === null){return null};

    return await prisma.users.create({
      data: {
        email: email,
        password: hashed_password,
        role_id,
      },
    })
  }
}

const userRepository = new UserRepository()
export default userRepository
