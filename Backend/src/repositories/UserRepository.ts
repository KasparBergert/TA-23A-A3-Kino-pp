import prisma from '../../db.ts'
import type { user } from '@prisma/client'

class UserRepository {
  /**
   * get 1 user based on email
   * @param {string} email the user email
   * @returns {Promise<user | null>} returns user if successful, null otherwise
   */
  async getByEmail(email: string): Promise<user | null> {
    return await prisma.user.findFirst({
      where: {
        email: email,
      },
    })
  }

  async getAll(): Promise<user[]> {
    return await prisma.user.findMany()
  }

  async getById(id: number): Promise<user | null> {
    return await prisma.user.findUnique({ where: { id } })
  }

  async create(user: Omit<user, 'id' | 'updatedAt'>): Promise<user | null> {
    return await prisma.user.create({
      data: user,
    })
  }

  async createMany(user: Omit<user, 'id' | 'updatedAt'>[]) {
    await prisma.user.createMany({
      data: user,
      skipDuplicates: true,
    })
  }

  async updateRole(id: number, role: user['role']): Promise<user> {
    return await prisma.user.update({
      where: { id },
      data: { role },
    })
  }

  async delete(id: number): Promise<user> {
    return await prisma.user.delete({ where: { id } })
  }
}

const userRepository = new UserRepository()
export default userRepository
