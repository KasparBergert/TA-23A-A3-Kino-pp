import { PoolConnection } from 'mariadb/*'
import db from '../../db.ts'
import UserAccount from '../../../../shared/models/UserAccount.ts'
import prisma from '../../db.ts'

/**
 * get 1 user based on email
 * @param {string} email the users email
 * @returns {Promise<Boolean>} true if user exists, false otherwise.
 */
export default async function getUser(email: string): Promise<UserAccount | null> {
  return await prisma.users.findFirst({
    where: {
      email: email,
    },
  })
}
