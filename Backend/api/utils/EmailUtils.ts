//password related functions
class EmailUtils {
  validate(email: string): Boolean {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    return emailRegex.test(email)
  }
}

const emailUtils = new EmailUtils()
export default emailUtils
