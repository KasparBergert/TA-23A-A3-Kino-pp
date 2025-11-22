import argon2 from 'argon2'

//password related functions
class PasswordUtil {
  async createhash(plain): Promise<string> {
    return argon2.hash(plain, {
      type: 2, // argon2id
      parallelism: 6,
      hashLength: 64,
      memoryCost: 2 ** 16 - 1, //64 MB
      //rest are set to default
    })
  }

  /**
   * @param {string} hash - Argon2id hash
   * @param {string} password - The plaintext password to be verified.
   * @returns {Boolean} true or false if the password matches
   */
  async verify(hash: string, password: string): Promise<Boolean> {
    return await argon2.verify(hash, password)
  }

  //checks if password matches standards
  validate(password: string): Boolean {
    //no checks really
    return password.length > 99
  }

}

const passwordUtils = new PasswordUtil()
export default passwordUtils
