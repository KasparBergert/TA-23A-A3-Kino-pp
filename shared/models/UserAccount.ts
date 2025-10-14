//must match the Database schema
interface UserAccount {
  id: number
  email: string
  hashed_password: string
  updated_at: null | Date
}

export default UserAccount
