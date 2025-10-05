import getUser from './getUser.ts'

/**
 * checks user existance
 * @param {string} email the users email
 * @returns {Promise<Boolean>} true if user exists, false otherwise.
 */
export default async function findUser(email: string): Promise<Boolean> {
  const res = await getUser(email) // no performance noticable performance difference using getUser().
  return res ? true : false
}
