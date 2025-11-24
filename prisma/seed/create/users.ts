import prisma from '../../../Backend/db'
import { getRoleByCode } from '../utils/fetch'

export async function createUsers() {
  const [admin, user] = await Promise.all([
    getRoleByCode('admin'),
    getRoleByCode('user')
  ])

  await prisma.users.createMany({
    data: [
      {
        email: 'alice@example.com',
        password: 'HASH',
        role_id: admin.id,
      },
      {
        email: 'bob@example.com',
        password: 'HASH',
        role_id: user.id,
      }
    ],
    skipDuplicates: true,
  })
}
