import { PoolConnection } from 'mariadb/*'
import db from '../db.ts'

/**
 * find user based on email
 * @param {string} email the users email
 * @returns {Boolean} true if user exists, false otherwise.
 */
export default function findUser(email: string) {
  return db(async (db: PoolConnection) => {
    return await db.query('SELECT count(1) as num FROM users WHERE email = ?', [email])
  })
}
