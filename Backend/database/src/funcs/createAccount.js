import { renderList } from 'vue'
import hashPassword from '../../../api/utils/hash.js'
import db from '../db.js'

/**
 * creates an account in the DB
 *
 * @param {Object} details - The account data.
 * @param {string} details.name - Chosen username.
 * @param {string} details.email - Account email address.
 * @param {string} details.password - Account password.
 * @param {string} role - type of role to give user (e.g. admin, user) default is 'user'.
 *
 * @returns {Boolean} was user created?
 */
export default async function createAccount(details, role = 'user') {
  //check if username, email, password are valid

  const hash = await hashPassword(details.password)

  const result = await db(async (db) => {
    //create the user account
    let userId = null // new user's id
    try {
      const res = await db.query(
        'INSERT INTO users (email, hashed_password, name) VALUES (?,?,?)',
        [details.email, hash, details.name],
      )

      userId = res.insertId
    } catch (err) {
      console.error(err.stack.split('\n').slice(0, 1).join('\n'))
      return false // failed to create user
    }

    try {
      //get 'role' variable id from the database.
      const [{ id: roleId }] = await db.query('SELECT id FROM roles WHERE code = ? LIMIT 1', [role])
      //attach a role to the user
      await db.query('INSERT INTO user_roles (user_id, role_id) VALUES (?,?)', [userId, roleId])
    } catch (error) {
      console.error(error)
      return false
    }

    return true
  })

  return result
}
