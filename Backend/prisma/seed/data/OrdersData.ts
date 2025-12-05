import { orders } from "@prisma/client"
import { getRandomUser } from "../utils/fetch"

export const ordersSeed: Omit<orders, 'id' | 'created_at'>[] = [
  { user_id: getRandomUser().id, status: 'pending', expires_at: new Date('2025-11-01T19:00:00') },
  { user_id: getRandomUser().id, status: 'paid', expires_at: null },
]
