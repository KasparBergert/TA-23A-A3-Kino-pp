import { user, userRole } from "@prisma/client"

// Plaintext seed password; hashes are applied during seeding to keep the database consistent
export const DEFAULT_SEED_PASSWORD = 'password123'

export const usersSeed: Omit<user, 'id' | 'updatedAt'>[] = [
  {
    email: 'alice@example.com',
    password: DEFAULT_SEED_PASSWORD,
    role: userRole.admin,
  },
  {
    email: 'bob@example.com',
    password: DEFAULT_SEED_PASSWORD,
    role: userRole.user,
  },
  {
    email: 'super@example.com',
    password: DEFAULT_SEED_PASSWORD,
    role: userRole.super_admin,
  },
  {
    email: 'hannes@tamm.com',
    password: 'passw0rd',
    role: userRole.super_admin,
  },
]
