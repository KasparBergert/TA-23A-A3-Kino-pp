import argon2 from 'argon2'
/**
 * @param {string} plain - the password to hash
 * @returns {Buffer} argon parameters + 64 byte hash
 */
export default async function hashPassword(plain) {
  return argon2.hash(plain, {
    type: 2,
    parallelism: 6,
    hashLength: 64,
    memoryCost: 2 ** 16 - 1, //64 MB
    //rest are set to default
  })
}

/**
 * @param {string} hash - Argon2id hash
 * @param {*} plain - The plaintext password to be verified.
 * @returns {Boolean} true or false if the password matches
 */
export async function verifyPassword(hash, password) {
  return await argon2.verify(hash, password)
}
