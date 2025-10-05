import { string } from 'joi'
import hashPassword from '../../../api/utils/auth/hash.js'
import db from '../db.js'
import { Connection } from 'mariadb/*'

interface AccountDetails {
  email: string
  name: string
  password: string
}

/**
 * creates an account in the DB
 *
 * @param {Object} details - The account data.
 * @param {string} details.name - Chosen username.
 * @param {string} details.email - Account email address.
 * @param {string} details.password - Account password.
 * @param {string} role - type of role to give user (e.g. admin, user) default is 'user'.
 *
 * @returns {Promise<boolean>} was user created?
 */
export default async function createAccount(
  details: AccountDetails,
  role = 'user',
): Promise<boolean> {
  const hash = await hashPassword(details.password)

  const result = await db(async (db: Connection) => {
    //create the user account
    let userId = null // new user's id
    try {
      const res = await db.query(
        'INSERT INTO users (email, hashed_password, name) VALUES (?,?,?)',
        [details.email, hash, details.name],
      )

      userId = res.insertId
    } catch (err: any) {
      if (err instanceof Error) {
        console.error(err.stack?.split('\n').slice(0, 1).join('\n'))
      } else {
        console.error('Unknown error during query:', err)
      }
      return false // failed to create user
    }

    try {
      //get 'role' variable id from the database.
      const [{ id: roleId }] = await db.query('SELECT id FROM roles WHERE code = ? LIMIT 1', [role])
      //attach a role to the user
      await db.query('INSERT INTO user_roles (user_id, role_id) VALUES (?,?)', [userId, roleId])
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.stack?.split('\n').slice(0, 1).join('\n'))
      } else {
        console.error('Unknown error during query:', err)
      }
      return false
    }

    return true
  })

  return result
}
