import { orders, orders_status, users_role } from "@prisma/client"
import { getRandom } from "../utils/fetch"
import userRepository from "../../../src/repositories/UserRepository"

export async function createOrdersSeed(): Promise<Omit<orders, 'id' | 'created_at'>[]> {
  const usersRaw = await userRepository.getAll()
  const users = usersRaw.filter(user => user.role === users_role.user); //get rid of admin users

  if (users.length === 0) throw new Error("No users exist for orders")

  return [
    {
      user_id: getRandom(users).id,
      status: orders_status.pending,
      expires_at: new Date('2025-11-01T19:00:00'),
    },
    {
      user_id: getRandom(users).id,
      status: orders_status.paid,
      expires_at: null,
    },
  ]
}
