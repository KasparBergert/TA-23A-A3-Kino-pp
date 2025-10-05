import { PoolConnection } from 'mariadb/*'
import db from '../db.ts'
import UserAccount from '../types/UserAccount.ts'

/**
 * get 1 user based on email
 * @param {string} email the users email
 * @returns {Promise<Boolean>} true if user exists, false otherwise.
 */
export default async function getUser(email: string): Promise<UserAccount> {
  return db(async (db: PoolConnection) => {
    const [res] = await db.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email])
    return res
  })
}
