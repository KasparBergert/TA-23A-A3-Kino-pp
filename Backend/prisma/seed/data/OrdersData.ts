import { orders } from "@prisma/client"
import { getRandom } from "../utils/fetch"
import userRepository from "../../../src/repositories/UserRepository"

export async function createOrdersSeed(): Promise<Omit<orders, 'id' | 'created_at'>[]> {
  const users = await userRepository.getAll()

  if (users.length === 0) throw new Error("No users exist for orders")

  return [
    {
      user_id: getRandom(users).id,
      status: 'pending',
      expires_at: new Date('2025-11-01T19:00:00'),
    },
    {
      user_id: getRandom(users).id,
      status: 'paid',
      expires_at: null,
    },
  ]
}
