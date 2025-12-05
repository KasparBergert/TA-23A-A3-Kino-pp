import { users, users_role } from "@prisma/client"


export const usersSeed: Omit<users, 'id' | 'updated_at'>[] = [
  {
    email: 'alice@example.com',
    password: 'HASH',
    role: users_role.admin,
  },
  {
    email: 'bob@example.com',
    password: 'HASH',
    role: users_role.user,
  },
]
