import { user, userRole } from "@prisma/client"


export const usersSeed: Omit<user, 'id' | 'updatedAt'>[] = [
  {
    email: 'alice@example.com',
    password: 'HASH',
    role: userRole.admin,
  },
  {
    email: 'bob@example.com',
    password: 'HASH',
    role: userRole.user,
  },
  {
    email: 'super@example.com',
    password: 'HASH',
    role: userRole.super_admin,
  },
]
