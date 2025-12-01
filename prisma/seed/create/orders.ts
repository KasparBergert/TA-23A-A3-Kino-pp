import prisma from '../../../Backend/db'
import type { users } from '@prisma/client'

export async function createOrdersForUser(user: users) {
  await prisma.orders.createMany({
    data: [
      { user_id: user.id, status: 'pending', expires_at: new Date('2025-11-01T19:00:00') },
      { user_id: user.id, status: 'paid', expires_at: null },
    ],
    skipDuplicates: true,
  })
}
