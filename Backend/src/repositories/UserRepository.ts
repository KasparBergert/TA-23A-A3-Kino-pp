import prisma from '../../db.ts'
import type { users } from '@prisma/client'

class UserRepository {
  /**
   * get 1 user based on email
   * @param {string} email the users email
   * @returns {Promise<users | null>} returns user if successful, null otherwise
   */
  async getByEmail(email: string): Promise<users | null> {
    return await prisma.users.findFirst({
      where: {
        email: email,
      },
    })
  }

  async getAll(): Promise<users[]> {
    return await prisma.users.findMany()
  }

  /**
   * @param {Omit<users, 'id' | 'updated_at'>} user the user to be inserted
   * @returns returns user if successful, null otherwise
   */
  async create(user: Omit<users, 'id' | 'updated_at'>): Promise<users | null> {
    return await prisma.users.create({
      data: user,
    })
  }

  async createMany(users: Omit<users, 'id' | 'updated_at'>[]) {
    await prisma.users.createMany({
      data: users,
      skipDuplicates: true,
    })
  }
}

const userRepository = new UserRepository()
export default userRepository
