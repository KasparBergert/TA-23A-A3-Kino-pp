import db from '../db.js'

/**
 * find user based on email
 * @param {string} email the users email
 * @returns {Boolean} true if user exists, false otherwise.
 */
export default function findUser(email) {
  return db(async (db) => {
    return await db.query('SELECT count(1) as num FROM users WHERE email = ?', [email])
  })
}
