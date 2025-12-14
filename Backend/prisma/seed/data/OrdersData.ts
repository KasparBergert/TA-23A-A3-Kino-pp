import { order, orderStatus, userRole } from "@prisma/client"
import { getRandom } from "../utils/fetch"
import userRepository from "../../../src/repositories/UserRepository"

export async function createOrdersSeed(): Promise<Omit<order, 'id' | 'createdAt'>[]> {
  const usersRaw = await userRepository.getAll()
  const users = usersRaw.filter(user => user.role === userRole.user); //get rid of admin users

  if (users.length === 0) throw new Error("No users exist for order")

  return [
    {
      userId: getRandom(users).id,
      status: orderStatus.pending,
      expiresAt: new Date('2025-11-01T19:00:00'),
    },
    {
      userId: getRandom(users).id,
      status: orderStatus.paid,
      expiresAt: null,
    },
  ]
}
