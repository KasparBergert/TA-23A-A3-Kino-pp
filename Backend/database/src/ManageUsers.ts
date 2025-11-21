import { useSSRContext } from 'vue'
import prisma from '../db.ts'
import type {users} from '@prisma/client'

class ManageUsers {
  async findUser(email: string) {
    const user = await this.getUser(email);
    return user ? true : false;
  }

  /**
   * get 1 user based on email
   * @param {string} email the users email
   * @returns {Promise<Boolean>} true if user exists, false otherwise.
   */
  async getUser(email: string): Promise<users | null> {
    return await prisma.users.findFirst({
      where: {
        email: email,
      },
    })
  }
}

const userManager = new ManageUsers()
export default userManager
