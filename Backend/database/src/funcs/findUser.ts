import { PoolConnection } from 'mariadb/*'
import db from '../db.ts'
import { BlobOptions } from 'buffer'

/**
 * find user based on email
 * @param {string} email the users email
 * @returns {Promise<Boolean>} true if user exists, false otherwise.
 */
export default async function findUser(email: string): Promise<Boolean> {
  return db(async (db: PoolConnection) => {
    const [res] = await db.query('SELECT count(1) as num FROM users WHERE email = ?', [email])
    return res.num > 0
  })
}
